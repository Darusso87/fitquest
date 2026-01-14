'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GameSave } from '@/lib/types';
import { storage, isToday } from '@/lib/storage';
import { computeXPValues, computeTargets } from '@/lib/targets';

export default function WeighinMissionPage() {
  const router = useRouter();
  const params = useParams();
  const date = params.date as string;
  const [save, setSave] = useState<GameSave | null>(null);
  const [weight, setWeight] = useState('');

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) router.push('/');
    else {
      const dayLog = loadedSave.logsByDate[date];
      if (dayLog?.weight) setWeight(dayLog.weight.toString());
      setSave(loadedSave);
    }
  }, [date, router]);

  const handleComplete = () => {
    if (!save || !isToday(date) || !weight) return;
    const xpValues = computeXPValues(save.onboarding);
    const updatedSave = { ...save };
    if (!updatedSave.logsByDate[date]) {
      updatedSave.logsByDate[date] = { date, waterMl: 0, workoutCompleted: false, missionCompleted: { workout: false, water: false, food: false, sleep: false, steps: false, mobility: false, weighin: false }, xpEarned: { workout: 0, water: 0, food: 0, sleep: 0, steps: 0, mobility: 0, weighin: 0 } };
    }
    const newWeight = parseFloat(weight);
    updatedSave.logsByDate[date].weight = newWeight;
    updatedSave.logsByDate[date].missionCompleted.weighin = true;
    updatedSave.logsByDate[date].xpEarned.weighin = xpValues.weighin;
    updatedSave.xpTotal += xpValues.weighin;
    updatedSave.weightHistory.push({ date, weight: newWeight });
    
    // Update targets based on new weight
    const newTargets = computeTargets(save.onboarding, newWeight);
    updatedSave.plan.days.forEach(day => {
      if (new Date(day.date) >= new Date(date)) {
        day.targets = { ...day.targets, ...newTargets };
      }
    });
    
    storage.save(updatedSave);
    router.push('/dashboard');
  };

  const handleUndo = () => {
    if (!save || !isToday(date)) return;
    const updatedSave = { ...save };
    if (updatedSave.logsByDate[date]?.missionCompleted.weighin) {
      updatedSave.logsByDate[date].missionCompleted.weighin = false;
      updatedSave.xpTotal -= updatedSave.logsByDate[date].xpEarned.weighin;
      updatedSave.logsByDate[date].xpEarned.weighin = 0;
      updatedSave.logsByDate[date].weight = undefined;
      updatedSave.weightHistory = updatedSave.weightHistory.filter(w => w.date !== date);
      storage.save(updatedSave);
      setSave(updatedSave);
      setWeight('');
    }
  };

  if (!save) return <div className="min-h-screen flex items-center justify-center"><div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div></div>;
  const dayLog = save.logsByDate[date];
  const isCompleted = dayLog?.missionCompleted.weighin;
  const canInteract = isToday(date);
  const xpValues = computeXPValues(save.onboarding);
  const startWeight = save.weightHistory[0]?.weight || save.onboarding.weight;

  return (
    <div className="min-h-screen px-6 py-8 pb-24">
      <div className="max-w-md mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-6 text-neon-cyan font-body flex items-center gap-2">← BACK</button>
        <h1 className="font-display text-4xl text-neon-yellow mb-2">WEIGH-IN</h1>
        <p className="text-gray-400 font-body mb-8">Bi-weekly progress check</p>
        <div className="text-center mb-8"><div className="text-6xl mb-4">⚖️</div></div>
        <div className="neon-card rounded-lg p-6 mb-6">
          <p className="text-gray-400 text-sm mb-2 font-body">Starting Weight</p>
          <p className="text-white text-2xl font-display">{startWeight}kg</p>
        </div>
        {canInteract && !isCompleted && (
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2 font-body">Current Weight (kg)</label>
            <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-4 bg-arcade-card border-2 border-arcade-border rounded-lg text-white text-center text-2xl focus:border-neon-yellow focus:outline-none" placeholder="70.5" />
          </div>
        )}
        {isCompleted ? (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
            <div className="max-w-md mx-auto space-y-3">
              <div className="p-4 bg-neon-green bg-opacity-20 border border-neon-green rounded-lg text-center">
                <div className="text-neon-green text-4xl mb-2">✓</div>
                <p className="text-neon-green font-display">WEIGHT LOGGED</p>
                <p className="text-white text-sm mt-1 font-body">{dayLog?.weight}kg • Change: {((dayLog?.weight || startWeight) - startWeight).toFixed(1)}kg • +{xpValues.weighin} XP</p>
              </div>
              {canInteract && <button onClick={handleUndo} className="w-full py-3 bg-arcade-card border-2 border-neon-pink text-neon-pink font-body rounded-lg hover:bg-neon-pink hover:text-white transition-all">UNDO</button>}
            </div>
          </div>
        ) : (
          canInteract && weight && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
              <div className="max-w-md mx-auto">
                <button onClick={handleComplete} className="w-full arcade-btn py-4 bg-gradient-to-r from-neon-yellow to-neon-green text-arcade-bg font-display text-xl rounded-lg hover:scale-105 transition-transform">LOG WEIGHT</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
