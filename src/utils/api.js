/**
 * API helper functions for OpenAI integration
 */

import axios from 'axios';
import CONFIG from '../config';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const AI_MODEL = process.env.REACT_APP_AI_MODEL || 'gpt-4o-mini';

/**
 * Generate AI explanation for physics simulation
 */
export async function getAIExplanation(context) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const { outcome, data, params } = context;

  // Build system prompt
  const systemPrompt = `You are a friendly physics tutor specializing in orbital mechanics. 
Explain physics concepts in simple, engaging terms suitable for students. 
Use analogies and real-world examples. Be encouraging and enthusiastic about physics!`;

  // Build user prompt with simulation context
  const userPrompt = `
I just ran a gravity slingshot simulation with these parameters:
- Gravity strength: ${params.gravity}
- Launch angle: ${params.angle}°
- Launch power: ${params.launchPower}

The result was: ${outcome} (${outcome === 'orbit' ? 'stable orbit achieved' : outcome === 'escape' ? 'escaped the planet\'s gravity' : 'crashed into the planet'})

Simulation data:
- Final distance from planet: ${data.distance?.toFixed(2)} units
- Final speed: ${data.speed?.toFixed(2)} units/s
- Kinetic energy: ${data.kineticEnergy?.toFixed(2)}
- Potential energy: ${data.potentialEnergy?.toFixed(2)}
- Total energy: ${data.totalEnergy?.toFixed(2)}

Please explain:
1. Why did this outcome occur?
2. What physics principles are at play here?
3. What would happen if I changed one parameter?
4. Any interesting real-world examples of this phenomenon?

Keep it fun and educational!
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
        stream: false, // Ensure we get the complete response
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: CONFIG.ai.apiTimeout, // Configurable timeout to give GPT time to respond
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get AI explanation: ' + error.message);
  }
}

/**
 * Get quick physics hint
 */
export async function getQuickHint(topic) {
  if (!OPENAI_API_KEY) {
    return 'Configure your OpenAI API key to get AI hints!';
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful physics tutor. Give brief, clear explanations.'
          },
          {
            role: 'user',
            content: `Give me a quick tip about ${topic} in orbital mechanics (2-3 sentences).`
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting hint:', error);
    return 'Unable to get hint at this time.';
  }
}

export default {
  getAIExplanation,
  getQuickHint,
};
