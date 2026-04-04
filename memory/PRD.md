# Quoridor Board Game - PRD

## Overview
A fully playable Quoridor board game built with Expo/React Native. Features VS AI (3 difficulty levels), Pass & Play mode, BFS pathfinding wall validation, and a dark premium theme.

## Phase 1 - Core Game (Complete)

### Screens
- **Splash Screen**: Animated logo + tagline, auto-navigates to home
- **Home Screen**: VS AI, Pass & Play, Daily Puzzle buttons + stats row
- **Pregame AI**: Difficulty selection (Easy/Medium/Hard, Hard locked behind premium)
- **Pregame Local**: Player name inputs + color selection
- **Game Screen**: 9x9 board, player info bars, MOVE/WALL action buttons, undo, menu
- **Victory Screen**: Winner display, game stats, Play Again/Home buttons

### Game Logic
- 9x9 grid, each player starts with 10 walls
- BFS pathfinding for wall placement validation (prevents trapping players)
- Jump rule: jump over adjacent opponent (straight + diagonal)
- 3 AI difficulties: Easy (random), Medium (BFS shortest path), Hard (strategic wall evaluation)
- Pass & Play with handoff overlay between turns

### Technical
- React Native + Expo Router (file-based routing)
- In-memory state (GameContext) for stats, settings, premium status
- No backend required - all logic is local
- `expo-haptics` for haptic feedback
- Animated pawn glow effects

## Phase 2 (Planned)
- Stats persistence with AsyncStorage
- Achievements system
- Daily Puzzle mode
- Settings screen with theme selection
- Sound effects

## Phase 3 (Planned)
- Premium/paywall UI (mock)
- Ad placeholder screens
- Unlockable themes
- Game auto-save on background
