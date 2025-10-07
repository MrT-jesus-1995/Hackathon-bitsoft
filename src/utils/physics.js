/**
 * Physics Engine for Gravity Slingshot Simulator
 * Handles gravitational calculations, trajectories, and orbital mechanics
 */

export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  mult(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  div(scalar) {
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const m = this.mag();
    if (m !== 0) {
      return this.div(m);
    }
    return new Vector2D(0, 0);
  }

  limit(max) {
    if (this.mag() > max) {
      return this.normalize().mult(max);
    }
    return new Vector2D(this.x, this.y);
  }

  copy() {
    return new Vector2D(this.x, this.y);
  }
}

export class PhysicsEngine {
  constructor(config = {}) {
    // Physics constants
    this.G = config.gravity || 1.0; // Gravitational constant
    this.timeStep = config.timeStep || 0.1;
    
    // Multiple planets support
    this.planets = config.planets || [{
      id: 'planet-1',
      pos: config.planetPos || new Vector2D(400, 300),
      mass: config.planetMass || 1000,
      radius: config.planetRadius || 50,
      color: '#4a5fc1',
      name: 'Planet 1'
    }];
    
    // Backwards compatibility - convert old single planet to array
    if (config.planetPos && !config.planets) {
      this.planets = [{
        id: 'planet-1',
        pos: config.planetPos,
        mass: config.planetMass || 1000,
        radius: config.planetRadius || 50,
        color: '#4a5fc1',
        name: 'Planet 1'
      }];
    }
    
    // Projectile properties
    this.projectile = {
      pos: new Vector2D(0, 0),
      vel: new Vector2D(0, 0),
      acc: new Vector2D(0, 0),
      mass: 1,
      radius: 5,
    };
    
    // Trajectory tracking
    this.trajectory = [];
    this.maxTrajectoryPoints = 500;
    
    // Simulation state
    this.isActive = false;
    this.outcome = null;
  }

  /**
   * Calculate combined gravitational force from all planets
   */
  calculateGravity() {
    let totalForce = new Vector2D(0, 0);
    
    // Sum gravitational forces from all planets
    for (const planet of this.planets) {
      const direction = planet.pos.sub(this.projectile.pos);
      const distance = direction.mag();
      
      // Prevent division by zero and unrealistic forces
      const minDistance = planet.radius;
      const clampedDistance = Math.max(distance, minDistance);
      
      // F = G * (m1 * m2) / r^2
      const forceMagnitude = (this.G * planet.mass * this.projectile.mass) / 
                             (clampedDistance * clampedDistance);
      
      const force = direction.normalize().mult(forceMagnitude);
      totalForce = totalForce.add(force);
    }
    
    return totalForce;
  }
  
  /**
   * Add a new planet to the simulation
   */
  addPlanet(planet) {
    const newPlanet = {
      id: planet.id || `planet-${Date.now()}`,
      pos: planet.pos || new Vector2D(400, 300),
      mass: planet.mass || 1000,
      radius: planet.radius || 50,
      color: planet.color || '#4a5fc1',
      name: planet.name || `Planet ${this.planets.length + 1}`
    };
    this.planets.push(newPlanet);
    return newPlanet;
  }
  
  /**
   * Remove a planet by ID
   */
  removePlanet(planetId) {
    const index = this.planets.findIndex(p => p.id === planetId);
    if (index > -1) {
      this.planets.splice(index, 1);
    }
  }
  
  /**
   * Update a planet's properties
   */
  updatePlanet(planetId, updates) {
    const planet = this.planets.find(p => p.id === planetId);
    if (planet) {
      Object.assign(planet, updates);
    }
  }
  
  /**
   * Get all planets
   */
  getPlanets() {
    return this.planets;
  }

  /**
   * Initialize projectile launch
   */
  launch(startPos, velocity) {
    this.projectile.pos = startPos.copy();
    this.projectile.vel = velocity.copy();
    this.projectile.acc = new Vector2D(0, 0);
    this.trajectory = [startPos.copy()];
    this.isActive = true;
    this.outcome = null;
  }

