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
        emoji: '🎯',
        description: '🎯 Perfect orbit setup! Try dragging from the side of the planet with medium power.',
        tip: 'Aim perpendicular to the planet for the smoothest orbit!',
      },
      escape: {
        gravity: 0.8,
        launchPower: 12,
        emoji: '🚀',
        description: '🚀 Escape velocity! Drag far back for maximum power to break free from gravity.',
        tip: 'The faster you go, the easier it is to escape!',
      },
      crash: {
        gravity: 2.0,
        launchPower: 3,
        emoji: '💥',
        description: '💥 Gravity wins! Low power and high gravity = guaranteed crash.',
        tip: 'Sometimes crashing is the most fun outcome!',
      },
      slingshot: {
        gravity: 1.5,
        launchPower: 8,
        emoji: '🌊',
        description: '🌊 Slingshot maneuver! Swing around the planet to gain speed.',
        tip: 'Real spacecraft use this to save fuel!',
      },
    };

    return suggestions[desiredOutcome] || null;
  }

  /**
   * Get a random fun space fact
   */
  getRandomSpaceFact() {
    const facts = [
      '🌍 Did you know? Earth itself is in a gravity slingshot around the Sun at 30 km/s!',
      '🚀 Voyager 1 used gravity assists from Jupiter and Saturn to reach interstellar space!',
      '🌙 The Apollo missions had to be precise within seconds for lunar orbit insertion!',
      '⚡ A slingshot maneuver can double a spacecraft\'s velocity without using any fuel!',
      '🪐 Cassini used 4 gravity assists (2 Venus, 1 Earth, 1 Jupiter) to reach Saturn!',
      '💫 Every satellite in orbit is constantly "falling" - it just keeps missing the Earth!',
      '🎯 The ISS travels at 28,000 km/h but feels weightless because it\'s in free fall!',
      '🌟 Black holes can slingshot objects at nearly the speed of light!',
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  }

  /**
   * Generate achievement messages for cool outcomes
   */
  generateAchievement(trajectory, outcome) {
    const achievements = [];
    
    if (outcome === 'orbit' && trajectory.length > 500) {
      achievements.push('🏆 Long-Duration Orbit Achieved!');
    }
    if (outcome === 'escape' && trajectory.length < 100) {
      achievements.push('⚡ Speed Demon - Ultra-Fast Escape!');
    }
    if (trajectory.length > 1000) {
      achievements.push('⏰ Marathon Orbit - 1000+ frames!');
    }
    
    return achievements;
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
