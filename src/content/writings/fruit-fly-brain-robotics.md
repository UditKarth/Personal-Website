---
title: "What a Fruit Fly's Brain Teaches Us About Building Better Robots"
description: "How the first full wiring diagram of the fruit fly brain, embodied in physics-accurate digital bodies, is changing how we build robot controllers—and what it says about evolution and intelligence."
pubDate: 2026-03-07
status: "evergreen"
tags: ["robotics", "FlyWire", "reinforcement-learning", "biomimetic-robotics", "control-systems"]
image: "/writings-images/flyeitre.jpg"
series: "Applications of Robotics"
---
![FlyWire](/writings-images/flyeitre.jpg)
(Source: Flywire)

For a long time, neuroscience and robotics talked past each other. Neuroscientists mapped circuits. Roboticists built controllers. The two communities published in different journals, attended different conferences, and operated with a shared but mostly unstated assumption: that understanding a brain and engineering a machine were fundamentally separate problems.

The fruit fly broke that assumption.

Between 2022 and 2025, a series of results came together that nobody had quite planned for. Connectomics researchers completed the first full wiring diagram of an adult animal brain. Biomechanical simulation researchers built a physics-accurate digital body for that same animal. And then, in what might be the most surprising development of all, a third group took the actual neural architecture from that brain and used it as the controller for the digital body. The simulated fly moved. And it moved better, with less training data and lower error, than controllers built from scratch by humans.

That result deserves more attention than it has gotten. It suggests something specific and testable about intelligence: that the wiring of a nervous system isn't arbitrary. It's been optimized, over millions of years of evolution, for the exact body it controls and the exact world that body navigates. And if that's true, it changes how we should think about building robots.

## A Brain Small Enough to Map, Complex Enough to Matter

The reason Drosophila melanogaster became the organism of choice for connectomics has nothing to do with charm. It's a question of tractability meeting complexity at the right point on the curve.

The nematode C. elegans had its complete 302-neuron connectome mapped in 1986. That was an extraordinary achievement, but 302 neurons produce limited behavior. The worm navigates, feeds, and reproduces, and that's roughly the extent of it. The mouse brain has 71 million neurons, which makes complete synaptic-resolution mapping, at least with current technology, essentially impossible. The fruit fly sits in the middle: approximately 140,000 neurons and 50 million synapses, small enough to image fully with modern electron microscopy, large enough to produce sophisticated behavior including social learning, courtship rituals, memory formation, and complex 3D navigation.

Getting from "tractable" to "mapped" took about three decades of work and several technological revolutions.

Early efforts in the 1990s were manually reconstructed from serial tissue sections, tracing individual neurons through hundreds of physical slices under a microscope. The first meaningful result, mapping a single column of the fly's visual system, appeared in 1991. It was painstaking, slow, and limited to small regions. The 2000s brought three-dimensional electron microscopy techniques that eliminated the misalignment artifacts that plagued earlier methods. Traditional transmission electron microscopy delivered excellent resolution in two dimensions but poor Z-axis resolution and a persistent risk of section distortion. Focused Ion Beam Scanning Electron Microscopy (FIB-SEM) eventually solved this by achieving isotropic resolution, equal clarity in all three axes, which made automated tracing of fine neural branches feasible for the first time.

By 2020, researchers had produced the "hemibrain": a dense reconstruction of roughly half the fly's central brain containing about 25,000 neurons. The larval connectome, completed in 2023, mapped 3,016 neurons and 548,000 synapses in the first-instar larva and served as a critical proof of concept. Treating the larval brain as a directed graph revealed 93 distinct neuron types based purely on connectivity patterns, and found that 93% of larval neurons had a perfect mirror-image counterpart in the opposite hemisphere. That bilateral symmetry would simplify later analysis of the adult brain considerably.

## The FlyWire Milestone

The 2024 publication of the complete adult Drosophila connectome by the FlyWire Consortium is the result that anchors everything that followed. Led jointly by Princeton, Cambridge, and the Janelia Research Campus, it produced the most complex wiring diagram of an adult animal brain ever assembled.

