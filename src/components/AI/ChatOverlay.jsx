import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAIExplanation } from '../../utils/api';
import { isAPIKeyConfigured } from '../../utils/helpers';
import CONFIG from '../../config';

const ChatOverlay = ({ context, onClose }) => {
  const [explanation, setExplanation] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const [loadingDots, setLoadingDots] = useState('.');

  // Animated loading dots
  useEffect(() => {
    if (!loading) return;
    
    const interval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev === '...') return '.';
        return prev + '.';
      });
    }, CONFIG.ai.loadingDotsSpeed);

    return () => clearInterval(interval);
  }, [loading]);

  // Typing animation effect
  useEffect(() => {
    if (!explanation || typing || loading) return;
    
    setTyping(true);
    setDisplayedText('');
    
    let currentIndex = 0;
    const typingSpeed = CONFIG.ai.typingSpeed;
    
    const typeInterval = setInterval(() => {
      if (currentIndex < explanation.length) {
        setDisplayedText(explanation.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setTyping(false);
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [explanation, loading]);

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
        
        // Add minimum delay to show loading state (makes it feel more intentional)
        const [result] = await Promise.all([
          getAIExplanation(context),
          new Promise(resolve => setTimeout(resolve, CONFIG.ai.minLoadingTime))
        ]);
        
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
            <span className="text-4xl">🚀</span>
            <div>
              <h2 className="text-2xl font-bold text-white">Professor Orbit's Analysis</h2>
              <p className="text-sm text-purple-100">Your personal orbital mechanics tutor</p>
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
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">🤖</span>
                </div>
              </div>
              <p className="text-gray-400 mt-6 text-lg font-medium">
                AI is thinking{loadingDots}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Analyzing your simulation data
              </p>
              <div className="mt-4 flex space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
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
                  {typing && (
                    <span className="text-xs text-gray-500 flex items-center">
                      <span className="animate-pulse">AI is typing...</span>
                    </span>
                  )}
                </div>

                {/* AI Explanation with typing effect and markdown rendering */}
                <div className="text-gray-200 markdown-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Custom styling for markdown elements
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-4 mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mt-3 mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-purple-300 mt-2 mb-1" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="ml-2" {...props} />,
                      code: ({node, inline, ...props}) => 
                        inline 
                          ? <code className="bg-purple-900/30 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                          : <code className="block bg-space-dark/70 text-green-300 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-purple-300" {...props} />,
                      em: ({node, ...props}) => <em className="italic text-blue-300" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-3" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} target="_blank" rel="noopener noreferrer" />,
                      table: ({node, ...props}) => <table className="min-w-full border-collapse border border-gray-600 my-3" {...props} />,
                      thead: ({node, ...props}) => <thead className="bg-purple-900/30" {...props} />,
                      tbody: ({node, ...props}) => <tbody {...props} />,
                      tr: ({node, ...props}) => <tr className="border-b border-gray-700" {...props} />,
                      th: ({node, ...props}) => <th className="px-3 py-2 text-left text-purple-300 font-semibold border border-gray-600" {...props} />,
                      td: ({node, ...props}) => <td className="px-3 py-2 border border-gray-600" {...props} />,
                    }}
                  >
                    {displayedText}
                  </ReactMarkdown>
                  {typing && (
                    <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse"></span>
                  )}
                </div>

                {/* Skip typing button */}
                {typing && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setDisplayedText(explanation);
                        setTyping(false);
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 px-3 py-1 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all"
                    >
                      ⏩ Skip typing animation
                    </button>
                  </div>
                )}
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
        <div className="bg-gradient-to-r from-space-dark via-purple-900/20 to-space-dark p-4 border-t border-space-accent/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">
                💡 Did you know? {[
                  'Earth orbits the Sun at 30 km/s!',
                  'Voyager 1 used gravity assists to reach interstellar space!',
                  'ISS travels at 28,000 km/h in constant free fall!',
                  'Gravity assists can double spacecraft velocity without fuel!',
                ][Math.floor(Math.random() * 4)]}
              </p>
              <p className="text-xs text-gray-600">
                Powered by OpenAI GPT-4o-mini 🤖
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              🎯 Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
