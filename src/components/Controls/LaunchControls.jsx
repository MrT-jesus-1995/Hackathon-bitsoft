import React from 'react';

const LaunchControls = ({ onLaunch, onReset, isRunning, params }) => {
  const handleLaunch = () => {
    if (!isRunning) {
      onLaunch(params.angle, params.launchPower);
    }
  };

  return (
    <div className="bg-space-medium/30 backdrop-blur-sm rounded-2xl p-6 border border-space-light/20">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="text-2xl mr-2">🚀</span>
        Launch Controls
      </h2>

      <div className="space-y-4">
        {/* Launch Button */}
        <button
          onClick={handleLaunch}
          disabled={isRunning}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
            isRunning
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 shadow-lg hover:shadow-green-500/50'
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
            '🚀 Launch Projectile'
          )}
        </button>

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
            <li>• 🎚️ Use Launch Power slider to adjust strength</li>
            <li>• 🎯 Try launching from different positions!</li>
          </ul>
        </div>

        {/* Current Settings Display */}
        <div className="mt-4 p-4 bg-gradient-to-br from-space-accent/20 to-purple-600/20 rounded-lg border border-space-accent/30">
          <h3 className="text-sm font-semibold text-white mb-2">Current Settings</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-space-dark/30 p-2 rounded">
              <span className="text-gray-400">Gravity:</span>
              <span className="ml-2 text-blue-400 font-mono">{params.gravity.toFixed(2)}</span>
            </div>
            <div className="bg-space-dark/30 p-2 rounded">
              <span className="text-gray-400">Power:</span>
              <span className="ml-2 text-green-400 font-mono">{params.launchPower.toFixed(1)}x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchControls;
