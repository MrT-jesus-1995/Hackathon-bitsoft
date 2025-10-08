import React, { useEffect, useRef, useState } from 'react';
import { PhysicsEngine, Vector2D } from '../../utils/physics';
import { degreesToRadians } from '../../utils/helpers';
import { CONFIG } from '../../config';

const PhysicsCanvas = ({ params, onSimulationComplete, onTrajectoryUpdate, isRunning, onLaunchFromCanvas, gameMode = 'free', currentPuzzle = null }) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const animationRef = useRef(null);
  const simulationStartTime = useRef(null);
  const updateCount = useRef(0);
  const lastLaunchData = useRef(null); // Store mouse launch data
  const mousePos = useRef(null); // Use ref for immediate updates
  const launchStart = useRef(null); // Use ref for immediate updates
  const lastPredictionTime = useRef(0); // For throttling predictions
  const cachedPrediction = useRef(null); // Cache last prediction for performance
  const isDraggingRef = useRef(false); // Use ref for immediate updates in render loop
  const [isDragging, setIsDragging] = useState(false); // State for UI updates only

  // Zoom and Pan state
  const zoom = useRef(1); // Zoom level (1 = 100%)
  const cameraOffset = useRef({ x: 0, y: 0 }); // Camera pan offset
  const isPanning = useRef(false); // Is user panning?
  const lastPanPos = useRef(null); // Last pan position
  const [zoomLevel, setZoomLevel] = useState(1); // State for UI display

  const WIDTH = 1200; // Larger canvas
  const HEIGHT = 800;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initialize physics engine with planets from params
    const planets = params.planets || CONFIG.planets.scenarios.single.planets;
    const convertedPlanets = planets.map(p => ({
      id: p.id,
      pos: new Vector2D(p.x, p.y),
      mass: p.mass,
      radius: p.radius,
      color: p.color,
      name: p.name
    }));

    engineRef.current = new PhysicsEngine({
      gravity: params.gravity,
      timeStep: 0.1,
      planets: convertedPlanets,
    });

    // Start render loop
    const render = () => {
      drawScene(ctx);
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update gravity when params change
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setGravity(params.gravity);
    }
  }, [params.gravity]);

  // Update planets when params.planets change
  useEffect(() => {
    if (engineRef.current && params.planets) {
      const convertedPlanets = params.planets.map(p => ({
        id: p.id,
        pos: new Vector2D(p.x, p.y),
        mass: p.mass,
        radius: p.radius,
        color: p.color,
        name: p.name
      }));
      
      // Clear and re-add all planets
      engineRef.current.planets = convertedPlanets;
    }
  }, [params.planets]);

  // Handle simulation running state
  useEffect(() => {
    if (isRunning && engineRef.current) {
      // Launch using mouse drag data
      if (lastLaunchData.current) {
        console.log('✅ Launching with:', lastLaunchData.current);
        engineRef.current.launch(lastLaunchData.current.position, lastLaunchData.current.velocity);
      } else {
        console.warn('⚠️ No launch data available. Please drag on canvas to launch.');
        return;
      }
      
      simulationStartTime.current = Date.now();
      updateCount.current = 0;
    }
    
    // Clear launch data after use
    if (!isRunning) {
      lastLaunchData.current = null;
    }
  }, [isRunning, params]);

  // Physics update loop with time limits
  useEffect(() => {
    if (!isRunning) return;

    const maxTime = params.maxSimulationTime || CONFIG.simulation.maxSimulationTime;
    const maxUpdates = CONFIG.simulation.maxSimulationUpdates;

    const updateInterval = setInterval(() => {
      if (engineRef.current && engineRef.current.isActive) {
        // Check time limit
        const elapsedTime = Date.now() - simulationStartTime.current;
        if (elapsedTime >= maxTime) {
          console.log(`Simulation stopped: Time limit reached (${maxTime}ms)`);
          engineRef.current.isActive = false;
          const data = engineRef.current.getData();
          onSimulationComplete(engineRef.current.outcome || 'timeout', data);
          clearInterval(updateInterval);
          return;
        }

        // Check update count limit
        updateCount.current++;
        if (updateCount.current >= maxUpdates) {
          console.log(`Simulation stopped: Update limit reached (${maxUpdates} updates)`);
          engineRef.current.isActive = false;
          const data = engineRef.current.getData();
          onSimulationComplete(engineRef.current.outcome || 'timeout', data);
          clearInterval(updateInterval);
          return;
        }

        // Update physics
        engineRef.current.update();
        onTrajectoryUpdate(engineRef.current.trajectory);

        // Check if simulation ended naturally
        if (!engineRef.current.isActive && engineRef.current.outcome) {
          const data = engineRef.current.getData();
          onSimulationComplete(engineRef.current.outcome, data);
          clearInterval(updateInterval);
        }
      }
    }, CONFIG.physics.updateRate); // Use config update rate

    return () => clearInterval(updateInterval);
  }, [isRunning, onSimulationComplete, onTrajectoryUpdate, params.maxSimulationTime]);

  // Coordinate transformation helpers
  // Inverse of: translate(WIDTH/2, HEIGHT/2), scale(zoom), translate(-WIDTH/2 + offset.x/zoom, -HEIGHT/2 + offset.y/zoom)
  const screenToWorld = (screenX, screenY) => {
    // Step 1: Subtract the center translation
    let x = screenX - WIDTH / 2;
    let y = screenY - HEIGHT / 2;
    
    // Step 2: Inverse scale (divide by zoom)
    x = x / zoom.current;
    y = y / zoom.current;
    
    // Step 3: Inverse the second translation
    x = x - (-WIDTH / 2 + cameraOffset.current.x / zoom.current);
    y = y - (-HEIGHT / 2 + cameraOffset.current.y / zoom.current);
    
    return { x, y };
  };

  const worldToScreen = (worldX, worldY) => {
    // Forward transform
    let x = worldX;
    let y = worldY;
    
    // Step 1: Apply second translation
    x = x + (-WIDTH / 2 + cameraOffset.current.x / zoom.current);
    y = y + (-HEIGHT / 2 + cameraOffset.current.y / zoom.current);
    
    // Step 2: Apply scale
    x = x * zoom.current;
    y = y * zoom.current;
    
    // Step 3: Apply first translation
    x = x + WIDTH / 2;
    y = y + HEIGHT / 2;
    
    return { x, y };
  };

  const drawScene = (ctx) => {
    const engine = engineRef.current;
    if (!engine) return;

    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Save context state
    ctx.save();

    // Apply camera transform (pan and zoom)
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    ctx.scale(zoom.current, zoom.current);
    ctx.translate(-WIDTH / 2 + cameraOffset.current.x / zoom.current, -HEIGHT / 2 + cameraOffset.current.y / zoom.current);

    // Draw stars background
    drawStars(ctx);

    // Draw all planets
    const planets = engine.getPlanets ? engine.getPlanets() : [
      { pos: engine.planetPos, radius: engine.planetRadius, color: '#4a5fc1', name: 'Planet' }
    ];
    
    planets.forEach(planet => {
      const pos = planet.pos || { x: planet.x, y: planet.y };
      drawPlanet(ctx, pos.x, pos.y, planet.radius, planet.color, planet.name);
    });

    // Draw trajectory
    if (engine.trajectory.length > 1) {
      drawTrajectory(ctx, engine.trajectory, engine.outcome);
    }

    // Draw projectile
    if (engine.isActive || engine.trajectory.length > 0) {
      const pos = engine.trajectory[engine.trajectory.length - 1];
      drawProjectile(ctx, pos.x, pos.y, engine.trajectory);
    }

    // Draw launch preview when dragging
    if (isDraggingRef.current && launchStart.current && mousePos.current) {
      drawLaunchPreview(ctx, launchStart.current, mousePos.current);
    }

    // Draw orbit guides for all planets
    planets.forEach(planet => {
      const pos = planet.pos || { x: planet.x, y: planet.y };
      drawOrbitGuides(ctx, pos.x, pos.y);
    });

    // Draw game mode specific elements
    // Only show targets in Target Practice mode
    if (gameMode === 'target' && CONFIG.gameModes?.targetPractice?.showTargets) {
      drawTargets(ctx, CONFIG.gameModes.targetPractice.targets);
    }
    
    // Only show puzzle target in Puzzle mode
    if (gameMode === 'puzzle' && currentPuzzle) {
      drawPuzzleTarget(ctx, currentPuzzle);
    }

    // Restore context state
    ctx.restore();
    
   
  };

  const drawStars = (ctx) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 100; i++) {
      const x = (i * 83) % WIDTH;
      const y = (i * 137) % HEIGHT;
      const size = (i % 3) * 0.5;
      ctx.fillRect(x, y, size, size);
    }
  };

  const drawPlanet = (ctx, x, y, radius, color = '#4a5fc1', name = 'Planet') => {
    // Convert hex to RGB for gradient
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 74, g: 95, b: 193 };
    };
    
    const rgb = hexToRgb(color);
    
    // Glow effect
    const gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2);
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Planet body with gradient
    const planetGradient = ctx.createRadialGradient(x - 10, y - 10, 0, x, y, radius);
    // Lighter shade
    planetGradient.addColorStop(0, `rgba(${Math.min(rgb.r + 40, 255)}, ${Math.min(rgb.g + 40, 255)}, ${Math.min(rgb.b + 40, 255)}, 1)`);
    // Original color
    planetGradient.addColorStop(1, color);
    ctx.fillStyle = planetGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Planet outline
    const uiScale = 1 / zoom.current;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2 * uiScale;
    ctx.stroke();
    
    // Planet name label (compensate for zoom)
    ctx.save();
    ctx.translate(x, y + radius + 15 * uiScale);
    ctx.scale(uiScale, uiScale);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 0, 0);
    
    ctx.restore();
  };

  const drawTargets = (ctx, targets) => {
    if (!targets || targets.length === 0) return;
    
    const uiScale = 1 / zoom.current;
    
    targets.forEach(target => {
      // Pulsing animation
      const pulse = Math.sin(Date.now() / 500) * 0.1 + 1;
      
      // Outer glow
      const gradient = ctx.createRadialGradient(
        target.x, target.y, 0,
        target.x, target.y, target.radius * pulse
      );
      gradient.addColorStop(0, target.color + '40');
      gradient.addColorStop(1, target.color + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius * pulse, 0, Math.PI * 2);
      ctx.fill();
      
      // Target rings
      ctx.strokeStyle = target.color;
      ctx.lineWidth = 2 * uiScale;
      for (let i = 3; i > 0; i--) {
        ctx.beginPath();
        ctx.arc(target.x, target.y, (target.radius * i) / 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Center dot
      ctx.fillStyle = target.color;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 3 * uiScale, 0, Math.PI * 2);
      ctx.fill();
      
      // Label
      ctx.save();
      ctx.font = `${12 * uiScale}px sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${target.points} pts`, target.x, target.y + target.radius + 15 * uiScale);
      ctx.restore();
    });
  };
  
  const drawPuzzleTarget = (ctx, puzzle) => {
    if (!puzzle) return;
    
    const uiScale = 1 / zoom.current;
    const { targetX, targetY, targetRadius } = puzzle;
    
    // Animated border
    const rotation = (Date.now() / 1000) % (Math.PI * 2);
    
    // Glow
    const gradient = ctx.createRadialGradient(
      targetX, targetY, 0,
      targetX, targetY, targetRadius * 1.5
    );
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Dashed circle
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3 * uiScale;
    ctx.setLineDash([10 * uiScale, 5 * uiScale]);
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Rotating markers
    for (let i = 0; i < 4; i++) {
      const angle = rotation + (i * Math.PI / 2);
      const x = targetX + Math.cos(angle) * (targetRadius + 10 * uiScale);
      const y = targetY + Math.sin(angle) * (targetRadius + 10 * uiScale);
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 4 * uiScale, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Label
    ctx.save();
    ctx.font = `bold ${14 * uiScale}px sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('🎯 TARGET', targetX, targetY + targetRadius + 20 * uiScale);
    ctx.restore();
  };

  const drawTrajectory = (ctx, trajectory, outcome) => {
    if (trajectory.length < 2) return;

    const uiScale = 1 / zoom.current;
    
    // Calculate speeds for color mapping
    const speeds = [];
    for (let i = 1; i < trajectory.length; i++) {
      const dx = trajectory[i].x - trajectory[i-1].x;
      const dy = trajectory[i].y - trajectory[i-1].y;
      speeds.push(Math.sqrt(dx * dx + dy * dy));
    }
    const maxSpeed = Math.max(...speeds, 1);
    const minSpeed = Math.min(...speeds, 0);
    
    // Draw segments with fading trail and speed-based colors
    for (let i = 1; i < trajectory.length; i++) {
      const progress = i / trajectory.length;
      const speedRatio = (speeds[i-1] - minSpeed) / (maxSpeed - minSpeed);
      
      // Fade older parts of trail
      const alpha = 0.3 + (progress * 0.5); // 0.3 to 0.8
      
      // Speed-based color (blue = slow, yellow = medium, red = fast)
      let r, g, b;
      if (speedRatio < 0.5) {
        // Blue to Yellow
        const t = speedRatio * 2;
        r = Math.floor(100 + (255 - 100) * t);
        g = Math.floor(150 + (220 - 150) * t);
        b = Math.floor(255 - 255 * t);
      } else {
        // Yellow to Red
        const t = (speedRatio - 0.5) * 2;
        r = 255;
        g = Math.floor(220 - 140 * t);
        b = Math.floor(50 * (1 - t));
      }
      
      // Outcome-based tint
      if (outcome === 'orbit') {
        g = Math.min(255, g + 50); // Greenish tint
      } else if (outcome === 'escape') {
        r = Math.min(255, r + 30);
        g = Math.min(255, g + 30); // Brighter
      } else if (outcome === 'crash') {
        r = 255;
        g = Math.floor(g * 0.5);
        b = Math.floor(b * 0.5); // More red
      }
      
      // Draw segment with glow
      ctx.save();
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`;
      ctx.shadowBlur = 8 * uiScale;
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = (2 + speedRatio * 2) * uiScale; // Thicker when faster
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(trajectory[i-1].x, trajectory[i-1].y);
      ctx.lineTo(trajectory[i].x, trajectory[i].y);
      ctx.stroke();
      ctx.restore();
    }
  };

  const drawProjectile = (ctx, x, y, trajectory = []) => {
    const uiScale = 1 / zoom.current;
    const size = 6 * uiScale;
    
    // Glow
    const glowGradient = ctx.createRadialGradient(x, y, 2 * uiScale, x, y, 12 * uiScale);
    glowGradient.addColorStop(0, 'rgba(255, 100, 50, 0.8)');
    glowGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y, 12 * uiScale, 0, Math.PI * 2);
    ctx.fill();

    // Rocket ship shape
    ctx.save();
    
    // Calculate direction based on velocity (if available)
    // For now, we'll point it in direction of motion
    let angle = 0;
    if (trajectory.length > 1) {
      const lastPos = trajectory[trajectory.length - 2];
      const dx = x - lastPos.x;
      const dy = y - lastPos.y;
      angle = Math.atan2(dy, dx);
    }
    
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Rocket body (main cone)
    ctx.fillStyle = '#ff6b35';
    ctx.beginPath();
    ctx.moveTo(size * 1.5, 0);
    ctx.lineTo(-size, -size * 0.6);
    ctx.lineTo(-size, size * 0.6);
    ctx.closePath();
    ctx.fill();
    
    // Rocket window
    ctx.fillStyle = '#4ecdc4';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Rocket fins
    ctx.fillStyle = '#ff8c61';
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, -size * 0.6);
    ctx.lineTo(-size * 1.2, -size * 1.1);
    ctx.lineTo(-size * 0.6, -size * 0.8);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, size * 0.6);
    ctx.lineTo(-size * 1.2, size * 1.1);
    ctx.lineTo(-size * 0.6, size * 0.8);
    ctx.closePath();
    ctx.fill();
    
    // Flame exhaust (animated)
    const flameLength = 1 + Math.sin(Date.now() / 100) * 0.3;
    const flameGradient = ctx.createLinearGradient(-size, 0, -size * (1 + flameLength), 0);
    flameGradient.addColorStop(0, 'rgba(255, 200, 0, 0.9)');
    flameGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.7)');
    flameGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
    
    ctx.fillStyle = flameGradient;
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(-size * (1 + flameLength), -size * 0.4);
    ctx.lineTo(-size * (1 + flameLength * 0.7), 0);
    ctx.lineTo(-size * (1 + flameLength), size * 0.4);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };

  const drawLaunchPreview = (ctx, start, end) => {
    console.log('🎨 Drawing launch preview', { 
      start, 
      end, 
      isDragging: isDraggingRef.current, 
      zoom: zoom.current,
      uiScale: 1 / zoom.current 
    });
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate velocity from drag distance and direction
    // MUST match the calculation in handleMouseUp!
    const velocityScale = params.launchPower / 50; // Same as launch
    const startPos = new Vector2D(start.x, start.y);
    const velocity = new Vector2D(dx * velocityScale, dy * velocityScale);
    
    // Get trajectory prediction from physics engine (with throttling)
    const engine = engineRef.current;
    let prediction = cachedPrediction.current; // Use cached prediction by default
    
    if (engine && CONFIG.prediction.enableDuringDrag) {
      const now = Date.now();
      const timeSinceLastPrediction = now - lastPredictionTime.current;
      
      // Only calculate new prediction if enough time has passed
      if (!prediction || timeSinceLastPrediction >= CONFIG.prediction.throttleMs) {
        console.log('🔮 Calculating trajectory prediction...', { velocity, startPos });
        prediction = engine.predictTrajectory(startPos, velocity, {
          maxSteps: CONFIG.prediction.maxSteps,
          timeStep: CONFIG.prediction.timeStep,
          maxTime: CONFIG.prediction.maxTime,
          samplingRate: CONFIG.prediction.samplingRate
        });
        console.log('✅ Prediction result:', prediction);
        cachedPrediction.current = prediction; // Cache the prediction
        lastPredictionTime.current = now;
      }
    }
    
    // Draw predicted trajectory if available
    if (prediction && prediction.points.length > 1) {
      const outcomeColor = CONFIG.prediction.visual.colors[prediction.outcome] || 
                          CONFIG.prediction.visual.colors.unknown;
      
      // Compensate for zoom in trajectory visual elements
      const uiScale = 1 / zoom.current;
      
      // Draw glow effect if enabled
      if (CONFIG.prediction.visual.glowEnabled) {
        ctx.save();
        ctx.shadowColor = outcomeColor;
        ctx.shadowBlur = CONFIG.prediction.visual.glowBlur * uiScale;
        
        // Draw trajectory path as dashed line
        ctx.strokeStyle = outcomeColor;
        ctx.lineWidth = CONFIG.prediction.visual.lineWidth * uiScale;
        ctx.setLineDash(CONFIG.prediction.visual.lineDash.map(v => v * uiScale));
        ctx.beginPath();
        ctx.moveTo(prediction.points[0].x, prediction.points[0].y);
        
        for (let i = 1; i < prediction.points.length; i++) {
          ctx.lineTo(prediction.points[i].x, prediction.points[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
      
      // Draw dots along trajectory for better visibility
      ctx.fillStyle = outcomeColor;
      for (let i = 0; i < prediction.points.length; i += Math.floor(CONFIG.prediction.visual.dotSpacing / 5)) {
        const point = prediction.points[i];
        ctx.beginPath();
        ctx.arc(point.x, point.y, CONFIG.prediction.visual.dotRadius * uiScale, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Compensate for zoom in UI element sizes
    const uiScale = 1 / zoom.current;
    
    // Starting position circle (where projectile will spawn)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(start.x, start.y, 8 * uiScale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2 * uiScale;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 8 * uiScale, 0, Math.PI * 2);
    ctx.stroke();
    
    // Launch direction line with gradient
    const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    gradient.addColorStop(0, 'rgba(74, 95, 193, 0.8)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.8)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3 * uiScale;
    ctx.setLineDash([5 * uiScale, 5 * uiScale]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow head (direction indicator)
    const angle = Math.atan2(dy, dx);
    const arrowLength = 20 * uiScale;
    ctx.fillStyle = 'rgba(147, 51, 234, 0.9)';
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - arrowLength * Math.cos(angle - Math.PI / 6),
      end.y - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      end.x - arrowLength * Math.cos(angle + Math.PI / 6),
      end.y - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
    
    // Power and outcome indicator text (compensate for zoom)
    const powerPercent = Math.min(100, (distance / 3)).toFixed(0);
    ctx.save();
    ctx.translate((start.x + end.x) / 2, (start.y + end.y) / 2 - 15 * uiScale);
    ctx.scale(uiScale, uiScale);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let outcomeText = `Power: ${powerPercent}%`;
    if (prediction && prediction.outcome !== 'unknown') {
      const outcomeEmoji = {
        crash: '💥',
        orbit: '🌟',
        escape: '🚀'
      };
      outcomeText += ` ${outcomeEmoji[prediction.outcome] || ''} ${prediction.outcome.toUpperCase()}`;
    }
    
    ctx.fillText(outcomeText, 0, 0);
    ctx.restore();
  };

  const drawOrbitGuides = (ctx, x, y) => {
    const uiScale = 1 / zoom.current;
    ctx.strokeStyle = 'rgba(74, 95, 193, 0.15)';
    ctx.lineWidth = 1 * uiScale;
    
    // Draw concentric circles as orbit guides
    [100, 150, 200, 250].forEach(radius => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    });
  };


  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    // Scale mouse coordinates from display size to canvas size
    const scaleX = WIDTH / rect.width;
    const scaleY = HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Right-click or middle mouse button for panning
    if (e.button === 2 || e.button === 1 || e.shiftKey) {
      e.preventDefault();
      isPanning.current = true;
      lastPanPos.current = { x, y };
      console.log('🖐️ Starting pan');
      return;
    }

    // Left-click for launching (only when not running)
    if (isRunning) return;
    
    // Convert screen coordinates to world coordinates
    const worldPos = screenToWorld(x, y);
    launchStart.current = worldPos;
    mousePos.current = worldPos;
    cachedPrediction.current = null; // Clear cached prediction
    lastPredictionTime.current = 0; // Reset throttle timer
    isDraggingRef.current = true;
    setIsDragging(true);
    console.log('🎯 Mouse down - starting drag', { 
      screen: { x, y }, 
      world: worldPos, 
      zoom: zoom.current, 
      cameraOffset: cameraOffset.current 
    });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    // Scale mouse coordinates from display size to canvas size
    const scaleX = WIDTH / rect.width;
    const scaleY = HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Handle panning
    if (isPanning.current && lastPanPos.current) {
      const dx = x - lastPanPos.current.x;
      const dy = y - lastPanPos.current.y;
      cameraOffset.current.x += dx;
      cameraOffset.current.y += dy;
      lastPanPos.current = { x, y };
      return;
    }

    // Handle launch preview dragging
    if (!isDraggingRef.current) return;
    
    // Convert screen coordinates to world coordinates
    const worldPos = screenToWorld(x, y);
    mousePos.current = worldPos;
  };

  const handleMouseUp = (e) => {
    // Stop panning
    if (isPanning.current) {
      isPanning.current = false;
      lastPanPos.current = null;
      console.log('🖐️ Pan stopped');
      return;
    }

    if (!isDraggingRef.current || !launchStart.current || !mousePos.current) return;
    
    // Calculate launch parameters from drag
    const dx = mousePos.current.x - launchStart.current.x;
    const dy = mousePos.current.y - launchStart.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only launch if drag is significant
    if (distance > 10) {
      // Calculate velocity from drag direction and length
      const velocityScale = params.launchPower / 50; // Scale by launch power
      const velocity = new Vector2D(dx * velocityScale, dy * velocityScale);
      
      // Launch from the drag start position
      const startPos = new Vector2D(launchStart.current.x, launchStart.current.y);
      
      console.log('🚀 Mouse Launch:', {
        startPos: { x: startPos.x, y: startPos.y },
        velocity: { x: velocity.x, y: velocity.y },
        dragDistance: distance,
        powerMultiplier: params.launchPower
      });
      
      // Store launch data for when simulation starts
      lastLaunchData.current = {
        position: startPos,
        velocity: velocity
      };
      
      // Reset trajectory and trigger the simulation to start
      onTrajectoryUpdate([]);
      
      // Trigger the parent's launch handler to start the simulation
      if (onLaunchFromCanvas) {
        onLaunchFromCanvas(startPos, velocity);
      }
    }
    
    // Clear cached prediction when dragging stops
    cachedPrediction.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
    console.log('🏁 Mouse up - drag ended');
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    // Scale mouse coordinates from display size to canvas size
    const scaleX = WIDTH / rect.width;
    const scaleY = HEIGHT / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Get world position before zoom
    const worldBeforeZoom = screenToWorld(mouseX, mouseY);

    // Zoom in or out
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom.current * zoomFactor));
    zoom.current = newZoom;
    setZoomLevel(newZoom);

    // Get world position after zoom
    const worldAfterZoom = screenToWorld(mouseX, mouseY);

    // Adjust camera offset to keep mouse position stable
    cameraOffset.current.x += (worldAfterZoom.x - worldBeforeZoom.x) * zoom.current;
    cameraOffset.current.y += (worldAfterZoom.y - worldBeforeZoom.y) * zoom.current;

    console.log('🔍 Zoom:', { level: newZoom.toFixed(2), percent: (newZoom * 100).toFixed(0) + '%' });
  };

  const handleZoomIn = () => {
    zoom.current = Math.min(5, zoom.current * 1.2);
    setZoomLevel(zoom.current);
  };

  const handleZoomOut = () => {
    zoom.current = Math.max(0.1, zoom.current / 1.2);
    setZoomLevel(zoom.current);
  };

  const handleResetView = () => {
    zoom.current = 1;
    cameraOffset.current = { x: 0, y: 0 };
    setZoomLevel(1);
    console.log('🎯 View reset');
  };

  return (
    <div className="w-full h-full relative bg-space-dark">
      {/* Zoom Controls - Top Left */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-space-dark/80 backdrop-blur-sm p-3 rounded-lg border border-space-light/30">
        <button
          onClick={handleZoomIn}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors font-bold text-lg"
          title="Zoom In"
        >
          +
        </button>
        <div className="text-center text-sm text-gray-300 font-mono">
          {(zoomLevel * 100).toFixed(0)}%
        </div>
        <button
          onClick={handleZoomOut}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors font-bold text-lg"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={handleResetView}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-xs"
          title="Reset View"
        >
          🎯 Reset
        </button>
      </div>

      {/* Status Bar - Bottom Center */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-space-dark/80 backdrop-blur-sm px-6 py-3 rounded-lg border border-space-light/30">
        <div className="text-center text-sm text-gray-300">
          {isRunning ? (
            <span className="text-yellow-400">🚀 Simulation running...</span>
          ) : isDragging ? (
            <span className="text-purple-400">🎯 Release to launch projectile!</span>
          ) : (
            <div className="flex items-center gap-4">
              <span>🖱️ <strong>Left-click + drag</strong> to launch</span>
              <span className="text-gray-600">|</span>
              <span>🖱️ <strong>Right-click</strong> to pan</span>
              <span className="text-gray-600">|</span>
              <span>🔍 <strong>Wheel</strong> to zoom</span>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Canvas */}
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  );
};

export default PhysicsCanvas;
