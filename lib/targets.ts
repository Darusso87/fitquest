import { OnboardingData } from './types';

export function computeTargets(onboarding: OnboardingData, currentWeight: number) {
  // Water: 30-40ml per kg, adjusted by activity
  const baseWater = currentWeight * 35;
  const activityMultiplier = {
    low: 1.0,
    medium: 1.15,
    high: 1.3,
  }[onboarding.activityLevel];
  const waterMl = Math.round(baseWater * activityMultiplier);

  // Sleep target
  const sleepTargetHours = onboarding.age < 25 ? 8 : onboarding.age < 50 ? 7.5 : 7;

  // Steps adjusted by activity and age
  const baseSteps = onboarding.age < 40 ? 8000 : onboarding.age < 60 ? 7000 : 6000;
  const activityStepsMultiplier = {
    low: 0.8,
    medium: 1.0,
    high: 1.2,
  }[onboarding.activityLevel];
  const stepsTarget = Math.round(baseSteps * activityStepsMultiplier);

  // Protein: goal-specific (2.0-2.4g/kg for muscle, 1.8-2.2 for fat loss, 1.6-2.0 for others)
  let proteinMultiplier = 1.8;
  if (onboarding.goalType === 'build muscle') proteinMultiplier = 2.2;
  else if (onboarding.goalType === 'fat loss') proteinMultiplier = 2.0;
  else if (onboarding.goalType === 'strength') proteinMultiplier = 2.0;
  const proteinTargetG = Math.round(currentWeight * proteinMultiplier);

  // Veggies servings
  const veggiesTarget = onboarding.goalType === 'fat loss' ? 5 : 4;

  return {
    waterMl,
    sleepHours: sleepTargetHours,
    steps: stepsTarget,
    proteinG: proteinTargetG,
    veggiesServings: veggiesTarget,
  };
}

export function computeXPValues(onboarding: OnboardingData) {
  // Base XP values, adjusted by goal
  const baseWorkout = 100;
  const baseWater = 30;
  const baseFood = 40;
  const baseSleep = 35;
  const baseSteps = 25;
  const baseMobility = 20;
  const baseWeighin = 50;

  // Adjust priorities based on goal
  let workoutMultiplier = 1.0;
  let nutritionMultiplier = 1.0;
  let recoveryMultiplier = 1.0;

  switch (onboarding.goalType) {
    case 'build muscle':
      workoutMultiplier = 1.2;
      nutritionMultiplier = 1.3;
      recoveryMultiplier = 1.1;
      break;
    case 'fat loss':
      workoutMultiplier = 1.1;
      nutritionMultiplier = 1.4;
      recoveryMultiplier = 1.0;
      break;
    case 'strength':
      workoutMultiplier = 1.3;
      nutritionMultiplier = 1.1;
      recoveryMultiplier = 1.2;
      break;
    case 'endurance':
      workoutMultiplier = 1.2;
      nutritionMultiplier = 1.1;
      recoveryMultiplier = 1.1;
      break;
  }

  return {
    workout: Math.round(baseWorkout * workoutMultiplier),
    water: Math.round(baseWater * recoveryMultiplier),
    food: Math.round(baseFood * nutritionMultiplier),
    sleep: Math.round(baseSleep * recoveryMultiplier),
    steps: Math.round(baseSteps),
    mobility: Math.round(baseMobility * recoveryMultiplier),
    weighin: baseWeighin,
  };
}

export function calculateLevel(xp: number): number {
  // Level curve: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(currentLevel: number): number {
  return currentLevel * currentLevel * 100;
}
