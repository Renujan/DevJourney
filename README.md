# 🎮 DevJourneyAI — DevCorp Simulator

[![React Version](https://img.shields.io/badge/react-v19.0-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-v5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-v8.0-646cff.svg?logo=vite)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/tailwind--css-v4.0-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

> **DevJourneyAI** is a premium interactive learning application designed to simulate a junior developer's path at **DevCorp**. Build critical frontend, backend, and system design expertise through diagnostic sandboxes, gamified roadmaps, and mock interview arenas.

---

## 🚀 Key Modules & Interactive Features

### 1. 🗺️ Training Roadmap Timeline Path
* **Dynamic Node Progression**: Complete lessons and unlock nodes sequentially (HTML Core ➔ CSS Layouts ➔ JavaScript ES6+ ➔ React Basics ➔ API Integration ➔ Advanced React ➔ Building Projects ➔ Interview Prep).
* **Workspace Modal**: Features a split-screen layout with a 60% scrollable study center guide and a 40% diagnostic verification tab (sandbox workspace + multiple choice quiz).

### 2. 💻 In-Browser Compiler Sandbox
* **Dynamic Verification**: Write real code inside code textareas, reset template files instantly, and trigger automated compiler verification checks.
* **XP System Integration**: Gain XP rewards on clearance validation checks to level up your Developer Profile status.

### 3. 🌐 API Flow Visualizer Matrix
* **Interactive Requests**: Simulate request traffic moving across the system: Client Browser ➔ Nginx Proxy Gateway ➔ Auth Token Verification Middleware ➔ CORS Validation Header ➔ Backend Server ➔ PostgreSQL Database.
* **Matrix Metrics**: View real-time simulated latency counters, response HTTP headers, authorization token tags, and PostgreSQL status checks.

### 4. 💥 HTTP Error Simulation Laboratory
* **Error Triggers**: Fire off simulated status codes (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error, 502 Bad Gateway).
* **Visual Bounces**: Watch packets get drops at firewall shields, redirect loop bounces, and lock screens with red alert overlays.

### 5. 🎙️ System Architecture Interview Arena
* **Interactive Interviewer**: Complete oral system design challenges.
* **Simulated Transcription**: Interactive microphone mock panel transcribe user audio, evaluate performance, and output dynamic feedback logs.

### 6. 🌗 Seamless Light/Dark Mode Customization
* **Cyberpunk Aesthetics**: Uses premium CSS custom properties mapping and Tailwind CSS v4 variables to toggle between Neon-Dark and Neon-Light modes smoothly.
* **Local Storage Persistence**: Preserves theme mode preferences automatically across browser sessions.

---

## 🛠️ Technology Stack

* **Core Framework**: React 19, TypeScript
* **Routing**: React Router DOM (v7)
* **Styling & Theme Engine**: Tailwind CSS v4.0, custom `:root` / `[data-theme="light"]` variables, and Outfit/JetBrains fonts
* **State Management**: Zustand (gamified XP tracking system state)
* **Icons & Animation**: Lucide React, CSS keyframes, Canvas Confetti

---

## 📁 Workspace Folder Structure

```bash
src/
├── app/                  # Router layout shells and dashboard routes config
├── assets/               # SVG indicators and vector media files
├── components/           # Custom, theme-adaptive UI blocks (Terminal, Button, XPBar)
├── data/                 # JSON syllabus files, quizzes, and backend simulators
├── features/             # Business logics (Zustand XP progress systems)
├── pages/                # High-fidelity dashboard modules
│   ├── ApiVisualizer     # API proxy gateways tracking matrix
│   ├── ErrorSimulator    # Firewall drops and lock simulator
│   ├── InterviewArena    # Speech simulator compiler
│   └── Roadmap           # Main timeline path layout
└── utils/                # Utility classes (mock audio visualizer components)
```

---

## 🏁 Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed on your local environment.

### 2. Installation
Clone the repository and install the project dependencies:
```bash
git clone https://github.com/Renujan/DevJourney.git
cd DevJourney
npm install
```

### 3. Development Server
Launch the development server:
```bash
npm run dev
# The dev server will run locally, usually at: http://localhost:5173
```

### 4. Build for Production
Build the static distribution package:
```bash
npm run build
# Files will be built and output to the dist/ directory
```

---

## 📝 License
Distributed under the MIT License. See [LICENSE](https://opensource.org/licenses/MIT) for more information.
