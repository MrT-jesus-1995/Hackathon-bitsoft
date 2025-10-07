# ⏱️ Simulation Time Limit Guide

## Overview

The Gravity Slingshot Simulator now includes configurable time limits to prevent simulations from running indefinitely and give you full control over observation time.

## 🎯 Features Added

### 1. **Maximum Simulation Time**
- **Default**: 30 seconds (30,000ms)
- **Range**: 5 seconds to 2 minutes
- **Purpose**: Prevents infinite simulations and saves computational resources
- **UI Control**: Slider in "Simulation Parameters" panel

### 2. **Update Count Limit**
- **Default**: 1,875 updates (30 seconds at 60 FPS)
- **Purpose**: Backup safety mechanism to stop runaway simulations
- **Automatically calculated** based on max time

### 3. **Timeout Outcome**
- **New outcome type**: 'timeout' ⏱️
- **Color**: Purple (#a855f7)
- **Description**: "Time Limit Reached"
- **Appears when**: Simulation hits time limit before natural conclusion

### 4. **Visual Feedback**
- Real-time elapsed time display
- Time limit shown in orange on slider
- Clear timeout message if limit is reached
- Purple highlight for timeout outcomes

## 🔧 Configuration

### In `src/config.js`:

```javascript
simulation: {
  // Maximum simulation time (milliseconds)
  maxSimulationTime: 30000, // 30 seconds
  
  // Maximum simulation updates before auto-stop
  maxSimulationUpdates: 1875, // 30s at 60 FPS
  
  // Auto-stop when outcome is detected
  autoStopOnOutcome: true,
  
  // Time before orbit detection (prevents false positives)
  orbitDetectionDelay: 3000, // 3 seconds
  
  // Time limit slider range
  ranges: {
    maxTime: { 
      min: 5000,      // 5 seconds
      max: 120000,    // 2 minutes
      step: 5000      // 5 second steps
    }
  }
}
```

## 🎮 User Controls

### Time Limit Slider

Located in **Simulation Parameters** panel:

```
⏱️ Max Simulation Time: 30s
[====|====|====|====|====] 
5s         1m          2m

Simulation will auto-stop after this time
```

**Features:**
- Real-time time display (formats as seconds/minutes)
- 5-second increments for precise control
- Visual feedback with orange color
- Disabled during active simulation

## 📊 How It Works

### 1. **Time Tracking**
```javascript
// Starts when simulation launches
simulationStartTime.current = Date.now();
updateCount.current = 0;
```

### 2. **Time Check (Every Update)**
```javascript
const elapsedTime = Date.now() - simulationStartTime.current;
if (elapsedTime >= maxTime) {
  // Stop simulation
  onSimulationComplete('timeout', data);
}
```

### 3. **Update Counter**
```javascript
updateCount.current++;
if (updateCount.current >= maxUpdates) {
  // Backup stop mechanism
  onSimulationComplete('timeout', data);
}
```

## 🎨 UI Indicators

### Timeout Outcome Badge
```
⏱️ Time Limit Reached
```
- Purple background (#a855f7)
- Clear emoji indicator
- Helpful tip message

### Info Panel Message
```
⏱️ Time's up! The simulation reached the maximum 
time limit. Increase the time limit or try different 
parameters for a definitive result.
```

## 💡 Use Cases

### Quick Testing (5-10 seconds)
```javascript
maxSimulationTime: 5000  // Fast iteration
```
Perfect for:
- Quick parameter testing
- Crash scenarios
- High-speed escapes

### Standard Observation (20-40 seconds)
```javascript
maxSimulationTime: 30000  // Default
```
Perfect for:
- Most simulations
- Orbit detection
- General exploration

### Long-term Analysis (1-2 minutes)
```javascript
maxSimulationTime: 120000  // Extended
```
Perfect for:
- Complex orbits
- Multiple revolutions
- Detailed trajectory analysis

### No Limit (For Advanced Users)
Set to maximum and adjust code:
```javascript
maxSimulationTime: 999999999  // Effectively unlimited
```

## 🚀 Examples

### Example 1: Fast Crash Test
```javascript
{
  gravity: 2.0,
  launchPower: 3,
  angle: 90,
  maxSimulationTime: 5000  // 5 seconds is plenty
}
```

### Example 2: Orbit Confirmation
```javascript
{
  gravity: 1.2,
  launchPower: 6.5,
  angle: 75,
  maxSimulationTime: 45000  // 45 seconds to confirm orbit
}
```

### Example 3: Escape Velocity Test
```javascript
{
  gravity: 1.0,
  launchPower: 12,
  angle: 45,
  maxSimulationTime: 20000  // 20 seconds to see escape
}
```

## 🔍 Advanced Features

### Adjust Time Mid-Simulation
**Current**: Time limit is set at launch
**Future Enhancement**: Could allow dynamic adjustment

### Time Remaining Display
**Current**: Shows elapsed time
**Future Enhancement**: Could show countdown timer

### Auto-Adjust Based on Outcome
**Concept**: Automatically set optimal time limits based on parameters
```javascript
// Example logic
if (launchPower > 10) {
  maxTime = 15000; // Fast outcomes
} else if (gravity < 0.5) {
  maxTime = 60000; // Slow orbits need time
}
```

## 🐛 Troubleshooting

### Problem: Simulation always times out

**Solutions:**
1. Increase max time slider
2. Check if outcome detection is working
3. Try different parameters for quicker results

```javascript
// In config.js
maxSimulationTime: 60000, // Try 1 minute
```

### Problem: Timeout too quickly for orbits

**Solution:** Orbits need more time
```javascript
maxSimulationTime: 45000, // 45 seconds for orbits
```

### Problem: Want to disable time limits

**Solution:** Set to maximum value
```javascript
maxSimulationTime: 120000, // 2 minutes (max allowed)
```

Or edit the range in config:
```javascript
ranges: {
  maxTime: { 
    min: 5000,
    max: 600000,  // 10 minutes if needed
    step: 5000
  }
}
```

## 📈 Performance Impact

### Benefits:
- ✅ Prevents browser slowdown from infinite simulations
- ✅ Saves CPU/battery on mobile devices
- ✅ Provides clear stopping point for analysis
- ✅ Improves user experience with predictable behavior

### Overhead:
- ⚡ Minimal - just two comparisons per update
- ⚡ No performance impact on rendering
- ⚡ Negligible memory usage

## 🎓 Best Practices

1. **Start with default** (30s) - works for most scenarios
2. **Adjust based on outcome** - if timeout, increase limit
3. **Use presets** - they're optimized for their outcomes
4. **Monitor elapsed time** - shown in Info Panel
5. **Combine with AI** - ask AI why it timed out

## 📝 Code Examples

### Custom Time Limit Component
```javascript
import CONFIG from './config';

function TimeControl({ value, onChange }) {
  return (
    <div>
      <label>Time Limit: {value / 1000}s</label>
      <input
        type="range"
        min={CONFIG.simulation.ranges.maxTime.min}
        max={CONFIG.simulation.ranges.maxTime.max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );
}
```

### Check If Timed Out
```javascript
if (outcome === 'timeout') {
  console.log('Simulation reached time limit');
  // Suggest longer time or different parameters
}
```

### Log Time Information
```javascript
const elapsedTime = Date.now() - simulationStartTime.current;
console.log(`Simulation ran for ${elapsedTime}ms`);
console.log(`Used ${updateCount.current} updates`);
```

## 📚 Related Files

- `src/config.js` - Main configuration
- `src/components/Canvas/PhysicsCanvas.jsx` - Time tracking logic
- `src/components/Controls/SimulationControls.jsx` - Time limit slider
- `src/components/UI/InfoPanel.jsx` - Timeout display
- `src/utils/helpers.js` - Outcome helpers (colors, emoji, descriptions)
- `src/App.jsx` - Parameter management

## 🎉 Summary

You now have complete control over simulation duration:

- ✅ **Configurable time limits** (5s to 2min)
- ✅ **Visual slider control** with real-time feedback
- ✅ **Timeout outcome** with clear messaging
- ✅ **Dual safety** (time + update count)
- ✅ **Performance optimized** with minimal overhead
- ✅ **User-friendly** with helpful tips

### Quick Recap:

| Setting | Default | Range | Purpose |
|---------|---------|-------|---------|
| Max Time | 30s | 5s - 2min | Stop after time limit |
| Update Limit | 1875 | Auto | Backup stop mechanism |
| Time Slider | Yes | Adjustable | User control |
| Timeout Outcome | Yes | ⏱️ Purple | Clear feedback |

---

**Need to adjust? Just slide the ⏱️ Max Simulation Time control!**
