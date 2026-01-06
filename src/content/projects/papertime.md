---
title: "PaperTime - ML Paper Recommendation Website"
description: "A modern, intelligent machine learning paper recommendation system that helps researchers discover relevant papers tailored to their interests."
githubUrl: "https://github.com/UditKarth/PaperTime"
techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand", "ArXiv API", "TF-IDF"]
publishDate: 2025-11-15
---

A modern, intelligent machine learning paper recommendation system that helps researchers discover relevant papers tailored to their interests.

## Key Features

- **Intelligent Recommendations**: Content-based recommendation algorithm using TF-IDF and cosine similarity to suggest papers based on your preferences
- **Hierarchical Subject Filters**: Filter papers by ML subfields (NLP, Computer Vision, Reinforcement Learning, etc.)
- **Boolean Search**: Advanced search with AND, OR, and NOT operators for precise queries
- **Paper-Type Filters**: Filter by Conference, Journal, Preprint, or Workshop papers
- **Key Points Extraction**: Automatically extracts 3-5 key points from paper abstracts
- **Code Availability Badges**: Identifies papers with available code repositories
- **Persistent Filters**: Your filter preferences are saved and restored across sessions
- **Minimalist Design**: Clean, scannable card-based UI with key metrics
- **Continuous Feedback**: Like/dislike papers to improve recommendations

## Technical Implementation

The recommendation algorithm uses TF-IDF vectorization to convert papers into feature vectors based on their titles and abstracts. Cosine similarity is then computed between papers, and rankings combine similarity to liked papers (50%), recency (30%), and foundational importance (20%).

The application is fully client-side, using browser-native APIs for XML parsing and a CORS proxy to interact with the ArXiv API. This allows the application to work entirely without a backend server.

## Tech Stack

Built with Next.js 14+ using the App Router, TypeScript for type safety, Tailwind CSS for styling, and Zustand for state management. The recommendation engine implements content-based filtering using TF-IDF vectorization.

