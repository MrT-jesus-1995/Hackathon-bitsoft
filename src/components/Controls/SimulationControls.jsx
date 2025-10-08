import React from 'react';
import CONFIG from '../../config';

const SimulationControls = ({ params, onParamChange, disabled }) => {
  // Format time for display
  const formatTime = (ms) => {
    if (ms >= 60000) {
      return `${(ms / 60000).toFixed(1)}m`;
    }
    return `${(ms / 1000).toFixed(0)}s`;
  };

  return (
    <div className="bg-space-medium/30 backdrop-blur-sm rounded-2xl p-6 border border-space-light/20">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="text-2xl mr-2">⚙️</span>
        Simulation Parameters
      </h2>

      <div className="space-y-6">
        {/* Gravity Control */}
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Gravitational Strength (G)</span>
            <span className="text-blue-400 font-mono">{params.gravity.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.1"
            value={params.gravity}
            onChange={(e) => onParamChange('gravity', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-space-light rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Weak</span>
            <span>Strong</span>
          </div>
        </div>

        {/* Launch Power Control */}
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Launch Power</span>
            <span className="text-green-400 font-mono">{params.launchPower.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={params.launchPower}
            onChange={(e) => onParamChange('launchPower', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-space-light rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Max Simulation Time Control */}
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
            <span>⏱️ Max Simulation Time</span>
            <span className="text-orange-400 font-mono">
              {formatTime(params.maxSimulationTime || CONFIG.simulation.maxSimulationTime)}
            </span>
          </label>
          <input
            type="range"
            min={CONFIG.simulation.ranges.maxTime.min}
            max={CONFIG.simulation.ranges.maxTime.max}
            step={CONFIG.simulation.ranges.maxTime.step}
            value={params.maxSimulationTime || CONFIG.simulation.maxSimulationTime}
            onChange={(e) => onParamChange('maxSimulationTime', parseInt(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-space-light rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5s</span>
            <span>1m</span>
            <span>2m</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Simulation will auto-stop after this time
          </p>
        </div>
      </div>

      {/* Quick presets */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Quick Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onParamChange('gravity', 50.0);
              onParamChange('launchPower', 5);
            }}
            disabled={disabled}
            className="px-3 py-2 bg-space-light/50 hover:bg-space-light text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            🎯 Default
          </button>
          <button
            onClick={() => {
              onParamChange('gravity', 0.5);
              onParamChange('launchPower', 8);
            }}
            disabled={disabled}
            className="px-3 py-2 bg-space-light/50 hover:bg-space-light text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            🌙 Low Gravity
          </button>
          <button
            onClick={() => {
              onParamChange('gravity', 2.0);
              onParamChange('launchPower', 10);
            }}
            disabled={disabled}
            className="px-3 py-2 bg-space-light/50 hover:bg-space-light text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            💪 High Gravity
          </button>
          <button
            onClick={() => {
              onParamChange('gravity', 1.2);
              onParamChange('launchPower', 6.5);
            }}
            disabled={disabled}
            className="px-3 py-2 bg-space-light/50 hover:bg-space-light text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            ⭕ Orbit Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
