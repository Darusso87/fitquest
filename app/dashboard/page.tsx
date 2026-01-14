'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameSave, DayPlan } from '@/lib/types';
import { storage, isToday, formatDate, getTodayString, addDays } from '@/lib/storage';
import { calculateLevel, xpForNextLevel, computeXPValues } from '@/lib/targets';

export default function DashboardPage() {
  const router = useRouter();
  const [save, setSave] = useState<GameSave | null>(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) {
      router.push('/');
      return;
    }
    
    setSave(loadedSave);
    
    // Find today's index
    const todayStr = getTodayString();
    const todayIndex = loadedSave.plan.days.findIndex(day => day.date === todayStr);
    setCurrentDateIndex(todayIndex >= 0 ? todayIndex : 0);
    
    setLoading(false);
  }, [router]);

  if (loading || !save) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div>
      </div>
    );
  }

  const currentDay = save.plan.days[currentDateIndex];
  const isCurrentDayToday = currentDay && isToday(currentDay.date);
  const xpValues = computeXPValues(save.onboarding);
  const currentLevel = calculateLevel(save.xpTotal);
  const nextLevelXP = xpForNextLevel(currentLevel);
  const xpProgress = (save.xpTotal % nextLevelXP) / nextLevelXP * 100;

  // Weight stats
  const startWeight = save.weightHistory[0]?.weight || save.onboarding.weight;
  const currentWeight = save.weightHistory[save.weightHistory.length - 1]?.weight || save.onboarding.weight;
  const weightChange = currentWeight - startWeight;

  const handlePrevDay = () => {
    if (currentDateIndex > 0) {
      setCurrentDateIndex(prev => prev - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDateIndex < save.plan.days.length - 1) {
      setCurrentDateIndex(prev => prev + 1);
    }
  };

  const handleMissionClick = (missionType: string) => {
    // Always allow viewing missions
    router.push(`/mission/${missionType}/${currentDay.date}`);
  };

  const getDayLog = (date: string) => {
    return save.logsByDate[date];
  };

  const currentLog = currentDay ? getDayLog(currentDay.date) : null;

  const missions = [
    {
      id: 'workout',
      name: currentDay?.type === 'workout' ? 'WORKOUT' : 'REST DAY QUEST',
      completed: currentLog?.missionCompleted.workout || false,
      xp: xpValues.workout,
      icon: '💪',
    },
    {
      id: 'water',
      name: 'HYDRATION',
      completed: currentLog?.missionCompleted.water || false,
      xp: xpValues.water,
      icon: '💧',
      progress: currentLog ? `${currentLog.waterMl}/${currentDay?.targets.waterMl}ml` : undefined,
    },
    {
      id: 'food',
      name: 'NUTRITION',
      completed: currentLog?.missionCompleted.food || false,
      xp: xpValues.food,
      icon: '🍽️',
    },
    {
      id: 'sleep',
      name: 'RECOVERY',
      completed: currentLog?.missionCompleted.sleep || false,
      xp: xpValues.sleep,
      icon: '😴',
      progress: currentLog?.sleepHours ? `${currentLog.sleepHours}h` : undefined,
    },
    {
      id: 'steps',
      name: 'MOVEMENT',
      completed: currentLog?.missionCompleted.steps || false,
      xp: xpValues.steps,
      icon: '👟',
      progress: currentLog?.steps ? `${currentLog.steps}` : undefined,
    },
    {
      id: 'mobility',
      name: 'MOBILITY',
      completed: currentLog?.missionCompleted.mobility || false,
      xp: xpValues.mobility,
      icon: '🧘',
      optional: true,
    },
  ];

  if (currentDay?.hasWeighIn) {
    missions.push({
      id: 'weighin',
      name: 'WEIGH-IN',
      completed: currentLog?.missionCompleted.weighin || false,
      xp: xpValues.weighin,
      icon: '⚖️',
    });
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header with user info */}
      <div className="bg-arcade-card border-b-2 border-arcade-border p-6">
        <div className="max-w-md mx-auto flex items-start gap-4">
          {/* User photo */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neon-cyan flex-shrink-0">
            {save.userPhoto ? (
              <img src={save.userPhoto} alt="User" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center text-3xl">
                👤
              </div>
            )}
          </div>

          {/* Level and stats */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display text-neon-cyan text-xl">LVL {currentLevel}</span>
              <button
                onClick={() => router.push('/progress')}
                className="ml-2 px-2 py-1 bg-arcade-card border border-neon-pink rounded text-neon-pink text-xs font-body hover:bg-neon-pink hover:text-white transition-all"
              >
                📊 STATS
              </button>
            </div>
            
            {/* XP bar */}
            <div className="h-3 bg-arcade-border rounded-full overflow-hidden progress-bar mb-3">
              <div 
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            
            <div className="text-xs text-gray-400 font-body">
              {save.xpTotal} / {currentLevel * currentLevel * 100} XP
            </div>

            {/* Weight stats */}
            <div className="mt-3 flex gap-4 text-xs font-body">
              <div>
                <span className="text-gray-500">Start:</span>{' '}
                <span className="text-white">{startWeight}kg</span>
              </div>
              <div>
                <span className="text-gray-500">Now:</span>{' '}
                <span className="text-white">{currentWeight}kg</span>
              </div>
              <div>
                <span className={weightChange >= 0 ? 'text-neon-pink' : 'text-neon-green'}>
                  {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)}kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day navigation */}
      <div className="max-w-md mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevDay}
            disabled={currentDateIndex === 0}
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-display text-xl transition-all ${
              currentDateIndex === 0
                ? 'bg-arcade-card text-gray-600 cursor-not-allowed'
                : 'bg-arcade-card border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-arcade-bg'
            }`}
          >
            ←
          </button>

          <div className="text-center flex-1">
            <h2 className="font-display text-2xl text-white">
              {currentDay && formatDate(currentDay.date)}
            </h2>
            {isCurrentDayToday && (
              <div className="inline-block mt-1 px-3 py-1 bg-neon-green text-arcade-bg text-xs font-body rounded-full">
                TODAY
              </div>
            )}
          </div>

          <button
            onClick={handleNextDay}
            disabled={currentDateIndex === save.plan.days.length - 1}
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-display text-xl transition-all ${
              currentDateIndex === save.plan.days.length - 1
                ? 'bg-arcade-card text-gray-600 cursor-not-allowed'
                : 'bg-arcade-card border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-arcade-bg'
            }`}
          >
            →
          </button>
        </div>

        {/* Missions list */}
        <div className="space-y-3">
          {missions.map((mission) => {
            const selectedDate = new Date(currentDay.date);
            const today = new Date(getTodayString());
            const isFuture = selectedDate > today;
            const isPast = selectedDate < today && !isCurrentDayToday;
            
            return (
              <button
                key={mission.id}
                onClick={() => handleMissionClick(mission.id)}
                className={`w-full neon-card rounded-lg p-4 text-left transition-all hover:scale-[1.02] ${
                  mission.completed ? 'status-completed' : isCurrentDayToday ? 'status-pending' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{mission.icon}</span>
                    <div>
                      <h3 className="font-display text-lg text-white">
                        {mission.name}
                        {mission.optional && (
                          <span className="ml-2 text-xs text-gray-500">(Optional)</span>
                        )}
                      </h3>
                      {mission.progress && isCurrentDayToday && (
                        <p className="text-sm text-gray-400 font-body">{mission.progress}</p>
                      )}
                      {isFuture && (
                        <p className="text-xs text-neon-cyan font-body">👁️ View plan • Complete on date</p>
                      )}
                      {isPast && !mission.completed && (
                        <p className="text-xs text-gray-500 font-body">Missed</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-display text-sm ${
                      mission.completed ? 'text-neon-green' : isFuture || isPast ? 'text-gray-400' : 'text-neon-yellow'
                    }`}>
                      +{mission.xp} XP
                    </div>
                    {mission.completed && (
                      <div className="text-neon-green text-xl">✓</div>
                    )}
                    {isFuture && !mission.completed && (
                      <div className="text-neon-cyan text-lg">👁️</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom nav buttons */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/shopping-list')}
            className="py-3 px-4 bg-arcade-card border border-arcade-border rounded-lg text-center hover:border-neon-green transition-all"
          >
            <div className="text-xl mb-1">🛒</div>
            <div className="text-xs text-gray-400 font-body">SHOPPING</div>
          </button>
          
          <button
            onClick={() => router.push('/settings')}
            className="py-3 px-4 bg-arcade-card border border-arcade-border rounded-lg text-center hover:border-neon-yellow transition-all"
          >
            <div className="text-xl mb-1">⚙️</div>
            <div className="text-xs text-gray-400 font-body">SETTINGS</div>
          </button>
        </div>
      </div>
    </div>
  );
}
