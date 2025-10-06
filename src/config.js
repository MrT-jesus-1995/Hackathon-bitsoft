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

  // UI Settings
  ui: {
    // Animation durations (milliseconds)
    transitionDuration: 300,
    
    // Modal overlay opacity
    modalOverlayOpacity: 0.7,
  },
};

export default CONFIG;
