import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, useWindowDimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../src/theme/colors';
import { GameState, Position, Wall, ActionMode, AIDifficulty, GameMode } from '../src/game/types';
import { createInitialGameState, getValidMoves, isValidWallPlacement, applyMove, applyWall } from '../src/game/GameEngine';
import { getAIMove } from '../src/game/AIPlayer';
import GameBoard from '../src/components/GameBoard';
import TurnToast from '../src/components/TurnToast';
import AchievementToast from '../src/components/AchievementToast';
import WallIcon from '../src/components/WallIcon';
import { useGameContext } from '../src/storage/GameContext';
import { useAuthStore } from '../src/store/authStore';
import { useStatsStore } from '../src/store/statsStore';
import { useGameStore } from '../src/store/gameStore';

type LogEntry = { num: number; type: string; detail: string };

function posToNotation(row: number, col: number): string {
  return String.fromCharCode(65 + col) + (9 - row);
}

export default function GameScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { settings, recordWin, recordLoss, recordWallsPlaced, incrementAdCounter, shouldShowAd, saveGame: ctxSaveGame, clearSavedGame } = useGameContext();
  const { user, isPremium, profile } = useAuthStore();
  const { stats, recordGame } = useStatsStore();
  const { saveGame: storeSaveGame, deleteSavedGame, incrementMatchCount, shouldShowAd: storeShowAd } = useGameStore();
  const { width: sw, height: sh } = useWindowDimensions();

  const mode = (params.mode as GameMode) || 'ai';
  const difficulty = (params.difficulty as AIDifficulty) || 'easy';
  const p1Name = (params.p1Name as string) || profile?.username || 'ARCHITECT_X';
  const p2Name = mode === 'ai' ? (params.p2Name as string) || 'KAI_ZEN_01' : (params.p2Name as string) || 'Player 2';

  const boardSize = Math.min(sw - 40, sh * 0.38);

  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState(p1Name, COLORS.player1, p2Name, COLORS.player2)
  );
  const [actionMode, setActionMode] = useState<ActionMode>('move');
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [selectedIntersection, setSelectedIntersection] = useState<{ row: number; col: number } | null>(null);
  const [wallOrientation, setWallOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [wallPreview, setWallPreview] = useState<Wall | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [turnToastVisible, setTurnToastVisible] = useState(false);
  const [turnToastPlayer, setTurnToastPlayer] = useState('');
  const [moveLog, setMoveLog] = useState<LogEntry[]>([]);
  const [chatMsg, setChatMsg] = useState('');
  const [achievementQueue, setAchievementQueue] = useState<string[]>([]);
  const gameOverHandled = useRef(false);
  const moveCountRef = useRef(0);
  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMessage(''), 2500);
  }, []);

  const addLog = useCallback((type: string, detail: string) => {
    moveCountRef.current += 1;
    setMoveLog(prev => [{ num: moveCountRef.current, type, detail }, ...prev].slice(0, 20));
  }, []);

  // Auto-save game state on every change
  useEffect(() => {
    if (user && !gameState.gameOver) {
      storeSaveGame(user.id, gameState as any, mode, difficulty || null);
    }
  }, [gameState, user]);

  useEffect(() => {
    if (actionMode === 'move' && !gameState.gameOver) {
      const cp = gameState.currentPlayer;
      if (mode === 'ai' && cp === 1) { setValidMoves([]); return; }
      const opp = 1 - cp;
      const moves = getValidMoves(gameState.players[cp].position, gameState.players[opp].position, gameState.walls);
      setValidMoves(moves);
    } else { setValidMoves([]); }
  }, [actionMode, gameState.currentPlayer, gameState.walls, gameState.players, gameState.gameOver, mode]);

  useEffect(() => {
    if (mode !== 'ai' || gameState.currentPlayer !== 1 || gameState.gameOver) return;
    setAiThinking(true);
    const t = setTimeout(() => {
      setGameState(prev => {
        if (prev.currentPlayer !== 1 || prev.gameOver) return prev;
        const aiAction = getAIMove(prev, difficulty);
        if (aiAction.type === 'move') {
          const from = prev.players[1].position;
          addLog('Opponent Move', `${posToNotation(from.row, from.col)} \u2192 ${posToNotation(aiAction.to.row, aiAction.to.col)}`);
          return applyMove(prev, aiAction.to);
        } else {
          addLog('Opponent Wall', `${posToNotation(aiAction.wall.row, aiAction.wall.col)}-${aiAction.wall.orientation[0].toUpperCase()}`);
          return applyWall(prev, aiAction.wall);
        }
      });
      if (settings.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setAiThinking(false);
      setActionMode('move');
    }, 600);
    return () => clearTimeout(t);
  }, [gameState.currentPlayer, gameState.gameOver, mode, difficulty]);

  useEffect(() => {
    if (gameState.gameOver && !gameOverHandled.current) {
      gameOverHandled.current = true;
      const isPlayerWin = mode === 'ai' ? gameState.winner === 0 : true;
      if (mode === 'ai') {
        if (gameState.winner === 0) recordWin(10 - gameState.players[0].wallsRemaining, gameState.moveCount[0], difficulty);
        else recordLoss(10 - gameState.players[0].wallsRemaining);
      }
      recordWallsPlaced(gameState.wallsPlaced[0] + gameState.wallsPlaced[1]);
      incrementAdCounter();
      incrementMatchCount();

      // Record to Supabase
      const handleGameEnd = async () => {
        if (user && stats) {
          try {
            const durationSec = Math.floor((Date.now() - gameState.startTime) / 1000);
            const wallsUsed = gameState.wallsPlaced[0];
            const ratingBefore = stats.rating || 1200;
            const ratingChange = isPlayerWin ? Math.floor(Math.random() * 15) + 5 : -(Math.floor(Math.random() * 10) + 3);
            const ratingAfter = ratingBefore + ratingChange;

            const gameData = {
              difficulty: difficulty.toUpperCase(),
              result: (gameState.winner === 0 ? 'WIN' : 'LOSS') as 'WIN' | 'LOSS',
              duration_seconds: durationSec,
              moves_made: gameState.moveCount[0],
              walls_placed: wallsUsed,
              wall_efficiency: Math.round((wallsUsed / 10) * 100),
              rating_before: ratingBefore,
              rating_after: ratingAfter,
              rating_change: ratingChange,
            };

            const newAchievements = await recordGame(user.id, gameData);
            if (newAchievements.length > 0) {
              setAchievementQueue(newAchievements);
            }
            await deleteSavedGame(user.id);
          } catch {}
        }
      };
      handleGameEnd();

      const endParams = {
        winner: String(gameState.winner),
        p1Name: gameState.players[0].name,
        p2Name: gameState.players[1].name,
        moves1: String(gameState.moveCount[0]),
        moves2: String(gameState.moveCount[1]),
        walls1: String(gameState.wallsPlaced[0]),
        walls2: String(gameState.wallsPlaced[1]),
        time: String(Math.floor((Date.now() - gameState.startTime) / 1000)),
        mode,
        difficulty: difficulty || '',
      };
      setTimeout(() => {
        if (shouldShowAd() || storeShowAd(isPremium)) {
          router.replace({
            pathname: '/ad-interstitial',
            params: { returnTo: mode === 'ai' && gameState.winner !== 0 ? '/defeat' : '/victory', ...endParams },
          } as never);
        } else {
          const destination = mode === 'ai' && gameState.winner !== 0 ? '/defeat' : '/victory';
          router.replace({ pathname: destination, params: endParams } as never);
        }
      }, 1500);
    }
  }, [gameState.gameOver]);

  const showTurnNotify = useCallback((name: string) => {
    setTurnToastPlayer(name);
    setTurnToastVisible(true);
    if (settings.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [settings.hapticsEnabled]);

  const handleCellPress = useCallback((row: number, col: number) => {
    if (gameState.gameOver || aiThinking || actionMode !== 'move') return;
    if (mode === 'ai' && gameState.currentPlayer === 1) return;
    if (!validMoves.some(m => m.row === row && m.col === col)) return;
    const from = gameState.players[gameState.currentPlayer].position;
    addLog('Player Move', `${posToNotation(from.row, from.col)} \u2192 ${posToNotation(row, col)}`);
    const ns = applyMove(gameState, { row, col });
    setGameState(ns);
    setSelectedIntersection(null);
    setWallPreview(null);
    if (settings.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (mode === 'local' && !ns.gameOver) showTurnNotify(ns.players[ns.currentPlayer].name);
  }, [gameState, actionMode, validMoves, aiThinking, mode, settings.hapticsEnabled, showTurnNotify, addLog]);

  const handleIntersectionPress = useCallback((row: number, col: number) => {
    if (gameState.gameOver || aiThinking) return;
    if (mode === 'ai' && gameState.currentPlayer === 1) return;
    if (gameState.players[gameState.currentPlayer].wallsRemaining <= 0) { showToast('No walls remaining!'); return; }
    if (actionMode !== 'wall') setActionMode('wall');
    if (selectedIntersection?.row === row && selectedIntersection?.col === col) {
      const newO = wallOrientation === 'horizontal' ? 'vertical' : 'horizontal';
      setWallOrientation(newO);
      setWallPreview({ row, col, orientation: newO });
    } else {
      setSelectedIntersection({ row, col });
      setWallPreview({ row, col, orientation: wallOrientation });
    }
  }, [gameState, aiThinking, mode, selectedIntersection, wallOrientation, actionMode]);

  const handlePlaceWall = useCallback(() => {
    if (!wallPreview) return;
    if (!isValidWallPlacement(wallPreview, gameState.walls, gameState.players[0].position, gameState.players[1].position)) {
      showToast('Invalid wall placement!');
      if (settings.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    addLog('Player Wall', `${posToNotation(wallPreview.row, wallPreview.col)}-${wallPreview.orientation[0].toUpperCase()}`);
    const ns = applyWall(gameState, wallPreview);
    setGameState(ns);
    setSelectedIntersection(null);
    setWallPreview(null);
    setActionMode('move');
    if (settings.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (mode === 'local' && !ns.gameOver) showTurnNotify(ns.players[ns.currentPlayer].name);
  }, [wallPreview, gameState, mode, settings.hapticsEnabled, showTurnNotify, addLog]);

  const cp = gameState.currentPlayer;
  const isHuman = mode === 'local' || cp === 0;

  const QUICK_MSGS = ['GG! Well played.', 'Interesting move...', 'One more game?'];

  return (
    <SafeAreaView testID="game-screen" style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        {/* Header */}
        <View style={st.header}>
          <View style={st.logoRow}>
            <View style={st.gridIcon}>
              <View style={st.gridDot} /><View style={st.gridDot} />
              <View style={st.gridDot} /><View style={st.gridDot} />
            </View>
            <Text style={st.logoText}>QUORIDOR</Text>
          </View>
          <TouchableOpacity onPress={() => setShowMenu(true)} activeOpacity={0.6}>
            <Ionicons name="settings-outline" size={22} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        {/* Opponent Info (TOP) */}
        <View style={st.infoCard}>
          <View style={st.infoRow}>
            <View style={st.avatarOpp}>
              <Ionicons name="person" size={24} color={COLORS.textSecondary} />
            </View>
            <View style={st.infoMid}>
              <Text style={st.infoLabel}>OPPONENT {cp === 1 ? '(ACTIVE)' : ''}</Text>
              <Text style={st.infoName}>{gameState.players[1].name}</Text>
              <View style={st.infoMeta}>
                <Text style={st.infoMetaLabel}>RANK</Text>
                <Text style={st.infoMetaValue}>#1,204</Text>
              </View>
            </View>
            <View style={st.wallsCol}>
              <Text style={st.wallsLabel}>WALLS</Text>
              <WallIcon remaining={gameState.players[1].wallsRemaining} />
            </View>
          </View>
        </View>

        {/* Board */}
        <View style={st.boardWrap}>
          <GameBoard gameState={gameState} actionMode={isHuman ? actionMode : 'move'} validMoves={isHuman ? validMoves : []} wallPreview={wallPreview} onCellPress={handleCellPress} onIntersectionPress={handleIntersectionPress} boardSize={boardSize} />
        </View>

        {/* Player Info (BOTTOM) */}
        <View style={[st.infoCard, st.playerCard]}>
          <View style={st.playerPinstripe} />
          <View style={st.infoRow}>
            <View style={st.avatarPlayer}>
              <Ionicons name="person" size={24} color={COLORS.textPrimary} />
            </View>
            <View style={st.infoMid}>
              <Text style={[st.infoLabel, { color: COLORS.accent }]}>YOU {cp === 0 ? '(ACTIVE)' : ''}</Text>
              <Text style={st.infoName}>{gameState.players[0].name}</Text>
              <View style={st.infoMetaRow}>
                <View>
                  <Text style={st.infoMetaLabel}>RATING</Text>
                  <Text style={st.infoMetaValue}>{stats?.rating || 1200}</Text>
                </View>
                <View>
                  <Text style={st.infoMetaLabel}>STREAK</Text>
                  <Text style={st.infoMetaValue}>{stats?.current_streak || 0}</Text>
                </View>
              </View>
            </View>
            <View style={st.wallsCol}>
              <Text style={st.wallsLabel}>WALLS</Text>
              <WallIcon remaining={gameState.players[0].wallsRemaining} />
            </View>
          </View>
        </View>

        {/* MOVE / WALL Toggle */}
        <View style={st.modeToggle}>
          <TouchableOpacity testID="mode-move-btn" style={[st.modeHalf, actionMode === 'move' && st.modeHalfActive]} onPress={() => { setActionMode('move'); setSelectedIntersection(null); setWallPreview(null); }} activeOpacity={0.7}>
            <Ionicons name="arrow-up-outline" size={16} color={actionMode === 'move' ? COLORS.accent : COLORS.textSecondary} />
            <Text style={[st.modeText, actionMode === 'move' && st.modeTextActive]}>MOVE</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="mode-wall-btn" style={[st.modeHalf, actionMode === 'wall' && st.modeHalfActive]} onPress={() => setActionMode('wall')} disabled={!isHuman || gameState.players[cp].wallsRemaining <= 0} activeOpacity={0.7}>
            <Ionicons name="reorder-three-outline" size={16} color={actionMode === 'wall' ? COLORS.accent : COLORS.textSecondary} />
            <Text style={[st.modeText, actionMode === 'wall' && st.modeTextActive]}>WALL</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Action */}
        <TouchableOpacity testID="confirm-btn" style={[st.confirmBtn, !wallPreview && !validMoves.length && st.confirmDisabled]} onPress={wallPreview ? handlePlaceWall : undefined} activeOpacity={0.85}>
          <Text style={st.confirmText}>CONFIRM ACTION</Text>
        </TouchableOpacity>

        {/* Log Sequence */}
        <View style={st.logSection}>
          <Text style={st.sectionTitle}>LOG _ SEQUENCE</Text>
          {moveLog.slice(0, 4).map((e, i) => (
            <View key={i} style={st.logRow}>
              <Text style={st.logNum}>{String(e.num).padStart(2, '0')}</Text>
              <Text style={st.logType}>{e.type}</Text>
              <Text style={st.logDetail}>{e.detail}</Text>
            </View>
          ))}
          {moveLog.length === 0 && <Text style={st.logEmpty}>No moves yet.</Text>}
        </View>

        <TouchableOpacity style={st.exportBtn} activeOpacity={0.6}>
          <Text style={st.exportText}>EXPORT GAME DATA</Text>
        </TouchableOpacity>

        {/* Tactical Comms */}
        <View style={st.logSection}>
          <Text style={st.sectionTitle}>TACTICAL COMMS</Text>
          {QUICK_MSGS.map((m, i) => (
            <View key={i} style={st.chatBubble}>
              <Text style={st.chatText}>{m}</Text>
            </View>
          ))}
          <View style={st.chatInputRow}>
            <TextInput style={st.chatInput} placeholder="Type message..." placeholderTextColor={COLORS.textSecondary} value={chatMsg} onChangeText={setChatMsg} />
            <TouchableOpacity style={st.sendBtn} activeOpacity={0.6}>
              <Ionicons name="arrow-forward" size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Turn Toast */}
      <TurnToast playerName={turnToastPlayer} visible={turnToastVisible} onDismiss={() => setTurnToastVisible(false)} />

      {/* Achievement Toast Queue */}
      <AchievementToast queue={achievementQueue} onComplete={() => setAchievementQueue([])} />

      {/* Pause overlay */}
      {showMenu && (
        <TouchableOpacity testID="pause-overlay" style={[StyleSheet.absoluteFill, st.overlay]} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={st.menuCard}>
            <Text style={st.menuTitle}>GAME PAUSED</Text>
            <View style={st.menuBtns}>
              <TouchableOpacity testID="resume-btn" style={st.resumeBtn} onPress={() => setShowMenu(false)} activeOpacity={0.85}>
                <Text style={st.resumeText}>RESUME</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.restartBtn} onPress={() => {
                setShowMenu(false);
                gameOverHandled.current = false;
                moveCountRef.current = 0;
                setMoveLog([]);
                setGameState(createInitialGameState(p1Name, COLORS.player1, p2Name, COLORS.player2));
                setActionMode('move');
                setSelectedIntersection(null);
                setWallPreview(null);
              }} activeOpacity={0.7}>
                <Text style={st.restartText}>RESTART</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.saveQuitBtn} onPress={() => {
                if (user) storeSaveGame(user.id, gameState as any, mode, difficulty);
                else ctxSaveGame(gameState, mode, difficulty);
                router.replace('/(tabs)' as never);
              }} activeOpacity={0.7}>
                <Text style={st.saveQuitText}>SAVE & QUIT</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="resign-btn" style={st.resignBtn} onPress={() => {
                if (user) deleteSavedGame(user.id);
                else clearSavedGame();
                if (mode === 'ai') recordLoss(10 - gameState.players[0].wallsRemaining);
                incrementAdCounter();
                router.replace('/(tabs)' as never);
              }} activeOpacity={0.7}>
                <Text style={st.resignText}>RESIGN & QUIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {message !== '' && (
        <View testID="toast-message" style={st.toast}>
          <Text style={st.toastText}>{message}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gridIcon: { width: 20, height: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  gridDot: { width: 8, height: 8, borderRadius: 1.5, backgroundColor: COLORS.accent },
  logoText: { color: COLORS.textPrimary, fontSize: 18, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 3 },
  boardWrap: { alignItems: 'center', marginTop: 8 },
  modeToggle: { flexDirection: 'row', backgroundColor: COLORS.elevated, borderRadius: 10, marginTop: 12, overflow: 'hidden' },
  modeHalf: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  modeHalfActive: { backgroundColor: 'rgba(255,122,0,0.08)' },
  modeText: { color: COLORS.textSecondary, fontSize: 13, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  modeTextActive: { color: COLORS.accent },
  confirmBtn: { backgroundColor: COLORS.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  confirmDisabled: { opacity: 0.5 },
  confirmText: { color: COLORS.background, fontSize: 14, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  infoCard: { backgroundColor: COLORS.elevated, borderRadius: 14, padding: 16, marginTop: 12 },
  playerCard: { position: 'relative', overflow: 'hidden' },
  playerPinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2.5, backgroundColor: COLORS.accent },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatarOpp: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.08)' },
  avatarPlayer: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,122,0,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.accent },
  infoMid: { flex: 1 },
  infoLabel: { color: COLORS.textSecondary, fontSize: 9, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1.5 },
  infoName: { color: COLORS.textPrimary, fontSize: 16, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', marginTop: 2 },
  infoMeta: { flexDirection: 'row', gap: 8, marginTop: 6 },
  infoMetaLabel: { color: COLORS.textSecondary, fontSize: 9, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  infoMetaValue: { color: COLORS.textPrimary, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', marginTop: 1 },
  infoMetaRow: { flexDirection: 'row', gap: 20, marginTop: 6 },
  wallsCol: { alignItems: 'flex-end', gap: 6 },
  wallsLabel: { color: COLORS.textSecondary, fontSize: 9, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  logSection: { marginTop: 20 },
  sectionTitle: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2.5, marginBottom: 10 },
  logRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 12 },
  logNum: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_700Bold', fontWeight: '700', width: 24 },
  logType: { color: COLORS.textPrimary, fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600', flex: 1 },
  logDetail: { color: COLORS.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular' },
  logEmpty: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular', fontStyle: 'italic' },
  exportBtn: { backgroundColor: COLORS.elevated, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  exportText: { color: COLORS.textPrimary, fontSize: 12, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1.5 },
  chatBubble: { backgroundColor: COLORS.elevated, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8 },
  chatText: { color: COLORS.textPrimary, fontSize: 13, fontFamily: 'Inter_400Regular' },
  chatInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  chatInput: { flex: 1, backgroundColor: COLORS.elevated, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: COLORS.textPrimary, fontSize: 13, fontFamily: 'Inter_400Regular' },
  sendBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.elevated, alignItems: 'center', justifyContent: 'center' },
  overlay: { backgroundColor: COLORS.overlayGlass, alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  menuCard: { backgroundColor: COLORS.elevated, borderRadius: 20, padding: 32, width: 280, alignItems: 'center' },
  menuTitle: { color: COLORS.textPrimary, fontSize: 18, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 2, marginBottom: 24 },
  menuBtns: { width: '100%', gap: 8 },
  resumeBtn: { backgroundColor: COLORS.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  resumeText: { color: COLORS.background, fontSize: 14, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  resignBtn: { borderWidth: 1.5, borderColor: COLORS.error, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  resignText: { color: COLORS.error, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  restartBtn: { backgroundColor: COLORS.secondaryBg, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  restartText: { color: COLORS.textPrimary, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  saveQuitBtn: { backgroundColor: COLORS.secondaryBg, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveQuitText: { color: COLORS.textPrimary, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  toast: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: COLORS.elevated, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, zIndex: 200 },
  toastText: { color: COLORS.error, fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
});
