import React, { useState } from 'react';
import CONFIG from '../../config';

const PlanetControls = ({ planets, onPlanetsChange, onScenarioSelect }) => {
  const [selectedPlanetId, setSelectedPlanetId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const selectedPlanet = planets.find(p => p.id === selectedPlanetId);

  const handleScenarioChange = (scenarioKey) => {
    const scenario = CONFIG.planets.scenarios[scenarioKey];
    if (scenario) {
      onScenarioSelect(scenario.planets);
      setSelectedPlanetId(null);
      setEditMode(false);
    }
  };

  const handlePlanetUpdate = (property, value) => {
    if (!selectedPlanetId) return;
    
    const updatedPlanets = planets.map(planet => 
      planet.id === selectedPlanetId 
        ? { ...planet, [property]: parseFloat(value) || value }
        : planet
    );
    onPlanetsChange(updatedPlanets);
  };

  const handleAddPlanet = () => {
    const newId = `planet-${Date.now()}`;
    const newPlanet = {
      id: newId,
      x: 400,
      y: 300,
      ...CONFIG.planets.defaultPlanet,
      color: CONFIG.planets.colors[planets.length % CONFIG.planets.colors.length],
      name: `Planet ${planets.length + 1}`
    };
    onPlanetsChange([...planets, newPlanet]);
    setSelectedPlanetId(newId);
    setEditMode(true);
  };

  const handleRemovePlanet = (planetId) => {
    if (planets.length <= 1) {
      alert('Cannot remove the last planet!');
      return;
    }
    onPlanetsChange(planets.filter(p => p.id !== planetId));
    if (selectedPlanetId === planetId) {
      setSelectedPlanetId(null);
      setEditMode(false);
    }
  };

  const handleColorChange = (color) => {
    handlePlanetUpdate('color', color);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20 shadow-2xl">
      <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        🌍 Planet Configuration
      </h3>

      {/* Scenario Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Quick Scenarios
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(CONFIG.planets.scenarios).map(([key, scenario]) => (
            <button
              key={key}
              onClick={() => handleScenarioChange(key)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-3 py-2 rounded-lg transition-all transform hover:scale-105 text-sm font-medium shadow-lg"
              title={scenario.description}
            >
              {scenario.name}
            </button>
          ))}
        </div>
      </div>

      {/* Planet List */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Active Planets ({planets.length})
          </label>
          <button
            onClick={handleAddPlanet}
            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
          >
            ➕ Add Planet
          </button>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {planets.map(planet => (
            <div
              key={planet.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                selectedPlanetId === planet.id
                  ? 'bg-purple-900/30 border-purple-400'
                  : 'bg-slate-700/50 border-slate-600 hover:border-purple-400/50'
              }`}
              onClick={() => {
                setSelectedPlanetId(planet.id);
                setEditMode(true);
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white"
                  style={{ backgroundColor: planet.color }}
                />
                <div>
                  <div className="text-white font-medium">{planet.name}</div>
                  <div className="text-gray-400 text-xs">
                    Mass: {planet.mass} | Radius: {planet.radius}
                  </div>
                </div>
              </div>
              {planets.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePlanet(planet.id);
                  }}
                  className="text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded hover:bg-red-900/30 transition-all"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Panel */}
      {editMode && selectedPlanet && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-400/30 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-bold text-purple-300">
              Edit {selectedPlanet.name}
            </h4>
            <button
              onClick={() => setEditMode(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={selectedPlanet.name}
              onChange={(e) => handlePlanetUpdate('name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Position X */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Position X: {selectedPlanet.x}
            </label>
            <input
              type="range"
              min={CONFIG.planets.limits.x.min}
              max={CONFIG.planets.limits.x.max}
              step={CONFIG.planets.limits.x.step}
              value={selectedPlanet.x}
              onChange={(e) => handlePlanetUpdate('x', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Position Y */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Position Y: {selectedPlanet.y}
            </label>
            <input
              type="range"
              min={CONFIG.planets.limits.y.min}
              max={CONFIG.planets.limits.y.max}
              step={CONFIG.planets.limits.y.step}
              value={selectedPlanet.y}
              onChange={(e) => handlePlanetUpdate('y', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Mass */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Mass: {selectedPlanet.mass}
            </label>
            <input
              type="range"
              min={CONFIG.planets.limits.mass.min}
              max={CONFIG.planets.limits.mass.max}
              step={CONFIG.planets.limits.mass.step}
              value={selectedPlanet.mass}
              onChange={(e) => handlePlanetUpdate('mass', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Radius */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Radius: {selectedPlanet.radius}
            </label>
            <input
              type="range"
              min={CONFIG.planets.limits.radius.min}
              max={CONFIG.planets.limits.radius.max}
              step={CONFIG.planets.limits.radius.step}
              value={selectedPlanet.radius}
              onChange={(e) => handlePlanetUpdate('radius', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {CONFIG.planets.colors.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 ${
                    selectedPlanet.color === color
                      ? 'border-white shadow-lg scale-110'
                      : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={selectedPlanet.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="mt-2 w-full h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 text-xs text-gray-400 bg-slate-800/30 p-3 rounded-lg">
        💡 <strong>Tip:</strong> Click a planet to edit its properties. Try different scenarios to explore multi-body physics!
      </div>
    </div>
  );
};

export default PlanetControls;
