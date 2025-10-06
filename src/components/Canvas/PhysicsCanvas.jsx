import React, { useEffect, useRef, useState } from 'react';
import { PhysicsEngine, Vector2D } from '../../utils/physics';
import { degreesToRadians } from '../../utils/helpers';

const PhysicsCanvas = ({ params, onSimulationComplete, onTrajectoryUpdate, isRunning }) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const animationRef = useRef(null);
  const [mousePos, setMousePos] = useState(null);
  const [launchStart, setLaunchStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const WIDTH = 800;
  const HEIGHT = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initialize physics engine
    const planetPos = new Vector2D(WIDTH / 2, HEIGHT / 2);
    engineRef.current = new PhysicsEngine({
      gravity: params.gravity,
      planetMass: 1000,
      planetRadius: 50,
      timeStep: 0.1,
      planetPos,
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

  // Handle simulation running state
  useEffect(() => {
    if (isRunning && engineRef.current) {
      const launchAngle = degreesToRadians(params.angle);
      const launchSpeed = params.launchPower * 2;
      
      // Calculate launch position (offset from planet)
      const startDistance = 150;
      const startX = WIDTH / 2 + Math.cos(launchAngle) * startDistance;
      const startY = HEIGHT / 2 + Math.sin(launchAngle) * startDistance;
      const startPos = new Vector2D(startX, startY);
      
      // Calculate velocity perpendicular to radius for better orbits
      const velAngle = launchAngle + Math.PI / 2;
      const velocity = new Vector2D(
        Math.cos(velAngle) * launchSpeed,
        Math.sin(velAngle) * launchSpeed
      );
      
      engineRef.current.launch(startPos, velocity);
    }
  }, [isRunning, params]);

  // Physics update loop
  useEffect(() => {
    if (!isRunning) return;

    const updateInterval = setInterval(() => {
      if (engineRef.current && engineRef.current.isActive) {
        engineRef.current.update();
        onTrajectoryUpdate(engineRef.current.trajectory);

        // Check if simulation ended
        if (!engineRef.current.isActive && engineRef.current.outcome) {
          const data = engineRef.current.getData();
          onSimulationComplete(engineRef.current.outcome, data);
          clearInterval(updateInterval);
        }
      }
    }, 16); // ~60 FPS

    return () => clearInterval(updateInterval);
  }, [isRunning, onSimulationComplete, onTrajectoryUpdate]);

  const drawScene = (ctx) => {
    const engine = engineRef.current;
    if (!engine) return;

    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw stars background
    drawStars(ctx);

    // Draw planet
    drawPlanet(ctx, engine.planetPos.x, engine.planetPos.y, engine.planetRadius);

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
    if (isDragging && launchStart && mousePos) {
      drawLaunchPreview(ctx, launchStart, mousePos);
    }

    // Draw orbit guides
    drawOrbitGuides(ctx, engine.planetPos.x, engine.planetPos.y);
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

  const drawPlanet = (ctx, x, y, radius) => {
    // Glow effect
    const gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2);
    gradient.addColorStop(0, 'rgba(74, 95, 193, 0.3)');
    gradient.addColorStop(1, 'rgba(74, 95, 193, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Planet body
    const planetGradient = ctx.createRadialGradient(x - 10, y - 10, 0, x, y, radius);
    planetGradient.addColorStop(0, '#6b7fd7');
    planetGradient.addColorStop(1, '#4a5fc1');
    ctx.fillStyle = planetGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Planet outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow head
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const arrowLength = 15;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
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
    setLaunchStart({ x, y });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseUp = (e) => {
    if (!isDragging || !launchStart || !mousePos) return;
    
    // Calculate launch parameters from drag
    // This is just for visual feedback - actual launch uses params
    setIsDragging(false);
    setLaunchStart(null);
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
        ) : (
          <span>⚙️ Adjust settings and click Launch to start</span>
        )}
      </div>
    </div>
  );
};

export default PhysicsCanvas;
