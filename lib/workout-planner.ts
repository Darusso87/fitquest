import { OnboardingData, Workout, Exercise } from './types';
import { EXERCISE_LIBRARY } from './exercises';

export function generateWorkoutPlan(
  onboarding: OnboardingData,
  weekNumber: number,
  dayInWeek: number
): Workout {
  const { experience, goalType, minutesPerSession, equipment, limitations, trainingDays } = onboarding;
  
  // Determine if this is a deload week (every 4th week for 8+ week plans)
  const isDeloadWeek = onboarding.timeline >= 8 && weekNumber % 4 === 0;
  
  // Choose split based on training days
  const split = determineSplit(trainingDays, dayInWeek);
  
  // Select exercises based on equipment and focus
  const exercises = selectExercises(equipment, split, experience, limitations, isDeloadWeek);
  
  // Apply progressive overload
  const progressedExercises = applyProgression(exercises, weekNumber, experience, goalType, isDeloadWeek);
  
  // Get warmup and cooldown
  const warmup = EXERCISE_LIBRARY.warmup[experience];
  const cooldown = EXERCISE_LIBRARY.cooldown.all;
  
  // Adjust for time constraint
  const finalExercises = adjustForTime(progressedExercises, minutesPerSession, warmup.length, cooldown.length);
  
  return {
    id: `workout_w${weekNumber}_d${dayInWeek}`,
    name: `Week ${weekNumber} - ${split}`,
    warmup,
    exercises: finalExercises,
    cooldown,
    estimatedMinutes: minutesPerSession,
  };
}

function determineSplit(trainingDays: number, dayInWeek: number): string {
  if (trainingDays === 2) {
    // Full body split
    return 'Full Body';
  } else if (trainingDays === 3) {
    // Push / Pull / Legs
    const cycle = ['Push', 'Pull', 'Legs'];
    return cycle[dayInWeek % 3];
  } else if (trainingDays === 4) {
    // Upper / Lower / Upper / Lower
    const cycle = ['Upper', 'Lower', 'Upper', 'Lower'];
    return cycle[dayInWeek % 4];
  } else if (trainingDays === 5) {
    // Push / Pull / Legs / Upper / Lower
    const cycle = ['Push', 'Pull', 'Legs', 'Upper Power', 'Lower Power'];
    return cycle[dayInWeek % 5];
  } else {
    // 6 days: PPL x2
    const cycle = ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'];
    return cycle[dayInWeek % 6];
  }
}

function selectExercises(
  equipment: string,
  split: string,
  experience: string,
  limitations: OnboardingData['limitations'],
  isDeloadWeek: boolean
): Exercise[] {
  const exercises: Exercise[] = [];
  
  // Get exercise pool based on equipment
  let pool: any;
  switch (equipment) {
    case 'none':
      pool = EXERCISE_LIBRARY.bodyweight;
      break;
    case 'dumbbells':
      pool = { ...EXERCISE_LIBRARY.bodyweight, ...EXERCISE_LIBRARY.dumbbell };
      break;
    case 'home gym':
    case 'full gym':
      pool = { ...EXERCISE_LIBRARY.bodyweight, ...EXERCISE_LIBRARY.dumbbell, ...EXERCISE_LIBRARY.gym };
      break;
    default:
      pool = EXERCISE_LIBRARY.bodyweight;
  }
  
  // Select based on split
  if (split.includes('Upper') || split === 'Push') {
    // Upper body exercises
    const upperPool = pool.upper || [];
    exercises.push(...selectFromPool(upperPool, split === 'Push' ? 4 : 5, limitations));
  } else if (split.includes('Lower') || split === 'Legs') {
    // Lower body exercises
    const lowerPool = pool.lower || [];
    exercises.push(...selectFromPool(lowerPool, 5, limitations));
  } else if (split === 'Pull') {
    // Back and biceps
    const pullPool = (pool.upper || []).filter((ex: any) => 
      ex.name.includes('Row') || ex.name.includes('Pull') || ex.name.includes('Curl')
    );
    exercises.push(...selectFromPool(pullPool, 4, limitations));
    
    // Add some bodyweight if limited options
    if (exercises.length < 3) {
      exercises.push(...selectFromPool(EXERCISE_LIBRARY.bodyweight.upper, 2, limitations));
    }
  } else {
    // Full Body
    const upperPool = pool.upper || EXERCISE_LIBRARY.bodyweight.upper;
    const lowerPool = pool.lower || EXERCISE_LIBRARY.bodyweight.lower;
    const fullbodyPool = EXERCISE_LIBRARY.bodyweight.fullbody || [];
    
    exercises.push(...selectFromPool(upperPool, 2, limitations));
    exercises.push(...selectFromPool(lowerPool, 2, limitations));
    exercises.push(...selectFromPool(fullbodyPool, 1, limitations));
  }
  
  return exercises;
}

