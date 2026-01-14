// Home Exercise Catalog - All Bodyweight, No Equipment Needed
export type ExerciseCategory = 'cardio' | 'lower_body' | 'upper_body' | 'core';
export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type CameraAngle = 'front' | 'side' | 'either';

export interface HomeExercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  targetMuscles: string[];
  tags: string[];
  prescription: {
    type: 'reps' | 'time';
    defaultSets?: number;
    defaultReps?: number;
    defaultTimeSec?: number;
    defaultRest?: string;
  };
  cameraSetup: {
    angle: CameraAngle;
    silhouettePath: string;
    instructions: string[];
  };
  demoMediaPath: string;
  alternatives: string[]; // IDs of alternative exercises
  avoidWhen: string[]; // limitation types to avoid
  equipment?: string; // Optional household items like "chair", "wall", "water bottles"
}

export const HOME_EXERCISE_CATALOG: HomeExercise[] = [
  // ===== CARDIO EXERCISES =====
  {
    id: 'jumping_jack',
    name: 'Jumping Jack',
    category: 'cardio',
    difficulty: 'beginner',
    targetMuscles: ['full_body', 'cardio'],
    tags: ['warmup', 'cardio', 'full_body'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 20, defaultRest: '30s' },
    cameraSetup: {
      angle: 'front',
      silhouettePath: '/silhouettes/jumping-jack.svg',
      instructions: [
        'Stand facing camera, full body visible',
        'Jump and spread arms/legs wide',
        'Land with feet together, arms down'
      ]
    },
    demoMediaPath: '/demos/jumping-jack.jpg',
    alternatives: ['high_knees', 'jump_twist'],
    avoidWhen: []
  },
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'cardio',
    difficulty: 'intermediate',
    targetMuscles: ['full_body', 'cardio'],
    tags: ['cardio', 'full_body', 'high_intensity'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/burpee.svg',
      instructions: [
        'Side view recommended',
        'Squat, jump back to plank, push-up, jump forward, jump up',
        'Full body must be visible'
      ]
    },
    demoMediaPath: '/demos/burpee.jpg',
    alternatives: ['mountain_climber', 'squat'],
    avoidWhen: ['avoid_knees']
  },
  {
    id: 'mountain_climber',
    name: 'Mountain Climber',
    category: 'cardio',
    difficulty: 'intermediate',
    targetMuscles: ['core', 'cardio', 'shoulders'],
    tags: ['cardio', 'core', 'floor'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 20, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/mountain-climber.svg',
      instructions: [
        'Start in plank position',
        'Side view works best',
        'Alternate bringing knees to chest rapidly'
      ]
    },
    demoMediaPath: '/demos/mountain-climber.jpg',
    alternatives: ['high_knees', 'burpee'],
    avoidWhen: ['avoid_shoulders']
  },
  {
    id: 'high_knees',
    name: 'High Knees',
    category: 'cardio',
    difficulty: 'beginner',
    targetMuscles: ['legs', 'cardio'],
    tags: ['cardio', 'standing', 'warmup'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 30, defaultRest: '30s' },
    cameraSetup: {
      angle: 'front',
      silhouettePath: '/silhouettes/high-knees.svg',
      instructions: [
        'Stand facing camera',
        'Run in place bringing knees to waist height',
        'Keep core engaged'
      ]
    },
    demoMediaPath: '/demos/high-knees.jpg',
    alternatives: ['jumping_jack', 'mountain_climber'],
    avoidWhen: []
  },
  {
    id: 'jump_tuck',
    name: 'Jump Tuck',
    category: 'cardio',
    difficulty: 'advanced',
    targetMuscles: ['legs', 'core', 'cardio'],
    tags: ['cardio', 'plyometric', 'explosive'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/jump-tuck.svg',
      instructions: [
        'Side view optimal',
        'Jump and bring knees to chest',
        'Land softly'
      ]
    },
    demoMediaPath: '/demos/jump-tuck.jpg',
    alternatives: ['burpee', 'squat'],
    avoidWhen: ['avoid_knees']
  },
  {
    id: 'jump_twist',
    name: 'Jump Twist',
    category: 'cardio',
    difficulty: 'intermediate',
    targetMuscles: ['core', 'legs', 'cardio'],
    tags: ['cardio', 'core', 'rotation'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '45s' },
    cameraSetup: {
      angle: 'front',
      silhouettePath: '/silhouettes/jump-twist.svg',
      instructions: [
        'Front view works best',
        'Jump and rotate hips side to side',
        'Keep upper body stable'
      ]
    },
    demoMediaPath: '/demos/jump-twist.jpg',
    alternatives: ['jumping_jack', 'high_knees'],
    avoidWhen: ['avoid_back']
  },

  // ===== LOWER BODY EXERCISES =====
  {
    id: 'squat',
    name: 'Squat',
    category: 'lower_body',
    difficulty: 'beginner',
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    tags: ['lower_body', 'compound', 'fundamental'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/squat.svg',
      instructions: [
        'Stand sideways to camera',
        'Feet shoulder-width apart',
        'Lower until thighs parallel to ground'
      ]
    },
    demoMediaPath: '/demos/squat.jpg',
    alternatives: ['wall_sit', 'pistol_squat'],
    avoidWhen: [],
    equipment: 'Optional: Hold water bottles for added resistance'
  },
  {
    id: 'wall_sit',
    name: 'Wall Sit',
    category: 'lower_body',
    difficulty: 'beginner',
    targetMuscles: ['quads', 'glutes'],
    tags: ['lower_body', 'isometric', 'avoid_knees'],
    prescription: { type: 'time', defaultSets: 3, defaultTimeSec: 30, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/wall-sit.svg',
      instructions: [
        'Back against wall',
        'Slide down until thighs parallel',
        'Hold position'
      ]
    },
    demoMediaPath: '/demos/wall-sit.jpg',
    alternatives: ['squat'],
    avoidWhen: [],
    equipment: 'Wall required'
  },
  {
    id: 'alternating_lunge',
    name: 'Alternating Lunge',
    category: 'lower_body',
    difficulty: 'intermediate',
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    tags: ['lower_body', 'unilateral', 'balance'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 20, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/lunge.svg',
      instructions: [
        'Side view recommended',
        'Step forward, lower back knee',
        'Alternate legs each rep'
      ]
    },
    demoMediaPath: '/demos/alternating-lunge.jpg',
    alternatives: ['squat'],
    avoidWhen: []
  },
  {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    category: 'lower_body',
    difficulty: 'beginner',
    targetMuscles: ['glutes', 'hamstrings', 'core'],
    tags: ['lower_body', 'floor', 'glutes'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/glute-bridge.svg',
      instructions: [
        'Lie on back, knees bent',
        'Lift hips until body forms straight line',
        'Squeeze glutes at top'
      ]
    },
    demoMediaPath: '/demos/glute-bridge.jpg',
    alternatives: ['donkey_kick'],
    avoidWhen: ['avoid_back']
  },
  {
    id: 'calf_raise',
    name: 'Calf Raise',
    category: 'lower_body',
    difficulty: 'beginner',
    targetMuscles: ['calves'],
    tags: ['lower_body', 'isolation', 'standing'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 20, defaultRest: '30s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/calf-raise.svg',
      instructions: [
        'Stand with feet hip-width',
        'Rise up on toes',
        'Lower slowly'
      ]
    },
    demoMediaPath: '/demos/calf-raise.jpg',
    alternatives: [],
    avoidWhen: [],
    equipment: 'Optional: Hold wall for balance'
  },
  {
    id: 'knee_high_dip',
    name: 'Knee High Dip',
    category: 'lower_body',
    difficulty: 'intermediate',
    targetMuscles: ['quads', 'hip_flexors'],
    tags: ['lower_body', 'balance', 'mobility'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 12, defaultRest: '45s' },
    cameraSetup: {
      angle: 'front',
      silhouettePath: '/silhouettes/knee-high-dip.svg',
      instructions: [
        'Front view works best',
        'Lift knee high, then dip down',
        'Keep balance'
      ]
    },
    demoMediaPath: '/demos/knee-high-dip.jpg',
    alternatives: ['high_knees', 'squat'],
    avoidWhen: []
  },
  {
    id: 'pistol_squat',
    name: 'Pistol Squat',
    category: 'lower_body',
    difficulty: 'advanced',
    targetMuscles: ['quads', 'glutes', 'core'],
    tags: ['lower_body', 'unilateral', 'balance', 'advanced'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 8, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/pistol-squat.svg',
      instructions: [
        'Side view optimal',
        'Squat on one leg, other leg extended',
        'Very challenging - use chair for assistance'
      ]
    },
    demoMediaPath: '/demos/pistol-squat.jpg',
    alternatives: ['squat', 'alternating_lunge'],
    avoidWhen: ['avoid_knees'],
    equipment: 'Optional: Chair for assistance'
  },
  {
    id: 'donkey_kick',
    name: 'Donkey Kick',
    category: 'lower_body',
    difficulty: 'beginner',
    targetMuscles: ['glutes', 'hamstrings'],
    tags: ['lower_body', 'glutes', 'floor'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/donkey-kick.svg',
      instructions: [
        'Start on hands and knees',
        'Kick one leg up and back',
        'Squeeze glute at top'
      ]
    },
    demoMediaPath: '/demos/donkey-kick.jpg',
    alternatives: ['glute_bridge'],
    avoidWhen: []
  },
  {
    id: 'skater',
    name: 'Skater',
    category: 'lower_body',
    difficulty: 'intermediate',
    targetMuscles: ['legs', 'glutes', 'cardio'],
    tags: ['lower_body', 'cardio', 'lateral', 'balance'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 20, defaultRest: '45s' },
    cameraSetup: {
      angle: 'front',
      silhouettePath: '/silhouettes/skater.svg',
      instructions: [
        'Front view works best',
        'Leap side to side',
        'Land on one foot, touch ground with opposite hand'
      ]
    },
    demoMediaPath: '/demos/skater.jpg',
    alternatives: ['alternating_lunge', 'side_leg_lift'],
    avoidWhen: ['avoid_knees']
  },
  {
    id: 'side_leg_lift',
    name: 'Side Leg Lift',
    category: 'lower_body',
    difficulty: 'beginner',
    targetMuscles: ['hip_abductors', 'glutes'],
    tags: ['lower_body', 'floor', 'isolation'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '30s' },
    cameraSetup: {
      angle: 'front',
      silhouettePath: '/silhouettes/side-leg-lift.svg',
      instructions: [
        'Lie on side',
        'Lift top leg up',
        'Keep leg straight'
      ]
    },
    demoMediaPath: '/demos/side-leg-lift.jpg',
    alternatives: ['donkey_kick'],
    avoidWhen: []
  },

  // ===== UPPER BODY EXERCISES =====
  {
    id: 'pushup',
    name: 'Push-up',
    category: 'upper_body',
    difficulty: 'intermediate',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    tags: ['upper_body', 'push', 'floor', 'compound'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 12, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/pushup.svg',
      instructions: [
        'Side view optimal',
        'Hands shoulder-width apart',
        'Lower chest to floor, push back up'
      ]
    },
    demoMediaPath: '/demos/pushup.jpg',
    alternatives: ['incline_pushup', 'knee_pushup'],
    avoidWhen: []
  },
  {
    id: 'incline_pushup',
    name: 'Incline Push-up',
    category: 'upper_body',
    difficulty: 'beginner',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    tags: ['upper_body', 'push', 'easier_variation'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/incline-pushup.svg',
      instructions: [
        'Hands on elevated surface (chair, table, couch)',
        'Easier than floor push-ups',
        'Side view'
      ]
    },
    demoMediaPath: '/demos/incline-pushup.jpg',
    alternatives: ['pushup', 'knee_pushup'],
    avoidWhen: [],
    equipment: 'Chair, table, or couch required'
  },
  {
    id: 'knee_pushup',
    name: 'Knee Push-up',
    category: 'upper_body',
    difficulty: 'beginner',
    targetMuscles: ['chest', 'triceps'],
    tags: ['upper_body', 'push', 'floor', 'easier_variation'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/knee-pushup.svg',
      instructions: [
        'Knees on floor',
        'Hands shoulder-width',
        'Easier than regular push-up'
      ]
    },
    demoMediaPath: '/demos/knee-pushup.jpg',
    alternatives: ['pushup', 'incline_pushup'],
    avoidWhen: []
  },
  {
    id: 'wide_pushup',
    name: 'Wide Push-up',
    category: 'upper_body',
    difficulty: 'intermediate',
    targetMuscles: ['chest', 'shoulders'],
    tags: ['upper_body', 'push', 'floor', 'chest_focus'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/wide-pushup.svg',
      instructions: [
        'Hands wider than shoulders',
        'Targets chest more',
        'Side view'
      ]
    },
    demoMediaPath: '/demos/wide-pushup.jpg',
    alternatives: ['pushup'],
    avoidWhen: ['avoid_shoulders']
  },
  {
    id: 'diamond_pushup',
    name: 'Diamond Push-up',
    category: 'upper_body',
    difficulty: 'advanced',
    targetMuscles: ['triceps', 'chest'],
    tags: ['upper_body', 'push', 'floor', 'tricep_focus'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 8, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/diamond-pushup.svg',
      instructions: [
        'Hands close together forming diamond shape',
        'Very challenging',
        'Targets triceps'
      ]
    },
    demoMediaPath: '/demos/diamond-pushup.jpg',
    alternatives: ['pushup', 'tricep_dip'],
    avoidWhen: []
  },
  {
    id: 'spiderman_pushup',
    name: 'Spiderman Push-up',
    category: 'upper_body',
    difficulty: 'advanced',
    targetMuscles: ['chest', 'core', 'obliques'],
    tags: ['upper_body', 'core', 'floor', 'advanced'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/spiderman-pushup.svg',
      instructions: [
        'During push-up, bring knee to elbow',
        'Alternates sides',
        'Advanced move combining push-up and core'
      ]
    },
    demoMediaPath: '/demos/spiderman-pushup.jpg',
    alternatives: ['pushup', 'mountain_climber'],
    avoidWhen: []
  },
  {
    id: 'tricep_dip',
    name: 'Tricep Dip',
    category: 'upper_body',
    difficulty: 'intermediate',
    targetMuscles: ['triceps', 'shoulders'],
    tags: ['upper_body', 'push', 'triceps'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 12, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/tricep-dip.svg',
      instructions: [
        'Use chair or couch',
        'Hands behind you on surface',
        'Lower body and push back up'
      ]
    },
    demoMediaPath: '/demos/tricep-dip.jpg',
    alternatives: ['diamond_pushup', 'pushup'],
    avoidWhen: ['avoid_shoulders'],
    equipment: 'Chair or couch required'
  },
  {
    id: 'tricep_extension',
    name: 'Tricep Extension',
    category: 'upper_body',
    difficulty: 'beginner',
    targetMuscles: ['triceps'],
    tags: ['upper_body', 'isolation', 'standing'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/tricep-extension.svg',
      instructions: [
        'Hold water bottle overhead',
        'Lower behind head',
        'Extend back up'
      ]
    },
    demoMediaPath: '/demos/tricep-extension.jpg',
    alternatives: ['tricep_dip'],
    avoidWhen: ['avoid_shoulders'],
    equipment: 'Water bottle or book'
  },

  // ===== CORE EXERCISES =====
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    difficulty: 'beginner',
    targetMuscles: ['abs', 'core', 'shoulders'],
    tags: ['core', 'isometric', 'floor'],
    prescription: { type: 'time', defaultSets: 3, defaultTimeSec: 30, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/plank.svg',
      instructions: [
        'Forearms on floor, body straight',
        'Side view ideal',
        'Hold position, don\'t let hips sag'
      ]
    },
    demoMediaPath: '/demos/plank.jpg',
    alternatives: ['knee_plank', 'side_plank'],
    avoidWhen: ['avoid_shoulders']
  },
  {
    id: 'side_plank',
    name: 'Side Plank',
    category: 'core',
    difficulty: 'intermediate',
    targetMuscles: ['obliques', 'core'],
    tags: ['core', 'isometric', 'floor', 'obliques'],
    prescription: { type: 'time', defaultSets: 3, defaultTimeSec: 20, defaultRest: '45s' },
    cameraSetup: {
      angle: 'front',
      silhouettePath: '/silhouettes/side-plank.svg',
      instructions: [
        'On side, forearm on floor',
        'Lift hips off floor',
        'Body forms straight line'
      ]
    },
    demoMediaPath: '/demos/side-plank.jpg',
    alternatives: ['plank'],
    avoidWhen: ['avoid_shoulders']
  },
  {
    id: 'superman',
    name: 'Superman',
    category: 'core',
    difficulty: 'beginner',
    targetMuscles: ['lower_back', 'glutes', 'core'],
    tags: ['core', 'back', 'floor'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 12, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/superman.svg',
      instructions: [
        'Lie face down',
        'Lift arms and legs off floor',
        'Hold briefly, lower'
      ]
    },
    demoMediaPath: '/demos/superman.jpg',
    alternatives: [],
    avoidWhen: ['avoid_back']
  },
  {
    id: 'in_out_crunch',
    name: 'In & Out Crunch',
    category: 'core',
    difficulty: 'intermediate',
    targetMuscles: ['abs', 'hip_flexors'],
    tags: ['core', 'floor', 'abs'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/in-out-crunch.svg',
      instructions: [
        'Sit on floor, lean back slightly',
        'Pull knees in, extend out',
        'Keep core engaged'
      ]
    },
    demoMediaPath: '/demos/in-out-crunch.jpg',
    alternatives: ['bicycle', 'crunch'],
    avoidWhen: []
  },
  {
    id: 'scissor',
    name: 'Scissor',
    category: 'core',
    difficulty: 'intermediate',
    targetMuscles: ['abs', 'hip_flexors'],
    tags: ['core', 'floor', 'lower_abs'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 20, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/scissor.svg',
      instructions: [
        'Lie on back, legs elevated',
        'Alternate legs up and down like scissors',
        'Keep lower back pressed to floor'
      ]
    },
    demoMediaPath: '/demos/scissor.jpg',
    alternatives: ['reverse_crunch', 'bicycle'],
    avoidWhen: ['avoid_back']
  },
  {
    id: 'situp',
    name: 'Sit-up',
    category: 'core',
    difficulty: 'beginner',
    targetMuscles: ['abs', 'hip_flexors'],
    tags: ['core', 'floor', 'classic'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/situp.svg',
      instructions: [
        'Lie on back, knees bent',
        'Sit all the way up',
        'Lower back down with control'
      ]
    },
    demoMediaPath: '/demos/situp.jpg',
    alternatives: ['crunch', 'in_out_crunch'],
    avoidWhen: ['avoid_back']
  },
  {
    id: 'bicycle',
    name: 'Bicycle Crunch',
    category: 'core',
    difficulty: 'intermediate',
    targetMuscles: ['abs', 'obliques'],
    tags: ['core', 'floor', 'obliques', 'rotation'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 20, defaultRest: '45s' },
    cameraSetup: {
      angle: 'front',
      silhouettePath: '/silhouettes/bicycle.svg',
      instructions: [
        'Lie on back, hands behind head',
        'Bring opposite elbow to knee',
        'Alternate in cycling motion'
      ]
    },
    demoMediaPath: '/demos/bicycle.jpg',
    alternatives: ['in_out_crunch', 'scissor'],
    avoidWhen: []
  },
  {
    id: 'reverse_crunch',
    name: 'Reverse Crunch',
    category: 'core',
    difficulty: 'intermediate',
    targetMuscles: ['abs', 'lower_abs'],
    tags: ['core', 'floor', 'lower_abs'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/reverse-crunch.svg',
      instructions: [
        'Lie on back, knees bent',
        'Lift hips off floor bringing knees to chest',
        'Lower with control'
      ]
    },
    demoMediaPath: '/demos/reverse-crunch.jpg',
    alternatives: ['scissor', 'in_out_crunch'],
    avoidWhen: []
  },
  {
    id: 'two_point_plank',
    name: 'Two Point Plank',
    category: 'core',
    difficulty: 'advanced',
    targetMuscles: ['core', 'shoulders', 'balance'],
    tags: ['core', 'balance', 'floor', 'advanced'],
    prescription: { type: 'time', defaultSets: 3, defaultTimeSec: 20, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/two-point-plank.svg',
      instructions: [
        'Start in plank position',
        'Lift opposite arm and leg',
        'Hold, then switch sides'
      ]
    },
    demoMediaPath: '/demos/two-point-plank.jpg',
    alternatives: ['plank', 'superman'],
    avoidWhen: ['avoid_shoulders']
  },
  {
    id: 'pike_press',
    name: 'Pike Press (Fire Press)',
    category: 'core',
    difficulty: 'advanced',
    targetMuscles: ['shoulders', 'core', 'upper_body'],
    tags: ['core', 'shoulders', 'floor', 'advanced'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: '60s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/pike-press.svg',
      instructions: [
        'Start in downward dog position',
        'Lower head toward floor',
        'Push back up'
      ]
    },
    demoMediaPath: '/demos/pike-press.jpg',
    alternatives: ['pushup', 'plank'],
    avoidWhen: ['avoid_shoulders']
  },
  {
    id: 'crab_walk',
    name: 'Crab Walk',
    category: 'core',
    difficulty: 'intermediate',
    targetMuscles: ['core', 'triceps', 'glutes'],
    tags: ['core', 'full_body', 'floor', 'mobility'],
    prescription: { type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: '45s' },
    cameraSetup: {
      angle: 'side',
      silhouettePath: '/silhouettes/crab-walk.svg',
      instructions: [
        'Sit, place hands behind you',
        'Lift hips off floor',
        'Walk forward and backward'
      ]
    },
    demoMediaPath: '/demos/crab-walk.jpg',
    alternatives: ['glute_bridge', 'tricep_dip'],
    avoidWhen: ['avoid_shoulders']
  }
];

