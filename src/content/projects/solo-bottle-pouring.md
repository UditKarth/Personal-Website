---
title: "Solo Bottle Pouring"
description: "Robotics hackathon project: ACT model trained with LeRobot on combined datasets for bottle finding, grasping, and pouring—using action primitives on a Le Robot SO101. 4th place, 18-hour build."
demoUrl: "https://devspot.app/projects/884"
techStack: ["LeRobot", "ACT", "PyTorch", "SmolVLA", "Robotics"]
publishDate: 2026-02-03
---

A robotics hackathon project that trained an Action Chunking with Transformers (ACT) model using [LeRobot](https://github.com/huggingface/lerobot) to perform end-to-end bottle pouring: finding the water bottle, grasping it, and pouring. The policy was built by combining three datasets and structuring actions into primitives, inspired by [*RoboChemist: Long-Horizon and Safety-Compliant Robotic Chemical Experimentation*](https://arxiv.org/abs/2509.08820).

## Key Features

- **Multi-dataset fusion**: Combined an egocentric pouring dataset, a general-purpose grasping dataset, and a full-motion teleoperation dataset (find bottle → grasp → pour)
- **Action primitives**: ACT structured the task into reusable primitives rather than a single long-horizon policy
- **Teleoperation data**: Generated and used a custom dataset covering the entire pour sequence via teleoperation
- **Le Robot SO101**: Deployed and evaluated on the hackathon’s Le Robot SO101 hardware
- **SmolVLA**: Trained on an NVIDIA A100 for vision–language–action modeling

## Technical Highlights

The system uses LeRobot’s ACT implementation to learn from the three data sources. The primitive-based design (following the arxiv reference) allowed the model to segment the long-horizon task into discrete phases (localizing the bottle, grasping, and pouring) which improved robustness and sample efficiency. SmolVLA provided the vision–language backbone trained on the A100.

## Hackathon Results

- **Placement**: 4th place  
- **Build time**: ~18 hours  
- **Project link**: [Devpost](https://devspot.app/projects/884)

## Tech Stack

LeRobot for data and training, ACT for action chunking and primitives, SmolVLA for VLA, PyTorch, and teleoperation for data collection. Training ran on an NVIDIA A100; evaluation on the Le Robot SO101.
