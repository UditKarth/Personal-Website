---
title: "Four Papers, One Robot: How Physical Intelligence's π-Series Rebuilt the Flow-Matching VLA"
description: "A walk through π₀, π₀.5, π*₀.6, and π₀.7 — each release locking in a new scaling axis for dexterous generalist policies while keeping the previous one intact."
pubDate: 2026-04-22
status: "evergreen"
tags: ["robotics", "VLA", "flow-matching", "physical-intelligence", "reinforcement-learning"]
series: "Foundations of Robotics"
---
![Pi Evolutions](/writings-images/pi.png)

Most robotics papers read as isolated contributions. A new architecture here, a new dataset there, each published as if no prior work constrained the design space. The π-series from Physical Intelligence is different. Read end to end, π₀ in 2024, then π₀.5, π*₀.6, and π₀.7 through 2025, and it becomes clear these are four chapters of one argument. Each release identifies exactly which axis is bottlenecking dexterous generalist policies, adds the smallest architectural change that unlocks it, and leaves the rest of the system alone.

This kind of discipline is rare. Language model scaling had it for a while. Robotics, until recently, did not.

What makes the π-series worth studying isn't any single model's benchmark number. It's that the four papers together form a coherent answer to a question the field hasn't always been willing to ask directly: when a dexterous policy underperforms, is it because the model is too small, the data is too narrow, the training objective is wrong, or the prompt is underspecified? The π-series, in order, says: none of those alone. It's always the next data regime you haven't figured out how to absorb safely.

---

## The Trunk That Doesn't Move

Before walking through the papers, it helps to name what stays constant across all four releases, because the stability of the core is what makes the progression legible.

Every π model is built from the same three ingredients. A pretrained vision-language model backbone handles semantics. A smaller flow-matching action expert, attached via a mixture-of-experts-style second set of weights, handles motor commands. Block-causal attention runs over images, language, proprioception, and noisy action tokens simultaneously. Actions are emitted as chunks of roughly 50 steps at 50 Hz control.

The training objective on the action side is the flow-matching velocity loss:

$$L^\tau(\theta) = \mathbb{E}\lVert\mathbf{v}_\theta(\mathbf{A}^\tau_t, \mathbf{o}_t) - (\epsilon - \mathbf{A}_t)\rVert^2$$

where $\mathbf{A}^\tau_t = \tau\mathbf{A}_t + (1-\tau)\epsilon$ and $\tau$ is drawn from a Beta distribution biased toward noisier timesteps. In plain terms: the model learns to predict the "velocity" needed to denoise a corrupted action back toward the real one, and training deliberately emphasizes the hard cases where noise is high. Inference uses roughly ten Euler integration steps, with the VLM prefix computed once and cached, and the action suffix recomputed each step.

Everything else is negotiable. What changes across the series is what gets put into the prefix and how the action expert is supervised. That's the whole arc, stated mechanically.

The parameter count is worth noting before going further. The series goes from 3.3B parameters in π₀ to 5B in π₀.7, a nearly 50% increase across four papers, most of it in the action expert. By AI research standards, that's almost nothing. The interesting growth happened everywhere else.

| | π₀ | π₀.5 | π*₀.6 | π₀.7 |
|---|---|---|---|---|
| Total params | 3.3B | 3.3B | 4.9B | 5B |
| VLM backbone | PaliGemma-3B | PaliGemma-3B | Gemma 3 4B | Gemma 3 4B |
| Action expert | 300M | 300M | 860M | 860M |
| Action decoder | Flow matching | Hybrid FAST + Flow | Hybrid + Knowledge Insulation | Inherits KI |
| Hierarchy | External VLM planner | Unified same-model HL+LL | Same-model HL+LL | Multi-modal HL + coaching |
| Extra prefix tokens | — | Subtask $\hat\ell$ | Subtask + advantage $I_t$ | Subtask + subgoal images + metadata |

---

## π₀: The Template

The first paper's job was to prove the architecture worked. Flow matching over continuous action chunks, conditioned on a PaliGemma-3B VLM, trained on 10,000 hours of dexterous manipulation data spanning seven robot platforms with open-source datasets folded in. Task-robot combinations were sampled with $n^{0.43}$ reweighting to prevent the over-represented platforms from drowning out the rare ones.

The architectural decision that mattered most was the split between VLM tokens and action tokens. The VLM weights stay specialized for semantics while the 300M action expert specializes for flow matching. This is what lets the backbone retain language understanding while the action head learns to denoise continuous motor commands. Remove the split and both objectives interfere with each other, because the gradient signal for "understand this sentence" and the gradient signal for "denoise this motor trajectory" push the shared weights in different directions simultaneously.