The scale of the problem required a fundamentally different approach from earlier connectomics. The source data was the Full Adult Fly Brain dataset, derived from 7,000 ultrathin sections of a single female fly's brain. Processing that volume manually was out of the question. The solution was a three-stage pipeline combining AI automation with global crowdsourcing.

Convolutional neural networks and flood-filling algorithms first partitioned the 3D volume into individual neurons automatically and predicted the locations of all synapses, also estimating neurotransmitter identity (GABAergic, cholinergic, and so on) for most of the population. The Connectome Annotation Versioning Engine, a custom back-end system, tracked every subsequent edit and annotation in real time across a decentralized global team. Then over 50 laboratories and hundreds of citizen scientists used the FlyWire web interface to proofread the AI segments, correcting errors where neurons had been falsely merged or split.

The final numbers: 139,255 neurons, approximately 54.5 million synapses, and 8,452 distinct cell types. The resulting data is now accessible through the Codex platform, a public browser for the connectome.

One finding reshaped the anatomical picture researchers had been working with. The subesophageal zone (SEZ), a brain region that earlier partial connectomes had poorly covered, turned out to be a primary integration hub. It receives sensory signals from across the brain and sends nearly all outgoing motor commands to the ventral nerve cord (VNC), the fly's functional equivalent of a spinal cord. The old picture had underestimated this region's centrality because the imaging just hadn't covered it well. The complete connectome corrected that.

## Building the Body to Go With the Brain

Mapping the neural hardware is necessary but not sufficient. To understand what that hardware actually does, you need to run it inside a physical body that obeys real physics. This is where NeuroMechFly enters the picture.

The original version, published in 2022, was built from high-resolution X-ray micro-computed tomography of an adult female fly. Researchers encased the fly in resin, scanned it, and extracted an accurate 3D polygon mesh of the exoskeleton and wings. Each biological joint was approximated as either a single hinge or a combination of hinges representing two- or three-degree-of-freedom articulations. The model ran in the PyBullet physics engine and initially focused on "kinematic replay," feeding in recorded movement data from real flies to calculate the joint torques and ground reaction forces that actual biology must be producing.

This was useful as a measurement tool. But it wasn't an autonomous agent. It couldn't do anything the researchers hadn't pre-scripted.

NeuroMechFlyv2 changed that. The upgrade, released through the Ramdya Lab and Eon Systems, transformed the model from a motor-replay system into something that could actually behave. Four major additions made this possible.

The vision system now simulates the fly's compound eyes, which consist of individual ommatidia arranged in a hexagonal lattice. Using the FlyVision model, the digital fly can simulate visual retina activity and track objects or avoid obstacles in real time. Olfactory sensors on the antennae and maxillary palps detect chemical gradients, enabling odor-taxis behaviors where the fly navigates toward an attractive plume. A phenomenological model of leg adhesion, toggleable between stance and swing phases, lets the digital fly walk on vertical surfaces and ceilings, capturing the 3D complexity of the fly's actual world. And perhaps most critically, the model now includes ascending mechanosensory pathways: signals from joints and legs travel back up to the "brain" level, enabling behaviors like path integration (keeping track of position in space) and head stabilization (compensating for body movement to keep the visual field steady).

The framework migrated to the MuJoCo physics engine, which handles contact dynamics and articulated structures better than PyBullet, and formulates the control problem as a Partially Observable Markov Decision Process. That framing makes it a standardized platform for training neural controllers through reinforcement learning.

## The Other Digital Fly

Concurrent with the NeuroMechFly work, a collaboration between Google DeepMind and the HHMI Janelia Research Campus produced a different digital fly model, published in Nature in 2025, that takes a notably different approach.

Where NeuroMechFlyv2 focuses on walking, rugged terrain, olfaction, and adhesion, the DeepMind/Janelia "flybody" model centers on the integration of walking and flight. It uses a kinematic tree with 102 degrees of freedom derived from high-resolution confocal stacks and includes a fluid force model for aerodynamics. The result is a simulated fly that can walk, take off, fly, and land, something that NeuroMechFlyv2 doesn't attempt.

