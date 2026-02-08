# 💕 Valentine's Day Interactive Website

A romantic, fully-featured interactive website with a 3D game, a personalized photo gallery, a smart music player, and playful proposal interaction. Built with HTML5, CSS3, Bootstrap 5, and Three.js.

## ✨ Key Features

### 🎮 **3D Heart Collection Game**
- Three.js powered 3D environment with 1280x720 canvas
- Zigzag heart spawning patterns for dynamic gameplay  
- Keyboard controls (←/→ arrow keys) for character movement

### 🎵 **Smart Music Player**
- Autoplay functionality with browser policy compliance
- Custom pink-themed UI with heart icons (💖💗🌸)
- Progress bar with click-to-seek functionality
- Volume control and mute toggle
- Shuffles between "Melancholic Walk" and "A Lonely Cherry Tree"
- Fixed-position bottom-left placement to avoid UI conflicts

### 📸 **Personalized Photo Gallery**
- Polaroid-style photo frames with romantic captions
- Staggered animation sequence for visual appeal
- Personal images (1.png through 6.png) with custom messages
- Responsive design maintaining aspect ratios

### 💕 **Interactive Proposal**
- Intelligent "No" button evasion that avoids overlapping "Yes" button
- Progressive pleading messages with emotional escalation
- Smart positioning algorithm with 10px buffer zones
- Celebration confetti effects on acceptance
- Mobile-friendly touch interactions

### 🎨 **Custom Theming**
- Pixelify Sans font for retro gaming aesthetic
- Custom kitty cursor theme from KittyCursorTheme assets
- Pink Valentine's color palette throughout
- Smooth CSS animations and transitions

## 📁 Project Structure

```
Valentines-Webn/
├── index.html                 # Main HTML file with music player integration
├── css/
│   └── style.css             # Complete styling with pink theme & custom fonts
├── js/
│   ├── main.js               # Entry point and global variables
│   ├── background.js         # Three.js particle system with heart.png sprites
│   ├── navigation.js         # Section management and SPA transitions
│   ├── gallery.js            # Polaroid gallery animations
│   ├── game.js              # 3D Heart Collection game with Three.js
│   ├── proposal.js           # Smart proposal with anti-overlap "No" button
│   ├── events.js             # Event listeners and handlers
│   ├── audio.js             # Music player with autoplay & progress controls
│   ├── mobile.js            # Mobile optimizations and touch controls
│   └── utils.js             # Utility functions and helpers
├── assets/
│   ├── images/               # Personal photos (1.png - 6.png) for gallery
│   ├── misc/
│   │   └── heart.png         # Heart sprite for game particles
│   ├── audio/
│   │   ├── Melancholic Walk.mp3      # Background music track 1
│   │   └── A Lonely Cherry Tree.mp3  # Background music track 2
│   └── game/
│       └── KittyCursorTheme/ # Custom cursor assets
└── README.md                 # Project documentation
```



## 🛠️ Tech Stack

- **Three.js**: 3D game engine and particle systems
- **HTML5**: Semantic structure with modern web standards
- **CSS3**: Custom animations and styling
- **Bootstrap**: Responsive grid system and components
- **Canvas Confetti**: Celebration animations and effects
- **Web Audio API**: Background music playback and controls
- **Modular JavaScript**: Clean, maintainable ES6+ architecture

## 📚 JavaScript Modules

- `main.js`: Application entry point and global state management
- `background.js`: Three.js particle system with heart.png texture loading
- `navigation.js`: Smooth SPA section transitions and routing
- `gallery.js`: Polaroid animation sequences and timing
- `game.js`: Complete 3D heart collection game with Three.js integration  
- `proposal.js`: Interactive proposal with intelligent button evasion logic
- `events.js`: Centralized event management and delegation
- `audio.js`: Music player with autoplay, progress, and volume controls
- `mobile.js`: Touch optimizations and responsive behavior
- `utils.js`: Helper functions and utility methods

## 🎮 Game Controls

- **Arrow Keys (←/→)**: Move character left and right
- **Space Bar**: Play/pause music player
- **Ctrl + ←/→**: Previous/next music track  
- **Ctrl + S**: Toggle music shuffle mode
- **Mouse/Touch**: Interactive proposal buttons and progress seeking

## 💖 Customization Features

- **Personal Photos**: Upload 6 images as 1.png through 6.png for gallery
- **Music Tracks**: Add MP3 files to assets/audio/ directory
- **Custom Cursors**: KittyCursorTheme integration for unique pointer styles
- **Pink Theme**: Consistent Valentine's color palette with CSS variables
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🚀 Quick Start

1. **Clone or download** the project files
2. **Add your photos** as 1.png through 6.png in `assets/images/`
3. **Add music files** to `assets/audio/` (MP3 format recommended)
4. **Open index.html** in a web browser
5. **Enjoy** your personalized Valentine's experience!

## 🌟 Browser Compatibility

- **Chrome 90+**: Full feature support including autoplay
- **Firefox 88+**: Complete functionality with manual music start
- **Safari 14+**: Works with user interaction for audio
- **Edge 90+**: Full compatibility and performance
- **Mobile Browsers**: Touch-optimized with responsive design

## 🎨 Assets & Credits

### 🎵 **Music**
- "A Lonely Cherry Tree" by **Pix**
- "Melancholic Walk" by **Pix**

### 🖱️ **Cursor Theme**
- "Kitty Cursor" by **KagamiShea**

*Built with love for Valentine's Day 2026* 💕  

