import React, { useEffect, useRef, useState } from 'react';
import { PhysicsEngine, Vector2D } from '../../utils/physics';
import { degreesToRadians } from '../../utils/helpers';
import { CONFIG } from '../../config';

const PhysicsCanvas = ({ params, onSimulationComplete, onTrajectoryUpdate, isRunning, onLaunchFromCanvas }) => {
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

  const WIDTH = 800;
  const HEIGHT = 600;

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
      // Use mouse launch data if available, otherwise fallback to angle-based
      if (lastLaunchData.current) {
        console.log('✅ Using mouse launch data:', lastLaunchData.current);
        engineRef.current.launch(lastLaunchData.current.position, lastLaunchData.current.velocity);
      } else {
        console.log('⚠️ Using fallback angle-based launch');
        // Fallback to angle-based launch (for Launch button)
        const launchAngle = degreesToRadians(params.angle || 45);
        const launchSpeed = params.launchPower * 2;
        
        // Calculate launch position (offset from first planet)
        const startDistance = 150;
        const firstPlanet = engineRef.current.planets[0];
        const planetX = firstPlanet.pos.x;
        const planetY = firstPlanet.pos.y;
        
        const startX = planetX + Math.cos(launchAngle) * startDistance;
        const startY = planetY + Math.sin(launchAngle) * startDistance;
        const startPos = new Vector2D(startX, startY);
        
        // Calculate velocity perpendicular to radius for better orbits
        const velAngle = launchAngle + Math.PI / 2;
        const velocity = new Vector2D(
          Math.cos(velAngle) * launchSpeed,
          Math.sin(velAngle) * launchSpeed
        );
        
        engineRef.current.launch(startPos, velocity);
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

  const drawScene = (ctx) => {
    const engine = engineRef.current;
    if (!engine) return;

    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

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
      drawProjectile(ctx, pos.x, pos.y);
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Planet name label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x, y + radius + 15);
  };

  const drawTrajectory = (ctx, trajectory, outcome) => {
    if (trajectory.length < 2) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    // Color based on outcome
    let color = 'rgba(148, 163, 184, 0.6)'; // default gray
    if (outcome === 'orbit') color = 'rgba(74, 222, 128, 0.8)';
    else if (outcome === 'escape') color = 'rgba(251, 191, 36, 0.8)';
    else if (outcome === 'crash') color = 'rgba(239, 68, 68, 0.8)';

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(trajectory[0].x, trajectory[0].y);
    
    for (let i = 1; i < trajectory.length; i++) {
      ctx.lineTo(trajectory[i].x, trajectory[i].y);
    }
    ctx.stroke();
  };

  const drawProjectile = (ctx, x, y) => {
    // Glow
    const glowGradient = ctx.createRadialGradient(x, y, 2, x, y, 10);
    glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Projectile
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawLaunchPreview = (ctx, start, end) => {
    console.log('🎨 Drawing launch preview', { start, end, isDragging: isDraggingRef.current });
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
      
      // Draw glow effect if enabled
      if (CONFIG.prediction.visual.glowEnabled) {
        ctx.save();
        ctx.shadowColor = outcomeColor;
        ctx.shadowBlur = CONFIG.prediction.visual.glowBlur;
        
        // Draw trajectory path as dashed line
        ctx.strokeStyle = outcomeColor;
        ctx.lineWidth = CONFIG.prediction.visual.lineWidth;
        ctx.setLineDash(CONFIG.prediction.visual.lineDash);
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
        ctx.arc(point.x, point.y, CONFIG.prediction.visual.dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Starting position circle (where projectile will spawn)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Launch direction line with gradient
    const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    gradient.addColorStop(0, 'rgba(74, 95, 193, 0.8)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.8)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow head (direction indicator)
    const angle = Math.atan2(dy, dx);
    const arrowLength = 20;
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
    
    // Power and outcome indicator text
    const powerPercent = Math.min(100, (distance / 3)).toFixed(0);
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
    
    ctx.fillText(outcomeText, (start.x + end.x) / 2, (start.y + end.y) / 2 - 15);
  };

  const drawOrbitGuides = (ctx, x, y) => {
    ctx.strokeStyle = 'rgba(74, 95, 193, 0.15)';
    ctx.lineWidth = 1;
    
    // Draw concentric circles as orbit guides
    [100, 150, 200, 250].forEach(radius => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  const handleMouseDown = (e) => {
    if (isRunning) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    launchStart.current = { x, y };
    mousePos.current = { x, y };
    cachedPrediction.current = null; // Clear cached prediction
    lastPredictionTime.current = 0; // Reset throttle timer
    isDraggingRef.current = true;
    setIsDragging(true);
    console.log('🎯 Mouse down - starting drag', { x, y });
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Always update mouse position (render loop will pick it up)
    mousePos.current = { x, y };
  };

  const handleMouseUp = (e) => {
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

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="bg-space-dark rounded-xl border-2 border-space-light/30 shadow-2xl cursor-crosshair"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div className="mt-4 text-center text-sm text-gray-400">
        {isRunning ? (
          <span className="text-yellow-400">🚀 Simulation running...</span>
        ) : isDragging ? (
          <span className="text-purple-400">🎯 Release to launch projectile!</span>
        ) : (
          <span>🖱️ Click and drag to set position and launch direction</span>
        )}
      </div>
    </div>
  );
};

export default PhysicsCanvas;
