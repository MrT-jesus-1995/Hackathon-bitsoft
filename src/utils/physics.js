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
    this.planetMass = config.planetMass || 1000;
    this.planetRadius = config.planetRadius || 50;
    this.timeStep = config.timeStep || 0.1;
    
    // Planet position (center of screen)
    this.planetPos = config.planetPos || new Vector2D(400, 300);
    
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
   * Calculate gravitational force between planet and projectile
   */
  calculateGravity() {
    const direction = this.planetPos.sub(this.projectile.pos);
    const distance = direction.mag();
    
    // Prevent division by zero and unrealistic forces
    const minDistance = this.planetRadius;
    const clampedDistance = Math.max(distance, minDistance);
    
    // F = G * (m1 * m2) / r^2
    const forceMagnitude = (this.G * this.planetMass * this.projectile.mass) / 
                           (clampedDistance * clampedDistance);
    
    const force = direction.normalize().mult(forceMagnitude);
    return force;
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
    const distance = this.projectile.pos.sub(this.planetPos).mag();
    
    // Crash: projectile hit the planet
    if (distance <= this.planetRadius) {
      this.outcome = 'crash';
      this.isActive = false;
      return;
    }
    
    // Escape: projectile is too far away
    const escapeDistance = 800; // Adjust based on canvas size
    if (distance > escapeDistance) {
      this.outcome = 'escape';
      this.isActive = false;
      return;
    }
    
    // Check for stable orbit (velocity perpendicular to gravity, consistent distance)
    if (this.trajectory.length > 100) {
      const recentDistances = this.trajectory.slice(-50).map(pos => 
        pos.sub(this.planetPos).mag()
      );
      
      const avgDistance = recentDistances.reduce((a, b) => a + b, 0) / recentDistances.length;
      const variance = recentDistances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / recentDistances.length;
      
      // If distance is relatively stable, consider it an orbit
      if (variance < 100 && avgDistance > this.planetRadius * 2) {
        this.outcome = 'orbit';
        // Don't stop the simulation for orbit, let it continue
      }
    }
  }

  /**
   * Get current simulation data
   */
  getData() {
    const distance = this.projectile.pos.sub(this.planetPos).mag();
    const speed = this.projectile.vel.mag();
    
    // Calculate orbital energy (kinetic + potential)
    const kineticEnergy = 0.5 * this.projectile.mass * speed * speed;
    const potentialEnergy = -(this.G * this.planetMass * this.projectile.mass) / distance;
    const totalEnergy = kineticEnergy + potentialEnergy;
    
    return {
      position: this.projectile.pos,
      velocity: this.projectile.vel,
      distance,
      speed,
      kineticEnergy,
      potentialEnergy,
      totalEnergy,
      trajectoryLength: this.trajectory.length,
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
}

export default PhysicsEngine;