The results set a new baseline. Zero-shot multi-task performance above every prior VLA on shirt folding, bussing, and grocery bagging, with fine-tuning gains of roughly 2x over training from scratch on harder tasks. More importantly, π₀ demonstrated the longest end-to-end dexterous behaviors in the learned-robotics literature at the time: multi-minute laundry folding, box assembly, to-go packing.

But the limitations were structural, not incidental. π₀ evaluated almost entirely on environments it had seen during training. The high-level planner was a separate frontier VLM wired in externally. And while 10,000 hours sounded like a lot, it came from labs and controlled scenes, not the homes where a generalist robot would eventually have to work.

---

## π₀.5: Diversity Beats Volume

The π₀.5 paper makes one argument: cross-embodiment and cross-environment co-training matters more than raw hours of target-robot data. Only 2.4% of phase-one training came from the mobile manipulator actually being deployed. The other 97.6% was a mixture of non-mobile home data, cross-embodiment lab data, high-level subtask annotations, multimodal web data, and verbal instructions from expert supervisors.

| Code | Source | Role |
|---|---|---|
| MM | ~400h mobile manipulator, ~100 homes | Target distribution |
| ME | Non-mobile arms in diverse homes | Scene diversity |
| CE | Cross-embodiment lab + OXE | Task diversity |
| HL | Subtask annotations over MM/ME/CE | Reasoning signal |
| WD | Web VQA, captions, grounding | Semantic priors |
| VI | Verbal instructions (post-training) | HL alignment |

The architecture barely moved. Timestep injection swapped to adaptive RMSNorm, borrowed from diffusion transformer work. Action horizon dropped by one step. The more significant structural change was in training discipline: pretrain as a pure FAST-tokenized next-token predictor with no flow-matching action expert, then attach the action expert post-hoc and train a hybrid discrete-plus-continuous loss. This turns out to be more compute-efficient than continuous-only flow training, and it held up even at 300,000 gradient steps. It was the first internal architectural correction in the series.

The high-level planner also collapsed into the same weights. Rather than calling a separate VLM to decompose commands into subtasks, π₀.5 factorizes the output so that subtask prediction and action generation share parameters:

$$\pi_\theta(\mathbf{a}, \hat\ell \mid \mathbf{o}, \ell) = \pi_\theta(\mathbf{a} \mid \mathbf{o}, \hat\ell)\,\pi_\theta(\hat\ell \mid \mathbf{o}, \ell)$$

The paper's most surprising ablation is that a model trained with high-level data but run without explicit high-level inference at test time captures most of the benefit. Hierarchy partially dissolves into the low-level policy when you train on subtask-annotated data. You can read this as evidence that hierarchical decomposition is partly a training-time phenomenon rather than an inference-time one, or you can read it as evidence that current long-horizon benchmarks don't demand enough depth for the hierarchy to earn its keep. Both readings are defensible.

The headline result was that π₀.5 became the first end-to-end VLA to clean kitchens and bedrooms in homes it had never seen in training. The scene-count scaling curve is the most striking data in the paper: training on 104 distinct locations produced a model that matched a baseline trained directly on the test home. Diversity substituted for targeting.

---

## π*₀.6: Teaching Flow Matching to Learn from Experience

π₀.5 closed the environment-generalization gap on demonstration data. But demonstration-only models have a ceiling that's hard to break through: the data you collect is what the operators could produce, and operators are never perfectly consistent. Some trajectories are slow. Some nearly fail. Some are excellent. Train on all of it uniformly and the model averages toward the median operator.

The obvious answer is reinforcement learning. The obvious obstacle is that flow-matching models don't have tractable log-likelihoods, which is what PPO and GRPO require to compute policy gradients. Advantage-Weighted Regression sidesteps this by downweighting bad trajectories exponentially, but in doing so it discards exactly the negative examples that would teach the policy what not to do. A policy that only sees good demonstrations learns what success looks like but doesn't learn to recover from the path toward failure.

π*₀.6 introduces Recap (RL with Experience and Corrections via Advantage-conditioned Policies), which sidesteps the log-likelihood problem entirely by treating advantage as a text token in the prefix. A binarized advantage indicator, "Advantage: positive" or "Advantage: negative," is computed by comparing each trajectory's advantage against the 30th-percentile threshold for that task and inserted alongside the subtask. The combined training objective becomes:

$$\min_\theta\,\mathbb{E}\Big[{-}\log \pi_\theta(\mathbf{a}_t \mid \mathbf{o}_t, \ell) - \alpha\log\pi_\theta(\mathbf{a}_t \mid I_t, \mathbf{o}_t, \ell)\Big]$$

with 30% dropout on the advantage indicator. That dropout is what makes the approach work at inference time. By forcing the model to learn both the conditional and unconditional distributions, it enables classifier-free guidance: sample with a guidance scale $\beta \in [1.5, 2.5]$ to sharpen the policy toward the positive-advantage mode. This is CFG borrowed from image diffusion, but doing different work here. In image generation, CFG steers toward a prompt. Here, it steers toward trajectories the value function rated as closer to success.

