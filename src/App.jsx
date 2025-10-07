import React, { useState } from 'react';
import PhysicsCanvas from './components/Canvas/PhysicsCanvas';
import LaunchControls from './components/Controls/LaunchControls';
import SimulationControls from './components/Controls/SimulationControls';
import PlanetControls from './components/Controls/PlanetControls';
import ChatOverlay from './components/AI/ChatOverlay';
import Dashboard from './components/UI/Dashboard';
import InfoPanel from './components/UI/InfoPanel';
import CONFIG from './config';

function App() {
  // Initialize with single planet from config
  const [planets, setPlanets] = useState(
    CONFIG.planets.scenarios.single.planets
  );

  const [simulationParams, setSimulationParams] = useState({
    gravity: 1.0,
    launchPower: 5,
    angle: 45,
    maxSimulationTime: CONFIG.simulation.maxSimulationTime,
    planets: planets, // Add planets to simulation params
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

  const handleLaunchFromCanvas = (position, velocity) => {
    // Launch triggered from canvas drag - just start the simulation
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

  const handlePlanetsChange = (newPlanets) => {
    setPlanets(newPlanets);
    setSimulationParams(prev => ({ ...prev, planets: newPlanets }));
  };

  const handleScenarioSelect = (scenarioPlanets) => {
    handlePlanetsChange(scenarioPlanets);
    // Reset simulation when changing planets
    handleReset();
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-space-medium to-space-dark flex flex-col">
      {/* Compact Header */}
      <header className="bg-space-medium/50 backdrop-blur-md border-b border-space-light/30 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🪐</div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Gravity Slingshot Simulator
              </h1>
              <p className="text-xs text-gray-400">
                Learn orbital mechanics with AI
              </p>
            </div>
          </div>
          <Dashboard simulationState={simulationState} />
        </div>
      </header>

      {/* Main Content - Fullscreen Canvas with Sidebar */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Fullscreen Canvas */}
        <div className="flex-1 relative">
          <PhysicsCanvas
            params={simulationParams}
            onSimulationComplete={handleSimulationComplete}
            onTrajectoryUpdate={(trajectory) => 
              setSimulationState(prev => ({ ...prev, trajectory }))
            }
            isRunning={simulationState.isRunning}
            onLaunchFromCanvas={handleLaunchFromCanvas}
          />
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-4 right-4 z-50 bg-space-medium/90 backdrop-blur-md hover:bg-space-medium text-white p-3 rounded-lg border border-space-light/30 transition-all duration-300 ${
            sidebarOpen ? 'mr-96' : ''
          }`}
          title={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        >
          {sidebarOpen ? '▶' : '◀'}
        </button>

        {/* Collapsible Sidebar */}
        <div
          className={`absolute top-0 right-0 h-full w-96 bg-space-dark/95 backdrop-blur-md border-l border-space-light/30 shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Controls</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Info Panel */}
            <InfoPanel 
              outcome={simulationState.outcome}
              trajectoryLength={simulationState.trajectory.length}
            />

            {/* Planet Controls */}
            <PlanetControls
              planets={planets}
              onPlanetsChange={handlePlanetsChange}
              onScenarioSelect={handleScenarioSelect}
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
    </div>
  );
}

export default App;
