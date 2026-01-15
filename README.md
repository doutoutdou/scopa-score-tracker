# Scopa Score Tracker

A vibrant, modern web application for tracking scores in the Italian card game Scopa. Built with React, TypeScript, and Tailwind CSS.

![Scopa Score Tracker](https://img.shields.io/badge/Scopa-Score%20Tracker-orange?style=for-the-badge)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-104%20Passing-success?style=flat-square)](./tests)

## ✨ Features

- 🎨 **Modern Italian-Themed UI** - Playful design with card game aesthetics, gradients, and smooth animations
- 🎯 **5 Scopa Scoring Rules** - Track all official scoring categories with custom icons
- 👥 **2-4 Players** - Perfect for small groups
- 💾 **Auto-Save** - Scores persist automatically using localStorage
- 📱 **Fully Responsive** - Works beautifully on mobile, tablet, and desktop
- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- ♿ **Accessible** - WCAG AA color contrast and keyboard navigation

## 🎮 Scoring Rules

Each scoring rule has its own dedicated button with custom icons:

1. **Scopa** 🧹 - Cleared the table (+1 point)
2. **Cards** 🃏 - Most cards (21+) (+1 point)
3. **Coins** 💰 - Most coins/diamonds (+1 point)
4. **Settebello** ✨ - 7 of coins (+1 point)
5. **Primiera** 🏆 - Best prime (+1 point)

## 🚀 Quick Start

### Prerequisites

- Node.js 24+ LTS
- npm 11+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173/
```

### Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Generate coverage report
npm run test:coverage

# Open Vitest UI
npm run test:ui
```

**Test Coverage**: 104 tests passing across unit and integration test suites.

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript 5.3
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React + Custom SVG icons
- **Testing**: Vitest + React Testing Library
- **State Management**: React Hooks + localStorage

## 📁 Project Structure

```
scopa-score-tracker/
├── src/
│   ├── components/       # React components
│   │   ├── icons/        # Custom SVG icons
│   │   ├── ScoreControl.tsx
│   │   ├── GameSetup.tsx
│   │   └── ...
│   ├── core/             # Business logic
│   ├── storage/          # localStorage persistence
│   ├── hooks/            # Custom React hooks
│   └── App.tsx           # Root component
├── tests/
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
└── public/               # Static assets
```

## 🎨 Design Features

- **Italian Flag Colors** - Red, white, and green accents
- **Card Suit Decorations** - ♠♣♥♦ pattern overlay
- **Gradient Backgrounds** - Warm Italian-inspired colors
- **Playful Font** - Fredoka display font for headings
- **Smooth Animations** - Float, wiggle, scale, and slide effects
- **Playing Card Aesthetic** - Score cards styled like real playing cards
- **Avatar Circles** - Player initials in colorful gradient circles

## 📦 Deployment

Deploy to Vercel, Netlify, or any static hosting provider:

```bash
# Build the app
npm run build

# The dist/ folder contains the production build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🤝 Contributing

Contributions are welcome! Please follow the TDD approach:

1. Write tests first
2. Implement the feature
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🎯 Roadmap

- [ ] Dark mode support
- [ ] Sound effects for scoring
- [ ] Game history and statistics
- [ ] PWA support for offline play
- [ ] Multiplayer via WebSockets
- [ ] Custom scoring rules
- [ ] Player avatars

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and device information

---

Made with ❤️ for Scopa enthusiasts
