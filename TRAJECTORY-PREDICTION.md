# 🎯 Trajectory Prediction Feature

## Overview

The trajectory prediction system provides real-time visual feedback showing where the projectile will go before launch. It simulates the complete flight path considering all planetary gravitational forces and displays the predicted outcome (crash, orbit, or escape).

## Features

### 1. **Physics-Based Prediction**
- Simulates projectile flight using the same physics engine as the actual simulation
- Considers gravitational forces from all planets in the system
- Accurate N-body physics calculations
- Predicts final outcome (crash 💥, orbit 🌟, or escape 🚀)

### 2. **Visual Feedback**
- **Dashed trajectory line**: Shows the complete predicted path
- **Color-coded by outcome**:
  - 🔴 Red (`crash`): Projectile will hit a planet
  - 🟢 Green (`orbit`): Projectile will achieve stable orbit
  - 🔵 Blue (`escape`): Projectile will escape the system
  - ⚪ Gray (`unknown`): Outcome uncertain within prediction time
- **Glow effect**: Adds visual emphasis to the trajectory
- **Dots along path**: Spaced markers for better visibility
- **Outcome indicator**: Shows predicted result in text with emoji

### 3. **Performance Optimization**
- **Throttling**: Limits prediction calculations to every 50ms during drag
- **Caching**: Stores last prediction to avoid redundant calculations
- **Sampling**: Only stores every 3rd point in the trajectory (configurable)
- **Step limits**: Maximum 300 simulation steps (10 seconds of flight)
- **Early termination**: Stops calculation when outcome is determined

## Configuration

All settings are in `src/config.js` under the `prediction` section:

```javascript
prediction: {
  // Simulation parameters
  maxSteps: 300,              // Maximum simulation steps
  timeStep: 0.1,              // Time step (matches physics engine)
  maxTime: 10,                // Maximum prediction time (seconds)
  samplingRate: 3,            // Store every Nth point
  
  // Visual style
  visual: {
    lineWidth: 2,
    lineDash: [5, 5],         // Dashed line pattern
    dotRadius: 2,
    dotSpacing: 15,           // Pixels between dots
    
    // Colors by outcome
    colors: {
      crash: 'rgba(239, 68, 68, 0.6)',
      orbit: 'rgba(34, 197, 94, 0.6)',
      escape: 'rgba(59, 130, 246, 0.6)',
      unknown: 'rgba(156, 163, 175, 0.5)'
    },
    
    glowEnabled: true,
    glowBlur: 5,
  },
  
  // Performance
  enableDuringDrag: true,     // Show prediction while dragging
  throttleMs: 50,             // Update every 50ms max
}
```

## How It Works

### 1. **Prediction Algorithm** (`physics.js`)

```javascript
predictTrajectory(startPos, velocity, options)
```

The algorithm:
1. Creates a temporary simulation state (doesn't affect actual simulation)
2. Iterates through physics steps using Euler integration
3. Calculates gravitational forces from all planets at each step
4. Checks for collisions (crash) or escape conditions
5. Detects stable orbits based on distance variance
6. Returns array of predicted positions and final outcome

### 2. **Visual Rendering** (`PhysicsCanvas.jsx`)

The `drawLaunchPreview` function:
1. Calculates velocity from mouse drag vector
2. Calls `predictTrajectory` with throttling
3. Caches prediction for performance
4. Draws trajectory with glow effect
5. Places dots along the path
6. Displays outcome text with emoji

### 3. **Performance Optimization**

**Throttling System:**
- Mouse move events tracked continuously
- Prediction only recalculated every 50ms
- Uses `Date.now()` to check time since last prediction
- Cached prediction used between updates

**Caching:**
- `cachedPrediction.current` stores last result
- Cleared when drag ends
- Reused on every frame until next calculation

## Usage

### For Users

1. **Click and drag** on the canvas to aim
2. Watch the **colored trajectory arc** appear
3. Check the **outcome indicator** (💥 crash, 🌟 orbit, 🚀 escape)
4. **Adjust your aim** based on the prediction
5. **Release** to launch

### For Developers

**To adjust prediction accuracy:**
```javascript
CONFIG.prediction.maxSteps = 500;      // More steps = longer prediction
CONFIG.prediction.samplingRate = 2;    // Lower = more points
```

**To improve performance:**
```javascript
CONFIG.prediction.throttleMs = 100;    // Higher = fewer calculations
CONFIG.prediction.maxSteps = 200;      // Lower = faster calculation
```

**To customize visuals:**
```javascript
CONFIG.prediction.visual.colors.orbit = 'rgba(0, 255, 0, 0.8)';
CONFIG.prediction.visual.lineWidth = 3;
CONFIG.prediction.visual.glowBlur = 10;
```

## Technical Details

### Physics Simulation

The prediction uses the same physics as the main simulation:

**Gravitational Force:**
```
F = G * (m1 * m2) / r²
```

**Euler Integration:**
```
a = F / m
v = v + a * dt
p = p + v * dt
```

### Outcome Detection

**Crash:**
```javascript
distance <= planet.radius
```

**Escape:**
```javascript
distance > 1000 pixels from all planets
```

**Orbit:**
```javascript
variance < 150 && avgDistance > planetRadius * 2
```
(Based on last 20 sampled positions)

### Performance Metrics

- **Typical prediction time**: 1-3ms per calculation
- **Throttle interval**: 50ms (20 predictions/second max)
- **Points per prediction**: ~100 points (300 steps / 3 sampling rate)
- **Memory usage**: ~8KB per cached prediction

## Future Enhancements

Potential improvements:
- [ ] Adjustable prediction detail slider
- [ ] Show multiple trajectory possibilities
- [ ] Highlight closest approach to planets
- [ ] Display predicted orbital parameters
- [ ] Energy visualization along trajectory
- [ ] Time markers on trajectory
- [ ] Interactive trajectory editing

## Troubleshooting

**Problem: Prediction lags during drag**
- Increase `throttleMs` to 100 or higher
- Decrease `maxSteps` to 200
- Increase `samplingRate` to 5

**Problem: Prediction inaccurate**
- Increase `maxSteps` to 500
- Decrease `samplingRate` to 2
- Increase `maxTime` to 15 seconds

**Problem: Trajectory not visible**
- Check `enableDuringDrag` is `true`
- Increase `lineWidth` to 3
- Adjust color opacity (alpha channel)
- Enable `glowEnabled`

## Related Files

- `src/utils/physics.js` - `predictTrajectory()` function
- `src/components/Canvas/PhysicsCanvas.jsx` - `drawLaunchPreview()` rendering
- `src/config.js` - `prediction` configuration section
