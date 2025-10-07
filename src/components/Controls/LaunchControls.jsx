import React from 'react';

const LaunchControls = ({ onReset, isRunning, params, lastLaunch, onRepeatLaunch }) => {
  return (
    <div className="bg-space-medium/30 backdrop-blur-sm rounded-2xl p-6 border border-space-light/20">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="text-2xl mr-2">🚀</span>
        Launch Controls
      </h2>

      <div className="space-y-4">
        {/* Repeat Last Launch Button - Only show if there was a previous launch */}
        {lastLaunch && (
          <button
            onClick={onRepeatLaunch}
            disabled={isRunning}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
              isRunning
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:scale-105 shadow-lg hover:shadow-orange-500/50'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Simulating...
              </span>
            ) : (
              '� Repeat Last Launch'
            )}
          </button>
        )}

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="w-full py-3 px-6 rounded-xl font-semibold bg-space-light hover:bg-space-accent text-white transition-all duration-300"
        >
          🔄 Reset Simulation
        </button>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-space-dark/50 rounded-lg border border-space-light/10">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">💡 How to Launch</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• 🖱️ <strong>Click & Drag</strong> on canvas to set position & direction</li>
            <li>• 📏 Drag length = launch velocity</li>
            <li>• 🔁 Use <strong>Repeat Last Launch</strong> to test parameter changes</li>
            <li>• 🎯 Try launching from different positions!</li>
          </ul>
        </div>

        {/* Last Launch Info - Only show if there was a launch */}
        {lastLaunch && (
          <div className="mt-4 p-4 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-lg border border-orange-500/30">
            <h3 className="text-sm font-semibold text-white mb-2">📍 Last Launch</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-space-dark/30 p-2 rounded">
                <span className="text-gray-400">Position:</span>
                <span className="ml-2 text-orange-400 font-mono">
                  ({lastLaunch.position.x.toFixed(0)}, {lastLaunch.position.y.toFixed(0)})
                </span>
              </div>
              <div className="bg-space-dark/30 p-2 rounded">
                <span className="text-gray-400">Velocity:</span>
                <span className="ml-2 text-red-400 font-mono">
                  {Math.sqrt(lastLaunch.velocity.x ** 2 + lastLaunch.velocity.y ** 2).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchControls;
