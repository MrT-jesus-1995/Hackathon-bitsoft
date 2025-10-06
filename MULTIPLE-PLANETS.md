# 🌍 Multiple Planets Feature

## Overview

The Gravity Slingshot Simulator now supports **multiple planets** with combined gravity fields! This allows you to explore complex multi-body physics scenarios like binary star systems, Lagrange points, and three-body problems.

## Features

### ✨ Key Capabilities

- **Add/Remove Planets**: Dynamically add up to 6 planets or remove them (minimum 1 required)
- **Edit Planet Properties**: Customize position, mass, radius, color, and name
- **Combined Gravity**: Realistic N-body physics with gravitational forces summed from all planets
- **Quick Scenarios**: Pre-configured setups for interesting physics demonstrations
- **Visual Feedback**: Each planet has unique colors, glow effects, and name labels

## Quick Scenarios

### 🌍 Single Planet
Classic single planet gravity simulation - great for learning basics.
- **Use Case**: Learning fundamental orbital mechanics
- **Difficulty**: Beginner

### ⚛️ Binary System
Two planets of equal mass creating a balanced gravitational system.
- **Use Case**: Binary star systems, figure-8 orbits
- **Difficulty**: Intermediate
- **Challenge**: Try launching between the two planets!

### 🔺 Lagrange Points
Three-body configuration demonstrating gravitational equilibrium points.
- **Use Case**: Understanding Lagrange points (L1, L2, L3, L4, L5)
- **Difficulty**: Advanced
- **Real World**: Where space telescopes (like James Webb) are positioned

### 🔼 Triangle Formation
Three planets arranged in an equilateral triangle.
- **Use Case**: Stability of symmetric systems, chaotic orbits
- **Difficulty**: Intermediate
- **Fun Fact**: Theoretical stable configuration for equal-mass objects

### ☀️ Solar System
Sun-like massive body with smaller planetary companions.
- **Use Case**: Realistic planetary systems, gravity assist maneuvers
- **Difficulty**: Beginner to Intermediate
- **Real World**: How Voyager spacecraft used Jupiter's gravity to reach outer planets

## How to Use

### Adding a Planet

1. Click the **➕ Add Planet** button
2. A new planet appears at the canvas center
3. The edit panel opens automatically
4. Adjust properties as needed

### Editing Planets

1. **Click any planet** in the planet list to select it
2. Edit panel shows with sliders for:
   - **Name**: Custom label for the planet
   - **Position X & Y**: Location on the canvas (50-750, 50-550)
   - **Mass**: Gravitational strength (50-3000)
   - **Radius**: Visual size (10-100)
   - **Color**: Choose from presets or custom color picker

### Removing Planets

- Click the **✕** button next to any planet (except the last one)
- Minimum 1 planet is always required for simulation

### Changing Scenarios

- Click any scenario button to instantly load that configuration
- This resets the simulation with new planet positions

## Physics Explanation

### Combined Gravity Calculation

Each projectile experiences gravitational force from **all planets simultaneously**:

```
F_total = F_planet1 + F_planet2 + F_planet3 + ...
```

For each planet:
```
F = G × (m_planet × m_projectile) / r²
```

Where:
- `G` = Gravitational constant (adjustable via gravity slider)
- `m_planet` = Planet mass
- `m_projectile` = Projectile mass (constant)
- `r` = Distance between planet and projectile

### Outcome Detection

The simulation checks for three possible outcomes:

1. **Crash** 🔴: Projectile collides with ANY planet
   - Checks distance to each planet
   - Collision when `distance < planet.radius`

2. **Orbit** 🟢: Stable orbit around closest planet
   - Detected when trajectory forms closed loop
   - Speed and distance remain relatively constant

3. **Escape** 🔵: Projectile escapes ALL planetary gravity
   - Velocity exceeds escape velocity from all planets
   - Projectile reaches canvas boundaries

4. **Timeout** 🟣: Simulation time limit reached
   - Adjustable via Time Limit slider (5s - 2min)
   - Prevents infinite calculations

## Tips & Tricks

### For Beginners
- Start with **Single Planet** to understand basics
- Try the **Solar System** scenario with launch power 6-8
- Observe how gravity affects trajectory curvature

### For Intermediate Users
- **Binary System**: Launch perpendicular to the line connecting planets
- Experiment with gravity settings: lower gravity = wider orbits
- Try achieving figure-8 orbits in binary systems

### For Advanced Users
- **Lagrange Points**: Launch near the small asteroid to see stable points
- **Triangle Formation**: Create chaotic orbits by launching at 45° angles
- Design custom systems with specific mass ratios (e.g., 10:1:1)

### Launch Strategies by Scenario