The controllers trained on flybody use end-to-end reinforcement learning, and the architecture is hierarchical: a high-level "brain" network issues steering commands to a pre-trained low-level flight controller. This separation allows the high-level network to reuse the flight controller across different tasks without retraining it from scratch. The researchers demonstrated this by having the simulated fly chase another fly in 3D space, a behavior that requires coordinating vision, flight stability, and high-level goal pursuit simultaneously.

The two models are pursuing complementary goals rather than competing ones. NeuroMechFlyv2 prioritizes biological fidelity in ground locomotion and sensorimotor integration. Flybody prioritizes the full locomotive repertoire and hierarchical control. Both are implemented in MuJoCo, which makes them increasingly compatible as the field converges.

## Using the Real Brain as a Controller

This is where the research crosses into genuinely new territory.

In 2025 and 2026, researchers introduced the Fly-connectomic Graph Model (FlyGM), sometimes called flyGNN. Instead of designing a neural network controller from scratch, they took the actual topology of the 2024 Drosophila connectome and instantiated it directly as the policy network for reinforcement learning. The connectome's 139,000-plus neurons and 54 million synaptic connections became the architecture of the controller, with the structural wiring inherited from biology rather than engineered by humans.

The connectome is represented as a directed graph where neurons are nodes and synaptic connections are edges. The model partitions this graph into three functional pathways: afferent neurons receiving environmental input, intrinsic neurons handling internal state (roughly 85% of the total), and efferent neurons translating internal state into motor commands for the flybody model.

What happened when they trained this connectome-structured controller alongside controllers built from scratch? The connectome-based architecture achieved significantly higher sample efficiency and lower error rates. It needed less training data to reach the same performance. And when compared against degree-preserving random graphs (networks with the same number of neurons and connections but randomly rewired), the actual connectome topology outperformed them clearly.

This result is worth sitting with for a moment. The specific wiring of the fly brain, not just its size or density, but the particular pattern of which neurons connect to which, acts as a structural inductive bias that makes learning faster and more accurate. The evolutionary pressure that shaped that wiring over millions of years appears to have produced an architecture that is non-randomly optimized for the physical constraints of the body it controls.

## The Logic of Stopping

Simulating the connectome hasn't just produced better controllers. It has revealed specific circuit mechanisms that weren't accessible from anatomy alone.

The "halt" circuit is a striking example. When a fly stops walking, three distinct neuron classes are involved, each contributing differently to the outcome.

Foxglove (FG) neurons use inhibitory (GABAergic) signaling to suppress forward-walking promotion pathways broadly. This creates a general suppression of walking and is particularly active during feeding. Bluebell (BB) neurons, also GABAergic and inhibitory, specifically suppress the turning pathway, preventing directional changes during feeding without necessarily stopping all forward movement. Brake (BRK) neurons do something more mechanically interesting: they're cholinergic (excitatory) and ascending, meaning they send signals from the leg segments in the ventral nerve cord back up to the brain. When activated, they don't just reduce the "walk" signal; they actively increase mechanical resistance at the leg joints, locking the body in place.

The BRK mechanism reveals a design principle that's easy to miss if you're only thinking about neural computation. The fly doesn't just stop by turning off a motor command. It creates physical resistance at the joints themselves, ensuring stability even if the center of mass shifts or a perturbation arrives. The body participates in the halt, not just the brain.

This is directly relevant to hexapod robotics. Most robotic stability algorithms work by modifying motor commands centrally. The fly's approach is distributed: the joints themselves become stiffer on command, which creates stability without requiring the central controller to anticipate every possible perturbation. Implementing this in robots like Drosophibot, a hexapod designed with anatomical accuracy to the fly including compliant feet and a retractable abdomen, is an active area of development.

## The Efficiency Argument

There's a version of this research that matters purely for engineering reasons, entirely separate from its scientific significance.

The fly brain's 140,000 neurons consume a tiny fraction of the energy that current robotic AI systems require. A fruit fly navigates complex 3D environments, processes multimodal sensory input, learns, socializes, and reproduces, all on the computational equivalent of a poppy seed. Current deep reinforcement learning approaches for robot locomotion run on GPU clusters consuming kilowatts.

