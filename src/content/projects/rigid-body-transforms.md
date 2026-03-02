---
title: "Robotics Transform Visualizer"
description: "A React + Three.js app for visualizing rigid body transformations (SE(3)) with frame chaining, interactive gizmos, and multiple rotation representations."
githubUrl: "https://github.com/UditKarth/RigidBodyTransforms"
demoUrl: "https://uditkarth.github.io/RigidBodyTransforms/"
techStack: ["React", "Vite", "TypeScript", "Three.js", "@react-three/fiber", "@react-three/drei", "Zustand", "Tailwind CSS"]
publishDate: 2026-03-01
---

A React + Three.js app for visualizing rigid body transformations (SE(3)) with frame chaining, interactive gizmos, and multiple rotation representations.

## Key Features

- **Frame chaining**: Add root frames and child frames; each frame is a child of the previous in the scene graph (nested transforms)
- **Compose transforms**: For each frame, set **translation** (x, y, z) and **rotation** via:
  - **Euler angles** with configurable axis order (XYZ, ZYX, etc.)
  - **Quaternion** (x, y, z, w)
  - **3×3 rotation matrix** (read-only display)
- **Interactive gizmos**: Use **TransformControls** (translate / rotate / scale) in the 3D view; sidebar inputs update in real time
- **Visual aids**:
  - RGB axes per frame (X=Red, Y=Green, Z=Blue)
  - Dashed lines from parent origin to child origin
  - **Local** and **global** 4×4 transformation matrices for the selected frame
- **Robotics context**: Toggle **Intrinsic** vs **Extrinsic** rotation (gizmo and interpretation)
- **Reset to identity** per frame; **Gimbal lock** warning when the middle Euler angle is near ±90° (e.g. XYZ with Y ≈ ±90°)

## Tech Stack

Built with React and Vite for fast development, TypeScript for type safety, and Three.js with @react-three/fiber and @react-three/drei for declarative 3D rendering. Zustand manages the frame tree, selection, and UI options. Tailwind CSS powers the dark sidebar UI.
