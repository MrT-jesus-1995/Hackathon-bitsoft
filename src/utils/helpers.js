/**
 * Helper utility functions
 */

/**
 * Format number with specified decimal places
 */
export function formatNumber(num, decimals = 2) {
  if (typeof num !== 'number') return '0.00';
  return num.toFixed(decimals);
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Map value from one range to another
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Get color based on outcome
 */
export function getOutcomeColor(outcome) {
  switch (outcome) {
    case 'orbit':
      return '#4ade80'; // green
    case 'escape':
      return '#fbbf24'; // yellow
    case 'crash':
      return '#ef4444'; // red
    case 'timeout':
      return '#a855f7'; // purple
    default:
      return '#94a3b8'; // gray
  }
}

/**
 * Get outcome emoji
 */
export function getOutcomeEmoji(outcome) {
  switch (outcome) {
    case 'orbit':
      return '✨';
    case 'escape':
      return '🚀';
    case 'crash':
      return '💥';
    case 'timeout':
      return '⏱️';
    default:
      return '🌟';
  }
}

/**
 * Get outcome description
 */
export function getOutcomeDescription(outcome) {
  switch (outcome) {
    case 'orbit':
      return 'Stable Orbit Achieved!';
    case 'escape':
      return 'Gravity Slingshot Escape!';
    case 'crash':
      return 'Crashed into Planet';
    case 'timeout':
      return 'Time Limit Reached';
    default:
      return 'Ready to Launch';
  }
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if API key is configured
 */
export function isAPIKeyConfigured() {
  return !!process.env.REACT_APP_OPENAI_API_KEY && 
         process.env.REACT_APP_OPENAI_API_KEY !== 'your_openai_api_key_here';
}

export default {
  formatNumber,
  degreesToRadians,
  radiansToDegrees,
  clamp,
  lerp,
  mapRange,
  getOutcomeColor,
  getOutcomeEmoji,
  getOutcomeDescription,
  debounce,
  isAPIKeyConfigured,
};
