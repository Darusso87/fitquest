'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GameSave } from '@/lib/types';
import { storage, isToday } from '@/lib/storage';
import { computeXPValues } from '@/lib/targets';

export default function StepsMissionPage() {
  const router = useRouter();
  const params = useParams();
  const date = params.date as string;
  
  const [save, setSave] = useState<GameSave | null>(null);
  const [steps, setSteps] = useState('');

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) {
      router.push('/');
      return;
    }

    const dayLog = loadedSave.logsByDate[date];
    if (dayLog?.steps) {
      setSteps(dayLog.steps.toString());
    }

    setSave(loadedSave);
  }, [date, router]);

  const handleComplete = () => {
    if (!save || !isToday(date) || !steps) return;

    const xpValues = computeXPValues(save.onboarding);
    
    const updatedSave = { ...save };
    if (!updatedSave.logsByDate[date]) {
      updatedSave.logsByDate[date] = {
        date,
        waterMl: 0,
        workoutCompleted: false,
        missionCompleted: { workout: false, water: false, food: false, sleep: false, steps: false, mobility: false, weighin: false },
        xpEarned: { workout: 0, water: 0, food: 0, sleep: 0, steps: 0, mobility: 0, weighin: 0 },
      };
    }

    updatedSave.logsByDate[date].steps = parseInt(steps);
    updatedSave.logsByDate[date].missionCompleted.steps = true;
    updatedSave.logsByDate[date].xpEarned.steps = xpValues.steps;
    updatedSave.xpTotal += xpValues.steps;

    storage.save(updatedSave);
    router.push('/dashboard');
  };

  const handleUndo = () => {
    if (!save || !isToday(date)) return;
    const updatedSave = { ...save };
    if (updatedSave.logsByDate[date]?.missionCompleted.steps) {
      updatedSave.logsByDate[date].missionCompleted.steps = false;
      updatedSave.xpTotal -= updatedSave.logsByDate[date].xpEarned.steps;
      updatedSave.logsByDate[date].xpEarned.steps = 0;
      updatedSave.logsByDate[date].steps = undefined;
      storage.save(updatedSave);
      setSave(updatedSave);
      setSteps('');
    }
  };

  if (!save) return <div className="min-h-screen flex items-center justify-center"><div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div></div>;

  const day = save.plan.days.find(d => d.date === date);
  const target = day?.targets.steps || 8000;
  const dayLog = save.logsByDate[date];
  const isCompleted = dayLog?.missionCompleted.steps;
  const canInteract = isToday(date);
  const xpValues = computeXPValues(save.onboarding);

  return (
    <div className="min-h-screen px-6 py-8 pb-24">
      <div className="max-w-md mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-6 text-neon-cyan font-body flex items-center gap-2">← BACK</button>
        <h1 className="font-display text-4xl text-neon-green mb-2">MOVEMENT</h1>
        <p className="text-gray-400 font-body mb-8">Target: {target.toLocaleString()} steps</p>
        <div className="text-center mb-8"><div className="text-6xl mb-4">👟</div></div>
        {canInteract && !isCompleted && (
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2 font-body">Steps Today</label>
            <input type="number" value={steps} onChange={(e) => setSteps(e.target.value)} className="w-full px-4 py-4 bg-arcade-card border-2 border-arcade-border rounded-lg text-white text-center text-2xl focus:border-neon-green focus:outline-none" placeholder="8000" />
            {steps && parseInt(steps) >= target && <p className="text-neon-green text-sm text-center mt-2 font-body">✓ Target reached!</p>}
          </div>
        )}
        {isCompleted ? (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
            <div className="max-w-md mx-auto space-y-3">
              <div className="p-4 bg-neon-green bg-opacity-20 border border-neon-green rounded-lg text-center">
                <div className="text-neon-green text-4xl mb-2">✓</div>
                <p className="text-neon-green font-display">STEPS LOGGED</p>
                <p className="text-white text-sm mt-1 font-body">{dayLog?.steps?.toLocaleString()} steps • +{xpValues.steps} XP</p>
              </div>
              {canInteract && <button onClick={handleUndo} className="w-full py-3 bg-arcade-card border-2 border-neon-pink text-neon-pink font-body rounded-lg hover:bg-neon-pink hover:text-white transition-all">UNDO</button>}
            </div>
          </div>
        ) : (
          canInteract && steps && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
              <div className="max-w-md mx-auto">
                <button onClick={handleComplete} className="w-full arcade-btn py-4 bg-gradient-to-r from-neon-green to-neon-cyan text-arcade-bg font-display text-xl rounded-lg hover:scale-105 transition-transform">LOG STEPS</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
