'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameSave } from '@/lib/types';
import { storage } from '@/lib/storage';
import { calculateLevel } from '@/lib/targets';

export default function ProgressPage() {
  const router = useRouter();
  const [save, setSave] = useState<GameSave | null>(null);

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) router.push('/');
    else setSave(loadedSave);
  }, [router]);

  if (!save) return <div className="min-h-screen flex items-center justify-center"><div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div></div>;

  const currentLevel = calculateLevel(save.xpTotal);
  const startWeight = save.weightHistory[0]?.weight || save.onboarding.weight;
  const currentWeight = save.weightHistory[save.weightHistory.length - 1]?.weight || save.onboarding.weight;
  const weightChange = currentWeight - startWeight;

  // Calculate stats
  const totalDays = save.plan.days.length;
  const completedDays = Object.values(save.logsByDate).filter(log => log.workoutCompleted || log.missionCompleted.workout).length;
  const adherenceRate = totalDays > 0 ? (completedDays / totalDays * 100).toFixed(0) : 0;

  // Calculate streak
  let currentStreak = 0;
  const today = new Date();
  for (let i = 0; i < 100; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    const log = save.logsByDate[dateStr];
    if (log && (log.workoutCompleted || log.missionCompleted.workout)) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="min-h-screen px-6 py-8 pb-20">
      <div className="max-w-md mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-6 text-neon-cyan font-body flex items-center gap-2">← BACK</button>
        <h1 className="font-display text-4xl text-neon-pink mb-8">STATS</h1>

        {/* Level card */}
        <div className="neon-card rounded-lg p-6 mb-4">
          <p className="text-gray-400 text-sm mb-2 font-body">Current Level</p>
          <p className="font-display text-5xl text-neon-cyan mb-2">LVL {currentLevel}</p>
          <p className="text-gray-400 text-sm font-body">{save.xpTotal} XP Total</p>
        </div>

        {/* Streak card */}
        <div className="neon-card rounded-lg p-6 mb-4">
          <p className="text-gray-400 text-sm mb-2 font-body">Current Streak</p>
          <p className="font-display text-5xl text-neon-yellow mb-2">🔥 {currentStreak}</p>
          <p className="text-gray-400 text-sm font-body">Days in a row</p>
        </div>

        {/* Adherence card */}
        <div className="neon-card rounded-lg p-6 mb-4">
          <p className="text-gray-400 text-sm mb-2 font-body">Adherence Rate</p>
          <p className="font-display text-5xl text-neon-green mb-2">{adherenceRate}%</p>
          <p className="text-gray-400 text-sm font-body">{completedDays} of {totalDays} days</p>
        </div>

        {/* Weight progress */}
        <div className="neon-card rounded-lg p-6 mb-4">
          <p className="text-gray-400 text-sm mb-4 font-body">Weight Progress</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-gray-500 text-xs">Start</p>
              <p className="text-white font-display text-xl">{startWeight}kg</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Current</p>
              <p className="text-white font-display text-xl">{currentWeight}kg</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Change</p>
              <p className={`font-display text-xl ${weightChange >= 0 ? 'text-neon-pink' : 'text-neon-green'}`}>
                {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)}kg
              </p>
            </div>
          </div>

          {/* Simple weight chart */}
          {save.weightHistory.length > 1 && (
            <div className="mt-4 pt-4 border-t border-arcade-border">
              <p className="text-gray-400 text-xs mb-3 font-body">Weight History</p>
              <div className="space-y-1">
                {save.weightHistory.slice(-5).reverse().map((entry, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-500">{entry.date}</span>
                    <span className="text-white">{entry.weight}kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* XP breakdown */}
        <div className="neon-card rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-4 font-body">XP Earned By Mission</p>
          <div className="space-y-2">
            {['workout', 'water', 'food', 'sleep', 'steps', 'mobility', 'weighin'].map(mission => {
              const totalXP = Object.values(save.logsByDate).reduce((sum, log) => sum + (log.xpEarned[mission as keyof typeof log.xpEarned] || 0), 0);
              if (totalXP === 0) return null;
              return (
                <div key={mission} className="flex justify-between text-sm">
                  <span className="text-gray-400 capitalize">{mission}</span>
                  <span className="text-neon-cyan">{totalXP} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