function selectFromPool(
  pool: any[],
  count: number,
  limitations: OnboardingData['limitations']
): Exercise[] {
  const selected: Exercise[] = [];
  const available = [...pool];
  
  // Filter based on limitations
  const filtered = available.filter(ex => {
    if (limitations.type === 'back' && 
        (ex.name.includes('Deadlift') || ex.name.includes('Good Morning'))) {
      return false;
    }
    if (limitations.type === 'lower' && 
        (ex.name.includes('Jump') || ex.name.includes('Lunge'))) {
      return false;
    }
    if (limitations.type === 'upper' && 
        (ex.name.includes('Press') || ex.name.includes('Push'))) {
      return false;
    }
    return true;
  });
  
  // Select unique exercises
  for (let i = 0; i < Math.min(count, filtered.length); i++) {
    const index = Math.floor(Math.random() * filtered.length);
    const exercise = filtered.splice(index, 1)[0];
    
    selected.push({
      ...exercise,
      sets: 3,
      reps: '10-12',
      rest: '60s',
    });
  }
  
  return selected;
}

function applyProgression(
  exercises: Exercise[],
  weekNumber: number,
  experience: string,
  goalType: string,
  isDeloadWeek: boolean
): Exercise[] {
  if (isDeloadWeek) {
    // Deload: reduce volume by 40%
    return exercises.map(ex => ({
      ...ex,
      sets: Math.max(2, Math.floor(ex.sets * 0.6)),
      reps: ex.reps.replace(/\d+/g, (match) => Math.floor(parseInt(match) * 0.7).toString()),
    }));
  }
  
  // Progressive overload based on week number
  const progressionFactor = 1 + (weekNumber - 1) * 0.1;
  
  return exercises.map(ex => {
    let sets = ex.sets;
    let reps = ex.reps;
    let rest = ex.rest;
    
    // Adjust based on goal
    if (goalType === 'strength') {
      // Lower reps, more sets, longer rest
      sets = Math.min(5, Math.floor(ex.sets * progressionFactor));
      reps = '4-6';
      rest = '120s';
    } else if (goalType === 'build muscle') {
      // Moderate reps, progressive sets
      sets = Math.min(4, Math.floor(ex.sets + weekNumber * 0.3));
      reps = '8-12';
      rest = '75s';
    } else if (goalType === 'endurance') {
      // Higher reps, shorter rest
      sets = Math.min(4, ex.sets + Math.floor(weekNumber * 0.2));
      reps = '15-20';
      rest = '45s';
    } else if (goalType === 'fat loss') {
      // Circuit style, minimal rest
      sets = ex.sets;
      reps = '12-15';
      rest = '45s';
    }
    
    // Experience modifier
    if (experience === 'beginner') {
      sets = Math.max(2, Math.min(3, sets));
    } else if (experience === 'advanced') {
      sets = Math.min(5, sets + 1);
    }
    
    return {
      ...ex,
      sets,
      reps,
      rest,
    };
  });
}

function adjustForTime(
  exercises: Exercise[],
  targetMinutes: number,
  warmupCount: number,
  cooldownCount: number
): Exercise[] {
  // Estimate time per exercise (sets * avg_time + rest)
  const avgTimePerSet = 45; // seconds
  const warmupTime = warmupCount * 2; // minutes
  const cooldownTime = cooldownCount * 2; // minutes
  const availableTime = targetMinutes - warmupTime - cooldownTime;
  
  let totalTime = 0;
  const adjusted: Exercise[] = [];
  
  for (const ex of exercises) {
    const restSeconds = parseInt(ex.rest.replace('s', '')) || 60;
    const exerciseTime = (ex.sets * avgTimePerSet + (ex.sets - 1) * restSeconds) / 60;
    
    if (totalTime + exerciseTime <= availableTime) {
      adjusted.push(ex);
      totalTime += exerciseTime;
    } else if (adjusted.length < 3) {
      // Ensure at least 3 main exercises
      adjusted.push(ex);
    }
  }
  
  return adjusted;
}

export function generateRestDayQuest(weekNumber: number, dayNumber: number): string {
  const quests = [
    '20-min Recovery Walk',
    '15-min Gentle Yoga Flow',
    '10-min Foam Rolling Session',
    '25-min Nature Walk',
    'Active Rest: Light Bike Ride',
    'Mobility & Breathing Practice',
    'Explore Quest: Walk Somewhere New',
  ];
  
  // Deterministic selection based on week and day
  const index = (weekNumber * 7 + dayNumber) % quests.length;
  return quests[index];
}