| Scenario | Recommended Launch | Power | Angle |
|----------|-------------------|-------|-------|
| Single Planet | Standard orbit | 5-7 | 60-75° |
| Binary System | Between planets | 8-10 | 45-90° |
| Lagrange Points | Near equilibrium | 4-6 | 30-60° |
| Triangle | Edge approach | 6-8 | 45° |
| Solar System | Inner orbit | 5-8 | 70-80° |

## Technical Details

### Planet Configuration Structure

```javascript
{
  id: 'unique-id',        // Unique identifier
  x: 400,                 // X position (pixels)
  y: 300,                 // Y position (pixels)
  mass: 1000,             // Mass (affects gravity)
  radius: 50,             // Visual size (pixels)
  color: '#4a5fc1',       // Hex color code
  name: 'Earth'           // Display name
}
```

### Property Limits

| Property | Min | Max | Step | Unit |
|----------|-----|-----|------|------|
| Mass | 50 | 3000 | 50 | units |
| Radius | 10 | 100 | 5 | pixels |
| Position X | 50 | 750 | 10 | pixels |
| Position Y | 50 | 550 | 10 | pixels |

### Color Presets

The app includes 6 color presets:
- 🔵 Blue (`#4a5fc1`) - Classic planet
- 🔴 Red (`#ef4444`) - Hot giant
- 🟢 Green (`#10b981`) - Habitable zone
- 🟠 Orange (`#f59e0b`) - Sun-like star
- 🟣 Purple (`#8b5cf6`) - Exotic world
- 🩷 Pink (`#ec4899`) - Binary companion

## AI Integration

When a simulation completes with multiple planets, the AI tutor receives context about:
- All planet configurations (mass, position, radius)
- Closest planet to projectile at crash/orbit
- Combined gravitational potential energy
- Distance to each planet throughout trajectory

This allows the AI to provide explanations like:
- "You crashed into Alpha because its stronger gravity pulled you in..."
- "The combined gravity from Beta and Gamma created a figure-8 path..."
- "You reached a Lagrange point between Sun and Jupiter!"

## Performance Notes

- **Recommended**: 1-5 planets for smooth simulation
- **Maximum**: 6 planets (automatic color assignment)
- **Physics Update Rate**: 16ms (60 FPS)
- **Gravity Calculation**: O(n) where n = number of planets

## Real-World Applications

### Space Mission Planning
- **Gravity Assists**: Voyager, Cassini, New Horizons missions
- **Lagrange Points**: James Webb Space Telescope (Sun-Earth L2)
- **Binary Systems**: Many exoplanets orbit binary stars

### Scientific Concepts
- **Three-Body Problem**: Famous unsolved problem in physics
- **Orbital Resonance**: Jupiter's moons, Saturn's rings
- **Gravitational Slingshots**: Energy-efficient space travel

## Future Enhancements

Potential features for future versions:
- [ ] Planet velocity (moving planets)
- [ ] Trail visualization for planet motion
- [ ] Mass visualization (size proportional to mass)
- [ ] Orbit prediction lines
- [ ] Save/load custom scenarios
- [ ] Animation of planet orbits around each other

## Troubleshooting

### Issue: Simulation crashes immediately
**Solution**: Check planet positions - they might be overlapping. Ensure minimum distance between planets.

### Issue: Projectile escapes too easily
**Solution**: Increase planet mass or decrease launch power. Lower gravity setting also makes escape easier.

### Issue: Can't achieve stable orbit
**Solution**: Try launching perpendicular to the planet. Adjust launch power to find the "sweet spot" (usually 5-7).

### Issue: Timeout reached before outcome
**Solution**: Increase the Time Limit slider. Complex multi-planet orbits need more time to stabilize.

## Code References

- **Physics Engine**: `src/utils/physics.js` - PhysicsEngine class
- **Planet Controls**: `src/components/Controls/PlanetControls.jsx`
- **Configuration**: `src/config.js` - Planet scenarios and limits
- **Canvas Rendering**: `src/components/Canvas/PhysicsCanvas.jsx`

## Learning Resources

### Recommended Reading
- [Lagrange Points Explained](https://en.wikipedia.org/wiki/Lagrange_point)
- [Three-Body Problem](https://en.wikipedia.org/wiki/Three-body_problem)
- [Gravity Assist](https://en.wikipedia.org/wiki/Gravity_assist)
- [Binary Star Systems](https://en.wikipedia.org/wiki/Binary_star)

### Educational Goals
By experimenting with multiple planets, you'll learn:
- ✅ How gravitational forces combine (vector addition)
- ✅ Why Lagrange points exist and are stable
- ✅ How NASA uses gravity assists to save fuel
- ✅ Why the three-body problem is chaotic
- ✅ How to calculate escape velocity
- ✅ The concept of gravitational potential wells

---

**Have fun exploring multi-body physics! 🚀🌍🪐**

Try creating your own scenarios and see what interesting orbits you can achieve!
