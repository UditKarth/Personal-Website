---
title: "3D Scene Perception & Point Cloud Pipeline"
description: "A minimal Vite + React + Three.js app that implements a multi-stage 3D scene perception pipeline: procedural scene generation, multi-view capture, point cloud fusion, ICP registration, and surface reconstruction."
githubUrl: "https://github.com/UditKarth/DepthEstimationPipeline"
demoUrl: "https://uditkarth.github.io/DepthEstimationPipeline/"
techStack: ["Vite", "React", "Three.js", "Tailwind CSS", "Marching Cubes", "ICP"]
publishDate: 2025-03-05
---

A minimal Vite + React + Three.js app that implements a multi-stage 3D scene perception pipeline.

## Pipeline Stages

1. **Scene Generation** – Procedural primitives + ground plane
2. **Multi-View Capture** – Virtual camera rig + raycasted depth maps
3. **Point Cloud Fusion** – Back-projection, voxel downsampling, outlier removal
4. **Registration (ICP)** – Point-to-plane ICP with pose noise
5. **Surface Reconstruction** – Marching Cubes over an SDF grid

## Key Features

- **Procedural scene setup**: Generate primitives and a ground plane for testing
- **Virtual camera rig**: Captures multi-view depth maps via raycasting
- **Point cloud processing**: Back-projection, voxel downsampling, and outlier removal
- **ICP registration**: Point-to-plane ICP with configurable pose noise
- **Surface reconstruction**: Marching Cubes over an SDF grid

## Tech Stack

Built with Vite for fast development, React for UI, and Three.js for 3D rendering. Tailwind CSS is used for utility styling. The pipeline implements standard computer vision techniques: depth map fusion, point-to-plane ICP, and Marching Cubes with edge/triangle lookup tables.

## Related

A [Jupyter notebook](https://github.com/UditKarth/DepthEstimationNotebook) explores similar concepts—tabletop RGB-D processing, point cloud fusion, voxel downsampling, outlier removal, RANSAC plane fitting, and DBSCAN clustering—using Open3D and PyBullet for synthetic data.
