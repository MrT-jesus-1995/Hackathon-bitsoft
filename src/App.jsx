import React, { useState } from 'react';
import PhysicsCanvas from './components/Canvas/PhysicsCanvas';
import LaunchControls from './components/Controls/LaunchControls';
import SimulationControls from './components/Controls/SimulationControls';
import ChatOverlay from './components/AI/ChatOverlay';
import Dashboard from './components/UI/Dashboard';
import InfoPanel from './components/UI/InfoPanel';

function App() {
  const [simulationParams, setSimulationParams] = useState({
    gravity: 1.0,
    launchPower: 5,
    angle: 45,
  });

  const [simulationState, setSimulationState] = useState({
    isRunning: false,
    trajectory: [],
    outcome: null, // 'orbit', 'escape', 'crash'
  });

  const [showAI, setShowAI] = useState(false);
  const [aiContext, setAiContext] = useState(null);

  const handleLaunch = (angle, power) => {
    setSimulationParams(prev => ({ ...prev, angle, launchPower: power }));
    setSimulationState(prev => ({ ...prev, isRunning: true, trajectory: [] }));
  };

  const handleReset = () => {
    setSimulationState({
      isRunning: false,
      trajectory: [],
      outcome: null,
    });
    setShowAI(false);
  };

  const handleSimulationComplete = (outcome, data) => {
    setSimulationState(prev => ({ ...prev, outcome, isRunning: false }));
    setAiContext({ outcome, data, params: simulationParams });
    setShowAI(true);
  };

  const handleParamChange = (param, value) => {
    setSimulationParams(prev => ({ ...prev, [param]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-space-medium to-space-dark">
      {/* Header */}
      <header className="bg-space-medium/50 backdrop-blur-md border-b border-space-light/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🪐</div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Gravity Slingshot Simulator
                </h1>
                <p className="text-sm text-gray-400">
                  Learn orbital mechanics with AI
                </p>
              </div>
            </div>
            <Dashboard simulationState={simulationState} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas Section - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-space-medium/30 backdrop-blur-sm rounded-2xl p-6 border border-space-light/20">
              <PhysicsCanvas
                params={simulationParams}
                onSimulationComplete={handleSimulationComplete}
                onTrajectoryUpdate={(trajectory) => 
                  setSimulationState(prev => ({ ...prev, trajectory }))
                }
                isRunning={simulationState.isRunning}
              />
            </div>
          </div>

          {/* Controls Section */}
          <div className="space-y-6">
            {/* Info Panel */}
            <InfoPanel 
              outcome={simulationState.outcome}
              trajectoryLength={simulationState.trajectory.length}
            />

            {/* Simulation Controls */}
            <SimulationControls
              params={simulationParams}
              onParamChange={handleParamChange}
              disabled={simulationState.isRunning}
            />

            {/* Launch Controls */}
            <LaunchControls
              onLaunch={handleLaunch}
              onReset={handleReset}
              isRunning={simulationState.isRunning}
              params={simulationParams}
            />

            {/* AI Button */}
            {simulationState.outcome && (
              <button
                onClick={() => setShowAI(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🤖 Explain This With AI
              </button>
            )}
          </div>
        </div>
      </main>

      {/* AI Chat Overlay */}
      {showAI && (
        <ChatOverlay
          context={aiContext}
          onClose={() => setShowAI(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-gray-500 text-sm">
        <p>Made with ❤️ for learning physics through interactive simulation</p>
        <p className="mt-2">Powered by OpenAI • Built with React & p5.js</p>
      </footer>
    </div>
  );
}

export default App;
