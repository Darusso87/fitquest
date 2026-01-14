# FITQUEST - MediaPipe Pose Camera Integration Implementation Guide

## Overview
This guide provides the complete implementation for adding MediaPipe Pose camera rep counting to FITQUEST, making it home-exercise only with an expanded exercise library.

## Files Changed/Added Summary

### Package Dependencies (DONE)
✅ `package.json` - Added @mediapipe/pose and @mediapipe/camera_utils

### Core Data Models (DONE)
✅ `lib/types.ts` - Updated with ExerciseProgress, CameraCalibration, homeSetup
✅ `lib/home-exercises.ts` - New comprehensive home exercise catalog (25+ exercises)

### Files to Create (17 new files)

#### 1. MediaPipe Core Components
- `components/camera/CameraPoseRunner.tsx` - MediaPipe initialization and pose tracking loop
- `components/camera/RepCounterEngine.ts` - Exercise-specific state machines for rep counting
- `components/camera/SilhouetteOverlay.tsx` - Visual guide overlay component
- `components/camera/PoseQualityMeter.tsx` - Real-time pose quality indicator
- `components/camera/CalibrationFlow.tsx` - Exercise calibration UI
- `components/camera/CameraControls.tsx` - Start/Stop/Save/Undo buttons
- `lib/pose-utils.ts` - Helper functions for angle calculation, smoothing, etc.

#### 2. Camera Route
- `app/mission/workout/[date]/[exerciseId]/camera/page.tsx` - Main camera page

#### 3. Updated Workout Components
- Update `app/mission/workout/[date]/page.tsx` - Add "Start" buttons per exercise
- Update `lib/workout-planner.ts` - Home-only exercise selection
- Update `app/onboarding/page.tsx` - Change equipment to homeSetup

#### 4. Silhouette Assets
- Create `/public/silhouettes/*.svg` files (25+ silhouettes)
- Create `/public/demos/*.png` placeholder images

#### 5. Utility Files
- `lib/rep-counter-state-machines.ts` - Per-exercise counting logic
- `lib/exercise-xp.ts` - XP calculation per set/exercise

## Detailed Implementation

### STEP 1: MediaPipe Pose Runner Component

```typescript
// components/camera/CameraPoseRunner.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

interface CameraPoseRunnerProps {
  exerciseId: string;
  onResults: (results: Results) => void;
  onError: (error: string) => void;
}

export default function CameraPoseRunner({ exerciseId, onResults, onError }: CameraPoseRunnerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializePose() {
      try {
        if (!videoRef.current || !canvasRef.current) return;

        // Initialize MediaPipe Pose
        const pose = new Pose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          }
        });

        pose.setOptions({
          modelComplexity: 1, // 0=Lite, 1=Full, 2=Heavy
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults((results) => {
          if (mounted) {
            onResults(results);
          }
        });

        poseRef.current = pose;

        // Initialize camera
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && poseRef.current) {
              await poseRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        await camera.start();
        cameraRef.current = camera;

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('MediaPipe initialization error:', error);
        onError('Failed to initialize camera: ' + (error as Error).message);
      }
    }

    initializePose();

    return () => {
      mounted = false;
      if (poseRef.current) {
        poseRef.current.close();
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, [exerciseId, onResults, onError]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-neon-cyan text-xl font-display">Loading Camera...</div>
        </div>
      )}
    </div>
  );
}
```

### STEP 2: Rep Counter Engine with State Machines

