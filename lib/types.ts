export interface OnboardingData {
  age: number;
  sex: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'low' | 'medium' | 'high';
  typicalSleep: number; // hours
  experience: 'beginner' | 'intermediate' | 'advanced';
  goalType: 'fat loss' | 'build muscle' | 'strength' | 'endurance' | 'general health';
  timeline: 4 | 8 | 12; // weeks
  trainingDays: 2 | 3 | 4 | 5 | 6;
  minutesPerSession: 20 | 30 | 45 | 60;
  homeSetup: 'none' | 'resistance_bands' | 'light_dumbbells'; // CHANGED from equipment
  limitations: {
    type: 'none' | 'lower' | 'upper' | 'back' | 'other';
    details?: string;
  };
  foodsLike: string[];
  foodsDislike: string[];
  allergies: {
    hasAllergies: boolean;
    details?: string;
  };
  cookingTime: 'low' | 'medium' | 'high';
  mealsPerDay: 2 | 3 | 4 | 5;
  coachTone: 'strict' | 'friendly' | 'competitive';
  photo?: string; // base64
}

export interface Exercise {
  id: string; // ADDED: unique exercise ID for tracking
  name: string;
  sets: number;
  reps: string;
  rest: string;
  timeSec?: number; // ADDED: for time-based exercises like plank
  mediaUrl: string;
  alternatives: string[];
  notes?: string;
  isWarmup?: boolean; // ADDED
  isCooldown?: boolean; // ADDED
}

export interface ExerciseProgress {
  exerciseId: string;
  repsSavedTotal: number;
  timeSavedTotal?: number; // for time-based exercises
  sets: Array<{
    reps?: number;
    timeSec?: number;
    timestamp: string;
    source: 'camera' | 'manual';
  }>;
  completed: boolean;
}

export interface CameraCalibration {
  exerciseId: string;
  topBaseline: number;
  bottomBaseline: number;
  timestamp: string;
}

export interface Workout {
  id: string;
  name: string;
  warmup: Exercise[];
  exercises: Exercise[];
  cooldown: Exercise[];
  estimatedMinutes: number;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  veggieServings: number;
  cookingTime: number;
  ingredients: string[];
  instructions: string[];
}

export interface DayPlan {
  date: string; // YYYY-MM-DD
  type: 'workout' | 'rest';
  workoutId?: string;
  mealIds: string[];
  targets: {
    waterMl: number;
    sleepHours: number;
    steps: number;
    proteinG: number;
    veggiesServings: number;
  };
  hasWeighIn: boolean;
}

export interface DayLog {
  date: string;
  waterMl: number;
  sleepBed?: string;
  sleepWake?: string;
  sleepHours?: number;
  steps?: number;
  proteinG?: number;
  veggiesServings?: number;
  workoutCompleted: boolean;
  exercises?: { [exerciseId: string]: ExerciseProgress }; // ADDED: per-exercise tracking
  missionCompleted: {
    workout: boolean;
    water: boolean;
    food: boolean;
    sleep: boolean;
    steps: boolean;
    mobility: boolean;
    weighin: boolean;
  };
  xpEarned: {
    workout: number;
    water: number;
    food: number;
    sleep: number;
    steps: number;
    mobility: number;
    weighin: number;
  };
  weight?: number;
  calibrations?: { [exerciseId: string]: CameraCalibration }; // ADDED
}

export interface GameSave {
  version: number;
  onboarding: OnboardingData;
  userPhoto?: string;
  plan: {
    startDate: string;
    timelineWeeks: number;
    days: DayPlan[];
    workoutsById: { [key: string]: Workout };
    recipesBank: Meal[];
  };
  logsByDate: { [date: string]: DayLog };
  xpTotal: number;
  level: number;
  weightHistory: Array<{ date: string; weight: number }>;
  settings: {
    arcadeIntensity: 'low' | 'medium' | 'high';
  };
}
