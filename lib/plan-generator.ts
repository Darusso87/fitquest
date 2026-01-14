import { OnboardingData, DayPlan, Workout, Meal, GameSave } from './types';
import { computeTargets } from './targets';
import { generateWorkoutPlan, generateRestDayQuest } from './workout-planner';
import { RECIPE_BANK, filterRecipesByPreferences } from './recipes';
import { addDays, getTodayString } from './storage';

export function generateCompletePlan(onboarding: OnboardingData): GameSave['plan'] {
  const startDate = getTodayString();
  const timelineWeeks = onboarding.timeline;
  const totalDays = timelineWeeks * 7;
  
  const days: DayPlan[] = [];
  const workoutsById: { [key: string]: Workout } = {};
  
  // Filter recipes based on preferences
  const availableRecipes = filterRecipesByPreferences(
    RECIPE_BANK,
    onboarding.foodsLike,
    onboarding.foodsDislike,
    onboarding.allergies.details || '',
    onboarding.cookingTime
  );
  
  // Compute initial targets
  const targets = computeTargets(onboarding, onboarding.weight);
  
  // Distribute workout days across the week
  const workoutPattern = generateWorkoutPattern(onboarding.trainingDays);
  
  let workoutDayCounter = 0;
  
  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    const date = addDays(startDate, dayIndex);
    const weekNumber = Math.floor(dayIndex / 7) + 1;
    const dayInWeek = dayIndex % 7;
    
    // Determine if this is a workout day based on pattern
    const isWorkoutDay = workoutPattern[dayInWeek];
    
    // Check if this should be a weigh-in day (every 14 days, on a rest day)
    const hasWeighIn = !isWorkoutDay && (dayIndex + 1) % 14 === 0 && dayIndex > 0;
    
    if (isWorkoutDay) {
      // Generate workout
      const workout = generateWorkoutPlan(onboarding, weekNumber, workoutDayCounter);
      workoutsById[workout.id] = workout;
      
      days.push({
        date,
        type: 'workout',
        workoutId: workout.id,
        mealIds: generateDailyMealIds(availableRecipes, dayIndex, onboarding.mealsPerDay),
        targets,
        hasWeighIn: false,
      });
      
      workoutDayCounter++;
    } else {
      // Rest day
      days.push({
        date,
        type: 'rest',
        mealIds: generateDailyMealIds(availableRecipes, dayIndex, onboarding.mealsPerDay),
        targets,
        hasWeighIn,
      });
    }
  }
  
  return {
    startDate,
    timelineWeeks,
    days,
    workoutsById,
    recipesBank: availableRecipes,
  };
}

function generateWorkoutPattern(trainingDays: number): boolean[] {
  // Generate a 7-day pattern with optimal distribution
  // ALWAYS start with a workout day (index 0)
  const pattern = [true, false, false, false, false, false, false]; // Day 1 is always workout
  
  if (trainingDays === 2) {
    // Day 1, Day 4
    pattern[0] = true;
    pattern[3] = true;
  } else if (trainingDays === 3) {
    // Day 1, Day 3, Day 5
    pattern[0] = true;
    pattern[2] = true;
    pattern[4] = true;
  } else if (trainingDays === 4) {
    // Day 1, Day 2, Day 4, Day 5
    pattern[0] = true;
    pattern[1] = true;
    pattern[3] = true;
    pattern[4] = true;
  } else if (trainingDays === 5) {
    // Day 1-5
    pattern[0] = true;
    pattern[1] = true;
    pattern[2] = true;
    pattern[3] = true;
    pattern[4] = true;
  } else if (trainingDays === 6) {
    // Day 1-6
    pattern[0] = true;
    pattern[1] = true;
    pattern[2] = true;
    pattern[3] = true;
    pattern[4] = true;
    pattern[5] = true;
  }
  
  return pattern;
}

function generateDailyMealIds(
  recipes: Meal[],
  dayIndex: number,
  mealsPerDay: number
): string[] {
  const mealIds: string[] = [];
  
  // Get breakfast
  const breakfasts = recipes.filter(r => r.type === 'breakfast');
  if (breakfasts.length > 0) {
    const bfIndex = dayIndex % breakfasts.length;
    mealIds.push(breakfasts[bfIndex].id);
  }
  
  // Get lunch
  const lunches = recipes.filter(r => r.type === 'lunch');
  if (lunches.length > 0) {
    const lnIndex = (dayIndex + 3) % lunches.length; // Offset for variety
    mealIds.push(lunches[lnIndex].id);
  }
  
  // Get dinner
  const dinners = recipes.filter(r => r.type === 'dinner');
  if (dinners.length > 0) {
    const dnIndex = (dayIndex + 7) % dinners.length; // Different offset
    mealIds.push(dinners[dnIndex].id);
  }
  
  // Add snacks if meals per day >= 4
  if (mealsPerDay >= 4) {
    const snacks = recipes.filter(r => r.type === 'snack');
    if (snacks.length > 0) {
      const snIndex = (dayIndex + 2) % snacks.length;
      mealIds.push(snacks[snIndex].id);
    }
  }
  
  // Add extra snack if 5 meals
  if (mealsPerDay === 5) {
    const snacks = recipes.filter(r => r.type === 'snack');
    if (snacks.length > 1) {
      const snIndex = (dayIndex + 5) % snacks.length;
      mealIds.push(snacks[snIndex].id);
    }
  }
  
  return mealIds;
}

export function rerollMeals(
  currentMealIds: string[],
  recipesBank: Meal[],
  dayIndex: number
): string[] {
  // Get current meal types
  const currentMeals = currentMealIds.map(id => 
    recipesBank.find(r => r.id === id)
  ).filter(Boolean) as Meal[];
  
  const newMealIds: string[] = [];
  
  for (const meal of currentMeals) {
    const sameType = recipesBank.filter(r => r.type === meal.type && r.id !== meal.id);
    if (sameType.length > 0) {
      // Use dayIndex + random seed for deterministic but different selection
      const newIndex = (dayIndex + Date.now()) % sameType.length;
      newMealIds.push(sameType[newIndex].id);
    } else {
      // No alternatives, keep the same
      newMealIds.push(meal.id);
    }
  }
  
  return newMealIds;
}

export function initializeGameSave(onboarding: OnboardingData): GameSave {
  const plan = generateCompletePlan(onboarding);
  
  return {
    version: 5,
    onboarding,
    userPhoto: onboarding.photo,
    plan,
    logsByDate: {},
    xpTotal: 0,
    level: 1,
    weightHistory: [
      { date: getTodayString(), weight: onboarding.weight }
    ],
    settings: {
      arcadeIntensity: 'medium',
    },
  };
}
