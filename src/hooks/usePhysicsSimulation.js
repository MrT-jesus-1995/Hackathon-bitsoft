import { useState, useEffect, useRef, useCallback } from 'react';
import { PhysicsEngine, Vector2D } from '../utils/physics';
import { degreesToRadians } from '../utils/helpers';

/**
 * Custom hook for managing physics simulation
 */
export function usePhysicsSimulation(params) {
  const [simulationState, setSimulationState] = useState({
    isRunning: false,
    trajectory: [],
    outcome: null,
  });

  const engineRef = useRef(null);

  useEffect(() => {
    // Initialize physics engine
    engineRef.current = new PhysicsEngine({
      gravity: params.gravity,
      planetMass: 1000,
      planetRadius: 50,
      planetPos: new Vector2D(400, 300),
    });
  }, []);

  useEffect(() => {
    // Update gravity when params change
    if (engineRef.current) {
      engineRef.current.setGravity(params.gravity);
    }
  }, [params.gravity]);

  const launch = useCallback(() => {
    if (!engineRef.current) return;

    const launchAngle = degreesToRadians(params.angle);
    const launchSpeed = params.launchPower * 2;
    
    const startDistance = 150;
    const startX = 400 + Math.cos(launchAngle) * startDistance;
    const startY = 300 + Math.sin(launchAngle) * startDistance;
    const startPos = new Vector2D(startX, startY);
    
    const velAngle = launchAngle + Math.PI / 2;
    const velocity = new Vector2D(
      Math.cos(velAngle) * launchSpeed,
      Math.sin(velAngle) * launchSpeed
    );
    
    engineRef.current.launch(startPos, velocity);
    setSimulationState({
      isRunning: true,
      trajectory: [],
      outcome: null,
    });
  }, [params]);

  const reset = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.reset();
    }
    setSimulationState({
      isRunning: false,
      trajectory: [],
      outcome: null,
    });
  }, []);

  return {
    simulationState,
    launch,
    reset,
    engine: engineRef.current,
  };
}

/**
 * Custom hook for AI explanations
 */
export function useAIExplanation() {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getExplanation = useCallback(async (context, getAIExplanationFn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAIExplanationFn(context);
      setExplanation(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearExplanation = useCallback(() => {
    setExplanation(null);
    setError(null);
  }, []);

  return {
    explanation,
    loading,
    error,
    getExplanation,
    clearExplanation,
  };
}

export default {
  usePhysicsSimulation,
  useAIExplanation,
};
