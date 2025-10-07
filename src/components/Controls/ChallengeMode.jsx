import React, { useState } from 'react';
import { CONFIG } from '../../config';

const ChallengeMode = ({ onChallengeSelect, currentChallenge }) => {
  const [expanded, setExpanded] = useState(true); // Start expanded by default
  const challenges = CONFIG.challenges?.list || [];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 border-green-500/50';
      case 'Medium': return 'text-yellow-400 border-yellow-500/50';
      case 'Hard': return 'text-red-400 border-red-500/50';
      default: return 'text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="bg-space-medium/30 backdrop-blur-sm rounded-2xl p-6 border border-space-light/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="text-2xl mr-2">🏆</span>
          Challenge Mode
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Current Challenge Display */}
      {currentChallenge && (
        <div className="mb-4 p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-white">{currentChallenge.name}</h3>
            <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(currentChallenge.difficulty)}`}>
              {currentChallenge.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-2">{currentChallenge.description}</p>
          <div className="text-xs text-gray-400">
            💡 {currentChallenge.hint}
          </div>
          {currentChallenge.timeLimit && (
            <div className="mt-2 text-xs text-yellow-400">
              ⏱️ Time Limit: {(currentChallenge.timeLimit / 1000).toFixed(0)}s
            </div>
          )}
          <button
            onClick={() => onChallengeSelect(null)}
            className="mt-3 w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
          >
            ❌ Exit Challenge
          </button>
        </div>
      )}

      {/* Challenge List */}
      {expanded && !currentChallenge && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {challenges.length === 0 ? (
            <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30 text-center">
              <p className="text-red-400">⚠️ No challenges loaded</p>
              <p className="text-xs text-gray-400 mt-2">Check config.js for challenges.list</p>
            </div>
          ) : (
            challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 bg-space-dark/50 rounded-lg border border-space-light/20 hover:border-space-accent/50 hover:bg-space-dark/70 transition-all cursor-pointer"
                onClick={() => onChallengeSelect(challenge)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-md font-bold text-white">{challenge.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{challenge.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{challenge.reward}</span>
                  {challenge.goal === 'score' && (
                    <span className="text-purple-400">Target: {challenge.targetScore} pts</span>
                  )}
                  {challenge.goal === 'orbit' && (
                    <span className="text-blue-400">Orbit: {(challenge.requiredOrbitTime / 1000).toFixed(0)}s</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Info when collapsed and no challenge */}
      {!expanded && !currentChallenge && (
        <p className="text-sm text-gray-400">
          Click to select a challenge and test your skills!
        </p>
      )}
    </div>
  );
};

export default ChallengeMode;
