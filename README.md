
---

### 🎮 Concept: Physics Sandbox with AI Tutor

# 🪐 Gravity Slingshot / Orbit Simulator

## 📋 Table of Contents

- [Concept](#-concept)
- [Getting Started](#-getting-started)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Core Features](#-core-features)
- [Development Roadmap](#-build-feasibility-solo--2-days)
- [Contributing](#-contributing)

## 📚 Additional Documentation

- **[MOUSE-LAUNCH.md](MOUSE-LAUNCH.md)** - Interactive mouse-based launch system guide
- **[MULTIPLE-PLANETS.md](MULTIPLE-PLANETS.md)** - Complete guide to multi-planet physics scenarios
- **[AI-TIMING.md](AI-TIMING.md)** - AI response timeout and typing animation configuration
- **[SIMULATION-TIME-LIMITS.md](SIMULATION-TIME-LIMITS.md)** - Configurable simulation duration limits
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guidelines and architecture

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **OpenAI API Key** (for AI tutor functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MrT-jesus-1995/Hackathon-bitsoft.git
   cd Hackathon-bitsoft
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   REACT_APP_API_ENDPOINT=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000` to see the app running.

### Quick Start Guide

1. **Launch a projectile** - 🖱️ Click and drag anywhere on the canvas to set position, direction, and velocity
2. **Adjust parameters** - Use sliders to modify gravity strength and launch power multiplier
3. **Try multiple planets** - Select from 5 pre-configured scenarios or create your own
4. **Observe the simulation** - Watch the trajectory interact with combined gravity fields
5. **Learn with AI** - Click "Explain This" to get AI-powered physics explanations

---

## 📁 Project Structure

```
Hackathon-bitsoft/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Canvas/
│   │   │   ├── PhysicsCanvas.jsx
│   │   │   └── PhysicsEngine.js
│   │   ├── Controls/
│   │   │   ├── LaunchControls.jsx
│   │   │   └── SimulationControls.jsx
│   │   ├── AI/
│   │   │   ├── ChatOverlay.jsx
│   │   │   └── AITutor.js
│   │   └── UI/
│   │       ├── Dashboard.jsx
│   │       └── InfoPanel.jsx
│   ├── utils/
│   │   ├── physics.js
│   │   ├── api.js
│   │   └── helpers.js
│   ├── hooks/
│   │   ├── usePhysicsSimulation.js
│   │   └── useAIExplanation.js
│   ├── styles/
│   │   └── tailwind.css
│   ├── App.jsx
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🏗️ Architecture Overview

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│          React Application              │
├─────────────────────────────────────────┤
│  ┌─────────────┐     ┌──────────────┐  │
│  │   p5.js     │     │  TailwindCSS │  │
│  │   Canvas    │────▶│  UI Layer    │  │
│  │  (Physics)  │     │  (Controls)  │  │
│  └─────────────┘     └──────────────┘  │
│         │                     │         │
│         ▼                     ▼         │
│  ┌─────────────────────────────────┐   │
│  │    Physics Engine (utils)       │   │
│  │  - Gravity calculations          │   │
│  │  - Trajectory tracking           │   │
│  │  - Collision detection           │   │
│  └─────────────────────────────────┘   │
│                   │                     │
│                   ▼                     │
│  ┌─────────────────────────────────┐   │
│  │    AI Integration Layer          │   │
│  │  - OpenAI API calls              │   │
│  │  - Context building              │   │
│  │  - Response formatting           │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Key Components

1. **PhysicsCanvas.jsx** - Main p5.js canvas wrapper
2. **PhysicsEngine.js** - Core physics calculations and simulation logic
3. **AITutor.js** - OpenAI integration for explanations
4. **LaunchControls.jsx** - User input controls for simulation
5. **ChatOverlay.jsx** - AI explanation display interface

---

## 🪐 Gravity Slingshot / Orbit Simulator

### 🎯 Concept

A web-based physics sandbox where you launch a small ship or asteroid near a planet and watch it curve, orbit, or slingshot due to gravity.
The AI explains what’s happening — teaching real orbital mechanics concepts like **gravitational attraction**, **escape velocity**, and **slingshot acceleration**.

---

## ⚙️ Tech Stack

| Layer                  | Technology                   | Purpose                                                           |
| ---------------------- | ---------------------------- | ----------------------------------------------------------------- |
| **Frontend**           | **p5.js**                    | Physics simulation and rendering (canvas-based)                   |
| **Framework / UI**     | **React + TailwindCSS**      | Page structure, controls, chat overlay styling                    |
| **AI Engine**          | **OpenAI API (GPT-4o-mini)** | Generates natural language explanations of the physics simulation |
| **Backend (optional)** | **FastAPI / Node.js**        | Proxy for API calls or data logging (optional for hackathon)      |

---

## 🌌 Core Features

### 1. 🚀 **Launch Simulation**

* Click and drag to set **launch direction** and **speed**.
* The asteroid follows a realistic curved path based on its velocity and gravitational pull.

### 2. 🪐 **Planetary Gravity**

* Central planet exerts a gravitational force proportional to `1 / r²`.
* Adjustable **gravity strength (G)** for easy experimentation.
* **NEW:** Multiple planets with combined gravity fields! See [MULTIPLE-PLANETS.md](MULTIPLE-PLANETS.md) for details.

### 3. 🌍 **Multiple Planets** *(NEW!)*

* Add/remove planets dynamically (1-6 planets)
* Edit planet properties: position, mass, radius, color, name
* Pre-configured scenarios: Binary System, Lagrange Points, Triangle Formation, Solar System
* Realistic N-body physics with combined gravitational forces
* See full documentation: [MULTIPLE-PLANETS.md](MULTIPLE-PLANETS.md)

### 4. ✨ **Orbit & Slingshot Visualization**

* Displays **real-time trajectory trails** to visualize orbits and escape paths.
* Shows different outcomes:

  * Orbit (stable)
  * Crash (too slow)
  * Escape / Slingshot (too fast)
  * Timeout (simulation limit reached)

### 5. 💬 **AI Physics Tutor**

* AI analyzes each simulation and explains what happened, e.g.

  > “Your asteroid entered a stable orbit because its tangential velocity balanced gravitational pull.”
  > or
  > “It escaped the planet’s influence after a gravity-assist slingshot, gaining extra speed.”

### 5. ⚙️ **User Controls**

* **Gravity Strength** slider
* **Launch Power** slider
* **Angle Adjuster**
* **Reset / Replay** buttons

### 6. 🧠 **AI Explanation Triggers**

* AI automatically explains when:

  * The projectile escapes, orbits, or crashes.
  * Or when the user clicks “Explain This”.

---

## 🧩 Optional Enhancements

* 🌍 **Multiple Planets** with combined gravity fields
* 💫 **Energy / Velocity meters** for learning physics deeper
* 🧭 **Target mode:** try to sling the asteroid to hit another planet
* 📊 **AI Quiz Mode:** AI asks “What will happen if we double gravity?”

---

## 🕒 Build Feasibility (Solo – 2 Days)

| Day       | Tasks                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| **Day 1** | Setup p5.js + React canvas, draw planet & projectile, implement gravity + motion, add trail.                   |
| **Day 2** | Add UI controls (sliders, buttons), integrate AI explanations, create chat overlay, polish visuals, prep demo. |

✅ **Result:** A visually stunning, interactive simulation that makes orbital physics fun and easy to understand — powered by AI.

---

## 🧪 Development

### Building for Production

```bash
npm run build
# or
yarn build
```

## 🔧 Configuration

### Physics Parameters

Edit `src/utils/physics.js` to customize:
- Gravitational constant (G)
- Planet mass and radius
- Initial velocity ranges
- Trajectory calculation precision

### AI Behavior

Edit `src/components/AI/AITutor.js` to customize:
- AI model selection (GPT-4o-mini, GPT-4, etc.)
- Explanation triggers
- System prompts and context
- Response formatting

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

**Hackathon Bitsoft Team**
- Developer: [MrT-jesus-1995](https://github.com/MrT-jesus-1995)

---

## 🙏 Acknowledgments

- Physics calculations inspired by real orbital mechanics
- AI integration powered by OpenAI
- Visual design with p5.js and TailwindCSS
- Community support and feedback

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/MrT-jesus-1995/Hackathon-bitsoft/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MrT-jesus-1995/Hackathon-bitsoft/discussions)

---

**Made with ❤️ for learning physics through interactive simulation**
