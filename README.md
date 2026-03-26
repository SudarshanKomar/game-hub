# Game Hub

A modern 1v1 gaming platform built with React and Webpack Module Federation, featuring multiple classic games with real-time score tracking and a unified leaderboard.

## Overview

Game Hub is a microfrontend-based gaming platform that allows two players to compete in various classic games. The platform uses a dark, modern UI with smooth animations and maintains player statistics across all games.

## Features

- **Multiple Games**: Play Tic Tac Toe, Dots and Boxes, and Snake & Ladder
- **Player Management**: Set custom player names that persist across all games
- **Unified Leaderboard**: Track scores and statistics from all games in one place
- **Dark Theme**: Modern, eye-friendly dark interface with proper color contrast
- **Microfrontend Architecture**: Each game runs independently using Webpack Module Federation
- **Responsive Design**: Works seamlessly across different screen sizes
- **Local Storage**: Player names and game scores are saved locally

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Webpack 5 with Module Federation
- **Styling**: Tailwind CSS with custom dark theme
- **Animations**: GSAP and Framer Motion
- **Routing**: React Router DOM
- **Package Manager**: npm

## Project Structure

```
game-hub/
├── container/          # Main container application (port 3000)
├── tic-tac-toe/       # Tic Tac Toe microfrontend (port 3001)
├── dots-and-boxes/    # Dots and Boxes microfrontend (port 3002)
├── snake-ladder/      # Snake & Ladder microfrontend (port 3003)
└── leaderboard/       # Leaderboard microfrontend (port 3004)
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SudarshanKomar/game-hub.git
cd game-hub
```

2. Install dependencies for all applications:
```bash
npm install
```

This will automatically install dependencies for the container and all microfrontends.

### Running the Application

Start all applications simultaneously:
```bash
npm run start:all
```

This command will start:
- Container app on http://localhost:3000
- Tic Tac Toe on http://localhost:3001
- Dots and Boxes on http://localhost:3002
- Snake & Ladder on http://localhost:3003
- Leaderboard on http://localhost:3004

Access the application by opening http://localhost:3000 in your browser.

### Running Individual Applications

You can also run each application separately:

```bash
# Container
npm run start:container

# Tic Tac Toe
npm run start:tictactoe

# Dots and Boxes
npm run start:dotsandboxes

# Snake & Ladder
npm run start:snakeladder

# Leaderboard
npm run start:leaderboard
```

## How to Play

1. **Set Player Names**: Enter names for Player 1 and Player 2, then click "Save Names"
2. **Choose a Game**: Select from the available game cards on the home page
3. **Play**: Follow the game-specific rules and compete with your friend
4. **View Scores**: Check the Leaderboard to see game history and player statistics

## Game Rules

### Tic Tac Toe
- Players take turns placing X or O on a 3x3 grid
- First player to get 3 in a row (horizontal, vertical, or diagonal) wins

### Dots and Boxes
- Players take turns connecting dots with lines
- Complete a box to score a point and take another turn
- Player with the most boxes wins

### Snake & Ladder
- Roll the dice to move forward on the board
- Land on a ladder to climb up, land on a snake to slide down
- First player to reach position 100 wins

## Development

### Building for Production

Build all applications:
```bash
npm run build
```

Individual builds:
```bash
npm run build:container
npm run build:tictactoe
npm run build:dotsandboxes
npm run build:snakeladder
npm run build:leaderboard
```
## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with React and Webpack Module Federation
- UI components inspired by modern design principles