### Why This Outperforms the Alternatives

In a direct comparison on the same laundry task with the same data, Recap outperforms both PPO and AWR. PPO requires a trust-region constraint tight enough that off-policy stability becomes a pyrrhic victory: the training is stable, but the resulting policy isn't meaningfully better. AWR downweights suboptimal trajectories to near-invisibility, so the policy never learns what fast looks like by contrast with slow. Recap keeps all trajectories and lets the model discriminate between them at inference time rather than during training.

| Method | Laundry throughput | Why it fails |
|---|---|---|
| Recap | Highest | — |
| AWR | Much lower | Downweights bad data; loses speed signal |
| PPO | Poor | Trust region too tight for flow-matching off-policy |

The value function itself is a 670M Gemma 3-initialized VLM predicting a distribution over 201 bins representing negative steps to task completion. It's co-trained with a slice of web data to prevent overfitting to robot observations, mirroring the co-training discipline from π₀.5.

The deployment results are what make the approach credible beyond the ablations. A 13-hour continuous espresso-making demonstration. Two-plus hours of diverse laundry folding across eleven item types in a home the model had never seen. Factory-grade box assembly on commercial packaging. On a strict collar-up t-shirt folding criterion, two Recap iterations using 600 trajectories each, with no human corrections, pushed success rate to 97%. Specific undesirable behaviors can be eliminated with entirely autonomous data, as long as the value function can identify which rollouts were closer to success.

---

## π₀.7: Prompt Diversification as a Scaling Axis

π₀.7 is the paper where the series finally shows its shape. The earlier papers accumulated data sources. This one accumulates prompt components. The training context now carries the overall task instruction, a predicted subtask, subgoal images depicting the desired near-future state, and episode metadata covering speed, quality rating, mistake flags, and control mode. Every component is randomly dropped during training, so any subset is a valid prompt at inference. And classifier-free guidance now applies to any prompt component, not just the advantage indicator from π*₀.6.

The ablation that justifies the entire design appears in Figure 18 of the paper. On a laundry task, the authors bucket training data by quality, top 30%, top 50%, top 80%, all of it, and train two variants: one with metadata, one without. Without metadata, adding lower-quality data makes the policy worse. The larger dataset regresses. With metadata, adding the same data monotonically improves performance, because the model learns to condition on quality rather than average over it.

This is the scaling story, stated plainly. Heterogeneous data is a liability for models that can't represent provenance, and a scaling axis for models that can.

### The World Model as Semantic Bridge

The subgoal image generator deserves attention on its own. It's a 14B mixture-of-transformers model initialized from BAGEL, trained with flow matching to predict end-of-segment images conditioned on the current observation, the subtask, and the metadata. At runtime it refreshes every four seconds or on subtask change, asynchronously, so it doesn't block the action loop.

The question worth asking is why bother generating subgoal images at all when you already have language subtasks. The answer is that language is a lossy description of spatial state. "Put the mug in the left drawer" doesn't specify which mug, which drawer, or the geometry of the target configuration. A generated image does. And because BAGEL inherits web-scale visual semantics, it can render subgoals for instructions the robot has never executed, including deliberately anti-bias prompts where the robot is asked to move things in a direction that training data never contained. The subgoal images carry the semantic burden that language can't.

### Emergent Cross-Embodiment Strategy

The most striking π₀.7 result is shirt folding on a bimanual UR5e with zero UR5e folding data in training. Not just zero folding-on-UR5e data, but zero folding-by-that-kinematic-class data. The policy achieves 85.6% task progress and 80% success, matching ten expert human teleoperators on their first UR5e attempt.

More interesting than the number is how the policy succeeds. The source robots in training folded with a tilted grasp. UR5e kinematics don't permit the same wrist angle. The policy discovers a vertical grasp instead. It isn't replicating source-embodiment motion and failing gracefully. It's discovering a new strategy that suits the target morphology. That's a qualitatively different kind of generalization than anything π₀ could claim.

---

## The Arc, Stated Minimally

| Paper | Axis unlocked | Smallest change that worked |
|---|---|---|
| π₀ | Cross-embodiment imitation at scale | Flow-matching action expert + VLM backbone |
| π₀.5 | Open-world environment generalization | Six-source co-training + unified HL+LL |
| π*₀.6 | Offline RL on real deployment data | Advantage conditioning + CFG |
| π₀.7 | Heterogeneous-data scaling | Prompt diversification + subgoal world model |

Each release absorbs a data regime the previous one couldn't safely train on. Each introduces the minimum surgery. The backbone keeps compounding rather than being replaced.

---

