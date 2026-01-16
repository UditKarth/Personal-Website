---
title: "Beyond Goals: The Rise of Process-Aware Rewards in Robotics"
pubDate: 2026-01-02
description: "Exploring how General Process Reward Models (GRMs) are revolutionizing robot learning by focusing on process rather than just end goals."
status: "evergreen"
tags: ["robotics", "reinforcement-learning", "reward-modeling", "machine-learning"]
---
![Robotics Development](/writings-images/RewardModeling.png)
Teaching robots to perform precise manipulation tasks (like assembly, surgery, or everyday household work) has always run into the same problem: how do you define the right reward? In reinforcement learning (RL), the reward function is everything. If it's poorly designed, the robot either learns very slowly or learns the wrong behavior entirely.

Over time, reward modeling in robotics has gone through several major phases. Each one fixed some problems while introducing new ones. The latest shift, to General Process Reward Models (GRMs), marks a big step toward robots that can learn complex tasks quickly and reliably from minimal human input.

## The Early Days: Hand-Coded Rewards and Their Limits

Early robotic RL relied on manually designed reward functions. For simple tasks, this worked fine: reach a target, get a reward. But for manipulation, rewards were often too sparse. A robot might need millions of interactions before ever seeing a positive signal.

To fix this, researchers added dense reward shaping, giving the agent feedback at every step (distance to object, alignment, force, etc.). While this sped up learning, it came with a major risk: reward hacking. Robots learned to maximize the reward without actually completing the task (e.g., hovering near an object instead of grasping it).

Potential-Based Reward Shaping helped by preserving the optimal policy mathematically, but it still required careful hand-design. Small mistakes often led to brittle or misleading behavior.

## Reward Machines: Structured but Rigid

Reward Machines tried to bring structure by breaking tasks into stages, like a finite-state machine: approach → grasp → move → release. This provided clearer progress signals and improved learning speed significantly.

The downside? They were expensive to build. Engineers had to define features, transitions, and logic by hand. In real-world, vision-based environments with noise and occlusion, this approach doesn't scale well.

## Learning Rewards from Humans: IRL and RLHF

To avoid manual design altogether, researchers turned to Inverse Reinforcement Learning (IRL) and later Reinforcement Learning from Human Feedback (RLHF).

IRL learns a reward function from expert demonstrations.

RLHF learns rewards from human preference comparisons between trajectories.

These methods align robots with human intent better than hand-coded rules, but they're slow and costly. Collecting demos or preference labels doesn't scale, especially when it comes to high-precision tasks.

## Foundation Models Enter the Picture

Vision-language models like CLIP made it possible to specify goals in natural language or images. Suddenly, robots could get reward signals without task-specific engineering or demos.

This led to robotics-focused models like:

- **R3M** – learned manipulation-friendly visual representations from human videos

- **VIP** – treated visual goal reaching as a value-learning problem

- **LIV** – combined language understanding with goal-conditioned rewards

These models generalized well and worked zero-shot, but they struggled with:

- Fine-grained, step-by-step progress

- Long-horizon precision tasks

- Occlusion and viewpoint changes

- Semantic shortcuts near task completion

Success rates on hard manipulation tasks were often below 50%.

## The Breakthrough: General Process Reward Models (GRMs)

GRMs, introduced with the Robo-Dopamine framework, tackle the core problem directly: robots need to understand process, not just end goals.

Key ideas:

1. **Step-aware (hop-based) progress**
   Instead of continuous distance metrics, GRMs predict discrete "progress hops" between states. This prevents reward drift and makes progress estimation more stable and interpretable.

2. **Multi-perspective fusion**
   Progress is estimated from three views:

   - From the previous step (local change)

   - From the start (global consistency)

   - From the goal (high sensitivity near completion)

   Averaging these makes rewards robust to occlusion and perception errors.

3. **Policy-invariant shaping**
   GRMs are combined with reward shaping that provably does not change the optimal policy. This avoids reward hacking while still giving dense feedback.

## Why GRMs Matter in Practice

Compared to earlier methods, GRMs hit a sweet spot:

| Method                  | Data Needed       | Training Time | Precision Task Success |
| ----------------------- | ----------------- | ------------- | ---------------------- |
| Sparse RL               | Millions of steps | Days          | Often fails            |
| Imitation Learning      | 50+ demos         | Hours         | 40–60%                 |
| VIP / LIV               | 1 goal image      | Zero-shot     | 30–46%                 |
| **GRM (Robo-Dopamine)** | **1 demo**         | **~1 hour**   | **95%+**               |

GRMs combine:

- The structure of reward machines

- The generalization of foundation models

- The safety of policy-invariant shaping

- All without heavy human supervision.

## The Bigger Picture: Where Reward Modeling Is Headed

Reward models are shifting from simple scoring functions to reasoning systems. With vision-LLMs at their core, GRMs don't just say how good a state is—they implicitly understand why progress is happening.

This opens the door to:

- Test-time action verification (sampling actions and picking the best one)

- More interpretable robot feedback

- Faster adaptation without retraining policies

In short, better reward models don't just make robots learn faster. They change what robots can realistically be taught—and who gets to teach them.

Sources
- [Robo-Dopamine: General Process Reward Modeling for High-Precision Robotic Manipulation](https://arxiv.org/html/2512.23703v1)
- [A Survey of Reinforcement Learning from Human Feedback](https://arxiv.org/html/2312.14925v3)
- [Dexterous Manipulation through Imitation Learning: A Survey](https://arxiv.org/html/2504.03515v1)
- [Reward Machines for Vision-Based Robotic Manipulation](https://www.cs.toronto.edu/~acamacho/papers/cam-var-zen-jai-isc-kal-icra21.pdf)
- [FLaRe: Achieving Masterful and Adaptive Robot Policies with Large-Scale Reinforcement Learning Fine-Tuning](https://www.cs.utexas.edu/~pstone/Papers/bib2html-links/hu_flare25.pdf)
- [A Comparison of Reinforcement Learning (RL) and RLHF](https://intuitionlabs.ai/articles/reinforcement-learning-vs-rlhf)
- [LIV: Language-Image Representations and Rewards for Robotic Control](https://www.seas.upenn.edu/~dineshj/publication/ma-2023-liv/ma-2023-liv.pdf)
- [RoVer: Robot Reward Model as Test-Time Verifier for Vision-Language-Action Model](https://arxiv.org/html/2510.10975v1)
