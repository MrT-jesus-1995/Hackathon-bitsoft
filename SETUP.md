# 🚀 Quick Start Guide

## Gravity Slingshot Simulator - Setup Instructions

### ✅ What We've Built

A complete physics sandbox application with:
- Real-time gravity simulation using custom physics engine
- Interactive canvas with p5.js rendering
- AI-powered explanations using OpenAI API
- Beautiful UI with Tailwind CSS
- Complete React component architecture

### 📦 Installation Complete!

All dependencies have been installed. The project includes:
- React 18.2.0
- p5.js for physics visualization
- Tailwind CSS for styling
- OpenAI SDK for AI tutoring
- Axios for API calls

### 🔑 Setup Your API Key

1. Open the `.env` file in the project root
2. Replace `your_openai_api_key_here` with your actual OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=sk-proj-...your_key_here
   ```
3. Get your API key from: https://platform.openai.com/api-keys

### 🎮 Running the App

The development server should now be running. If not, run:

```bash
npm start
```

The app will open automatically at `http://localhost:3000`

### 🎯 How to Use

1. **Adjust Parameters** - Use the sliders to set gravity, launch power, and angle
2. **Launch** - Click the green "Launch Projectile" button
3. **Observe** - Watch the simulation and see the trajectory
4. **Learn** - Click "Explain This With AI" to get physics explanations

### 🎨 Project Structure

```
src/
├── components/
│   ├── Canvas/
│   │   └── PhysicsCanvas.jsx     # Main simulation canvas
│   ├── Controls/
│   │   ├── LaunchControls.jsx    # Launch and reset buttons
│   │   └── SimulationControls.jsx # Parameter sliders
│   ├── AI/
│   │   ├── ChatOverlay.jsx       # AI explanation modal
│   │   └── AITutor.js            # AI logic
│   └── UI/
│       ├── Dashboard.jsx          # Status dashboard
│       └── InfoPanel.jsx          # Info and stats
├── utils/
│   ├── physics.js                 # Physics engine
│   ├── api.js                     # OpenAI integration
│   └── helpers.js                 # Utility functions
├── hooks/
│   └── usePhysicsSimulation.js    # Custom React hooks
└── styles/
    └── index.css                  # Global styles
```

### 🔧 Key Features

#### Physics Engine
- Realistic gravity calculations (F = G*m1*m2/r²)
- Trajectory tracking and visualization
- Collision detection
- Orbit, escape, and crash outcomes

#### AI Integration
- GPT-4o-mini powered explanations
- Contextual physics tutoring
- Real-time analysis of simulations

#### UI Components
- Interactive parameter controls
- Real-time status updates
- Responsive design
- Beautiful space-themed styling

### 🎯 Try These Experiments

1. **Stable Orbit**
   - Gravity: 1.2
   - Power: 6.5
   - Angle: 75°

2. **Gravity Slingshot**
   - Gravity: 0.8
   - Power: 12
   - Angle: 45°

3. **Planet Crash**
   - Gravity: 2.0
   - Power: 3
   - Angle: 90°

### 🐛 Troubleshooting

**If the app doesn't start:**
- Make sure you're in the correct directory
- Run `npm install` again
- Check for any error messages in the terminal

**If AI explanations don't work:**
- Verify your OpenAI API key is correct in `.env`
- Restart the development server after adding the key
- Check your OpenAI account has credits

**If you see CSS warnings:**
- These are normal for Tailwind CSS directives
- The app will still work perfectly

### 📚 Next Steps

1. **Add Features:**
   - Multiple planets
   - Energy meters
   - Target mode
   - Quiz mode

2. **Enhance Physics:**
   - Add atmospheric drag
   - Include relativity effects
   - Multi-body simulations

3. **Improve AI:**
   - Add conversation history
   - Interactive Q&A
   - Step-by-step tutorials

### 🚀 Deployment

When ready to deploy:

**To Vercel:**
```bash
npm install -g vercel
vercel
```

**To Netlify:**
```bash
npm install -g netlify-cli
netlify deploy
```

### 📝 Notes

- The app uses Create React App (CRA) for easy setup
- Physics calculations run at ~60 FPS
- Trajectory points are limited to 500 for performance
- Canvas size is 800x600 pixels (responsive)

### 🎉 You're Ready!

Your Gravity Slingshot Simulator is now fully set up and ready to use. Have fun exploring orbital mechanics!

---

**Need help?** Check the README.md for detailed documentation or open an issue on GitHub.
