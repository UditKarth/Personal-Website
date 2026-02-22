---
title: "RoboPub Map"
description: "Full-stack web app that visualizes global robotics research on an interactive 3D globe: Python data pipeline (OpenAlex) and vanilla JS + Three.js WebGPU frontend with search, leaderboards, and day/night textures."
demoUrl: "https://uditkarth.github.io/RoboticsMap/"
techStack: ["Python", "OpenAlex", "Three.js", "WebGPU", "Vanilla JS", "SQLite"]
publishDate: 2026-02-21
---

A full-stack web app that visualizes global robotics research activity on an interactive 3D globe. A Python pipeline fetches robotics papers from [OpenAlex](https://openalex.org/) (filtered by the Robotics concept), builds a SQLite database, and exports per-institution and per-country stats. The frontend is vanilla JavaScript with [Three.js](https://threejs.org/) (r170+ WebGPU and TSL), no bundler—day/night Earth textures, bump/roughness/clouds, fresnel atmosphere, and instanced markers with log-scaled size and a subtle pulse.

## Key Features

- **Interactive 3D globe**: Day/night textures (Solar System Scope 2K), bump/roughness/clouds, fresnel atmosphere; markers as instanced spheres with log-scaled size and opacity pulse
- **OpenAlex data pipeline**: Fetches robotics papers (concept `C18903297`) from 2018–2026, cursor pagination, institution geo required; writes `publications.db`, `institutions.json`, and `meta.json`
- **Sidebar**: Search to filter markers by institution name; top institutions and top countries leaderboards (click to highlight on the globe); country counts use distinct papers per country from `meta.papers_by_country`
- **Scheduled updates**: GitHub Actions workflow runs incremental update and commits refreshed data so the globe stays current

## Technical Highlights

The frontend uses Three.js via an import map in `index.html`—no build step. The globe is rendered with WebGPU and TSL. The Python scripts (`backfill.py`, `update.py`, `export.py`) handle initial load, incremental updates, and export of institutions and meta (including `papers_by_country`) so leaderboard counts never exceed total papers. Textures are optional but recommended; the app can be served with `npx serve` or `python -m http.server`.

## Tech Stack

Python (requests, SQLite) for the OpenAlex pipeline and export; vanilla JS, Three.js r170+ WebGPU/TSL for the globe and UI; no bundler. Data lives in `data/publications.db`, `institutions.json`, and `meta.json`; textures in `img/` (Earth day, night, bump/roughness/clouds).
