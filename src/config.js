/**
 * Configuration settings for the Gravity Slingshot Simulator
 */

export const CONFIG = {
  // AI Settings
  ai: {
    // Timeout for AI API calls (milliseconds)
    apiTimeout: 60000, // 60 seconds - gives GPT plenty of time
    
    // Minimum loading time to show (milliseconds)
    minLoadingTime: 1000, // 1 second
    
    // Typing animation speed (milliseconds per character)
    typingSpeed: 15, // 15ms per character (about 66 chars/second)
    
    // Loading dots animation speed
    loadingDotsSpeed: 500, // Update every 500ms
  },

  // Physics Settings
  physics: {
    // Default gravity constant
    defaultGravity: 1.0,
    
    // Default planet properties
    planetMass: 1000,
    planetRadius: 50,
    
    // Simulation timestep
    timeStep: 0.1,
    
    // Maximum trajectory points to track (for performance)
    maxTrajectoryPoints: 500,
    
    // Physics update rate (milliseconds)
    updateRate: 16, // ~60 FPS
  },

  // Canvas Settings
  canvas: {
    width: 800,
    height: 600,
    backgroundColor: '#0a0e27',
    
    // Star field density
    starCount: 100,
  },

  // Trajectory Prediction Settings
  prediction: {
    // Maximum steps for prediction simulation
    maxSteps: 300,
    
    // Time step for prediction (should match physics.timeStep)
    timeStep: 0.1,
    
    // Maximum time to predict (seconds)
    maxTime: 10,
    
    // Sampling rate (store every Nth point for performance)
    samplingRate: 3,
    
    // Visual style for predicted trajectory
    visual: {
      // Line style
      lineWidth: 2,
      lineDash: [5, 5], // Dashed line pattern
      
      // Dot style
      dotRadius: 2,
      dotSpacing: 15, // Draw dot every 15 pixels
      
      // Colors by outcome
      colors: {
        crash: 'rgba(239, 68, 68, 0.6)',    // Red - will crash
        orbit: 'rgba(34, 197, 94, 0.6)',    // Green - will orbit
        escape: 'rgba(59, 130, 246, 0.6)',  // Blue - will escape
        unknown: 'rgba(156, 163, 175, 0.5)' // Gray - uncertain
      },
      
      // Glow effect
      glowEnabled: true,
      glowBlur: 5,
    },
    
    // Performance optimization
    enableDuringDrag: true, // Show prediction while dragging
    throttleMs: 50,         // Update prediction every 50ms max
  },

  // Simulation Settings
  simulation: {
    // Maximum simulation time (milliseconds)
    maxSimulationTime: 30000, // 30 seconds - prevents infinite simulations
    
    // Maximum simulation updates before auto-stop
    maxSimulationUpdates: 1875, // 30 seconds at 60 FPS (30000ms / 16ms)
    
    // Auto-stop on outcome detection
    autoStopOnOutcome: true, // Stop when orbit/crash/escape is detected
    
    // Time before orbit detection starts (to avoid false positives)
    orbitDetectionDelay: 3000, // 3 seconds
    
    // Default parameters
    defaultParams: {
      gravity: 1.0,
      launchPower: 5,
      angle: 45,
    },
    
    // Parameter ranges
    ranges: {
      gravity: { min: 0.1, max: 3, step: 0.1 },
      launchPower: { min: 1, max: 15, step: 0.5 },
      angle: { min: 0, max: 360, step: 5 },
      maxTime: { min: 5000, max: 120000, step: 5000 }, // 5s to 2 minutes
    },
    
    // Preset configurations
    presets: {
      default: {
        gravity: 1.0,
        launchPower: 5,
        angle: 45,
        name: '🎯 Default',
      },
      lowGravity: {
        gravity: 0.5,
        launchPower: 8,
        angle: 90,
        name: '🌙 Low Gravity',
      },
      highGravity: {
        gravity: 2.0,
        launchPower: 10,
        angle: 60,
        name: '💪 High Gravity',
      },
      orbit: {
        gravity: 1.2,
        launchPower: 6.5,
        angle: 75,
        name: '⭕ Orbit Mode',
      },
    },
  },

  // Multi-Planet Settings
  planets: {
    // Default planet colors
    colors: [
      '#4a5fc1', // Blue
      '#ef4444', // Red
      '#10b981', // Green
      '#f59e0b', // Orange
      '#8b5cf6', // Purple
      '#ec4899', // Pink
    ],
    
    // Planet presets for multi-planet scenarios
    scenarios: {
      single: {
        name: '🌍 Single Planet',
        description: 'Classic single planet gravity',
        planets: [
          {
            id: 'planet-1',
            x: 400,
            y: 300,
            mass: 1000,
            radius: 50,
            color: '#4a5fc1',
            name: 'Earth'
          }
        ]
      },
      binary: {
        name: '⚛️ Binary System',
        description: 'Two planets of equal mass',
        planets: [
          {
            id: 'planet-1',
            x: 300,
            y: 300,
            mass: 800,
            radius: 45,
            color: '#4a5fc1',
            name: 'Alpha'
          },
          {
            id: 'planet-2',
            x: 500,
            y: 300,
            mass: 800,
            radius: 45,
            color: '#ef4444',
            name: 'Beta'
          }
        ]
      },
      lagrange: {
        name: '🔺 Lagrange Points',
        description: 'Three body problem configuration',
        planets: [
          {
            id: 'planet-1',
            x: 400,
            y: 300,
            mass: 1200,
            radius: 55,
            color: '#f59e0b',
            name: 'Sun'
          },
          {
            id: 'planet-2',
            x: 550,
            y: 300,
            mass: 400,
            radius: 30,
            color: '#10b981',
            name: 'Jupiter'
          },
          {
            id: 'planet-3',
            x: 650,
            y: 300,
            mass: 100,
            radius: 15,
            color: '#8b5cf6',
            name: 'Asteroid'
          }
        ]
      },
      triangle: {
        name: '🔼 Triangle Formation',
        description: 'Three planets in triangle',
        planets: [
          {
            id: 'planet-1',
            x: 400,
            y: 200,
            mass: 700,
            radius: 40,
            color: '#4a5fc1',
            name: 'Alpha'
          },
          {
            id: 'planet-2',
            x: 300,
            y: 380,
            mass: 700,
            radius: 40,
            color: '#ef4444',
            name: 'Beta'
          },
          {
            id: 'planet-3',
            x: 500,
            y: 380,
            mass: 700,
            radius: 40,
            color: '#10b981',
            name: 'Gamma'
          }
        ]
      },
      sunPlanets: {
        name: '☀️ Solar System',
        description: 'Sun with smaller planets',
        planets: [
          {
            id: 'sun',
            x: 400,
            y: 300,
            mass: 2000,
            radius: 60,
            color: '#f59e0b',
            name: 'Sun'
          },
          {
            id: 'planet-1',
            x: 550,
            y: 300,
            mass: 200,
            radius: 20,
            color: '#10b981',
            name: 'Planet'
          },
          {
            id: 'planet-2',
            x: 250,
            y: 300,
            mass: 150,
            radius: 18,
            color: '#8b5cf6',
            name: 'Moon'
          }
        ]
      },
      // Challenge-specific planet configurations
      beginnerOrbit: {
        name: '🌟 Beginner Orbit',
        description: 'Perfect for learning orbits',
        planets: [
          {
            id: 'planet',
            x: 600,
            y: 400,
            mass: 1200,
            radius: 45,
            color: '#3b82f6',
            name: 'Training Planet'
          }
        ]
      },
      perfectShot: {
        name: '🎯 Perfect Shot Arena',
        description: 'Designed for precision targeting',
        planets: [
          {
            id: 'target-planet',
            x: 600,
            y: 400,
            mass: 1000,
            radius: 40,
            color: '#10b981',
            name: 'Target'
          }
        ]
      },
      binaryChallenge: {
        name: '🔄 Binary System',
        description: 'Two planets in balance',
        planets: [
          {
            id: 'planet-1',
            x: 450,
            y: 400,
            mass: 900,
            radius: 42,
            color: '#8b5cf6',
            name: 'Alpha'
          },
          {
            id: 'planet-2',
            x: 750,
            y: 400,
            mass: 900,
            radius: 42,
            color: '#ec4899',
            name: 'Beta'
          }
        ]
      },
      tripleChallenge: {
        name: '🌠 Triple Threat',
        description: 'Navigate three planets',
        planets: [
          {
            id: 'planet-1',
            x: 600,
            y: 300,
            mass: 800,
            radius: 38,
            color: '#ef4444',
            name: 'Red Giant'
          },
          {
            id: 'planet-2',
            x: 450,
            y: 480,
            mass: 800,
            radius: 38,
            color: '#3b82f6',
            name: 'Blue Star'
          },
          {
            id: 'planet-3',
            x: 750,
            y: 480,
            mass: 800,
            radius: 38,
            color: '#10b981',
            name: 'Green World'
          }
        ]
      }
    },
    
    // Editable planet properties
    editableProps: ['x', 'y', 'mass', 'radius', 'color', 'name'],
    
    // Default new planet template
    defaultPlanet: {
      mass: 800,
      radius: 40,
      color: '#4a5fc1',
      name: 'New Planet'
    },
    
    // Limits for planet properties
    limits: {
      mass: { min: 50, max: 3000, step: 50 },
      radius: { min: 10, max: 100, step: 5 },
      x: { min: 50, max: 750, step: 10 },
      y: { min: 50, max: 550, step: 10 },
    },
  },

  // Target Rings Settings
  targetRings: {
    enabled: false, // Can be toggled on/off
    zones: [
      {
        id: 'perfect',
        minRadius: 60,
        maxRadius: 80,
        color: 'rgba(34, 197, 94, 0.2)', // Green
        strokeColor: 'rgba(34, 197, 94, 0.7)',
        points: 100,
        label: 'Perfect!'
      },
      {
        id: 'great',
        minRadius: 80,
        maxRadius: 110,
        color: 'rgba(59, 130, 246, 0.15)', // Blue
        strokeColor: 'rgba(59, 130, 246, 0.6)',
        points: 50,
        label: 'Great'
      },
      {
        id: 'good',
        minRadius: 110,
        maxRadius: 145,
        color: 'rgba(168, 85, 247, 0.12)', // Purple
        strokeColor: 'rgba(168, 85, 247, 0.5)',
        points: 25,
        label: 'Good'
      },
      {
        id: 'ok',
        minRadius: 145,
        maxRadius: 185,
        color: 'rgba(251, 146, 60, 0.1)', // Orange
        strokeColor: 'rgba(251, 146, 60, 0.4)',
        points: 10,
        label: 'OK'
      }
    ],
    // How long projectile must stay in zone to score (ms)
    scoreThreshold: 2000, // 2 seconds
    // Time in zone before counting as "orbit"
    orbitThreshold: 5000, // 5 seconds
  },

  // Challenge Mode Settings
  challenges: {
    list: [
      {
        id: 'beginner-orbit',
        name: '🌟 First Orbit',
        difficulty: 'Easy',
        description: 'Achieve a stable orbit around the planet for 5 seconds',
        goal: 'orbit',
        targetScore: 0,
        timeLimit: null,
        planets: 'beginnerOrbit', // Use custom challenge map
        requiredOrbitTime: 5000,
        hint: 'Launch at medium speed tangent to the planet',
        reward: '⭐ Basic Orbiter'
      },
      {
        id: 'perfect-shot',
        name: '🎯 Perfect Shot',
        difficulty: 'Medium',
        description: 'Score 100 points by hitting the perfect zone',
        goal: 'score',
        targetScore: 100,
        timeLimit: 60000, // 60 seconds
        planets: 'perfectShot', // Use custom challenge map
        requiredOrbitTime: 2000,
        hint: 'Aim for the green zone closest to the planet',
        reward: '🏆 Sharpshooter'
      },
      {
        id: 'high-scorer',
        name: '💯 High Scorer',
        difficulty: 'Medium',
        description: 'Score 200 points total across multiple launches',
        goal: 'score',
        targetScore: 200,
        timeLimit: 120000, // 2 minutes
        planets: 'perfectShot', // Use same map as perfect shot
        hint: 'Multiple launches in different zones earn more points',
        reward: '🌟 Point Master'
      },
      {
        id: 'binary-orbit',
        name: '🔄 Binary Orbit',
        difficulty: 'Hard',
        description: 'Orbit between two planets for 10 seconds',
        goal: 'orbit',
        targetScore: 0,
        timeLimit: null,
        planets: 'binaryChallenge', // Use custom binary map
        requiredOrbitTime: 10000,
        hint: 'Launch between the planets with balanced velocity',
        reward: '🌌 Binary Navigator'
      },
      {
        id: 'triple-threat',
        name: '🌠 Triple Threat',
        difficulty: 'Hard',
        description: 'Navigate three planets and score 150 points',
        goal: 'score',
        targetScore: 150,
        timeLimit: 90000, // 90 seconds
        planets: 'tripleChallenge', // Use custom triple map
        requiredOrbitTime: 3000,
        hint: 'Use gravity assists to move between planets',
        reward: '👑 Master Navigator'
      },
      {
        id: 'speed-run',
        name: '⚡ Speed Run',
        difficulty: 'Easy',
        description: 'Achieve orbit in under 30 seconds',
        goal: 'orbit',
        targetScore: 0,
        timeLimit: 30000, // 30 seconds
        planets: 'beginnerOrbit', // Use same map as beginner
        requiredOrbitTime: 3000,
        hint: 'Quick launch, don\'t overthink it!',
        reward: '⚡ Quick Draw'
      }
    ]
  },

  // UI Settings
  ui: {
    // Animation durations (milliseconds)
    transitionDuration: 300,
    
    // Modal overlay opacity
    modalOverlayOpacity: 0.7,
  },
};

export default CONFIG;