// Helper functions
export function getExerciseById(id: string): HomeExercise | undefined {
  return HOME_EXERCISE_CATALOG.find(ex => ex.id === id);
}

export function getExercisesByCategory(category: ExerciseCategory): HomeExercise[] {
  return HOME_EXERCISE_CATALOG.filter(ex => ex.category === category);
}

export function getExercisesByDifficulty(difficulty: ExerciseDifficulty): HomeExercise[] {
  return HOME_EXERCISE_CATALOG.filter(ex => ex.difficulty === difficulty);
}

export function getSafeAlternative(exerciseId: string, limitations: string[]): HomeExercise | undefined {
  const exercise = getExerciseById(exerciseId);
  if (!exercise) return undefined;
  
  // Check if current exercise should be avoided
  const shouldAvoid = exercise.avoidWhen.some(avoid => limitations.includes(avoid));
  if (!shouldAvoid) return exercise;
  
  // Find safe alternative
  for (const altId of exercise.alternatives) {
    const alt = getExerciseById(altId);
    if (alt && !alt.avoidWhen.some(avoid => limitations.includes(avoid))) {
      return alt;
    }
  }
  
  return undefined;
}

export function getExercisesByTags(tags: string[]): HomeExercise[] {
  return HOME_EXERCISE_CATALOG.filter(ex => 
    tags.some(tag => ex.tags.includes(tag))
  );
}
