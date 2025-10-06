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

  // UI Settings
  ui: {
    // Animation durations (milliseconds)
    transitionDuration: 300,
    
    // Modal overlay opacity
    modalOverlayOpacity: 0.7,
  },
};

export default CONFIG;
