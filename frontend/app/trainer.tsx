import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';

const SECTIONS = [
  {
    id: 'rules',
    title: 'RULES',
    icon: 'book-outline',
    items: [
      { title: 'Board Setup', content: 'Quoridor is played on a 9x9 grid. Each player starts at opposite ends of the board with 10 walls each. The objective is to reach the opposite side before your opponent.' },
      { title: 'Movement', content: 'On your turn, you can either move your pawn one space orthogonally (up, down, left, right) or place a wall. Pawns cannot move diagonally.' },
      { title: 'Wall Placement', content: 'Walls are placed between two rows or columns and span exactly two cell widths. Walls cannot overlap or cross other walls. You must always leave at least one path to the goal for both players.' },
      { title: 'Jumping', content: 'If your pawn is adjacent to your opponent, you can jump over them. If a wall or board edge blocks the jump, you can move diagonally instead.' },
      { title: 'Winning', content: 'The first player to reach any cell on their goal row wins the game. Player 1 aims for row 1 (top), Player 2 aims for row 9 (bottom).' },
    ],
  },
  {
    id: 'strategy',
    title: 'STRATEGY',
    icon: 'flash-outline',
    items: [
      { title: 'Path Efficiency', content: 'Always calculate the shortest path to your goal. BFS (Breadth-First Search) is the algorithm that determines optimal routing. Make moves that shorten your path.' },
      { title: 'Wall Economy', content: 'Walls are limited resources. Each wall should either significantly lengthen your opponent\'s path or protect your own route. Don\'t waste walls on minor disruptions.' },
      { title: 'The Corridor Trap', content: 'Force your opponent into a narrow corridor where their movement options are limited. This creates opportunities for you to advance while they navigate around walls.' },
      { title: 'Defensive Walls', content: 'Sometimes the best wall is one that protects your own shortest path rather than blocking your opponent. Secure your route before attacking.' },
    ],
  },
  {
    id: 'advanced',
    title: 'ADVANCED',
    icon: 'skull-outline',
    items: [
      { title: 'Tempo Control', content: 'Each wall placement costs you a move. If you\'re ahead in position, advance. If you\'re behind, use walls strategically to catch up.' },
      { title: 'Endgame Theory', content: 'When both players have few walls remaining, the game becomes a pure race. Position yourself so that your remaining walls can create the maximum disruption.' },
      { title: 'Symmetry Breaking', content: 'In opening positions, breaking symmetry early can give you an advantage. The first player to create an asymmetric board state often controls the tempo.' },
      { title: 'Wall Sacrifice', content: 'Sometimes placing a wall that your opponent can easily route around is worthwhile if it forces them to use an extra move, giving you a tempo advantage.' },
    ],
  },
];

export default function TrainerScreen() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('rules');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const section = SECTIONS.find(s => s.id === activeSection)!;

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={st.backBtn} activeOpacity={0.6}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <Text style={st.label}>LEARNING CENTER</Text>
        <Text style={st.heading}>TRAINER</Text>

        {/* Section Tabs */}
        <View style={st.tabs}>
          {SECTIONS.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[st.tab, activeSection === s.id && st.tabActive]}
              onPress={() => { setActiveSection(s.id); setExpandedItem(null); }}
              activeOpacity={0.7}
            >
              <Ionicons name={s.icon as any} size={16} color={activeSection === s.id ? COLORS.accent : COLORS.textSecondary} />
              <Text style={[st.tabText, activeSection === s.id && st.tabTextActive]}>{s.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={st.contentArea}>
          {section.items.map((item, i) => {
            const isExpanded = expandedItem === `${section.id}-${i}`;
            return (
              <TouchableOpacity
                key={i}
                style={st.contentCard}
                onPress={() => setExpandedItem(isExpanded ? null : `${section.id}-${i}`)}
                activeOpacity={0.7}
              >
                {isExpanded && <View style={st.cardPinstripe} />}
                <View style={st.cardHeader}>
                  <Text style={st.cardNum}>{String(i + 1).padStart(2, '0')}</Text>
                  <Text style={st.cardTitle}>{item.title}</Text>
                  <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
                </View>
                {isExpanded && (
                  <Text style={st.cardContent}>{item.content}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 20 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginTop: 8 },
  label: { color: COLORS.accent, fontSize: 11, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2 },
  heading: { color: COLORS.textPrimary, fontSize: 32, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', marginTop: 4, marginBottom: 20 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.elevated, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  tabActive: { backgroundColor: COLORS.accentAlpha15 },
  tabText: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 0.5 },
  tabTextActive: { color: COLORS.accent },
  contentArea: { marginTop: 20, gap: 8 },
  contentCard: { backgroundColor: COLORS.elevated, borderRadius: 12, padding: 16, overflow: 'hidden', position: 'relative' },
  cardPinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardNum: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_700Bold', fontWeight: '700', width: 24 },
  cardTitle: { color: COLORS.textPrimary, fontSize: 15, fontFamily: 'Inter_700Bold', fontWeight: '700', flex: 1 },
  cardContent: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 21, marginTop: 12, paddingLeft: 36 },
});
