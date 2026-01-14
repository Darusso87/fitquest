import { Exercise } from './types';

// Exercise media URLs (using real fitness images)
const EXERCISE_MEDIA: { [key: string]: string } = {
  // Warmup
  'Jumping Jacks': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
  'Arm Circles': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop',
  'Leg Swings': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
  'High Knees': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
  'Butt Kicks': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
  
  // Bodyweight
  'Push-ups': 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=400&h=300&fit=crop',
  'Squats': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop',
  'Lunges': 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=400&h=300&fit=crop',
  'Plank': 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=400&h=300&fit=crop',
  'Mountain Climbers': 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=400&h=300&fit=crop',
  'Burpees': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
  'Pull-ups': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
  'Dips': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
  'Glute Bridges': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop',
  
  // Dumbbell
  'Dumbbell Press': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
  'Dumbbell Rows': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
  'Goblet Squats': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop',
  'Dumbbell Curls': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
  'Shoulder Press': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
  'Dumbbell Lunges': 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=400&h=300&fit=crop',
  
  // Gym equipment
  'Bench Press': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
  'Barbell Squats': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop',
  'Deadlifts': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
  'Lat Pulldowns': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
  'Leg Press': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop',
  'Cable Rows': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
  
  // Stretch/Cooldown
  'Cat-Cow Stretch': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=300&fit=crop',
  'Child Pose': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=300&fit=crop',
  'Hamstring Stretch': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=300&fit=crop',
  'Quad Stretch': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
  'Shoulder Stretch': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop',
};

function getExerciseMedia(name: string): string {
  return EXERCISE_MEDIA[name] || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop&q=80&text=' + encodeURIComponent(name);
}

