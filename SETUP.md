# FITQUEST - Quick Setup Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd fitquest
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📱 First Time Use

1. Click **"START QUEST"** on the home page
2. Complete all 20 onboarding questions (required)
3. Take or upload a before photo
4. Your personalized plan will be generated instantly!
5. Start completing daily missions to earn XP and level up

---

## 🎮 How to Play

### Dashboard
- **Swipe or use arrows** to browse days
- **Tap any mission** to open it
- **Only TODAY can be completed** (locked past/future days)
- Track your **Level, XP, and Weight** at the top

### Missions (7 types)
1. **💪 Workout** - Complete your training with exercise images
2. **💧 Water** - Hit your hydration goal
3. **🍽️ Food** - Follow your meal plan
4. **😴 Sleep** - Log recovery hours
5. **👟 Steps** - Track daily movement
6. **🧘 Mobility** - Optional stretching (bonus XP)
7. **⚖️ Weigh-In** - Every 2 weeks on rest days

### Bottom Nav
- **📅 Plan** - View full workout calendar
- **📊 Stats** - Track progress, streak, adherence
- **⚙️ Settings** - About & reset options

---

## ✨ Key Features

### Offline AI-Like Planner
- Generates workouts based on YOUR specs
- Progressive overload each week
- Adapts to injuries
- Equipment-specific exercises
- Personalized meal plans

### Today-Only Completion
- Prevents cheating
- Forces real-time progress
- Undo available for mistakes
- Future-proof your gains!

### No Login Required
- All data stored locally
- Works offline
- Complete privacy
- Reset anytime

---

## 🏋️ Workout Features

- **Warmup routines** - Proper preparation
- **Exercise images** - Visual guidance
- **Set tracking** - Check off as you go
- **Alternative exercises** - Swap if needed
- **Progressive difficulty** - Get stronger weekly
- **Deload weeks** - Recovery built in (8+ week plans)

---

## 🍽️ Nutrition Features

- **Daily meal plans** - Breakfast, lunch, dinner (+ snacks)
- **Macro breakdown** - Track protein, carbs, fats
- **Recipe instructions** - Step-by-step cooking
- **Meal swapping** - Don't like it? Swap it!
- **Allergy filtering** - Safe recommendations
- **Cooking time adapted** - Fits your schedule

---

## 📊 Tracking & Stats

- **XP & Levels** - Gamified progress
- **Streak counter** - Days in a row
- **Adherence rate** - Completion percentage
- **Weight history** - Track changes
- **XP breakdown** - See where you earn most

---

## 🎨 Customization

Want to tweak the experience?

### Change Colors
Edit `tailwind.config.js` → colors

### Add Exercises
Edit `lib/exercises.ts` → EXERCISE_LIBRARY

### Add Recipes
Edit `lib/recipes.ts` → RECIPE_BANK

### Adjust XP Values
Edit `lib/targets.ts` → computeXPValues()

---

## 🐛 Troubleshooting

### "Save not loading"
- Clear browser cache
- Check localStorage in DevTools
- Try incognito mode

### "Missions not completing"
- Make sure you're on TODAY's date
- Check the "TODAY" badge on dashboard
- Try refreshing the page

### "Lost my data"
- Data is stored in browser localStorage
- Clearing browser data = loses progress
- No cloud backup (privacy feature)

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
Works on any platform supporting Next.js:
- Netlify
- Railway
- Your own server

---

## 💡 Pro Tips

1. **Complete missions in order** - Workout → Water → Food → Sleep → Steps
2. **Use the swap button** - Don't like a meal? Swap it!
3. **Check exercise alternatives** - Can't do an exercise? Alternatives provided
4. **Track weight bi-weekly** - Patience is key
5. **Undo is your friend** - Accidentally completed something? Undo it!
6. **Rest days matter** - Active recovery quests earn XP too
7. **Build your streak** - Consistency > intensity

---

## 🎯 Goals & Tracking

The app adapts to YOUR goal:
- **Fat Loss** - Higher reps, lower rest, veggie focus
- **Muscle Gain** - Moderate reps, protein priority
- **Strength** - Lower reps, longer rest
- **Endurance** - High reps, cardio emphasis
- **General Health** - Balanced approach

---

## 🔒 Privacy & Data

- ✅ No tracking
- ✅ No analytics
- ✅ No server communication
- ✅ No account creation
- ✅ All data stored locally
- ✅ You control everything

---

## 🎮 Enjoy Your Quest!

Remember: **You can only complete missions for TODAY.** This isn't a bug—it's a feature to keep you honest and consistent!

**Level up your fitness, one mission at a time. Let's GO! 💪🔥**
