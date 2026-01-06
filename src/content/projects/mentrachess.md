---
title: "MentraChess"
description: "A real-time chess server for AR smart glasses using the MentraOS SDK; made for the MentraOS hackathon. Features voice-controlled chess, AR board display, and Stockfish AI—all deployable on Node.js or Bun with no system binary dependencies."
githubUrl: "https://github.com/UditKarth/MentraChess"
techStack: ["TypeScript", "Node.js", "MentraOS SDK", "Stockfish", "AR"]
publishDate: 2025-10-20
---

A real-time chess server for AR smart glasses using the MentraOS SDK. Features voice-controlled chess, AR board display, and Stockfish AI—all deployable on Node.js or Bun with no system binary dependencies.

## Key Features

- **Voice-controlled chess moves**: Natural language move commands (e.g., "rook to d4", "pawn e5")
- **P2P Connectiosn**: Connect with others using Mentra glasses and play
- **AI opponent**: Stockfish integration with configurable difficulty levels
- **Real-time AR board**: Live board and feedback display on smart glasses
- **Session management**: Persistent game state and session handling

## Technical Highlights

The application uses the npm `stockfish` package which runs as a Node.js child process, eliminating the need for system binaries or WASM setup. This makes it easily deployable on platforms like Railway and Vercel.

The chess logic handles move parsing from natural language voice commands, validates moves according to chess rules, and manages game state. The AR display provides real-time visual feedback of the board state and move outcomes.

## Architecture

Built with TypeScript and designed to work seamlessly with the MentraOS SDK. The server handles voice input parsing, chess move validation, Stockfish AI integration, and AR rendering—all in a single deployable Node.js application.

