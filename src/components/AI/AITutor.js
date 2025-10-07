/**
 * AI Tutor Module
 * Handles AI-powered explanations and hints for physics simulations
 */

import { getAIExplanation, getQuickHint } from '../../utils/api';

export class AITutor {
  constructor() {
    this.conversationHistory = [];
  }

  /**
   * Get detailed explanation for simulation outcome
   */
  async explainSimulation(context) {
    try {
      const explanation = await getAIExplanation(context);
      this.conversationHistory.push({
        type: 'explanation',
        context,
        response: explanation,
        timestamp: new Date(),
      });
      return explanation;
    } catch (error) {
      console.error('Error getting AI explanation:', error);
      throw error;
    }
  }

  /**
   * Get a quick hint about a physics topic
   */
  async getHint(topic) {
    try {
      const hint = await getQuickHint(topic);
      this.conversationHistory.push({
        type: 'hint',
        topic,
        response: hint,
        timestamp: new Date(),
      });
      return hint;
    } catch (error) {
      console.error('Error getting hint:', error);
      throw error;
    }
  }

  /**
   * Generate suggested parameters for different outcomes
   */
  suggestParameters(desiredOutcome) {
    const suggestions = {
      orbit: {
        gravity: 1.2,
        launchPower: 6.5,
        angle: 75,
        description: 'These settings should create a stable orbit around the planet.',
      },
      escape: {
        gravity: 0.8,
        launchPower: 12,
        angle: 45,
        description: 'High velocity will help the projectile escape the planet\'s gravity.',
      },
      crash: {
        gravity: 2.0,
        launchPower: 3,
        angle: 90,
        description: 'Low velocity and high gravity will pull the projectile into the planet.',
      },
    };

    return suggestions[desiredOutcome] || null;
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Analyze trajectory and provide insights
   */
  analyzeTrajectory(trajectory, outcome) {
    const insights = {
      trajectoryLength: trajectory.length,
      outcome,
      timeElapsed: trajectory.length * 0.016, // Assuming 60 FPS
    };

    // Calculate trajectory characteristics
    if (trajectory.length > 2) {
      const startPos = trajectory[0];
      const endPos = trajectory[trajectory.length - 1];
      const totalDistance = Math.sqrt(
        Math.pow(endPos.x - startPos.x, 2) + 
        Math.pow(endPos.y - startPos.y, 2)
      );
      insights.totalDistance = totalDistance;
    }

    return insights;
  }
}

export default AITutor;
