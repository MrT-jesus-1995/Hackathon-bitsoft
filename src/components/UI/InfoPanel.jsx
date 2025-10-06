import React from 'react';
import { getOutcomeColor, getOutcomeEmoji, getOutcomeDescription } from '../../utils/helpers';

const InfoPanel = ({ outcome, trajectoryLength }) => {
  return (
    <div className="bg-space-medium/30 backdrop-blur-sm rounded-2xl p-6 border border-space-light/20">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="text-2xl mr-2">📊</span>
        Status
      </h2>

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
    </div>
  );
};

export default InfoPanel;