  /**
   * Update physics simulation for one time step
   */
  update() {
    if (!this.isActive) return;

    // Calculate gravitational force
    const gravity = this.calculateGravity();
    
    // F = ma, so a = F/m
    this.projectile.acc = gravity.div(this.projectile.mass);
    
    // Update velocity and position (Euler integration)
    this.projectile.vel = this.projectile.vel.add(this.projectile.acc.mult(this.timeStep));
    this.projectile.pos = this.projectile.pos.add(this.projectile.vel.mult(this.timeStep));
    
    // Add to trajectory
    this.trajectory.push(this.projectile.pos.copy());
    
    // Limit trajectory length for performance
    if (this.trajectory.length > this.maxTrajectoryPoints) {
      this.trajectory.shift();
    }
    
    // Check for collision or escape
    this.checkOutcome();
  }

  /**
   * Check if simulation has reached an outcome
   */
  checkOutcome() {
    // Check collision with any planet
    for (const planet of this.planets) {
      const distance = this.projectile.pos.sub(planet.pos).mag();
      
      // Crash: projectile hit a planet
      if (distance <= planet.radius) {
        this.outcome = 'crash';
        this.isActive = false;
        return;
      }
    }
    
    // Escape: projectile is too far from all planets
    const escapeDistance = 1000; // Increased for multiple planets
    let isNearAnyPlanet = false;
    
    for (const planet of this.planets) {
      const distance = this.projectile.pos.sub(planet.pos).mag();
      if (distance < escapeDistance) {
        isNearAnyPlanet = true;
        break;
      }
    }
    
    if (!isNearAnyPlanet) {
      this.outcome = 'escape';
      this.isActive = false;
      return;
    }
    
    // Check for stable orbit around any planet
    if (this.trajectory.length > 100) {
      for (const planet of this.planets) {
        const recentDistances = this.trajectory.slice(-50).map(pos => 
          pos.sub(planet.pos).mag()
        );
        
        const avgDistance = recentDistances.reduce((a, b) => a + b, 0) / recentDistances.length;
        const variance = recentDistances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / recentDistances.length;
        
        // If distance is relatively stable around this planet, consider it an orbit
        if (variance < 100 && avgDistance > planet.radius * 2) {
          this.outcome = 'orbit';
          // Don't stop the simulation for orbit, let it continue
          break;
        }
      }
    }
  }

  /**
   * Get current simulation data
   */
  getData() {
    const speed = this.projectile.vel.mag();
    
    // Calculate kinetic energy
    const kineticEnergy = 0.5 * this.projectile.mass * speed * speed;
    
    // Calculate total potential energy from all planets
    let totalPotentialEnergy = 0;
    let closestDistance = Infinity;
    let closestPlanet = this.planets[0];
    
    for (const planet of this.planets) {
      const distance = this.projectile.pos.sub(planet.pos).mag();
      const planetPotentialEnergy = -(this.G * planet.mass * this.projectile.mass) / distance;
      totalPotentialEnergy += planetPotentialEnergy;
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlanet = planet;
      }
    }
    
    const totalEnergy = kineticEnergy + totalPotentialEnergy;
    
