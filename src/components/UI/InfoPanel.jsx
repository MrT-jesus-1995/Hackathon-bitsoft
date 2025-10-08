import React from 'react';
import { getOutcomeColor, getOutcomeEmoji, getOutcomeDescription } from '../../utils/helpers';

const InfoPanel = ({ outcome, trajectoryLength, isRunning, isPaused, onPause, onResume, timeScale = 1, onTimeScaleChange }) => {
  const timeScales = [
    { value: -2, label: '◀◀', emoji: '⏪', description: 'Reverse 2×' },
    { value: -1, label: '◀', emoji: '◀️', description: 'Reverse' },
    { value: 0.25, label: '0.25×', emoji: '🐌', description: 'Slow Motion' },
    { value: 0.5, label: '0.5×', emoji: '🐢', description: 'Half Speed' },
    { value: 1, label: '1×', emoji: '▶️', description: 'Normal' },
    { value: 2, label: '2×', emoji: '⏩', description: 'Fast' },
    { value: 4, label: '4×', emoji: '⚡', description: 'Super Fast' }
  ];

  return (
    <div className="bg-space-medium/30 backdrop-blur-sm rounded-2xl p-6 border border-space-light/20">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="text-2xl mr-2">📊</span>
        Status
      </h2>

      {/* Time Control Panel */}
      {(isRunning || trajectoryLength > 0) && onTimeScaleChange && (
        <div className="mb-4 bg-space-dark/50 rounded-xl p-4 border border-space-light/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-300">⏱️ Time Control</span>
            <span className="text-xs text-blue-400 font-mono">
              {timeScales.find(s => s.value === timeScale)?.description || 'Normal'}
            </span>
          </div>

          {/* Playback Speed Buttons */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {timeScales.map((scale) => (
              <button
                key={scale.value}
                onClick={() => onTimeScaleChange(scale.value)}
                disabled={isPaused || (!isRunning && trajectoryLength === 0)}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                  timeScale === scale.value
                    ? scale.value < 0 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                      : 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : scale.value < 0
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300'
                      : 'bg-space-light/30 text-gray-400 hover:bg-space-light/50 hover:text-white'
                } ${(isPaused || (!isRunning && trajectoryLength === 0)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                title={scale.description}
              >
                <div className="text-base">{scale.emoji}</div>
                <div className="mt-1">{scale.label}</div>
              </button>
            ))}
          </div>

          {/* Pause/Resume Button */}
          {(onPause || onResume) && (isRunning || isPaused) && (
            <button
              onClick={isPaused ? onResume : onPause}
              className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-200 ${
                isPaused
                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                  : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30'
              }`}
            >
              {isPaused ? '▶️ Continue Simulation' : '⏸️ Pause Simulation'}
            </button>
          )}
        </div>
      )}

      {/* Outcome Display */}
      <div className="mb-4">
        <div
          className="p-4 rounded-xl border-2 transition-all duration-300"
          style={{
            backgroundColor: outcome ? `${getOutcomeColor(outcome)}20` : '#1a1f3a',
            borderColor: outcome ? getOutcomeColor(outcome) : '#2a3556',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl">{outcome ? getOutcomeEmoji(outcome) : '⏳'}</span>
            <div className="text-right">
              <p className="text-sm text-gray-400">Outcome</p>
              <p
                className="text-lg font-bold"
                style={{ color: outcome ? getOutcomeColor(outcome) : '#94a3b8' }}
              >
                {outcome ? getOutcomeDescription(outcome) : 'Waiting...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Stats */}
      <div className="space-y-3">
        <div className="bg-space-dark/50 rounded-lg p-3 border border-space-light/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Trajectory Points</span>
            <span className="text-lg font-mono text-blue-400">{trajectoryLength}</span>
          </div>
        </div>

        <div className="bg-space-dark/50 rounded-lg p-3 border border-space-light/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Simulation Time</span>
            <span className="text-lg font-mono text-green-400">
              {(trajectoryLength * 0.016).toFixed(2)}s
            </span>
          </div>
        </div>
      </div>

      {/* Info Tips */}
      {!outcome && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 <strong>Tip:</strong> Try different angles and power levels to achieve different outcomes!
          </p>
        </div>
      )}

      {outcome === 'orbit' && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-xs text-green-300">
            ✨ <strong>Great!</strong> You achieved a stable orbit. The projectile's velocity perfectly balances gravity.
          </p>
        </div>
      )}

      {outcome === 'escape' && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-300">
            🚀 <strong>Nice!</strong> The projectile escaped! It had enough velocity to overcome gravity.
          </p>
        </div>
      )}

      {outcome === 'crash' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-300">
            💥 <strong>Impact!</strong> Try increasing launch power or adjusting the angle for a different result.
          </p>
        </div>
      )}

      {outcome === 'timeout' && (
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-300">
            ⏱️ <strong>Time's up!</strong> The simulation reached the maximum time limit. Increase the time limit or try different parameters for a definitive result.
          </p>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
