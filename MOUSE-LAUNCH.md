# 🖱️ Interactive Mouse Launch System

## Overview

The Gravity Slingshot Simulator now features an **intuitive click-and-drag launch system** that lets you set both the starting position and launch direction/velocity with your mouse!

## How It Works

### 🎯 Basic Usage

1. **Click** anywhere on the canvas to set the projectile's starting position
2. **Drag** in the direction you want to launch
3. **Release** to launch the projectile

The **length of your drag** determines the launch velocity - longer drag = faster launch!

### Visual Feedback

While dragging, you'll see:
- ⚪ **White circle** at your click position (where the projectile will spawn)
- 🔵 **Blue gradient line** showing launch direction
- 🟣 **Purple arrow** indicating velocity direction
- 📊 **Power percentage** showing launch strength (0-100%)

### Launch Power Multiplier

Use the **Launch Power** slider to adjust the overall velocity multiplier:
- **1x** - Gentle launches (good for close orbits)
- **5x** - Medium velocity (balanced)
- **10x+** - High-speed launches (escapes and slingshots)

The final velocity = drag length × power multiplier

## Advantages Over Angle Slider

### ✅ Benefits

| Old System (Angle Slider) | New System (Mouse Drag) |
|---------------------------|-------------------------|
| Fixed launch position | Launch from anywhere |
| Abstract angle values | Visual direction |
| Harder to predict outcome | Intuitive trajectory feel |
| Separate angle/power controls | Combined position/direction |

### 🎮 Gameplay Improvements

1. **Spatial Awareness**: Launch from strategic positions near planets
2. **Visual Intuition**: See exactly where you're aiming
3. **Experimentation**: Quick iterations without slider adjustments
4. **Multi-Planet Strategy**: Position matters with multiple gravity sources!

## Advanced Techniques

### 🚀 Launch Strategies

**Binary System**
- Launch from between the two planets
- Drag perpendicular to the planet axis
- Try figure-8 trajectories!

**Lagrange Points**
- Launch near the small asteroid
- Short drags for gentle exploration
- Find stable equilibrium points

**Solar System**
- Launch from edge of canvas toward the sun
- Use gravity assists off smaller planets
- Long drags for escape velocity

**Triangle Formation**
- Launch from center of triangle
- Equal distance from all three planets
- Watch chaotic orbital patterns

### 💡 Pro Tips

1. **Closer to Planets**: Launch near a planet for tight orbits
2. **Edge Launches**: Start from canvas edges for slingshot effects
3. **Short Drags**: Gentle velocity for stable orbits
4. **Long Drags**: High velocity for escape trajectories
5. **Tangential Launches**: Drag perpendicular to planet direction for circular orbits

## Technical Details

### Velocity Calculation

```javascript
// Drag vector
dx = endX - startX
dy = endY - startY

// Velocity with power scaling
velocity.x = dx * (launchPower / 50)
velocity.y = dy * (launchPower / 50)
```

### Power Scale Visualization

| Drag Length (pixels) | Power % | Result |
|---------------------|---------|---------|
| 0-50 | 0-17% | Very slow |
| 50-100 | 17-33% | Slow orbit |
| 100-200 | 33-67% | Medium orbit |
| 200-300 | 67-100% | Fast/escape |
| 300+ | 100% | Maximum velocity |

### Position Freedom

- **X Range**: 0-800 pixels (full canvas width)
- **Y Range**: 0-600 pixels (full canvas height)
- **No restrictions**: Launch from anywhere, even inside planets!

## Canvas States

### 🔵 Idle State
```
🖱️ Click and drag to set position and launch direction
```
- Canvas has crosshair cursor
- Ready for new launch

### 🟣 Dragging State
```
🎯 Release to launch projectile!
```
- Visual feedback showing:
  - Start position circle
  - Direction line with gradient
  - Arrow head
  - Power percentage

### 🟡 Running State
```
🚀 Simulation running...
```
- Canvas interaction disabled
- Watching trajectory in real-time
- Use Reset button to try again

## Keyboard Shortcuts (Future Enhancement)

Potential additions:
- `Space` - Quick launch from last position
- `R` - Reset simulation
- `Esc` - Cancel current drag
- `Shift+Drag` - Launch perpendicular to drag direction

## Accessibility

- **Visual clarity**: High-contrast colors for drag preview
- **Large click targets**: Entire canvas is interactive
- **Instant feedback**: Real-time preview while dragging
- **Error prevention**: Minimum drag length prevents accidental launches

## Examples

### Example 1: Orbit Around Single Planet
```
1. Planet at center (400, 300)
2. Click at (550, 300) - 150px from planet
3. Drag upward to (550, 200) - perpendicular to planet
4. Release → Circular orbit!
```

### Example 2: Binary Slingshot
```
1. Two planets at (300, 300) and (500, 300)
2. Click at (400, 400) - below both planets
3. Drag toward (300, 250) - angled between them
4. Release → Figure-8 trajectory!
```

### Example 3: Escape Velocity
```
1. Planet at center
2. Click at edge (100, 300)
3. Drag long distance to (100, 50) - 250px drag
4. Release → Escapes planet gravity!
```

## FAQ

**Q: Can I launch while simulation is running?**  
A: No, you must click Reset first. This prevents accidental clicks during observation.

**Q: What if I drag too short?**  
A: Minimum drag length is 10 pixels. Shorter drags are ignored to prevent micro-launches.

**Q: Can I change launch power after dragging?**  
A: No, adjust the Launch Power slider before dragging. This ensures predictable behavior.

**Q: Does gravity affect where I can launch from?**  
A: No, you can launch from anywhere! However, launching very close to a planet will likely result in an immediate crash.

**Q: Can I see my previous launch position?**  
A: Currently no, but this could be added as a "ghost" marker in future updates.

## Troubleshooting

### Issue: Drag not registering
**Solution**: Make sure simulation isn't running. Click Reset first.

### Issue: Launch goes wrong direction
**Solution**: The arrow shows direction. Drag FROM start TO end (not the opposite).

### Issue: Too much/little velocity
**Solution**: Adjust Launch Power slider (1-15x multiplier).

### Issue: Can't reach planet
**Solution**: Launch closer to planet or use higher power setting.

## Code Implementation

Key files modified:
- `src/components/Canvas/PhysicsCanvas.jsx` - Mouse event handlers
- `src/components/Controls/LaunchControls.jsx` - Removed angle slider
- `src/components/Controls/SimulationControls.jsx` - Removed angle control
- `src/App.jsx` - Added `handleLaunchFromCanvas` callback

---

**Enjoy the new intuitive launch system! 🚀**

Try launching from different positions and discover new orbital patterns with the multi-planet scenarios!
