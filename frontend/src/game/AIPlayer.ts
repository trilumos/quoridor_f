import { GameState, Wall, GameAction } from './types';
import { getValidMoves, bfsShortestPath, bfsShortestPathLength, isValidWallPlacement } from './GameEngine';

export function getAIMove(gameState: GameState, difficulty: 'easy' | 'medium' | 'hard'): GameAction {
  switch (difficulty) {
    case 'easy': return easyAIMove(gameState);
    case 'medium': return mediumAIMove(gameState);
    case 'hard': return hardAIMove(gameState);
  }
}

function easyAIMove(gameState: GameState): GameAction {
  const ai = gameState.players[1];
  const human = gameState.players[0];
  const validMoves = getValidMoves(ai.position, human.position, gameState.walls);
  if (ai.wallsRemaining > 0 && Math.random() < 0.3) {
    for (let i = 0; i < 30; i++) {
      const wall: Wall = {
        row: Math.floor(Math.random() * 8),
        col: Math.floor(Math.random() * 8),
        orientation: Math.random() < 0.5 ? 'horizontal' : 'vertical',
      };
      if (isValidWallPlacement(wall, gameState.walls, human.position, ai.position)) {
        return { type: 'wall', player: 1, wall };
      }
    }
  }
  if (validMoves.length === 0) {
    return { type: 'move', player: 1, from: ai.position, to: ai.position };
  }
  const target = validMoves[Math.floor(Math.random() * validMoves.length)];
  return { type: 'move', player: 1, from: ai.position, to: target };
}

function mediumAIMove(gameState: GameState): GameAction {
  const ai = gameState.players[1];
  const human = gameState.players[0];
  const validMoves = getValidMoves(ai.position, human.position, gameState.walls);
  if (ai.wallsRemaining > 0 && Math.random() < 0.3) {
    for (let i = 0; i < 30; i++) {
      const wall: Wall = {
        row: Math.floor(Math.random() * 8),
        col: Math.floor(Math.random() * 8),
        orientation: Math.random() < 0.5 ? 'horizontal' : 'vertical',
      };
      if (isValidWallPlacement(wall, gameState.walls, human.position, ai.position)) {
        return { type: 'wall', player: 1, wall };
      }
    }
  }
  const path = bfsShortestPath(ai.position.row, ai.position.col, 8, gameState.walls);
  if (path && path.length > 1) {
    const next = path[1];
    if (validMoves.some(m => m.row === next.row && m.col === next.col)) {
      return { type: 'move', player: 1, from: ai.position, to: next };
    }
  }
  if (validMoves.length === 0) {
    return { type: 'move', player: 1, from: ai.position, to: ai.position };
  }
  return { type: 'move', player: 1, from: ai.position, to: validMoves[0] };
}

function hardAIMove(gameState: GameState): GameAction {
  const ai = gameState.players[1];
  const human = gameState.players[0];
  const validMoves = getValidMoves(ai.position, human.position, gameState.walls);
  const aiPathLen = bfsShortestPathLength(ai.position.row, ai.position.col, 8, gameState.walls);
  const humanPathLen = bfsShortestPathLength(human.position.row, human.position.col, 0, gameState.walls);
  let bestWall: Wall | null = null;
  let bestScore = 0;
  if (ai.wallsRemaining > 0) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        for (const orientation of ['horizontal', 'vertical'] as const) {
          const wall: Wall = { row: r, col: c, orientation };
          if (!isValidWallPlacement(wall, gameState.walls, human.position, ai.position)) continue;
          const testWalls = [...gameState.walls, wall];
          const newHumanLen = bfsShortestPathLength(human.position.row, human.position.col, 0, testWalls);
          const newAiLen = bfsShortestPathLength(ai.position.row, ai.position.col, 8, testWalls);
          const score = (newHumanLen - humanPathLen) - (newAiLen - aiPathLen) * 0.5;
          if (score > bestScore) {
            bestScore = score;
            bestWall = wall;
          }
        }
      }
    }
  }
  let bestMove = validMoves[0];
  let bestMoveDist = 999;
  for (const move of validMoves) {
    const dist = bfsShortestPathLength(move.row, move.col, 8, gameState.walls);
    if (dist < bestMoveDist) {
      bestMoveDist = dist;
      bestMove = move;
    }
  }
  if (bestWall && bestScore >= 2 && ai.wallsRemaining > 2) {
    return { type: 'wall', player: 1, wall: bestWall };
  }
  if (!bestMove) {
    return { type: 'move', player: 1, from: ai.position, to: ai.position };
  }
  return { type: 'move', player: 1, from: ai.position, to: bestMove };
}