export const EXERCISE_LIBRARY = {
  warmup: {
    beginner: [
      {
        name: 'Jumping Jacks',
        sets: 1,
        reps: '20',
        rest: '30s',
        mediaUrl: getExerciseMedia('Jumping Jacks'),
        alternatives: ['High Knees', 'Butt Kicks'],
      },
      {
        name: 'Arm Circles',
        sets: 1,
        reps: '10 each direction',
        rest: '20s',
        mediaUrl: getExerciseMedia('Arm Circles'),
        alternatives: ['Shoulder Rolls'],
      },
      {
        name: 'Leg Swings',
        sets: 1,
        reps: '10 each leg',
        rest: '20s',
        mediaUrl: getExerciseMedia('Leg Swings'),
        alternatives: ['Walking Lunges'],
      },
    ],
    intermediate: [
      {
        name: 'Jumping Jacks',
        sets: 2,
        reps: '30',
        rest: '20s',
        mediaUrl: getExerciseMedia('Jumping Jacks'),
        alternatives: ['High Knees'],
      },
      {
        name: 'High Knees',
        sets: 2,
        reps: '20',
        rest: '20s',
        mediaUrl: getExerciseMedia('High Knees'),
        alternatives: ['Butt Kicks'],
      },
      {
        name: 'Arm Circles',
        sets: 1,
        reps: '15 each direction',
        rest: '15s',
        mediaUrl: getExerciseMedia('Arm Circles'),
        alternatives: ['Band Pull-Aparts'],
      },
    ],
    advanced: [
      {
        name: 'Jumping Jacks',
        sets: 2,
        reps: '40',
        rest: '15s',
        mediaUrl: getExerciseMedia('Jumping Jacks'),
        alternatives: ['Jump Rope'],
      },
      {
        name: 'High Knees',
        sets: 2,
        reps: '30',
        rest: '15s',
        mediaUrl: getExerciseMedia('High Knees'),
        alternatives: ['Butt Kicks'],
      },
      {
        name: 'Burpees',
        sets: 1,
        reps: '10',
        rest: '30s',
        mediaUrl: getExerciseMedia('Burpees'),
        alternatives: ['Mountain Climbers'],
      },
    ],
  },
  
  cooldown: {
    all: [
      {
        name: 'Cat-Cow Stretch',
        sets: 1,
        reps: '10',
        rest: '0s',
        mediaUrl: getExerciseMedia('Cat-Cow Stretch'),
        alternatives: ['Child Pose'],
      },
      {
        name: 'Hamstring Stretch',
        sets: 1,
        reps: '30s each leg',
        rest: '0s',
        mediaUrl: getExerciseMedia('Hamstring Stretch'),
        alternatives: ['Seated Forward Fold'],
      },
      {
        name: 'Quad Stretch',
        sets: 1,
        reps: '30s each leg',
        rest: '0s',
        mediaUrl: getExerciseMedia('Quad Stretch'),
        alternatives: ['Standing Quad Stretch'],
      },
      {
        name: 'Shoulder Stretch',
        sets: 1,
        reps: '30s each arm',
        rest: '0s',
        mediaUrl: getExerciseMedia('Shoulder Stretch'),
        alternatives: ['Chest Opener'],
      },
    ],
  },
  
  bodyweight: {
    upper: [
      {
        name: 'Push-ups',
        mediaUrl: getExerciseMedia('Push-ups'),
        alternatives: ['Knee Push-ups', 'Incline Push-ups', 'Diamond Push-ups'],
      },
      {
        name: 'Dips',
        mediaUrl: getExerciseMedia('Dips'),
        alternatives: ['Bench Dips', 'Chair Dips'],
      },
      {
        name: 'Pull-ups',
        mediaUrl: getExerciseMedia('Pull-ups'),
        alternatives: ['Inverted Rows', 'Assisted Pull-ups'],
      },
      {
        name: 'Plank',
        mediaUrl: getExerciseMedia('Plank'),
        alternatives: ['Knee Plank', 'Side Plank'],
      },
    ],
    lower: [
      {
        name: 'Squats',
        mediaUrl: getExerciseMedia('Squats'),
        alternatives: ['Box Squats', 'Jump Squats'],
      },
      {
        name: 'Lunges',
        mediaUrl: getExerciseMedia('Lunges'),
        alternatives: ['Reverse Lunges', 'Walking Lunges'],
      },
      {
        name: 'Glute Bridges',
        mediaUrl: getExerciseMedia('Glute Bridges'),
        alternatives: ['Single-Leg Bridges', 'Hip Thrusts'],
      },
    ],
    fullbody: [
      {
        name: 'Burpees',
        mediaUrl: getExerciseMedia('Burpees'),
        alternatives: ['Half Burpees', 'Burpee Variations'],
      },
      {
        name: 'Mountain Climbers',
        mediaUrl: getExerciseMedia('Mountain Climbers'),
        alternatives: ['Plank Jacks', 'Running Planks'],
      },
    ],
  },
  
  dumbbell: {
    upper: [
      {
        name: 'Dumbbell Press',
        mediaUrl: getExerciseMedia('Dumbbell Press'),
        alternatives: ['Floor Press', 'Incline DB Press'],
      },
      {
        name: 'Dumbbell Rows',
        mediaUrl: getExerciseMedia('Dumbbell Rows'),
        alternatives: ['Single-Arm Rows', 'Bent-Over Rows'],
      },
      {
        name: 'Shoulder Press',
        mediaUrl: getExerciseMedia('Shoulder Press'),
        alternatives: ['Arnold Press', 'Seated Press'],
      },
      {
        name: 'Dumbbell Curls',
        mediaUrl: getExerciseMedia('Dumbbell Curls'),
        alternatives: ['Hammer Curls', 'Concentration Curls'],
      },
    ],
    lower: [
      {
        name: 'Goblet Squats',
        mediaUrl: getExerciseMedia('Goblet Squats'),
        alternatives: ['DB Squats', 'Sumo Squats'],
      },
      {
        name: 'Dumbbell Lunges',
        mediaUrl: getExerciseMedia('Dumbbell Lunges'),
        alternatives: ['Bulgarian Split Squats', 'Walking Lunges'],
      },
    ],
  },
  
  gym: {
    upper: [
      {
        name: 'Bench Press',
        mediaUrl: getExerciseMedia('Bench Press'),
        alternatives: ['Incline Press', 'Close-Grip Bench'],
      },
      {
        name: 'Lat Pulldowns',
        mediaUrl: getExerciseMedia('Lat Pulldowns'),
        alternatives: ['Pull-ups', 'Wide-Grip Pulldowns'],
      },
      {
        name: 'Cable Rows',
        mediaUrl: getExerciseMedia('Cable Rows'),
        alternatives: ['Barbell Rows', 'T-Bar Rows'],
      },
    ],
    lower: [
      {
        name: 'Barbell Squats',
        mediaUrl: getExerciseMedia('Barbell Squats'),
        alternatives: ['Front Squats', 'Safety Bar Squats'],
      },
      {
        name: 'Deadlifts',
        mediaUrl: getExerciseMedia('Deadlifts'),
        alternatives: ['Romanian Deadlifts', 'Trap Bar Deadlifts'],
      },
      {
        name: 'Leg Press',
        mediaUrl: getExerciseMedia('Leg Press'),
        alternatives: ['Hack Squats', 'Bulgarian Split Squats'],
      },
    ],
  },
};
