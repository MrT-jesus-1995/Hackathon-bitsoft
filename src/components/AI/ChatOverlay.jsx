import React, { useState, useEffect } from 'react';
import { getAIExplanation } from '../../utils/api';
import { isAPIKeyConfigured } from '../../utils/helpers';

const ChatOverlay = ({ context, onClose }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExplanation = async () => {
      // Check if API key is configured
      if (!isAPIKeyConfigured()) {
        setExplanation(
          "🔑 **OpenAI API Key Not Configured**\n\n" +
          "To enable AI-powered explanations:\n\n" +
          "1. Create a `.env` file in the project root\n" +
          "2. Add your OpenAI API key:\n" +
          "   ```\n" +
          "   REACT_APP_OPENAI_API_KEY=your_key_here\n" +
          "   ```\n" +
          "3. Restart the development server\n\n" +
          "Get your API key at: https://platform.openai.com/api-keys"
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getAIExplanation(context);
        setExplanation(result);
      } catch (err) {
        console.error('AI explanation error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [context]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-space-medium to-space-dark rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border-2 border-space-accent/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">🤖</span>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Physics Tutor</h2>
              <p className="text-sm text-purple-100">Understanding your simulation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-400 animate-pulse">Generating explanation...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-2">⚠️ Error</p>
              <p className="text-gray-300 text-sm">{error}</p>
              <p className="text-gray-400 text-xs mt-2">
                Make sure your OpenAI API key is valid and has sufficient credits.
              </p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="bg-space-light/30 rounded-lg p-6 border border-space-accent/20">
                {/* Outcome Badge */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    context?.outcome === 'orbit' ? 'bg-green-500/20 text-green-400' :
                    context?.outcome === 'escape' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {context?.outcome === 'orbit' ? '✨ Stable Orbit' :
                     context?.outcome === 'escape' ? '🚀 Gravity Slingshot' :
                     '💥 Impact'}
                  </span>
                </div>

                {/* AI Explanation */}
                <div className="text-gray-200 space-y-4 whitespace-pre-wrap">
                  {explanation}
                </div>
              </div>

              {/* Simulation Data */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-space-dark/50 rounded-lg p-3 border border-space-light/10">
                  <p className="text-xs text-gray-500">Distance</p>
                  <p className="text-lg font-mono text-blue-400">
                    {context?.data?.distance?.toFixed(2)} units
                  </p>
                </div>
                <div className="bg-space-dark/50 rounded-lg p-3 border border-space-light/10">
                  <p className="text-xs text-gray-500">Speed</p>
                  <p className="text-lg font-mono text-green-400">
                    {context?.data?.speed?.toFixed(2)} u/s
                  </p>
                </div>
                <div className="bg-space-dark/50 rounded-lg p-3 border border-space-light/10">
                  <p className="text-xs text-gray-500">Kinetic Energy</p>
                  <p className="text-lg font-mono text-yellow-400">
                    {context?.data?.kineticEnergy?.toFixed(2)}
                  </p>
                </div>
                <div className="bg-space-dark/50 rounded-lg p-3 border border-space-light/10">
                  <p className="text-xs text-gray-500">Potential Energy</p>
                  <p className="text-lg font-mono text-purple-400">
                    {context?.data?.potentialEnergy?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-space-dark/50 p-4 border-t border-space-light/20">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Powered by OpenAI GPT-4o-mini
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