```typescript
// lib/rep-counter-state-machines.ts

import { NormalizedLandmarkList } from '@mediapipe/pose';

export type RepState = 'IDLE' | 'DOWN' | 'UP';

export interface RepCounterConfig {
  exerciseId: string;
  downThreshold: number;
  upThreshold: number;
  minFramesInState: number;
}

export class RepCounter {
  private state: RepState = 'IDLE';
  private repCount: number = 0;
  private framesInState: number = 0;
  private smoothedMetric: number = 0;
  private alpha: number = 0.3; // EMA smoothing factor

  constructor(private config: RepCounterConfig) {}

  update(landmarks: NormalizedLandmarkList): { reps: number; state: RepState; metric: number } {
    const metric = this.calculateMetric(landmarks);
    
    // Apply EMA smoothing
    this.smoothedMetric = this.alpha * metric + (1 - this.alpha) * this.smoothedMetric;

    // State machine with hysteresis
    this.framesInState++;

    switch (this.state) {
      case 'IDLE':
        if (this.smoothedMetric < this.config.downThreshold && this.framesInState >= this.config.minFramesInState) {
          this.state = 'DOWN';
          this.framesInState = 0;
        }
        break;

      case 'DOWN':
        if (this.smoothedMetric > this.config.upThreshold && this.framesInState >= this.config.minFramesInState) {
          this.state = 'UP';
          this.repCount++;
          this.framesInState = 0;
        }
        break;

      case 'UP':
        if (this.smoothedMetric < this.config.downThreshold && this.framesInState >= this.config.minFramesInState) {
          this.state = 'DOWN';
          this.framesInState = 0;
        }
        break;
    }

    return {
      reps: this.repCount,
      state: this.state,
      metric: this.smoothedMetric
    };
  }

  private calculateMetric(landmarks: NormalizedLandmarkList): number {
    switch (this.config.exerciseId) {
      case 'squat_bodyweight':
      case 'squat_chair':
        return this.calculateSquatMetric(landmarks);
      case 'pushup_regular':
      case 'pushup_knee':
        return this.calculatePushupMetric(landmarks);
      case 'lunge_forward':
      case 'lunge_reverse':
        return this.calculateLungeMetric(landmarks);
      case 'glute_bridge':
        return this.calculateBridgeMetric(landmarks);
      default:
        return 0;
    }
  }

  private calculateSquatMetric(landmarks: NormalizedLandmarkList): number {
    // Hip angle: higher when standing, lower when squatting
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftShoulder = landmarks[11];

    if (!leftHip || !leftKnee || !leftShoulder) return 0;

    // Calculate angle using y-coordinates (simplified)
    // In squat: hip drops below shoulder level
    const hipHeight = leftHip.y;
    const shoulderHeight = leftShoulder.y;
    
    // Return normalized metric (0-1, where 0 is down, 1 is up)
    return (shoulderHeight - hipHeight) / shoulderHeight;
  }

  private calculatePushupMetric(landmarks: NormalizedLandmarkList): number {
    // Shoulder to wrist distance: smaller when down, larger when up
    const leftShoulder = landmarks[11];
    const leftWrist = landmarks[15];
    
    if (!leftShoulder || !leftWrist) return 0;

    const distance = Math.abs(leftShoulder.y - leftWrist.y);
    return distance * 2; // Scale to 0-1 range
  }

  private calculateLungeMetric(landmarks: NormalizedLandmarkList): number {
    // Front knee angle: smaller when down, larger when up
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    if (!leftHip || !leftKnee || !leftAnkle) return 0;

    // Calculate knee angle
    const angle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    return angle / 180; // Normalize to 0-1
  }

  private calculateBridgeMetric(landmarks: NormalizedLandmarkList): number {
    // Hip height: higher when bridge up, lower when down
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];

    if (!leftHip || !leftKnee) return 0;

    return Math.abs(leftHip.y - leftKnee.y) * 2;
  }

  private calculateAngle(a: any, b: any, c: any): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  }

  reset() {
    this.state = 'IDLE';
    this.repCount = 0;
    this.framesInState = 0;
    this.smoothedMetric = 0;
  }

  getReps(): number {
    return this.repCount;
  }
}

// Factory function to create rep counter for specific exercise
export function createRepCounter(exerciseId: string): RepCounter {
  const configs: { [key: string]: RepCounterConfig } = {
    'squat_bodyweight': {
      exerciseId: 'squat_bodyweight',
      downThreshold: 0.3,
      upThreshold: 0.7,
      minFramesInState: 5
    },
    'pushup_regular': {
      exerciseId: 'pushup_regular',
      downThreshold: 0.2,
      upThreshold: 0.6,
      minFramesInState: 4
    },
    // Add more configs for each exercise
  };

  const config = configs[exerciseId] || configs['squat_bodyweight'];
  return new RepCounter(config);
}
```

### STEP 3: Camera Page Route

