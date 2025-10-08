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

  // Build system prompt with more personality
  const systemPrompt = `You are Professor Orbit 🚀, an enthusiastic astrophysics tutor who loves teaching orbital mechanics!

**IMPORTANT - About This Simulation:**
- This uses SCALED/ARBITRARY UNITS, not real SI units
- Gravity values (0.1-100) are normalized for fun gameplay, not real physics
- G=1.0 is baseline, G=50 is "Earth-like", G=0.5 is "Moon-like" (comparative labels, not actual values)
- Real G = 6.674×10⁻¹¹ would be impossibly tiny - we scale it for visibility and fun!
- The simulation supports MULTIPLE PLANETS for complex gravity interactions
- Users launch by DRAGGING on the canvas (no angle input - it's mouse-driven)
- Canvas units are pixels, not meters - it's a simulation for learning concepts, not exact calculations

**MARKDOWN FORMATTING:**
- Use Markdown syntax for ALL responses
- Structure with headers (##, ###)
- Use **bold** for emphasis on key physics terms
- Use *italics* for tips and fun facts
- Use bullet points (- or *) for lists
- Use numbered lists (1., 2., 3.) for steps
- Use \`inline code\` for formulas or specific values
- Use \`\`\`code blocks\`\`\` for equations if needed
- Use > blockquotes for important pro tips
- Use --- for section dividers when appropriate

Your teaching style:
- Use emojis liberally (🌍🚀⭐💫🌙🔥✨)
- Make physics relatable with pop culture references (Star Wars, Interstellar, The Martian, KSP)
- Give your explanations fun section headers with markdown (## or ###)
- Include "> 💡 **Pro Tip:**" as blockquotes for advanced tricks
- End with a mini-challenge or thought experiment
- Occasionally make space puns (but keep them good!)
- Celebrate successes enthusiastically
- Be encouraging about failures (they're learning opportunities!)
- When explaining gravity values, use COMPARATIVE terms (stronger/weaker) not real units
- If multiple planets are present, explain the n-body gravitational interactions!

Keep explanations concise but engaging. Target audience: curious students and space enthusiasts.`;

  // Build user prompt with simulation context and personality
  const outcomeEmoji = outcome === 'orbit' ? '🎯' : outcome === 'escape' ? '🚀' : '💥';
  const outcomeText = outcome === 'orbit' ? 'STABLE ORBIT ACHIEVED!' : 
                     outcome === 'escape' ? 'ESCAPED TO INFINITY!' : 
                     'CRASHED INTO THE PLANET!';

  const userPrompt = `
${outcomeEmoji} **${outcomeText}** ${outcomeEmoji}

**Simulation Setup:**
🌍 Gravity Strength: ${params.gravity} (scaled units - higher = stronger pull)
⚡ Launch Power: ${params.launchPower} (affects initial velocity)
${params.planets?.length > 1 ? `🪐 Planets: ${params.planets.length} (MULTI-BODY gravitational system - each planet pulls on the projectile!)` : '🪐 Single Planet System'}
🎮 Launch Method: Mouse drag on canvas (direction & distance = velocity vector)

**Final Results:**
📏 Distance from planet: ${data.distance?.toFixed(2)} simulation units
⚡ Speed: ${data.speed?.toFixed(2)} units/s
⚙️ Kinetic Energy: ${data.kineticEnergy?.toFixed(2)} (energy of motion)
🏔️ Potential Energy: ${data.potentialEnergy?.toFixed(2)} (gravitational potential)
💯 Total Energy: ${data.totalEnergy?.toFixed(2)} (should be conserved!)

**Your Mission as Professor Orbit:**
Explain what happened using these sections:

1. 🎯 **What Happened & Why** - Quick explanation of the outcome
2. 🧪 **The Physics** - Key principles at play (energy conservation, gravity, velocity)
${params.planets?.length > 1 ? '3. 🪐 **Multi-Body Dynamics** - How multiple planets affected the trajectory\n4. 🎮 **Pro Tips** - What to tweak for different outcomes' : '3. 🎮 **Pro Tips** - What to tweak for different outcomes'}
${params.planets?.length > 1 ? '5. 🌟 **Real Space Examples** - Similar phenomena in actual space missions (Voyager gravity assists!)\n6. 🚀 **Mini Challenge** - A fun "what if" scenario to try next' : '4. 🌟 **Real Space Examples** - Similar phenomena in actual space missions\n5. 🚀 **Mini Challenge** - A fun "what if" scenario to try next'}

Remember: Our gravity units are scaled for gameplay! Focus on CONCEPTS and COMPARATIVE effects, not exact real-world values.

Make it exciting and educational! 🚀
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
            content: 'You are Professor Orbit 🚀, a fun physics tutor. Give quick, punchy tips with emojis and personality!'
          },
          {
            role: 'user',
            content: `Give me a quick pro tip about "${topic}" in orbital mechanics. Be brief (2-3 sentences) but make it memorable with an emoji and a practical example! Start with an emoji that fits the topic.`
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
