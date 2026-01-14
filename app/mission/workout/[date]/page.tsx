'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GameSave, Workout, Exercise } from '@/lib/types';
import { storage, isToday } from '@/lib/storage';
import { computeXPValues } from '@/lib/targets';
import { generateRestDayQuest } from '@/lib/workout-planner';

export default function WorkoutMissionPage() {
  const router = useRouter();
  const params = useParams();
  const date = params.date as string;
  
  const [save, setSave] = useState<GameSave | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [completedSets, setCompletedSets] = useState<{[key: string]: boolean[]}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) {
      router.push('/');
      return;
    }

    const day = loadedSave.plan.days.find(d => d.date === date);
    if (!day) {
      router.push('/dashboard');
      return;
    }

    if (day.type === 'workout' && day.workoutId) {
      const w = loadedSave.plan.workoutsById[day.workoutId];
      setWorkout(w);
      
      // Initialize completed sets
      const sets: {[key: string]: boolean[]} = {};
      w.exercises.forEach((ex, i) => {
        sets[`ex_${i}`] = new Array(ex.sets).fill(false);
      });
      setCompletedSets(sets);
    }

    setSave(loadedSave);
    setLoading(false);
  }, [date, router]);

  const toggleSet = (exerciseKey: string, setIndex: number) => {
    setCompletedSets(prev => ({
      ...prev,
      [exerciseKey]: prev[exerciseKey].map((val, i) => i === setIndex ? !val : val)
    }));
  };

  const handleComplete = () => {
    if (!save || !isToday(date)) return;

    const xpValues = computeXPValues(save.onboarding);
    
    const updatedSave = { ...save };
    if (!updatedSave.logsByDate[date]) {
      updatedSave.logsByDate[date] = {
        date,
        waterMl: 0,
        workoutCompleted: false,
        missionCompleted: {
          workout: false,
          water: false,
          food: false,
          sleep: false,
          steps: false,
          mobility: false,
          weighin: false,
        },
        xpEarned: {
          workout: 0,
          water: 0,
          food: 0,
          sleep: 0,
          steps: 0,
          mobility: 0,
          weighin: 0,
        },
      };
    }

    updatedSave.logsByDate[date].workoutCompleted = true;
    updatedSave.logsByDate[date].missionCompleted.workout = true;
    updatedSave.logsByDate[date].xpEarned.workout = xpValues.workout;
    updatedSave.xpTotal += xpValues.workout;

    storage.save(updatedSave);
    router.push('/dashboard');
  };

  const handleUndo = () => {
    if (!save || !isToday(date)) return;

    const updatedSave = { ...save };
    if (updatedSave.logsByDate[date]?.missionCompleted.workout) {
      const xpValues = computeXPValues(save.onboarding);
      updatedSave.logsByDate[date].workoutCompleted = false;
      updatedSave.logsByDate[date].missionCompleted.workout = false;
      updatedSave.xpTotal -= updatedSave.logsByDate[date].xpEarned.workout;
      updatedSave.logsByDate[date].xpEarned.workout = 0;
      
      storage.save(updatedSave);
      setSave(updatedSave);
    }
  };

  if (!save) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div>
      </div>
    );
  }

  const day = save.plan.days.find(d => d.date === date);
  const dayLog = save.logsByDate[date];
  const isCompleted = dayLog?.missionCompleted.workout;
  const canComplete = isToday(date);
  const xpValues = computeXPValues(save.onboarding);
  
  // Check if future or past
  const selectedDate = new Date(date);
  const today = new Date(date.split('T')[0]);
  const isFuture = selectedDate > today && !canComplete;
  const isPast = selectedDate < today && !canComplete;

  // Rest day
  if (day?.type === 'rest') {
    const weekNumber = Math.floor(save.plan.days.indexOf(day) / 7) + 1;
    const dayNumber = save.plan.days.indexOf(day);
    const restQuest = generateRestDayQuest(weekNumber, dayNumber);

    return (
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-6 text-neon-cyan font-body flex items-center gap-2"
          >
            ← BACK
          </button>

          <h1 className="font-display text-4xl text-neon-green mb-2">REST DAY</h1>
          <p className="text-gray-400 font-body mb-8">Active recovery quest</p>

          <div className="neon-card rounded-lg p-6 mb-6">
            <h2 className="font-display text-2xl text-white mb-4">TODAY'S QUEST</h2>
            <p className="text-neon-yellow font-body text-lg">{restQuest}</p>
            <p className="text-gray-400 text-sm mt-4 font-body">
              Complete this light activity to earn XP and support recovery.
            </p>
          </div>

          {isCompleted ? (
            <div className="space-y-3">
              <div className="p-4 bg-neon-green bg-opacity-20 border border-neon-green rounded-lg text-center">
                <div className="text-neon-green text-4xl mb-2">✓</div>
                <p className="text-neon-green font-display">QUEST COMPLETE</p>
                <p className="text-white text-sm mt-1 font-body">+{xpValues.workout} XP</p>
              </div>
              {canComplete && (
                <button
                  onClick={handleUndo}
                  className="w-full py-3 bg-arcade-card border-2 border-neon-pink text-neon-pink font-body rounded-lg hover:bg-neon-pink hover:text-white transition-all"
                >
                  UNDO
                </button>
              )}
            </div>
          ) : (
            canComplete && (
              <button
                onClick={handleComplete}
                className="w-full arcade-btn py-4 bg-gradient-to-r from-neon-green to-neon-yellow text-arcade-bg font-display text-xl rounded-lg hover:scale-105 transition-transform"
              >
                COMPLETE QUEST
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  // Workout day
  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-pink">No workout found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 pb-24">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 text-neon-cyan font-body flex items-center gap-2"
        >
          ← BACK
        </button>

        <h1 className="font-display text-4xl text-neon-cyan mb-2">{workout.name}</h1>
        <p className="text-gray-400 font-body mb-8">Est. {workout.estimatedMinutes} minutes</p>

        {/* Preview notice for non-today dates */}
        {!canComplete && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            isFuture ? 'bg-neon-cyan bg-opacity-10 border-neon-cyan' : 'bg-gray-800 border-gray-600'
          }`}>
            <p className={`text-sm font-body text-center ${isFuture ? 'text-neon-cyan' : 'text-gray-400'}`}>
              {isFuture ? '👁️ Preview - View your upcoming workout' : '📋 Past workout preview'}
            </p>
          </div>
        )}

        {/* Warmup */}
        <div className="mb-8">
          <h2 className="font-display text-2xl text-neon-yellow mb-4">WARMUP</h2>
          <div className="space-y-3">
            {workout.warmup.map((ex, i) => (
              <div key={i} className="neon-card rounded-lg p-4">
                <img 
                  src={ex.mediaUrl} 
                  alt={ex.name} 
                  className="w-full h-32 object-cover rounded mb-3 bg-arcade-card"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-image')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'fallback-image w-full h-32 bg-gradient-to-br from-neon-yellow to-neon-green rounded mb-3 flex items-center justify-center';
                      fallback.innerHTML = `<span class="text-arcade-bg font-display text-lg">${ex.name}</span>`;
                      e.currentTarget.after(fallback);
                    }
                  }}
                />
                <h3 className="font-body text-white font-semibold">{ex.name}</h3>
                <p className="text-gray-400 text-sm">{ex.sets} x {ex.reps}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main workout */}
        <div className="mb-8">
          <h2 className="font-display text-2xl text-neon-pink mb-4">MAIN WORKOUT</h2>
          <div className="space-y-4">
            {workout.exercises.map((ex, i) => {
              const exerciseKey = `ex_${i}`;
              return (
                <div key={i} className="neon-card rounded-lg p-4">
                  <img 
                    src={ex.mediaUrl} 
                    alt={ex.name} 
                    className="w-full h-48 object-cover rounded mb-3 bg-arcade-card"
                    onError={(e) => {
                      // Fallback to a solid color background with text
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector('.fallback-image')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'fallback-image w-full h-48 bg-gradient-to-br from-neon-pink to-neon-cyan rounded mb-3 flex items-center justify-center';
                        fallback.innerHTML = `<span class="text-white font-display text-xl">${ex.name}</span>`;
                        e.currentTarget.after(fallback);
                      }
                    }}
                  />
                  <h3 className="font-body text-white font-semibold text-lg">{ex.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{ex.sets} sets × {ex.reps} reps • Rest: {ex.rest}</p>
                  {ex.notes && <p className="text-neon-yellow text-xs mb-3">{ex.notes}</p>}
                  
                  {/* Set checkboxes */}
                  {canComplete && !isCompleted && (
                    <div className="flex gap-2 mt-3">
                      {Array.from({ length: ex.sets }).map((_, setIndex) => (
                        <button
                          key={setIndex}
                          onClick={() => toggleSet(exerciseKey, setIndex)}
                          className={`w-10 h-10 rounded-lg font-display transition-all ${
                            completedSets[exerciseKey]?.[setIndex]
                              ? 'bg-neon-green text-arcade-bg'
                              : 'bg-arcade-card border-2 border-arcade-border text-gray-500'
                          }`}
                        >
                          {setIndex + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Alternatives */}
                  {ex.alternatives.length > 0 && (
                    <details className="mt-3">
                      <summary className="text-neon-cyan text-sm cursor-pointer">Alternatives</summary>
                      <ul className="mt-2 text-gray-400 text-sm list-disc list-inside">
                        {ex.alternatives.map((alt, j) => (
                          <li key={j}>{alt}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cooldown */}
        <div className="mb-8">
          <h2 className="font-display text-2xl text-neon-purple mb-4">COOLDOWN</h2>
          <div className="space-y-3">
            {workout.cooldown.map((ex, i) => (
              <div key={i} className="neon-card rounded-lg p-4">
                <img 
                  src={ex.mediaUrl} 
                  alt={ex.name} 
                  className="w-full h-32 object-cover rounded mb-3 bg-arcade-card"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-image')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'fallback-image w-full h-32 bg-gradient-to-br from-neon-purple to-neon-cyan rounded mb-3 flex items-center justify-center';
                      fallback.innerHTML = `<span class="text-white font-display text-lg">${ex.name}</span>`;
                      e.currentTarget.after(fallback);
                    }
                  }}
                />
                <h3 className="font-body text-white font-semibold">{ex.name}</h3>
                <p className="text-gray-400 text-sm">{ex.reps}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Complete button */}
        {isCompleted ? (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
            <div className="max-w-md mx-auto space-y-3">
              <div className="p-4 bg-neon-green bg-opacity-20 border border-neon-green rounded-lg text-center">
                <div className="text-neon-green text-4xl mb-2">✓</div>
                <p className="text-neon-green font-display">WORKOUT COMPLETE</p>
                <p className="text-white text-sm mt-1 font-body">+{xpValues.workout} XP</p>
              </div>
              {canComplete && (
                <button
                  onClick={handleUndo}
                  className="w-full py-3 bg-arcade-card border-2 border-neon-pink text-neon-pink font-body rounded-lg hover:bg-neon-pink hover:text-white transition-all"
                >
                  UNDO
                </button>
              )}
            </div>
          </div>
        ) : (
          canComplete && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
              <div className="max-w-md mx-auto">
                <button
                  onClick={handleComplete}
                  className="w-full arcade-btn py-4 bg-gradient-to-r from-neon-cyan to-neon-pink text-white font-display text-xl rounded-lg hover:scale-105 transition-transform"
                >
                  COMPLETE WORKOUT
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
