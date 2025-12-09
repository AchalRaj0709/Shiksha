# MindEase - Mental Wellness Module

A comprehensive mental health and wellness module for the Shiksha educational platform, providing students with tools for stress management, meditation, and motivation.

## Features

### 🌬️ Breathing Exercises
- Guided 4-7-8 breathing technique
- Visual animation with breathing circle
- Play/Pause/Reset controls
- Keyboard shortcuts (Space, Escape)
- Cycle counter

### 🧘 Mindfulness & Meditation
- 10 guided meditation sessions (5-15 minutes)
- Audio player with progress tracking
- Visual audio visualizer
- Session categories: Quick Relief, Focus, Stress Relief, Deep Relaxation, Energy, Sleep, Exam Prep
- Keyboard controls (Space, Escape, Arrow keys)

### 💡 Study Pressure Management
- 30 categorized study tips
- Pomodoro timer (25:5 work/break cycle)
- Visual timer with progress circle
- Shuffle tips functionality
- Session statistics tracking

### ✨ Motivational Resources
- 55+ inspirational quotes
- Random quote generator
- Daily affirmations
- Copy-to-clipboard functionality
- Keyboard shortcut (R key)

## Installation

### 1. Install Dependencies

```bash
cd server/mental-health
npm install
```

### 2. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on **http://localhost:3001**

## API Endpoints

### GET /api/quotes
Returns a random motivational quote.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "text": "Success is not final...",
    "author": "Winston Churchill"
  }
}
```

### GET /api/tips?shuffle=true
Returns all study tips, optionally shuffled.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "category": "Time Management",
      "title": "Use the Pomodoro Technique",
      "description": "Study for 25 minutes...",
      "icon": "⏰"
    }
  ]
}
```

### GET /api/meditations
Returns all meditation sessions.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Quick Calm - 5 Minutes",
      "duration": 5,
      "description": "A brief guided meditation...",
      "category": "Quick Relief",
      "audioUrl": "...",
      "benefits": ["Reduces anxiety", "Improves focus"]
    }
  ]
}
```

## Page Routes

- **GET /wellbeing** - Main dashboard
- **GET /wellbeing/breathing** - Breathing exercises
- **GET /wellbeing/meditation** - Meditation sessions
- **GET /wellbeing/tips** - Study tips & Pomodoro timer
- **GET /wellbeing/quotes** - Motivational quotes

## Integration with Main Shiksha App

### Option 1: Standalone Server (Recommended)

The mental health module runs as a separate Express server on port 3001.

**Update MindEaseButton.jsx:**
```javascript
const handleClick = () => {
    window.location.href = 'http://localhost:3001/wellbeing';
};
```

### Option 2: Mount as Express Router

If you want to integrate into your main server:

```javascript
// In your main server.js
const mentalHealthRoutes = require('./mental-health/server');
app.use('/wellbeing', mentalHealthRoutes);
```

## File Structure

```
mental-health/
├── data/
│   ├── quotes.json          # 55 motivational quotes
│   ├── tips.json            # 30 study tips
│   └── meditations.json     # 10 meditation sessions
├── public/
│   ├── css/
│   │   └── styles.css       # Comprehensive responsive styles
│   └── js/
│       ├── main.js          # Common utilities
│       ├── breathing.js     # Breathing exercise logic
│       ├── meditation.js    # Audio player logic
│       ├── tips.js          # Tips & Pomodoro timer
│       └── quotes.js        # Quote refresh logic
├── views/
│   ├── layout.ejs           # Base template
│   ├── dashboard.ejs        # Main dashboard
│   ├── breathing.ejs        # Breathing page
│   ├── meditation.ejs       # Meditation page
│   ├── tips.ejs             # Tips page
│   └── quotes.ejs           # Quotes page
├── server.js                # Express server
├── package.json             # Dependencies
└── README.md                # This file
```

## Technologies Used

- **Backend:** Node.js, Express.js
- **Template Engine:** EJS
- **Frontend:** Vanilla JavaScript (no frameworks)
- **Styling:** Pure CSS with gradients and animations
- **Audio:** HTML5 Audio API
- **Notifications:** Web Audio API for sounds

## Design Features

- ✨ Soft gradient color scheme (Purple, Blue, Teal)
- 🎨 Card-based responsive layout
- 🌊 Smooth animations and transitions
- 📱 Mobile-first responsive design
- ♿ Keyboard shortcuts for accessibility
- 🔔 Visual and audio notifications
- 💫 Glassmorphism effects

## Keyboard Shortcuts

### Breathing Page
- `Space` - Start/Pause breathing
- `Escape` - Reset

### Meditation Page
- `Space` - Play/Pause audio
- `Escape` - Close player
- `←` - Rewind 10 seconds
- `→` - Forward 10 seconds

### Quotes Page
- `R` - Refresh quote

## Customization

### Adding More Quotes
Edit `data/quotes.json` and add new quote objects:
```json
{
  "id": 56,
  "text": "Your quote here",
  "author": "Author Name"
}
```

### Adding More Tips
Edit `data/tips.json` and add new tip objects with categories.

### Adding Meditation Sessions
Edit `data/meditations.json` and add new sessions with audio URLs.

### Changing Timer Duration
In `public/js/tips.js`, modify:
```javascript
const FOCUS_TIME = 25 * 60;  // Change 25 to desired minutes
const BREAK_TIME = 5 * 60;   // Change 5 to desired minutes
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Part of the Shiksha Educational Platform

## Support

For issues or questions, please contact the Shiksha development team.

---

**Remember:** Your mental health matters. Take breaks, practice self-care, and don't hesitate to seek help when needed. 💙
