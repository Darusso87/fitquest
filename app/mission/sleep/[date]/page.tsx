'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GameSave } from '@/lib/types';
import { storage, isToday } from '@/lib/storage';
import { computeXPValues } from '@/lib/targets';

export default function SleepMissionPage() {
  const router = useRouter();
  const params = useParams();
  const date = params.date as string;
  
  const [save, setSave] = useState<GameSave | null>(null);
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) {
      router.push('/');
      return;
    }

    const dayLog = loadedSave.logsByDate[date];
    if (dayLog) {
      setBedTime(dayLog.sleepBed || '');
      setWakeTime(dayLog.sleepWake || '');
    }

    setSave(loadedSave);
  }, [date, router]);

  const calculateSleepHours = (bed: string, wake: string): number => {
    if (!bed || !wake) return 0;
    const bedDate = new Date(`2000-01-01 ${bed}`);
    let wakeDate = new Date(`2000-01-01 ${wake}`);
    
    // If wake time is earlier than bed time, add a day
    if (wakeDate < bedDate) {
      wakeDate = new Date(`2000-01-02 ${wake}`);
    }
    
    const diff = wakeDate.getTime() - bedDate.getTime();
    return diff / (1000 * 60 * 60);
  };

  const handleComplete = () => {
    if (!save || !isToday(date) || !bedTime || !wakeTime) return;

    const sleepHours = calculateSleepHours(bedTime, wakeTime);
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

    updatedSave.logsByDate[date].sleepBed = bedTime;
    updatedSave.logsByDate[date].sleepWake = wakeTime;
    updatedSave.logsByDate[date].sleepHours = sleepHours;
    updatedSave.logsByDate[date].missionCompleted.sleep = true;
    updatedSave.logsByDate[date].xpEarned.sleep = xpValues.sleep;
    updatedSave.xpTotal += xpValues.sleep;

    storage.save(updatedSave);
    router.push('/dashboard');
  };

  const handleUndo = () => {
    if (!save || !isToday(date)) return;

    const updatedSave = { ...save };
    if (updatedSave.logsByDate[date]?.missionCompleted.sleep) {
      updatedSave.logsByDate[date].missionCompleted.sleep = false;
      updatedSave.xpTotal -= updatedSave.logsByDate[date].xpEarned.sleep;
      updatedSave.logsByDate[date].xpEarned.sleep = 0;
      updatedSave.logsByDate[date].sleepBed = undefined;
      updatedSave.logsByDate[date].sleepWake = undefined;
      updatedSave.logsByDate[date].sleepHours = undefined;
      
      storage.save(updatedSave);
      setSave(updatedSave);
      setBedTime('');
      setWakeTime('');
    }
  };

  if (!save) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div>
    </div>;
  }

  const day = save.plan.days.find(d => d.date === date);
  const target = day?.targets.sleepHours || 8;
  const dayLog = save.logsByDate[date];
  const isCompleted = dayLog?.missionCompleted.sleep;
  const canInteract = isToday(date);
  const xpValues = computeXPValues(save.onboarding);
  const sleepHours = bedTime && wakeTime ? calculateSleepHours(bedTime, wakeTime) : 0;

  return (
    <div className="min-h-screen px-6 py-8 pb-24">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 text-neon-cyan font-body flex items-center gap-2"
        >
          ← BACK
        </button>

        <h1 className="font-display text-4xl text-neon-purple mb-2">RECOVERY</h1>
        <p className="text-gray-400 font-body mb-8">Target: {target} hours</p>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">😴</div>
          {sleepHours > 0 && (
            <div className="font-display text-4xl text-white">
              {sleepHours.toFixed(1)}h
            </div>
          )}
        </div>

        {canInteract && !isCompleted && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-body">Bed Time</label>
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full px-4 py-3 bg-arcade-card border-2 border-arcade-border rounded-lg text-white text-center text-xl focus:border-neon-purple focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2 font-body">Wake Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-4 py-3 bg-arcade-card border-2 border-arcade-border rounded-lg text-white text-center text-xl focus:border-neon-purple focus:outline-none"
              />
            </div>

            {sleepHours > 0 && (
              <div className={`p-4 rounded-lg ${
                sleepHours >= target - 0.5 && sleepHours <= target + 1
                  ? 'bg-neon-green bg-opacity-20 border border-neon-green'
                  : 'bg-arcade-card border border-arcade-border'
              }`}>
                <p className={`text-sm text-center font-body ${
                  sleepHours >= target - 0.5 && sleepHours <= target + 1
                    ? 'text-neon-green'
                    : 'text-gray-400'
                }`}>
                  {sleepHours >= target - 0.5 && sleepHours <= target + 1
                    ? '✓ Great recovery!'
                    : sleepHours < target - 0.5
                    ? 'Try to get more sleep tonight'
                    : 'Good sleep!'}
                </p>
              </div>
            )}
          </div>
        )}

        {isCompleted ? (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
            <div className="max-w-md mx-auto space-y-3">
              <div className="p-4 bg-neon-green bg-opacity-20 border border-neon-green rounded-lg text-center">
                <div className="text-neon-green text-4xl mb-2">✓</div>
                <p className="text-neon-green font-display">SLEEP LOGGED</p>
                <p className="text-white text-sm mt-1 font-body">+{xpValues.sleep} XP</p>
              </div>
              {canInteract && (
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
          canInteract && bedTime && wakeTime && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
              <div className="max-w-md mx-auto">
                <button
                  onClick={handleComplete}
                  className="w-full arcade-btn py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-display text-xl rounded-lg hover:scale-105 transition-transform"
                >
                  LOG SLEEP
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