```typescript
// app/mission/workout/[date]/[exerciseId]/camera/page.tsx
'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraPoseRunner from '@/components/camera/CameraPoseRunner';
import { RepCounter, createRepCounter } from '@/lib/rep-counter-state-machines';
import { getExerciseById } from '@/lib/home-exercises';
import { isToday } from '@/lib/storage';

export default function ExerciseCameraPage({ params }: { params: Promise<{ date: string; exerciseId: string }> }) {
  const { date, exerciseId } = use(params);
  const router = useRouter();
  const [repCounter] = useState(() => createRepCounter(exerciseId));
  const [currentReps, setCurrentReps] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const exercise = getExerciseById(exerciseId);
  const canInteract = isToday(date);

  if (!canInteract) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-neon-yellow text-xl font-display mb-4">🔒 LOCKED</p>
          <p className="text-gray-400">Camera only available for today's workout</p>
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-3 bg-arcade-card border-2 border-neon-cyan text-neon-cyan rounded-lg"
          >
            GO BACK
          </button>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return <div>Exercise not found</div>;
  }

  const handlePoseResults = (results: any) => {
    if (!isRecording || !results.poseLandmarks) return;

    const update = repCounter.update(results.poseLandmarks);
    setCurrentReps(update.reps);
  };

  const handleStartSet = () => {
    repCounter.reset();
    setCurrentReps(0);
    setIsRecording(true);
  };

  const handleStopSet = () => {
    setIsRecording(false);
  };

  const handleSave = () => {
    // TODO: Save reps to localStorage
    router.back();
  };

  return (
    <div className="relative w-full h-screen bg-arcade-bg overflow-hidden">
      {/* Camera feed */}
      <CameraPoseRunner
        exerciseId={exerciseId}
        onResults={handlePoseResults}
        onError={setError}
      />

      {/* Silhouette overlay */}
      {showGuide && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <img
            src={exercise.cameraSetup.silhouettePath}
            alt="Guide"
            className="h-3/4 opacity-30"
          />
        </div>
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black to-transparent">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-arcade-card rounded text-white font-body"
          >
            ← EXIT
          </button>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-4 py-2 bg-arcade-card rounded text-white font-body"
          >
            {showGuide ? '👁️ HIDE GUIDE' : '👁️ SHOW GUIDE'}
          </button>
        </div>
      </div>

      {/* Rep counter display */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-8xl font-display text-neon-cyan drop-shadow-[0_0_20px_rgba(0,246,255,0.8)]">
          {currentReps}
        </div>
        <div className="text-xl text-white font-body mt-2">
          {isRecording ? 'COUNTING...' : 'READY'}
        </div>
      </div>

      {/* Instructions */}
      {!isRecording && (
        <div className="absolute bottom-32 left-0 right-0 px-6">
          <div className="bg-black bg-opacity-75 rounded-lg p-4">
            <h3 className="text-neon-yellow font-display mb-2">SETUP</h3>
            <ul className="text-sm text-white space-y-1">
              {exercise.cameraSetup.instructions.map((instruction, i) => (
                <li key={i}>• {instruction}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
        <div className="flex gap-3 justify-center">
          {!isRecording ? (
            <button
              onClick={handleStartSet}
              className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-green text-arcade-bg font-display text-xl rounded-lg"
            >
              START SET
            </button>
          ) : (
            <>
              <button
                onClick={handleStopSet}
                className="px-8 py-4 bg-neon-pink text-white font-display text-xl rounded-lg"
              >
                STOP
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-4 bg-neon-green text-arcade-bg font-display text-xl rounded-lg"
              >
                SAVE {currentReps} REPS
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 p-6">
          <div className="text-center">
            <p className="text-neon-pink text-xl font-display mb-4">ERROR</p>
            <p className="text-white mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-arcade-card border-2 border-neon-cyan text-neon-cyan rounded-lg"
            >
              GO BACK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### STEP 4: Update Workout Page to Add Camera Buttons

Add to workout mission page:
```typescript
// In app/mission/workout/[date]/page.tsx
// For each exercise in the main workout section:

