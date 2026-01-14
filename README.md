# FITQUEST - Arcade Fitness Tracker

A complete mobile-first fitness tracking web app with Street Fighter-inspired arcade aesthetics. Features an offline AI-like workout and nutrition planner with progressive overload, injury adaptation, and personalized meal recommendations.

## Features

### 🎮 Arcade Experience
- Neon-themed UI with crisp, modern design
- XP system with level progression
- Daily mission-based gameplay
- Street Fighter energy with clean, readable typography

### 🏋️ Smart Workout Planner (Offline AI-like)
- Deterministic workout generation based on 13+ factors
- Progressive overload week-to-week
- Deload weeks for 8+ week programs
- Injury-adaptive exercise selection
- Equipment-specific routines (bodyweight, dumbbells, home gym, full gym)
- Multiple training splits (2-6 days/week)
- Exercise images and alternatives
- Warm-up and cooldown routines

### 🍽️ Nutrition System
- Personalized meal recommendations
- Goal-specific macros (fat loss, muscle gain, etc.)
- Allergy and preference filtering
- Quick meal swapping
- Recipe instructions with cooking times

### 📊 Comprehensive Tracking
- **Workouts**: Set-by-set tracking with exercise images
- **Water**: Daily hydration goals with quick-add buttons
- **Nutrition**: Meal-by-meal tracking with macros
- **Sleep**: Recovery tracking with quality feedback
- **Steps**: Daily movement goals
- **Mobility**: Optional stretching sessions
- **Weigh-ins**: Bi-weekly progress checks

### 🎯 Core Features
- Today-only mission completion (prevents future/past cheating)
- Swipeable day navigation
- Undo functionality for all missions
- Progressive workout difficulty
- Weight-based target adjustments
- Streak tracking
- Adherence statistics
- Level system with XP

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: LocalStorage (no backend required)
- **Fonts**: Russo One (display) + Inter (body)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
fitquest/
├── app/
│   ├── dashboard/         # Main mission hub
│   ├── mission/          # Mission pages
│   │   ├── workout/
│   │   ├── water/
│   │   ├── food/
│   │   ├── sleep/
│   │   ├── steps/
│   │   ├── mobility/
│   │   └── weighin/
│   ├── onboarding/       # 20-step setup wizard
│   ├── plan/             # Workout calendar
│   ├── progress/         # Stats & history
│   ├── settings/         # App settings
│   └── page.tsx          # Landing page
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── storage.ts        # LocalStorage utils
│   ├── targets.ts        # Goal calculations
│   ├── exercises.ts      # Exercise database
│   ├── recipes.ts        # Recipe database
│   ├── workout-planner.ts # AI-like workout generator
│   └── plan-generator.ts  # Complete plan orchestrator
└── components/           # Reusable components
```

## How It Works

### Onboarding (20 Required Steps)
1. Age, sex, height, weight
2. Activity level, typical sleep, experience
3. Goal type, timeline, training frequency
4. Session duration, available equipment
5. Injuries/limitations
6. Food preferences (5+ required)
7. Dislikes and allergies
8. Cooking time, meals/day, coach tone
9. Before photo (required)

### AI-Like Planner Logic

The app uses sophisticated deterministic algorithms to generate personalized plans:

**Workout Generation:**
- Analyzes 13+ onboarding factors
- Selects appropriate training split (Full Body, Push/Pull/Legs, Upper/Lower)
- Chooses exercises based on equipment and limitations
- Applies progressive overload (sets, reps, rest periods)
- Implements deload weeks for longer programs
- Adjusts difficulty by experience level
- Filters unsafe exercises based on injuries

**Nutrition Planning:**
- Filters recipes by preferences, allergies, cooking time
- Rotates meals daily for variety
- Calculates goal-specific macros
- Adjusts protein based on weight and goal
- Provides meal swap functionality

### Day Navigation & Completion Rules

- Swipe or use arrows to browse any day
- "Today" badge shows current day
- **Only today's missions can be completed**
- Past days are locked
- Future days are locked
- Each mission awards XP when completed
- Undo available (today only)

### Progression System

- XP earned from completing missions
- Level = floor(sqrt(XP / 100)) + 1
- Higher levels require more XP
- Workouts increase in difficulty weekly
- Targets adjust based on weigh-ins

## Key Design Decisions

### Mobile-First
- Touch-optimized interfaces
- Swipe gestures
- Large tap targets
- Responsive layouts

### Offline-First
- No external API calls
- All data in localStorage
- Works without internet
- Deterministic "AI" logic

### Arcade Aesthetic
- Neon color scheme (cyan, pink, yellow, green, purple)
- Russo One display font for headers
- Inter font for readable body text
- Animated progress bars
- Glow effects on interactions

### Today-Only Completion
Prevents gaming the system:
- Can't complete future workouts
- Can't retroactively complete past days
- Enforces real-time progress
- Undo available for mistakes

## Data Model

All data stored in `localStorage` under key `fitquest_save_v5`:

```typescript
{
  version: 5,
  onboarding: { /* 20 fields */ },
  userPhoto: string,
  plan: {
    startDate: string,
    timelineWeeks: number,
    days: DayPlan[],
    workoutsById: { [id]: Workout },
    recipesBank: Meal[]
  },
  logsByDate: {
    [date]: {
      waterMl, sleepHours, steps, weight,
      missionCompleted: { workout, water, food, ... },
      xpEarned: { workout, water, food, ... }
    }
  },
  xpTotal: number,
  level: number,
  weightHistory: Array<{date, weight}>,
  settings: { arcadeIntensity }
}
```

## Customization

### Adding Exercises
Edit `lib/exercises.ts`:
```typescript
EXERCISE_LIBRARY.bodyweight.upper.push({
  name: 'New Exercise',
  mediaUrl: 'https://...',
  alternatives: ['Alt1', 'Alt2']
});
```

### Adding Recipes
Edit `lib/recipes.ts`:
```typescript
RECIPE_BANK.push({
  id: 'meal_new',
  name: 'New Meal',
  type: 'breakfast',
  protein: 30,
  carbs: 40,
  fats: 15,
  calories: 400,
  veggieServings: 2,
  cookingTime: 20,
  ingredients: [...],
  instructions: [...]
});
```

### Theming
Modify colors in `tailwind.config.js`:
```javascript
colors: {
  neon: {
    cyan: '#00f6ff',
    pink: '#ff006e',
    // ...
  }
}
```

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern mobile browsers

## Performance

- Lightweight (~500KB JS bundle)
- No external dependencies at runtime
- Instant page transitions
- LocalStorage for fast data access

## Privacy

- No tracking or analytics
- No server communication
- All data stored locally
- No account required
- Reset data anytime in settings

## License

MIT License - feel free to use and modify!

## Credits

Built with ❤️ for the fitness community.

---

**Ready to start your FITQUEST? Let's go! 💪🎮**
