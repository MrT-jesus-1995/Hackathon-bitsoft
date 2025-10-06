# ⏱️ AI Timing Configuration Guide

## Overview

The Gravity Slingshot Simulator now includes configurable timing for AI responses, ensuring GPT has enough time to generate quality explanations.

## 🎯 What's Been Added

### 1. **AI Response Timeout**
- **Default**: 60 seconds (60,000ms)
- **Purpose**: Gives OpenAI's GPT model sufficient time to analyze simulation data and generate comprehensive explanations
- **Location**: `src/config.js` → `CONFIG.ai.apiTimeout`

### 2. **Typing Animation**
- **Default**: 15ms per character (~66 characters/second)
- **Purpose**: Creates a natural "AI is thinking" effect as text appears
- **Location**: `src/config.js` → `CONFIG.ai.typingSpeed`
- **Features**:
  - Animated cursor during typing
  - "Skip typing" button to instantly show full response
  - Smooth character-by-character display

### 3. **Minimum Loading Time**
- **Default**: 1 second (1,000ms)
- **Purpose**: Ensures users see the loading animation, making the AI feel more intentional
- **Location**: `src/config.js` → `CONFIG.ai.minLoadingTime`

### 4. **Enhanced Loading UI**
- Animated robot icon 🤖
- Pulsing "AI is thinking..." text
- Bouncing dots indicator
- Dynamic loading message with animated ellipsis

## 🔧 How to Configure

### Option 1: Edit Config File (Recommended)

Open `src/config.js` and modify the `ai` section:

```javascript
ai: {
  // Timeout for AI API calls (milliseconds)
  apiTimeout: 60000, // Change this value
  
  // Minimum loading time to show (milliseconds)
  minLoadingTime: 1000, // Change this value
  
  // Typing animation speed (milliseconds per character)
  typingSpeed: 15, // Lower = faster, Higher = slower
  
  // Loading dots animation speed
  loadingDotsSpeed: 500, // Speed of "..." animation
},
```

### Option 2: Environment Variables

Add to your `.env` file:

```env
# Optional: Increase timeout if you get timeout errors
REACT_APP_AI_TIMEOUT=90000

# Optional: Use a different AI model
REACT_APP_AI_MODEL=gpt-4o
```

## 📊 Timing Recommendations

### For Different Use Cases:

#### **Fast Experience** (Quick responses)
```javascript
ai: {
  apiTimeout: 30000,      // 30 seconds
  minLoadingTime: 500,    // 0.5 seconds
  typingSpeed: 5,         // Very fast typing
  loadingDotsSpeed: 300,
}
```

#### **Balanced** (Default - Recommended)
```javascript
ai: {
  apiTimeout: 60000,      // 60 seconds
  minLoadingTime: 1000,   // 1 second
  typingSpeed: 15,        // Natural typing speed
  loadingDotsSpeed: 500,
}
```

#### **Patient/Detailed** (For complex explanations)
```javascript
ai: {
  apiTimeout: 120000,     // 2 minutes
  minLoadingTime: 2000,   // 2 seconds
  typingSpeed: 25,        // Slower, more dramatic
  loadingDotsSpeed: 700,
}
```

#### **Instant** (No animations)
```javascript
ai: {
  apiTimeout: 60000,      // 60 seconds
  minLoadingTime: 0,      // No minimum
  typingSpeed: 0,         // Instant display (set to 0)
  loadingDotsSpeed: 500,
}
```

## 🐛 Troubleshooting

### Problem: "Request timeout" errors

**Solution**: Increase `apiTimeout`
```javascript
apiTimeout: 90000, // Try 90 seconds
```

### Problem: Typing animation too slow

**Solution**: Decrease `typingSpeed`
```javascript
typingSpeed: 5, // Faster typing
```

### Problem: Loading screen flashes too quickly

**Solution**: Increase `minLoadingTime`
```javascript
minLoadingTime: 2000, // Show for at least 2 seconds
```

### Problem: Want to skip animations entirely

**Solution**: Set typing speed to 0 and min loading to 0
```javascript
minLoadingTime: 0,
typingSpeed: 0, // Shows full text immediately
```

## 💡 Advanced Features

### Skip Typing Button

Users can click "⏩ Skip typing animation" during text display to see the full response immediately.

### Animated Loading States

The loading screen includes:
- Spinning robot icon
- Dynamic "AI is thinking..." text
- Bouncing color dots
- Progress indicators

### Smart Timeouts

The system uses `Promise.all()` to ensure:
- API response completes fully
- Minimum loading time is respected
- User never sees a flash of loading screen

## 🎨 UI Indicators

### During Loading:
- 🤖 Spinning robot icon
- "AI is thinking..." with animated dots
- Three bouncing colored dots

### During Typing:
- Character-by-character text reveal
- Blinking purple cursor
- "AI is typing..." badge
- Skip button available

### Complete:
- Full text displayed
- No cursor or animations
- Ready for user interaction

## 📝 Code Examples

### Example 1: Disable Typing Animation

```javascript
// In src/config.js
ai: {
  typingSpeed: 0, // Set to 0 to disable
}
```

### Example 2: Longer Timeout for Complex Models

```javascript
// In src/config.js
ai: {
  apiTimeout: 120000, // 2 minutes for GPT-4
}
```

### Example 3: Skip Minimum Loading

```javascript
// In src/config.js
ai: {
  minLoadingTime: 0, // Show results immediately
}
```

## 🚀 Best Practices

1. **Keep timeout reasonable**: 60s is usually enough for most responses
2. **Match typing speed to content**: Faster for short texts, slower for drama
3. **Test with your API key**: Different models have different response times
4. **Consider user patience**: Balance polish vs speed
5. **Provide skip option**: Always let users skip animations

## 📚 Related Files

- `src/config.js` - Main configuration
- `src/components/AI/ChatOverlay.jsx` - AI chat component
- `src/utils/api.js` - API integration with timeout
- `.env` - Environment variables

## 🎉 Result

Your users now get:
- ✅ Reliable AI responses with proper timeouts
- ✅ Smooth typing animations
- ✅ Professional loading states
- ✅ Control to skip animations
- ✅ Clear feedback at every stage

---

**Need to adjust timing? Just edit `src/config.js` and restart the server!**
