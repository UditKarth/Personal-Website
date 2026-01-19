---
title: "Gazebo Online"
description: "A React-based web application featuring a side-by-side IDE and 3D Robot Simulation with support for multiple robot types, including a 5-DOF robot arm and a 4-wheel rover with LiDAR visualization."
githubUrl: "https://github.com/UditKarth/GazeboOnline"
demoUrl: "https://gazebo-online.vercel.app/"
techStack: ["React", "Three.js", "React Three Fiber", "Monaco Editor", "Zustand", "Tailwind CSS", "Vite"]
publishDate: 2026-01-19
---

A React-based web application featuring a side-by-side IDE and 3D Robot Simulation with support for multiple robot types. Write C++ code to control robots in real-time with a professional engineering interface.

## Key Features

- **Dual Robot Types**: Switch between a 5-DOF robot arm with gripper and a 4-wheel rover
- **3D Simulation**: Real-time 3D visualization using Three.js and React Three Fiber
- **Code Editor**: Monaco Editor with C++ syntax support and robot-specific code templates
- **Robot Controller API**: Simple C++ API for controlling robots with ROS2-style commands
- **Physics Engine**: Realistic physics simulation for the rover with friction and watchdog behavior
- **LiDAR Visualization**: 360° LiDAR scan visualization for the rover
- **Telemetry Dashboard**: Real-time velocity graphs and occupancy maps for the rover
- **Animated Movements**: Smooth interpolated joint rotations for the arm
- **Dark Theme**: Professional engineering interface with Tailwind CSS

## Robot Types

### 5-DOF Robot Arm

Control a 5-degree-of-freedom robot arm with commands like:

```cpp
void main() {
    robot.moveJoint(0, 45);      // Move base joint to 45 degrees
    robot.moveJoint(1, 30);      // Move shoulder joint to 30 degrees
    robot.openGripper();          // Open the gripper
    robot.closeGripper();         // Close the gripper
}
```

Features include smooth joint animations with easing and animated gripper with open/close functionality.

### 4-Wheel Rover

Control a physics-based rover with ROS2-style velocity commands:

```cpp
void main() {
    robot.setLight("green");
    robot.move(1.0, 0.0);  // Move forward at 1 m/s
    float dist = robot.getDistance();
    if (dist < 2.0) {
        robot.move(0.0, 0.5);  // Turn if obstacle detected
    }
    robot.move(0.0, 0.0);  // Stop
}
```

The rover includes 360° LiDAR visualization, frontal distance sensor (5m range), LED indicator, and real-time telemetry with velocity graphs and occupancy maps.

## Tech Stack

Built with React 18 and Three.js for 3D rendering, the application uses React Three Fiber for declarative 3D scene management. The Monaco Editor provides a professional code editing experience with C++ syntax highlighting. Zustand manages state for both robot types, while a custom physics engine handles realistic rover movement with friction and watchdog behavior.

The C++ parser executes user code in a sandboxed environment, translating API calls into robot movements. The telemetry system provides real-time feedback with velocity graphs and occupancy maps for the rover.
