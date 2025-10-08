import React, { useState } from 'react';
import CONFIG from '../../config';

const GameModeSelector = ({ currentMode, onModeChange, onPuzzleSelect, currentPuzzle, onChallengeSelect, currentChallenge }) => {
  const [expanded, setExpanded] = useState(true);

  const modes = [
    { id: 'free', name: 'Free Play', emoji: '🚀', description: 'Explore physics freely' },
    { id: 'target', name: 'Target Practice', emoji: '🎯', description: 'Hit specific targets' },
    { id: 'puzzle', name: 'Puzzle Mode', emoji: '🧩', description: 'Find exact solutions' },
    { id: 'challenge', name: 'Challenge Mode', emoji: '🏆', description: 'Test your skills' },
  ];

  return (
    <div className="bg-space-medium/30 backdrop-blur-sm rounded-2xl p-6 border border-space-light/20">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-xl font-bold text-white mb-4"
      >
        <div className="flex items-center">
          <span className="text-2xl mr-2">🎮</span>
          Game Modes
        </div>
        <span className="text-gray-400">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="space-y-4">
          {/* Mode Selector */}
          <div className="grid grid-cols-1 gap-2">
            {modes.map(mode => (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  currentMode === mode.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-space-light/20 bg-space-dark/30 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span className="text-xl">{mode.emoji}</span>
                      {mode.name}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{mode.description}</p>
                  </div>
                  {currentMode === mode.id && (
                    <span className="text-green-400">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Puzzle Selection (when puzzle mode active) */}
          {currentMode === 'puzzle' && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-400">Select Puzzle</h3>
              {CONFIG.gameModes.puzzleMode.puzzles.map(puzzle => (
                <button
                  key={puzzle.id}
                  onClick={() => onPuzzleSelect(puzzle)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    currentPuzzle?.id === puzzle.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-space-light/20 bg-space-dark/30 hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{puzzle.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      puzzle.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      puzzle.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {puzzle.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{puzzle.description}</p>
                  {currentPuzzle?.id === puzzle.id && (
                    <div className="mt-2 space-y-2">
                      <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                        <p className="text-xs text-blue-300 font-semibold mb-1">Starting Parameters:</p>
                        <div className="flex gap-3 text-xs">
                          <span className="text-gray-300">Gravity: <span className="text-blue-400">{puzzle.startGravity}</span></span>
                          <span className="text-gray-300">Power: <span className="text-green-400">{puzzle.startPower}</span></span>
                        </div>
                      </div>
                      <p className="text-blue-400 text-xs">
                        💡 {puzzle.hint}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Attempts remaining: {CONFIG.gameModes.puzzleMode.attemptsRemaining || puzzle.allowedAttempts}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Challenge Selection (when challenge mode active) */}
          {currentMode === 'challenge' && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-400">Select Challenge</h3>
              {CONFIG.challenges.list.map(challenge => (
                <button
                  key={challenge.id}
                  onClick={() => onChallengeSelect(challenge)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    currentChallenge?.id === challenge.id
                      ? 'border-yellow-500 bg-yellow-500/20'
                      : 'border-space-light/20 bg-space-dark/30 hover:border-yellow-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{challenge.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{challenge.description}</p>
                  {currentChallenge?.id === challenge.id && (
                    <div className="mt-2 text-xs">
                      <p className="text-yellow-400">
                        🎯 {challenge.goal === 'orbit' ? 'Achieve stable orbit' : `Score ${challenge.targetScore} points`}
                      </p>
                      <p className="text-gray-500 mt-1">
                        💡 {challenge.hint}
                      </p>
                    </div>
                  )}
                </button>
              ))}
              
              {/* Exit Challenge Button */}
              {currentChallenge && (
                <button
                  onClick={() => onChallengeSelect(null)}
                  className="w-full mt-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  ❌ Exit Challenge
                </button>
              )}
            </div>
          )}

          {/* Target Practice Info */}
          {currentMode === 'target' && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <h3 className="text-sm font-semibold text-green-400 mb-2">🎯 Target Practice Active</h3>
              <p className="text-xs text-gray-300 mb-2">
                Hit the colored target zones to score points!
              </p>
              <div className="space-y-1">
                {CONFIG.gameModes.targetPractice.targets.map(target => (
                  <div key={target.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: target.color }}
                      ></div>
                      <span className="text-gray-300">{target.label}</span>
                    </div>
                    <span className="text-yellow-400 font-bold">{target.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameModeSelector;