    return {
      position: this.projectile.pos,
      velocity: this.projectile.vel,
      distance: closestDistance,
      closestPlanet: closestPlanet.name,
      speed,
      kineticEnergy,
      potentialEnergy: totalPotentialEnergy,
      totalEnergy,
      trajectoryLength: this.trajectory.length,
      planetCount: this.planets.length,
    };
  }

  /**
   * Reset simulation
   */
  reset() {
    this.projectile = {
      pos: new Vector2D(0, 0),
      vel: new Vector2D(0, 0),
      acc: new Vector2D(0, 0),
      mass: 1,
      radius: 5,
    };
    this.trajectory = [];
    this.isActive = false;
    this.outcome = null;
  }

  /**
   * Update gravity constant
   */
  setGravity(g) {
    this.G = g;
  }

  /**
   * Calculate escape velocity for current position
   */
  getEscapeVelocity(distance) {
    // v_escape = sqrt(2 * G * M / r)
    return Math.sqrt((2 * this.G * this.planetMass) / distance);
  }

  /**
   * Calculate orbital velocity for circular orbit at distance
   */
  getOrbitalVelocity(distance) {
    // v_orbital = sqrt(G * M / r)
    return Math.sqrt((this.G * this.planetMass) / distance);
  }

  /**
   * Predict trajectory path for preview
   * Simulates the projectile flight without affecting actual simulation state
   * Returns array of points and predicted outcome
   */
  predictTrajectory(startPos, velocity, options = {}) {
    const {
      maxSteps = 300,        // Maximum simulation steps
      timeStep = 0.1,        // Time step for prediction
      maxTime = 10,          // Maximum simulation time in seconds
      samplingRate = 3       // Only store every Nth point for performance
    } = options;

    const predictions = [];
    const maxIterations = Math.min(maxSteps, Math.floor(maxTime / timeStep));
    
    // Create temporary projectile state for prediction
    let pos = startPos.copy();
    let vel = velocity.copy();
    let outcome = null;
    let step = 0;
    
    // Store initial position
    predictions.push({
      pos: pos.copy(),
      vel: vel.copy(),
      step: 0
    });

    // Simulate trajectory
    for (let i = 0; i < maxIterations && !outcome; i++) {
      step++;
      
      // Calculate gravitational force from all planets
      let totalForce = new Vector2D(0, 0);
      
      for (const planet of this.planets) {
        const direction = planet.pos.sub(pos);
        const distance = direction.mag();
        
        // Check for collision
        if (distance <= planet.radius) {
          outcome = 'crash';
          break;
        }
        
        // Prevent division by zero
        const minDistance = planet.radius;
        const clampedDistance = Math.max(distance, minDistance);
        
        // F = G * (m1 * m2) / r^2
        const forceMagnitude = (this.G * planet.mass * this.projectile.mass) / 
                               (clampedDistance * clampedDistance);
        
        const force = direction.normalize().mult(forceMagnitude);
        totalForce = totalForce.add(force);
      }
      
      if (outcome === 'crash') break;
      
      // F = ma, so a = F/m
      const acc = totalForce.div(this.projectile.mass);
      
      // Update velocity and position (Euler integration)
      vel = vel.add(acc.mult(timeStep));
      pos = pos.add(vel.mult(timeStep));
      
      // Sample points for performance (only store every Nth point)
      if (i % samplingRate === 0) {
        predictions.push({
          pos: pos.copy(),
          vel: vel.copy(),
          step: step
        });
      }
      
      // Check for escape
      let isNearAnyPlanet = false;
      const escapeDistance = 1000;
      
      for (const planet of this.planets) {
        const distance = pos.sub(planet.pos).mag();
        if (distance < escapeDistance) {
          isNearAnyPlanet = true;
          break;
        }
      }
      
      if (!isNearAnyPlanet) {
        outcome = 'escape';
        break;
      }
      
      // Check for potential orbit (simplified check for preview)
      if (predictions.length > 50) {
        for (const planet of this.planets) {
          const recentDistances = predictions.slice(-20).map(p => 
            p.pos.sub(planet.pos).mag()
          );
          
          const avgDistance = recentDistances.reduce((a, b) => a + b, 0) / recentDistances.length;
          const variance = recentDistances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / recentDistances.length;
          
          if (variance < 150 && avgDistance > planet.radius * 2) {
            outcome = 'orbit';
            break;
          }
        }
      }
    }

    // If no outcome determined within steps, mark as unknown
    if (!outcome && step >= maxIterations) {
      outcome = 'unknown';
    }

    return {
      points: predictions.map(p => p.pos),
      outcome: outcome,
      stepCount: step,
      finalVelocity: vel,
      finalPosition: pos
    };
  }
}

export default PhysicsEngine;
