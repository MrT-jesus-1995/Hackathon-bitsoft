import React from 'react';

const Dashboard = ({ simulationState }) => {
  const { outcome, isRunning } = simulationState;

  return (
    <div className="flex items-center space-x-4">
      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          isRunning ? 'bg-yellow-400 animate-pulse' : 
          outcome ? 'bg-green-400' : 'bg-gray-400'
        }`}></div>
        <span className="text-sm text-gray-300">
          {isRunning ? 'Running' : outcome ? 'Complete' : 'Ready'}
        </span>
      </div>

      {/* Quick Stats */}
      {outcome && (
        <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-space-dark/30 rounded-lg border border-space-light/20">
          <div className="text-center">
            <p className="text-xs text-gray-500">Result</p>
            <p className="text-sm font-semibold text-white capitalize">{outcome}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
