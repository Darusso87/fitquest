'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GameSave, Meal } from '@/lib/types';
import { storage, isToday, getTodayString } from '@/lib/storage';
import { computeXPValues } from '@/lib/targets';
import { rerollMeals } from '@/lib/plan-generator';

export default function FoodMissionPage() {
  const router = useRouter();
  const params = useParams();
  const date = params.date as string;
  
  const [save, setSave] = useState<GameSave | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) {
      router.push('/');
      return;
    }

    const day = loadedSave.plan.days.find(d => d.date === date);
    if (day) {
      const dayMeals = day.mealIds.map(id => 
        loadedSave.plan.recipesBank.find(r => r.id === id)
      ).filter(Boolean) as Meal[];
      setMeals(dayMeals);
    }

    setSave(loadedSave);
  }, [date, router]);

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

    updatedSave.logsByDate[date].missionCompleted.food = true;
    updatedSave.logsByDate[date].xpEarned.food = xpValues.food;
    updatedSave.xpTotal += xpValues.food;

    storage.save(updatedSave);
    router.push('/dashboard');
  };

  const handleUndo = () => {
    if (!save || !isToday(date)) return;

    const updatedSave = { ...save };
    if (updatedSave.logsByDate[date]?.missionCompleted.food) {
      updatedSave.logsByDate[date].missionCompleted.food = false;
      updatedSave.xpTotal -= updatedSave.logsByDate[date].xpEarned.food;
      updatedSave.logsByDate[date].xpEarned.food = 0;
      
      storage.save(updatedSave);
      setSave(updatedSave);
    }
  };

  const handleSwapMeal = (mealIndex: number) => {
    if (!save) return;

    const day = save.plan.days.find(d => d.date === date);
    if (!day) return;

    const dayIndex = save.plan.days.indexOf(day);
    const newMealIds = rerollMeals(day.mealIds, save.plan.recipesBank, dayIndex);
    
    const updatedSave = { ...save };
    const dayInPlan = updatedSave.plan.days.find(d => d.date === date);
    if (dayInPlan) {
      dayInPlan.mealIds = newMealIds;
    }

    const newMeals = newMealIds.map(id => 
      updatedSave.plan.recipesBank.find(r => r.id === id)
    ).filter(Boolean) as Meal[];
    
    setMeals(newMeals);
    storage.save(updatedSave);
    setSave(updatedSave);
  };

  if (!save) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div>
    </div>;
  }

  const day = save.plan.days.find(d => d.date === date);
  const dayLog = save.logsByDate[date];
  const isCompleted = dayLog?.missionCompleted.food;
  const canInteract = isToday(date);
  const xpValues = computeXPValues(save.onboarding);
  
  // Check if future or past
  const selectedDate = new Date(date);
  const today = new Date(getTodayString());
  const isFuture = selectedDate > today && !canInteract;

  return (
    <div className="min-h-screen px-6 py-8 pb-24">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 text-neon-cyan font-body flex items-center gap-2"
        >
          ← BACK
        </button>

        <h1 className="font-display text-4xl text-neon-yellow mb-2">NUTRITION</h1>
        <p className="text-gray-400 font-body mb-2">Today's meal plan</p>
        {day && (
          <p className="text-gray-400 text-sm font-body mb-8">
            Target: {day.targets.proteinG}g protein, {day.targets.veggiesServings} veggie servings
          </p>
        )}

        {/* Preview notice */}
        {!canInteract && isFuture && (
          <div className="mb-6 p-4 rounded-lg border-2 bg-neon-cyan bg-opacity-10 border-neon-cyan">
            <p className="text-sm font-body text-center text-neon-cyan">
              👁️ Preview - View your upcoming meals
            </p>
          </div>
        )}

        {/* Meals */}
        <div className="space-y-4 mb-6">
          {meals.map((meal, i) => (
            <div key={i} className="neon-card rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-display text-xl text-white">{meal.name}</h3>
                  <p className="text-neon-yellow text-sm font-body capitalize">{meal.type}</p>
                </div>
                {canInteract && !isCompleted && (
                  <button
                    onClick={() => handleSwapMeal(i)}
                    className="px-3 py-1 bg-arcade-bg border border-neon-cyan text-neon-cyan text-xs rounded hover:bg-neon-cyan hover:text-arcade-bg transition-all"
                  >
                    SWAP
                  </button>
                )}
              </div>

              <div className="flex gap-4 text-xs text-gray-400 mb-3 font-body">
                <span>🔥 {meal.calories} cal</span>
                <span>🥩 {meal.protein}g</span>
                <span>🍞 {meal.carbs}g</span>
                <span>🥑 {meal.fats}g</span>
              </div>

              <details className="text-sm">
                <summary className="text-neon-cyan cursor-pointer mb-2">View Recipe</summary>
                <div className="space-y-2 mt-2">
                  <div>
                    <p className="text-gray-500 text-xs">Ingredients:</p>
                    <ul className="list-disc list-inside text-gray-400">
                      {meal.ingredients.map((ing, j) => (
                        <li key={j}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Instructions:</p>
                    <ol className="list-decimal list-inside text-gray-400">
                      {meal.instructions.map((inst, j) => (
                        <li key={j}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                  <p className="text-gray-500 text-xs">Cooking time: ~{meal.cookingTime} min</p>
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* Complete button */}
        {isCompleted ? (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
            <div className="max-w-md mx-auto space-y-3">
              <div className="p-4 bg-neon-green bg-opacity-20 border border-neon-green rounded-lg text-center">
                <div className="text-neon-green text-4xl mb-2">✓</div>
                <p className="text-neon-green font-display">NUTRITION COMPLETE</p>
                <p className="text-white text-sm mt-1 font-body">+{xpValues.food} XP</p>
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
          canInteract && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-arcade-bg border-t-2 border-arcade-border">
              <div className="max-w-md mx-auto">
                <button
                  onClick={handleComplete}
                  className="w-full arcade-btn py-4 bg-gradient-to-r from-neon-yellow to-neon-green text-arcade-bg font-display text-xl rounded-lg hover:scale-105 transition-transform"
                >
                  MARK AS COMPLETE
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