The FlyGM research suggests a specific reason for this gap: current AI architectures are over-parameterized for physical interaction tasks. They use generic network topologies that must learn from scratch the kinds of structural priors that biology has already built in. When you start with a connectome-derived architecture, you arrive at good solutions faster because the structure is already aligned with the problem.

Leaky integrate-and-fire spiking neural network models, which approximate biological neurons more closely than standard artificial neurons, have already demonstrated the ability to predict which specific neurons will activate to initiate behaviors like eating or grooming in the fly simulation. Implementing these models on neuromorphic hardware chips that are designed to run spiking networks efficiently could yield autonomous drones and prosthetics that respond with biological latency while consuming a fraction of current power budgets. The biological structure would be carrying the load that brute-force compute currently shoulders.

## Where This Is Heading

The trajectory here is legible even if the timescale isn't.

The 2024 FlyWire connectome covers a single female fly. The male connectome was released in 2025, and comparing the two is already revealing neural circuits underlying sex-specific behaviors like courtship, which requires the male fly to process visual, olfactory, and mechanosensory signals simultaneously and coordinate a highly choreographed behavioral sequence. Understanding which circuits differ between male and female, and how those differences produce different behaviors, gives researchers a model for how neural architecture encodes behavioral repertoire.

The broader progression runs from C. elegans at 302 neurons in 1986, to Drosophila at 140,000 neurons now, toward the mouse and eventually the human. Each step increases complexity by orders of magnitude and introduces new behaviors, but the fundamental approach scales: map the connectome, build the body, embody the brain, observe what emerges. Conditions that affect neural wiring, including epilepsy and various psychiatric disorders, may eventually be studied by introducing connectome-level perturbations into the digital model and observing the behavioral consequences. This turns "connectopathy" from a descriptive label into something you can simulate and test.

The open problems are real and specific. Current FlyGM models are still approximations of the connectome, not exact instantiations. The computational cost of simulating 139,000 neurons in real time at the fidelity needed for learning is substantial. The gap between the controlled simulation environment and the chaotic real world that actual flies navigate hasn't been bridged. And translating findings from a 140,000-neuron insect brain to robotic applications requires abstracting principles rather than copying implementations directly.

None of those are fundamental barriers. They're engineering problems, which means they yield to resources, time, and clever people working on them.

## What the Fly Actually Tells Us

For decades, the standard model for building intelligent robots assumed that intelligence was primarily a matter of computation. Given enough parameters and enough data, a sufficiently large network would learn to move, perceive, and act. The structure of the network was largely incidental, something to be tuned but not fundamentally constrained.

The FlyGM result challenges that assumption at its core. A controller whose architecture is inherited from 540 million years of insect evolution outperforms a controller whose architecture was designed by humans for the same task on the same body. The evolutionary structure isn't just a historical artifact. It's load-bearing.

The fly's brain is small enough that we can now see this principle clearly, without the confounds of scale that make mammalian neuroscience so difficult to interpret. It took a decade of imaging technology, a global crowdsourcing effort, two competing digital body models, and a graph neural network before the picture came into focus.

A fruit fly weighs about a milligram and lives for roughly 30 days. It turns out to be one of the most important animals in the history of robotics.

Sources:
- [Complete wiring map of an adult fruit fly brain](https://www.nih.gov/news-events/nih-research-matters/complete-wiring-map-adult-fruit-fly-brain)
- [Fruit fly brain map and wiring diagram: A major milestone for neuroscience](https://braininitiative.nih.gov/news-events/blog/fruit-fly-brain-map-and-wiring-diagram-major-milestone-neuroscience)
- [NeuroMechFly 2.0, a framework for simulating embodied sensorimotor control in adult Drosophila](https://www.biorxiv.org/content/10.1101/2023.09.18.556649v1)
- [Whole-body physics simulation of fruit fly locomotion](https://www.researchgate.net/publication/391082514_Whole-body_physics_simulation_of_fruit_fly_locomotion)
- [Simulating embodied sensorimotor control with NeuroMechFly v2](https://neuromechfly.org/)
- [Simulating how fruit flies see, smell, and navigate](https://actu.epfl.ch/news/simulating-how-fruit-flies-see-smell-and-navigate/)