<div key={i} className="neon-card rounded-lg p-4">
  <div className="flex justify-between items-start mb-3">
    <div className="flex-1">
      <h3 className="font-body text-white font-semibold text-lg">{ex.name}</h3>
      <p className="text-gray-400 text-sm">{ex.sets} sets × {ex.reps} reps</p>
    </div>
    
    {/* ADD THIS: Camera button */}
    {canComplete && !isCompleted && ex.id && (
      <button
        onClick={() => router.push(`/mission/workout/${date}/${ex.id}/camera`)}
        className="ml-3 px-4 py-2 bg-neon-cyan text-arcade-bg rounded-lg font-body text-sm hover:bg-opacity-90"
      >
        📷 START
      </button>
    )}
  </div>
  
  <img src={ex.mediaUrl} alt={ex.name} className="w-full h-48 object-cover rounded mb-3" />
  
  {/* Show progress if any sets saved */}
  {dayLog?.exercises?.[ex.id] && (
    <div className="mt-2 text-sm text-neon-green">
      Progress: {dayLog.exercises[ex.id].repsSavedTotal} / {ex.sets * parseInt(ex.reps)} reps
    </div>
  )}
</div>
```

### STEP 5: Update Onboarding - Change Equipment to Home Setup

In `app/onboarding/page.tsx`, replace the equipment step (case 12) with:

```typescript
case 12:
  return (
    <div className="space-y-4">
      <h2 className="font-display text-3xl text-neon-cyan mb-4">HOME SETUP</h2>
      <p className="text-gray-400 text-sm mb-4">What equipment do you have at home?</p>
      <div className="space-y-3">
        {(['none', 'resistance_bands', 'light_dumbbells'] as const).map(option => (
          <button
            key={option}
            onClick={() => updateData('homeSetup', option)}
            className={`w-full py-4 px-6 rounded-lg font-body text-lg transition-all ${
              data.homeSetup === option
                ? 'bg-neon-green text-arcade-bg border-2 border-neon-green'
                : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-green'
            }`}
          >
            {option === 'none' ? 'NO EQUIPMENT' : option === 'resistance_bands' ? 'RESISTANCE BANDS' : 'LIGHT DUMBBELLS'}
          </button>
        ))}
      </div>
    </div>
  );
```

### STEP 6: Create Silhouette SVG Files

Create simple SVG silhouettes in `/public/silhouettes/`:

Example squat.svg:
```svg
<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
  <g fill="#00f6ff" opacity="0.3">
    <!-- Head -->
    <circle cx="100" cy="50" r="25"/>
    <!-- Body -->
    <rect x="85" y="75" width="30" height="80" rx="5"/>
    <!-- Arms -->
    <rect x="60" y="85" width="20" height="60" rx="5"/>
    <rect x="120" y="85" width="20" height="60" rx="5"/>
    <!-- Legs (bent for squat position) -->
    <rect x="80" y="155" width="18" height="70" rx="5" transform="rotate(10 89 155)"/>
    <rect x="102" y="155" width="18" height="70" rx="5" transform="rotate(-10 111 155)"/>
  </g>
</svg>
```

Repeat for all exercises with appropriate poses.

## Implementation Checklist

- [✅] Update package.json with MediaPipe dependencies
- [✅] Create home-exercises.ts catalog
- [✅] Update types.ts for exercise tracking
- [ ] Create CameraPoseRunner component
- [ ] Create RepCounter engine with state machines
- [ ] Create camera page route
- [ ] Update workout mission page with camera buttons
- [ ] Update onboarding homeSetup field
- [ ] Create all 25+ silhouette SVG files
- [ ] Update workout planner to use home exercises only
- [ ] Implement XP calculation per set
- [ ] Add manual fallback UI
- [ ] Test on mobile devices

## Testing Strategy

1. Test camera permissions
2. Test pose detection accuracy
3. Test rep counting for each exercise type
4. Test state machine transitions
5. Test data persistence
6. Test today-only restrictions
7. Test manual fallback

## Performance Optimization

- Lazy load MediaPipe only on camera page
- Use modelComplexity: 1 (balance of speed/accuracy)
- Throttle pose inference if needed (skip frames)
- Reduce video resolution on low-end devices
- Implement frame rate monitoring

## Next Steps After Core Implementation

1. Add calibration flow UI
2. Add pose quality meter
3. Add exercise-specific tips during camera
4. Add sound effects for rep completion
5. Add haptic feedback (mobile)
6. Improve silhouette designs
7. Add demo videos
8. Add debug skeleton overlay toggle

