// Mobility Mission - app/mission/mobility/[date]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GameSave } from '@/lib/types';
import { storage, isToday } from '@/lib/storage';
import { computeXPValues } from '@/lib/targets';

export default function MobilityMissionPage() {
  const router = useRouter();
  const params = useParams();
  const date = params.date as string;
  const [save, setSave] = useState<GameSave | null>(null);

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) router.push('/');
    else setSave(loadedSave);
  }, [date, router]);

  const handleComplete = () => {
    if (!save || !isToday(date)) return;
    const xpValues = computeXPValues(save.onboarding);
    const updatedSave = { ...save };
    if (!updatedSave.logsByDate[date]) {
      updatedSave.logsByDate[date] = { date, waterMl: 0, workoutCompleted: false, missionCompleted: { workout: false, water: false, food: false, sleep: false, steps: false, mobility: false, weighin: false }, xpEarned: { workout: 0, water: 0, food: 0, sleep: 0, steps: 0, mobility: 0, weighin: 0 } };
    }
    updatedSave.logsByDate[date].missionCompleted.mobility = true;
    updatedSave.logsByDate[date].xpEarned.mobility = xpValues.mobility;
    updatedSave.xpTotal += xpValues.mobility;
    storage.save(updatedSave);
    router.push('/dashboard');
  };

  const handleUndo = () => {
    if (!save || !isToday(date)) return;
    const updatedSave = { ...save };
    if (updatedSave.logsByDate[date]?.missionCompleted.mobility) {
      updatedSave.logsByDate[date].missionCompleted.mobility = false;
      updatedSave.xpTotal -= updatedSave.logsByDate[date].xpEarned.mobility;
      updatedSave.logsByDate[date].xpEarned.mobility = 0;
      storage.save(updatedSave);
      setSave(updatedSave);
    }
  };

  if (!save) return <div className="min-h-screen flex items-center justify-center"><div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div></div>;
  const dayLog = save.logsByDate[date];
  const isCompleted = dayLog?.missionCompleted.mobility;
  const canInteract = isToday(date);
  const xpValues = computeXPValues(save.onboarding);

  return (
    <div className="min-h-screen px-6 py-8 pb-24">
      <div className="max-w-md mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-6 text-neon-cyan font-body flex items-center gap-2">← BACK</button>
        <h1 className="font-display text-4xl text-neon-purple mb-2">MOBILITY</h1>
        <p className="text-gray-400 font-body mb-8">10-15 minutes stretching & mobility</p>
        <div className="text-center mb-8"><div className="text-6xl mb-4">🧘</div></div>
        <div className="neon-card rounded-lg p-6 mb-6">
          <h2 className="font-display text-xl text-white mb-4">SUGGESTED ROUTINE</h2>
          <ul className="space-y-2 text-gray-400 font-body">
            <li>• Hip Flexor Stretch - 30s each</li>
            <li>• Thoracic Rotations - 10 each side</li>
            <li>• Cat-Cow - 10 reps</li>
            <li>• Shoulder Dislocations - 10 reps</li>
            <li>• Deep Squat Hold - 60s</li>
          </ul>
        </div>
        {isCompleted ? (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
            <div className="max-w-md mx-auto space-y-3">
              <div className="p-4 bg-neon-green bg-opacity-20 border border-neon-green rounded-lg text-center">
                <div className="text-neon-green text-4xl mb-2">✓</div>
                <p className="text-neon-green font-display">MOBILITY COMPLETE</p>
                <p className="text-white text-sm mt-1 font-body">+{xpValues.mobility} XP</p>
              </div>
              {canInteract && <button onClick={handleUndo} className="w-full py-3 bg-arcade-card border-2 border-neon-pink text-neon-pink font-body rounded-lg hover:bg-neon-pink hover:text-white transition-all">UNDO</button>}
            </div>
          </div>
        ) : (
          canInteract && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
              <div className="max-w-md mx-auto">
                <button onClick={handleComplete} className="w-full arcade-btn py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-display text-xl rounded-lg hover:scale-105 transition-transform">COMPLETE SESSION</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
