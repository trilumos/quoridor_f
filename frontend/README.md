# Quoridor - Mobile Strategy Game

A premium, fully-featured mobile strategy game built with **React Native** and **Expo**, featuring a beautiful dark UI, AI opponents, daily puzzles, achievements, and cloud sync via **Supabase**.

![Quoridor Game](./assets/images/icon.png)

---

## 🎮 Features

- **Single-player vs AI** — 4 difficulty levels (Easy, Medium, Hard, Expert)
- **Local 2-player** — Pass & play on the same device
- **Daily Puzzles** — Fresh challenge every day with streak tracking
- **Achievements System** — Unlock 12+ achievements as you play
- **Cloud Sync** — Game progress, stats, and achievements saved to Supabase
- **Google Sign-In** — Quick authentication via OAuth
- **Rating System** — ELO-based rating with rank titles
- **Premium Subscription** — Ad-free experience (RevenueCat integration ready)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React Native 0.81 + Expo SDK 54 |
| **Routing** | Expo Router (file-based) |
| **State Management** | Zustand |
| **Backend / Database** | Supabase (PostgreSQL + Auth) |
| **Authentication** | Supabase Auth + Google OAuth |
| **Animations** | React Native Reanimated |
| **Styling** | StyleSheet (no CSS) |

---

## 📁 Project Structure

```
frontend/
├── app/                        # Expo Router screens (file-based routing)
│   ├── (tabs)/                 # Tab navigator screens
│   │   ├── index.tsx           # Home screen
│   │   ├── collection.tsx      # Achievements collection
│   │   ├── rank.tsx            # Leaderboard / Rankings
│   │   └── me.tsx              # Profile screen
│   ├── game.tsx                # Main game board
│   ├── login.tsx               # Login screen
│   ├── signup.tsx              # Sign up screen
│   ├── daily-puzzle.tsx        # Daily puzzle mode
│   ├── paywall.tsx             # Premium subscription
│   └── ...                     # Other screens
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Board.tsx           # Game board renderer
│   │   ├── PlayerInfoBar.tsx   # Player status bar
│   │   ├── PrimaryButton.tsx   # Styled button
│   │   └── ...
│   ├── game/                   # Game logic
│   │   ├── GameEngine.ts       # Core Quoridor rules
│   │   ├── AIPlayer.ts         # AI opponent logic
│   │   └── types.ts            # TypeScript types
│   ├── lib/
│   │   └── supabase.ts         # Supabase client initialization
│   ├── services/               # Backend API services
│   │   ├── AuthService.ts      # Authentication helpers
│   │   ├── ProfileService.ts   # User profile CRUD
│   │   ├── StatsService.ts     # Game statistics
│   │   ├── AchievementService.ts
│   │   ├── GameSaveService.ts  # Save/resume games
│   │   └── DailyPuzzleService.ts
│   ├── store/                  # Zustand state stores
│   │   ├── authStore.ts        # Auth state
│   │   ├── gameStore.ts        # Game state
│   │   └── statsStore.ts       # Stats state
│   └── theme/
│       └── colors.ts           # Color palette
├── assets/                     # Images, fonts, icons
├── app.json                    # Expo configuration
├── package.json                # Dependencies
└── .env                        # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **Yarn** or **npm**
- **Expo CLI** (installed globally or via npx)
- **Expo Go** app on your phone (for testing on device)
- A **Supabase** project (for backend)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd quoridor/frontend
```

### 2. Install Dependencies

```bash
yarn install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `frontend/` directory (or update the existing one):

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google OAuth (for Google Sign-In)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

#### Getting Supabase Credentials:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (or use existing)
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**

#### Getting Google OAuth Client ID:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials (Web application type)
3. Add authorized redirect URIs for your Expo app
4. Copy the **Client ID**

### 4. Set Up Supabase Database

Run the following SQL in your Supabase SQL Editor to create required tables:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  rating INTEGER DEFAULT 1200,
  rank_title TEXT DEFAULT 'Novice',
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game stats table
CREATE TABLE game_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_games INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_playtime_seconds INTEGER DEFAULT 0,
  walls_placed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Game history table
CREATE TABLE game_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  opponent_type TEXT, -- 'ai' or 'local'
  difficulty TEXT,
  result TEXT, -- 'win' or 'loss'
  duration_seconds INTEGER,
  moves_count INTEGER,
  rating_change INTEGER DEFAULT 0,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved games table
CREATE TABLE saved_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_state JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily puzzle progress table
CREATE TABLE daily_puzzle_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  total_completed INTEGER DEFAULT 0,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_puzzle_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own stats" ON game_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own achievements" ON achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own history" ON game_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own saves" ON saved_games FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own puzzle progress" ON daily_puzzle_progress FOR ALL USING (auth.uid() = user_id);
```

### 5. Run the App

#### Development Server (with Expo Go)

```bash
# Start the Expo development server
yarn start
# or
npx expo start
```

This will display a QR code. Scan it with:
- **iOS**: Camera app → tap the Expo notification
- **Android**: Expo Go app → Scan QR code

#### Run on Specific Platform

```bash
# iOS Simulator
yarn ios
# or
npx expo start --ios

# Android Emulator
yarn android
# or
npx expo start --android

# Web Browser
yarn web
# or
npx expo start --web
```

#### Tunnel Mode (for remote device testing)

If your phone isn't on the same network:

```bash
npx expo start --tunnel
```

---

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start Expo development server |
| `yarn android` | Run on Android emulator/device |
| `yarn ios` | Run on iOS simulator/device |
| `yarn web` | Run in web browser |
| `yarn lint` | Run ESLint for code quality |

---

## 🔐 Authentication Flow

1. **Email/Password** — Standard Supabase auth
2. **Google Sign-In** — OAuth via `expo-auth-session`

The app automatically:
- Persists sessions using AsyncStorage
- Refreshes tokens when app comes to foreground
- Syncs user data to Supabase on login

---

## 📱 Screens Overview

| Screen | Route | Description |
|--------|-------|-------------|
| Home | `/` (tabs) | Main menu with play options |
| Game | `/game` | Active game board |
| Login | `/login` | Sign in screen |
| Sign Up | `/signup` | Create account |
| Profile | `/me` (tabs) | User profile & stats |
| Daily Puzzle | `/daily-puzzle` | Daily challenge mode |
| Achievements | `/collection` (tabs) | Achievement collection |
| Paywall | `/paywall` | Premium subscription |
| Settings | `/settings` | App settings |

---

## 🧪 Testing the App

### Manual Testing Checklist

1. **Auth Flow**
   - [ ] Sign up with email
   - [ ] Login with email
   - [ ] Google Sign-In
   - [ ] Logout

2. **Gameplay**
   - [ ] Start AI game (all difficulties)
   - [ ] Start local 2P game
   - [ ] Move pawn
   - [ ] Place walls
   - [ ] Win/Lose conditions
   - [ ] Resume saved game

3. **Features**
   - [ ] Daily puzzle streak
   - [ ] Achievement unlocks
   - [ ] Profile stats update
   - [ ] Offline mode (graceful degradation)

---

## 🚢 Building for Production

### Expo EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure your project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | For Google Auth | Google OAuth client ID |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) — React Native development platform
- [Supabase](https://supabase.com/) — Open source Firebase alternative
- [Zustand](https://github.com/pmndrs/zustand) — Lightweight state management
- Quoridor board game by Mirko Marchesi

---

**Built with ❤️ using React Native & Expo**
