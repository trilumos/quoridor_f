import React, { useMemo, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Position, Wall, GameState, ActionMode } from '../game/types';
import { COLORS } from '../theme/colors';

interface BoardProps {
  gameState: GameState;
  actionMode: ActionMode;
  validMoves: Position[];
  wallPreview: Wall | null;
  onCellPress: (row: number, col: number) => void;
  onIntersectionPress: (row: number, col: number) => void;
  boardSize: number;
}

const GAP_SIZE_BASE = 7;

export default function Board({
  gameState, actionMode, validMoves, wallPreview, onCellPress, onIntersectionPress, boardSize,
}: BoardProps) {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.8, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const { cellSize, gapSize, step } = useMemo(() => {
    const gs = Math.max(5, Math.round(boardSize / 48));
    const cs = (boardSize - 8 * gs) / 9;
    return { cellSize: cs, gapSize: gs, step: cs + gs };
  }, [boardSize]);

  if (boardSize <= 0 || cellSize <= 0) return null;

  const isValidMove = (r: number, c: number) => validMoves.some(m => m.row === r && m.col === c);
  const pawnSize = cellSize * 0.6;
  const glowSize = cellSize * 0.8;

  const getWallStyle = (wall: Wall) => {
    if (wall.orientation === 'horizontal') {
      return {
        left: wall.col * step,
        top: wall.row * step + cellSize,
        width: 2 * cellSize + gapSize,
        height: gapSize,
      };
    }
    return {
      left: wall.col * step + cellSize,
      top: wall.row * step,
      width: gapSize,
      height: 2 * cellSize + gapSize,
    };
  };

  const cells = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const valid = actionMode === 'move' && isValidMove(r, c);
      cells.push(
        <TouchableOpacity
          key={`c-${r}-${c}`}
          testID={`cell-${r}-${c}`}
          activeOpacity={valid ? 0.6 : 1}
          onPress={() => valid && onCellPress(r, c)}
          style={{
            position: 'absolute',
            left: c * step,
            top: r * step,
            width: cellSize,
            height: cellSize,
            borderRadius: 3,
            backgroundColor: valid ? COLORS.validMove : COLORS.boardSquare,
            borderWidth: valid ? 1.5 : 0,
            borderColor: valid ? COLORS.validMoveBorder : 'transparent',
          }}
        />
      );
    }
  }

  const pawns = gameState.players.map((player, i) => {
    const px = player.position.col * step + (cellSize - pawnSize) / 2;
    const py = player.position.row * step + (cellSize - pawnSize) / 2;
    const gx = player.position.col * step + (cellSize - glowSize) / 2;
    const gy = player.position.row * step + (cellSize - glowSize) / 2;
    return (
      <React.Fragment key={`pawn-${i}`}>
        <Animated.View
          testID={`pawn-glow-${i}`}
          style={{
            position: 'absolute',
            left: gx,
            top: gy,
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: player.color,
            opacity: pulseAnim,
            zIndex: 8,
          }}
        />
        <View
          testID={`pawn-${i}`}
          style={{
            position: 'absolute',
            left: px,
            top: py,
            width: pawnSize,
            height: pawnSize,
            borderRadius: pawnSize / 2,
            backgroundColor: player.color,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.35)',
            zIndex: 9,
          }}
        />
      </React.Fragment>
    );
  });

  const wallElements = gameState.walls.map((wall, i) => {
    const ws = getWallStyle(wall);
    return (
      <React.Fragment key={`wall-${i}`}>
        <View style={{
          position: 'absolute', ...ws,
          left: (ws.left ?? 0) - 2, top: (ws.top ?? 0) - 2,
          width: (ws.width ?? 0) + 4, height: (ws.height ?? 0) + 4,
          backgroundColor: COLORS.wallGlow, borderRadius: 4, opacity: 0.35, zIndex: 4,
        }} />
        <View testID={`wall-${i}`} style={{
          position: 'absolute', ...ws,
          backgroundColor: COLORS.wallPlaced, borderRadius: 3, zIndex: 5,
        }} />
      </React.Fragment>
    );
  });

  const previewElement = wallPreview ? (() => {
    const ws = getWallStyle(wallPreview);
    return (
      <View testID="wall-preview" style={{
        position: 'absolute', ...ws,
        backgroundColor: COLORS.wallPreview,
        borderRadius: 3, borderWidth: 1.5,
        borderColor: COLORS.wallPreviewBorder,
        zIndex: 6,
      }} />
    );
  })() : null;

  const intersections = actionMode === 'wall' ? (() => {
    const zones = [];
    const touchSize = Math.max(gapSize * 3.5, 28);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cx = c * step + cellSize + gapSize / 2;
        const cy = r * step + cellSize + gapSize / 2;
        zones.push(
          <TouchableOpacity
            key={`int-${r}-${c}`}
            testID={`intersection-${r}-${c}`}
            onPress={() => onIntersectionPress(r, c)}
            style={{
              position: 'absolute',
              left: cx - touchSize / 2,
              top: cy - touchSize / 2,
              width: touchSize,
              height: touchSize,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <View style={{
              width: Math.max(gapSize + 2, 8),
              height: Math.max(gapSize + 2, 8),
              borderRadius: 10,
              backgroundColor: 'rgba(0, 212, 255, 0.25)',
              borderWidth: 1,
              borderColor: 'rgba(0, 212, 255, 0.4)',
            }} />
          </TouchableOpacity>
        );
      }
    }
    return zones;
  })() : null;

  return (
    <View testID="game-board" style={[styles.board, { width: boardSize, height: boardSize, backgroundColor: COLORS.gridLine }]}>
      {cells}
      {wallElements}
      {previewElement}
      {pawns}
      {intersections}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    position: 'relative',
    borderRadius: 6,
    overflow: 'hidden',
  },
});
