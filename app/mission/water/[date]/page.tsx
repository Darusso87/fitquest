'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GameSave } from '@/lib/types';
import { storage, isToday } from '@/lib/storage';
import { computeXPValues } from '@/lib/targets';

export default function WaterMissionPage() {
  const router = useRouter();
  const params = useParams();
  const date = params.date as string;
  
  const [save, setSave] = useState<GameSave | null>(null);
  const [waterMl, setWaterMl] = useState(0);

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) {
      router.push('/');
      return;
    }

    const dayLog = loadedSave.logsByDate[date];
    if (dayLog) {
      setWaterMl(dayLog.waterMl || 0);
    }

    setSave(loadedSave);
  }, [date, router]);

  const addWater = (amount: number) => {
    if (!save || !isToday(date)) return;

    const newWater = waterMl + amount;
    setWaterMl(newWater);

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

    updatedSave.logsByDate[date].waterMl = newWater;

    const day = save.plan.days.find(d => d.date === date);
    const target = day?.targets.waterMl || 2000;

    // Auto-complete if target reached
    if (newWater >= target && !updatedSave.logsByDate[date].missionCompleted.water) {
      const xpValues = computeXPValues(save.onboarding);
      updatedSave.logsByDate[date].missionCompleted.water = true;
      updatedSave.logsByDate[date].xpEarned.water = xpValues.water;
      updatedSave.xpTotal += xpValues.water;
    }

    storage.save(updatedSave);
    setSave(updatedSave);
  };

  const handleUndo = () => {
    if (!save || !isToday(date)) return;

    const updatedSave = { ...save };
    if (updatedSave.logsByDate[date]?.missionCompleted.water) {
      updatedSave.logsByDate[date].missionCompleted.water = false;
      updatedSave.xpTotal -= updatedSave.logsByDate[date].xpEarned.water;
      updatedSave.logsByDate[date].xpEarned.water = 0;
      updatedSave.logsByDate[date].waterMl = 0;
      
      storage.save(updatedSave);
      setSave(updatedSave);
      setWaterMl(0);
    }
  };

  if (!save) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div>
    </div>;
  }

  const day = save.plan.days.find(d => d.date === date);
  const target = day?.targets.waterMl || 2000;
  const progress = Math.min(100, (waterMl / target) * 100);
  const dayLog = save.logsByDate[date];
  const isCompleted = dayLog?.missionCompleted.water;
  const canInteract = isToday(date);
  const xpValues = computeXPValues(save.onboarding);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 text-neon-cyan font-body flex items-center gap-2"
        >
          ← BACK
        </button>

        <h1 className="font-display text-4xl text-neon-cyan mb-2">HYDRATION</h1>
        <p className="text-gray-400 font-body mb-8">Target: {target}ml</p>

        {/* Progress circle */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="rgba(42, 42, 68, 0.5)"
              strokeWidth="16"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="url(#waterGradient)"
              strokeWidth="16"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f6ff" />
                <stop offset="100%" stopColor="#06ffa5" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl mb-2">💧</div>
            <div className="font-display text-3xl text-white">{waterMl}ml</div>
            <div className="text-gray-400 text-sm font-body">of {target}ml</div>
          </div>
        </div>

        {/* Quick add buttons */}
        {canInteract && !isCompleted && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => addWater(250)}
              className="arcade-btn py-6 bg-arcade-card border-2 border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-arcade-bg font-display text-xl transition-all"
            >
              +250ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="arcade-btn py-6 bg-arcade-card border-2 border-neon-green text-neon-green rounded-lg hover:bg-neon-green hover:text-arcade-bg font-display text-xl transition-all"
            >
              +500ml
            </button>
          </div>
        )}

        {/* Status */}
        {isCompleted && (
          <div className="space-y-3">
            <div className="p-4 bg-neon-green bg-opacity-20 border border-neon-green rounded-lg text-center">
              <div className="text-neon-green text-4xl mb-2">✓</div>
              <p className="text-neon-green font-display">TARGET REACHED</p>
              <p className="text-white text-sm mt-1 font-body">+{xpValues.water} XP</p>
            </div>
            {canInteract && (
              <button
                onClick={handleUndo}
                className="w-full py-3 bg-arcade-card border-2 border-neon-pink text-neon-pink font-body rounded-lg hover:bg-neon-pink hover:text-white transition-all"
              >
                RESET
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
