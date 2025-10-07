# 🔍 Zoom and Pan Feature

## Overview

The canvas now supports **zoom and pan** functionality, allowing you to explore the simulation space at different scales and positions. The canvas has been increased to **1200x800 pixels** with full camera controls.

## Features

### 1. **Mouse Wheel Zoom**
- **Scroll up** to zoom in
- **Scroll down** to zoom out
- **Zoom range**: 10% to 500% (0.1x to 5x)
- **Smart zooming**: Zooms toward your cursor position, keeping the point under your mouse stable

### 2. **Pan (Camera Movement)**
- **Right-click + drag** to pan the view
- **Shift + left-click + drag** to pan the view
- **Middle mouse button + drag** to pan
- Move the camera to explore different areas of the simulation space

### 3. **Zoom Controls UI**
- **+ button**: Zoom in by 20%
- **− button**: Zoom out by 20%
- **Zoom indicator**: Shows current zoom level percentage
- **🎯 Reset button**: Returns to 100% zoom and centered view

### 4. **Larger Canvas**
- Canvas size increased from **800x600** to **1200x800**
- More space to explore and visualize trajectories
- Better view of multi-planet systems

## How to Use

### Launching Projectiles
1. **Left-click and drag** on the canvas to aim
2. The preview shows trajectory prediction
3. Release to launch

### Exploring the Space
1. **Zoom in** to see details (planet surfaces, trajectory curves)
2. **Zoom out** to see the big picture (escape trajectories, orbital patterns)
3. **Pan** to follow projectiles or explore different areas
4. **Reset view** to return to default

### Tips
- Zoom in before launching for precise aiming
- Zoom out to see long escape trajectories
- Pan to follow projectiles as they orbit
- Use reset when you get lost

## Technical Implementation

### Coordinate System
The system uses **two coordinate spaces**:

**World Coordinates**: The actual physics simulation space where objects exist
- Planets, projectiles, and trajectories use world coordinates
- Physics calculations happen in world space
- Remains consistent regardless of camera position/zoom

**Screen Coordinates**: What you see on the canvas
- Mouse clicks are in screen coordinates
- Rendering happens in screen space
- Changes when you zoom or pan

### Transformation Functions

**screenToWorld(x, y)**
- Converts mouse click position to world coordinates
- Used when clicking to launch projectiles
- Accounts for current zoom level and camera offset

**worldToScreen(x, y)**
- Converts world position to screen position
- Used for rendering (currently handled by canvas transform)
- Future use for UI overlays

### Canvas Transform
The rendering uses HTML5 Canvas 2D context transformation:
```javascript
ctx.save();
ctx.translate(WIDTH / 2, HEIGHT / 2);
ctx.scale(zoom.current, zoom.current);
ctx.translate(-WIDTH / 2 + cameraOffset.x / zoom, -HEIGHT / 2 + cameraOffset.y / zoom);
// ... draw everything ...
ctx.restore();
```

This applies the transformation to **all rendering** automatically, so:
- Planets stay in correct world positions
- Trajectories scale properly
- Launch preview works at any zoom level

### State Management

**Refs (for render loop)**:
- `zoom.current` - Current zoom level (1 = 100%)
- `cameraOffset.current` - Camera pan offset {x, y}
- `isPanning.current` - Currently panning?
- `lastPanPos.current` - Last pan mouse position

**State (for UI)**:
- `zoomLevel` - Triggers UI updates for zoom indicator

## Configuration

All zoom/pan behavior can be customized:

```javascript
// Zoom limits
const MIN_ZOOM = 0.1;  // 10%
const MAX_ZOOM = 5;    // 500%

// Zoom speed (mouse wheel)
const ZOOM_FACTOR_IN = 1.1;   // 10% per scroll
const ZOOM_FACTOR_OUT = 0.9;  // 10% per scroll

// Zoom speed (buttons)
const BUTTON_ZOOM_IN = 1.2;   // 20% per click
const BUTTON_ZOOM_OUT = 1/1.2; // 20% per click
```

## Keyboard Shortcuts (Future Enhancement)

Potential additions:
- **+** / **=** : Zoom in
- **-** / **_** : Zoom out
- **0** : Reset view
- **Arrow keys** : Pan camera
- **Space + drag** : Alternative pan method

## Performance Considerations

### Optimizations Applied
1. **Canvas transform**: Hardware-accelerated rendering
2. **Ref-based state**: No unnecessary re-renders
3. **Efficient coordinate conversion**: Simple math operations
4. **Preserved trajectory prediction**: Still uses world coordinates

### Performance Impact
- **Minimal overhead**: Canvas transforms are native and fast
- **No physics changes**: Physics engine unaffected by zoom/pan
- **Smooth rendering**: 60 FPS maintained at all zoom levels

## Troubleshooting

**Problem: Can't click on planets accurately**
- Solution: Zoom in for more precise clicking

**Problem: Lost in space after panning**
- Solution: Click the 🎯 Reset button

**Problem: Launch preview not showing**
- Solution: Make sure you're left-clicking (not right-clicking for pan)

**Problem: Zoom too fast/slow**
- Solution: Use zoom buttons for controlled zooming instead of mouse wheel

**Problem: Launch trajectory doesn't match prediction at high zoom**
- Solution: Should match perfectly - report bug if not

## Related Files

- `src/components/Canvas/PhysicsCanvas.jsx` - Main implementation
- Coordinate transforms: Lines 180-191
- Zoom handlers: Lines 590-630
- Pan handlers: Lines 488-537
- UI controls: Lines 635-665

## Future Enhancements

Potential improvements:
- [ ] Mini-map showing camera position
- [ ] Zoom level presets (25%, 50%, 100%, 200%, 400%)
- [ ] Keyboard shortcuts for zoom/pan
- [ ] Smooth zoom/pan animations
- [ ] Touch gesture support (pinch to zoom)
- [ ] Fit-to-view button (auto-zoom to show all objects)
- [ ] Follow projectile mode (camera tracks projectile)
- [ ] Grid overlay that scales with zoom