## Tensions Worth Naming

The series isn't internally consistent on every point, and the contradictions are more informative than the agreements.

The scale-versus-diversity tension runs through all four papers. π₀ sold itself on 10,000 hours. π₀.5 showed that cross-embodiment and web data mattered more than same-embodiment volume. π₀.7 went further still, finding that removing the 20% most diverse data hurts more than removing 20% random data. The naive "more hours equals better" reading of π₀ was wrong, but π₀'s own ablations on pretraining diversity actually anticipated this. The internal tension resolves as: diversity was always the point, the first paper just didn't emphasize it enough.

The implicit-versus-explicit hierarchy question is the most interesting unresolved thread. π₀.5's finding that running without explicit high-level inference captures most of the benefit sits uneasily with π*₀.6 and π₀.7 both keeping the explicit pathway. The reconciliation offered indirectly by π₀.7's language-coaching results is that explicit hierarchy matters more as task horizon grows. Short tasks dissolve it; long tasks need it back. This is plausible, but it hasn't been rigorously tested.

The FAST-versus-pure-flow-matching question is the most decisive internal architectural correction. π₀ used pure flow matching. π₀.5 found that FAST-tokenized pretraining followed by flow-matching post-training was more compute-efficient even at 300,000 steps. The remaining series never looked back, which suggests the finding was robust, but there's no ablation that isolates exactly what FAST pretraining contributes to the final policy.

Knowledge Insulation, the stop-gradient introduced in π*₀.6 to prevent the flow-matching action expert from updating the VLM backbone, is justified empirically but has no within-series ablation isolating its contribution. It might be load-bearing or it might be a temporary fix for the current backbone size. The series doesn't say.

---

## What the Series Still Doesn't Answer

Four questions the program hasn't resolved, stated specifically.

Nothing in the series closes a fully autonomous RL loop inside a generalist policy. π*₀.6 needs humans for resets, rewards, and interventions. π₀.7 distills rather than continues RL training. The flywheel spins, but it doesn't yet self-propel.

The diversity-beats-volume story has no identified ceiling. π₀.7's ablations are suggestive but don't show where the improvement curve bends. This matters because the annotation cost of metadata-tagged heterogeneous data grows with the dataset, and the scaling story only survives if that annotation stays cheap.

Implicit hierarchy hasn't been tested on tasks requiring cross-room navigation or multi-episode memory. The π₀.5 finding was on mobile manipulation within a home. It might not survive at horizons where hierarchy has to do substantially more work.

The RL-specialist-to-generalist distillation story rests on a specific assumption: that the prompt carries enough provenance signal to let the generalist recover the specialist mode. If that assumption fails for a new task class, the distillation pipeline breaks. Which task classes break it is not yet known.

---

## What Changed, and What Didn't

The π-series is interesting not because it proves any one technique is correct, but because it models a way of doing research that most of robotics still doesn't practice. Pick a bottleneck. Add the minimum change that moves it. Keep everything else fixed. Write down what you measured. Repeat.

The through-line from π₀ to π₀.7, a 3.3B flow-matching VLA with a cross-embodiment pretraining mixture, to a 5B flow-matching VLA whose prompt carries its own provenance and whose subgoals come from a web-pretrained world model, is roughly eighteen months of work. In that span, the trunk barely moved. What moved was everything about what goes into the trunk: more data sources, more conditioning channels, more ways to steer the action distribution at inference.

That's the pattern worth stealing. Not the specific architecture, but the discipline of treating the prompt surface and the training data as the primary design axes, with architecture modifications reserved for when those axes genuinely can't bear the load. Most dexterous-policy research still defaults to the opposite: new architectures, new losses, new names. And it shows in the results.

The π-series doesn't answer what the next bottleneck is. But whichever bottleneck it turns out to be, the method for attacking it is already written down.

Sources:

- [π₀: A Vision-Language-Action Flow Model for General Robot Control](https://arxiv.org/abs/2410.24164)
- [π₀.5: A Vision-Language-Action Model with Open-World Generalization](https://arxiv.org/abs/2504.16054)
- [π*₀.6: A VLA That Learns From Experience](https://arxiv.org/abs/2511.14759)
- [π₀.7: A Steerable Generalist Robotic Foundation Model with Emergent Capabilities](https://pi.website/pi07)
- [PaliGemma: A Versatile 3B VLM for Transfer](https://arxiv.org/abs/2407.07726)
- [Open X-Embodiment: Robotic Learning Datasets and RT-X Models](https://arxiv.org/abs/2310.08864)
- [FAST: Efficient Action Tokenization for Vision-Language-Action Models](https://arxiv.org/abs/2501.09747)
- [BAGEL: A Unified Mixture-of-Transformers for Image Understanding and Generation](https://arxiv.org/abs/2505.14683)
