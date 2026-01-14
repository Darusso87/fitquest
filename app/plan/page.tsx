'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameSave } from '@/lib/types';
import { storage, formatDate } from '@/lib/storage';

export default function PlanPage() {
  const router = useRouter();
  const [save, setSave] = useState<GameSave | null>(null);

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) router.push('/');
    else setSave(loadedSave);
  }, [router]);

  if (!save) return <div className="min-h-screen flex items-center justify-center"><div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div></div>;

  const weeks: { [key: number]: typeof save.plan.days } = {};
  save.plan.days.forEach((day, i) => {
    const weekNum = Math.floor(i / 7);
    if (!weeks[weekNum]) weeks[weekNum] = [];
    weeks[weekNum].push(day);
  });

  return (
    <div className="min-h-screen px-6 py-8 pb-20">
      <div className="max-w-md mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-6 text-neon-cyan font-body flex items-center gap-2">← BACK</button>
        <h1 className="font-display text-4xl text-neon-cyan mb-2">YOUR PLAN</h1>
        <p className="text-gray-400 font-body mb-8">{save.plan.timelineWeeks} week quest</p>

        <div className="space-y-6">
          {Object.entries(weeks).map(([weekNum, days]) => (
            <div key={weekNum} className="neon-card rounded-lg p-4">
              <h2 className="font-display text-xl text-neon-pink mb-4">WEEK {parseInt(weekNum) + 1}</h2>
              <div className="space-y-2">
                {days.map(day => {
                  const dayLog = save.logsByDate[day.date];
                  const isWorkout = day.type === 'workout';
                  const workout = isWorkout && day.workoutId ? save.plan.workoutsById[day.workoutId] : null;
                  return (
                    <div key={day.date} className={`p-3 rounded ${dayLog?.workoutCompleted || dayLog?.missionCompleted.workout ? 'bg-neon-green bg-opacity-10 border border-neon-green' : 'bg-arcade-bg border border-arcade-border'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-body text-sm">{formatDate(day.date).split(' • ')[0]}</p>
                          <p className="text-gray-400 text-xs">{isWorkout ? (workout?.name || 'Workout') : 'Rest Day'}</p>
                        </div>
                        {(dayLog?.workoutCompleted || dayLog?.missionCompleted.workout) && <span className="text-neon-green">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 neon-card rounded-lg p-6">
          <h2 className="font-display text-xl text-neon-yellow mb-3">PROGRESSION LOGIC</h2>
          <ul className="space-y-2 text-gray-400 text-sm font-body">
            <li>• Weekly progressive overload</li>
            <li>• {save.plan.timelineWeeks >= 8 ? 'Deload every 4th week' : 'No deload weeks'}</li>
            <li>• Split: {save.onboarding.trainingDays} days/week</li>
            <li>• Home Setup: {save.onboarding.homeSetup === 'none' ? 'No equipment needed' : save.onboarding.homeSetup.replace('_', ' ')}</li>
            <li>• Goal: {save.onboarding.goalType}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
