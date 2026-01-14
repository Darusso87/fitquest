'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameSave, Meal } from '@/lib/types';
import { storage, getTodayString, addDays } from '@/lib/storage';

export default function ShoppingListPage() {
  const router = useRouter();
  const [save, setSave] = useState<GameSave | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadedSave = storage.load();
    if (!loadedSave) router.push('/');
    else setSave(loadedSave);
  }, [router]);

  if (!save) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-neon-cyan text-2xl font-display animate-pulse">LOADING...</div>
    </div>
  );

  // Get next 7 days of meals
  const today = getTodayString();
  const todayIndex = save.plan.days.findIndex(d => d.date === today);
  const nextWeekDays = save.plan.days.slice(todayIndex, todayIndex + 7);

  // Collect all ingredients
  const ingredientMap = new Map<string, { count: number; meals: string[] }>();
  
  nextWeekDays.forEach(day => {
    day.mealIds.forEach(mealId => {
      const meal = save.plan.recipesBank.find(r => r.id === mealId);
      if (meal) {
        meal.ingredients.forEach(ingredient => {
          // Normalize ingredient (remove quantities for grouping)
          const normalizedIng = ingredient.replace(/\d+[a-z]*\s*/gi, '').trim();
          
          if (ingredientMap.has(normalizedIng)) {
            const existing = ingredientMap.get(normalizedIng)!;
            existing.count++;
            if (!existing.meals.includes(meal.name)) {
              existing.meals.push(meal.name);
            }
          } else {
            ingredientMap.set(normalizedIng, { count: 1, meals: [meal.name] });
          }
        });
      }
    });
  });

  // Group by category
  const categories: { [key: string]: string[] } = {
    'Proteins': [],
    'Vegetables': [],
    'Fruits': [],
    'Grains & Carbs': [],
    'Dairy': [],
    'Pantry': [],
    'Other': []
  };

  const proteinKeywords = ['chicken', 'beef', 'fish', 'salmon', 'turkey', 'tuna', 'egg', 'tofu', 'protein'];
  const veggieKeywords = ['spinach', 'broccoli', 'tomato', 'lettuce', 'cucumber', 'pepper', 'onion', 'carrot', 'mushroom', 'asparagus', 'zucchini', 'bean', 'pea', 'vegetable', 'greens'];
  const fruitKeywords = ['banana', 'apple', 'berries', 'berry', 'fruit', 'lemon'];
  const grainKeywords = ['rice', 'pasta', 'bread', 'oat', 'quinoa', 'noodle', 'toast', 'potato', 'naan'];
  const dairyKeywords = ['milk', 'yogurt', 'cheese', 'butter', 'cream'];
  const pantryKeywords = ['oil', 'sauce', 'spice', 'salt', 'pepper', 'honey', 'nut', 'seed', 'almond', 'peanut'];

  ingredientMap.forEach((data, ingredient) => {
    const lowerIng = ingredient.toLowerCase();
    let categorized = false;

    if (proteinKeywords.some(k => lowerIng.includes(k))) {
      categories['Proteins'].push(ingredient);
      categorized = true;
    } else if (veggieKeywords.some(k => lowerIng.includes(k))) {
      categories['Vegetables'].push(ingredient);
      categorized = true;
    } else if (fruitKeywords.some(k => lowerIng.includes(k))) {
      categories['Fruits'].push(ingredient);
      categorized = true;
    } else if (grainKeywords.some(k => lowerIng.includes(k))) {
      categories['Grains & Carbs'].push(ingredient);
      categorized = true;
    } else if (dairyKeywords.some(k => lowerIng.includes(k))) {
      categories['Dairy'].push(ingredient);
      categorized = true;
    } else if (pantryKeywords.some(k => lowerIng.includes(k))) {
      categories['Pantry'].push(ingredient);
      categorized = true;
    }
    
    if (!categorized) {
      categories['Other'].push(ingredient);
    }
  });

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const clearChecked = () => {
    setCheckedItems(new Set());
  };

  return (
    <div className="min-h-screen px-6 py-8 pb-20">
      <div className="max-w-md mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-6 text-neon-cyan font-body flex items-center gap-2">
          ← BACK
        </button>
        
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-4xl text-neon-green">SHOPPING</h1>
          {checkedItems.size > 0 && (
            <button
              onClick={clearChecked}
              className="px-3 py-1 bg-arcade-card border border-neon-pink text-neon-pink text-xs rounded hover:bg-neon-pink hover:text-white transition-all"
            >
              CLEAR
            </button>
          )}
        </div>
        <p className="text-gray-400 font-body mb-8">Next 7 days • Tap to check off</p>

        {/* Summary */}
        <div className="neon-card rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-body">Total Items</span>
            <span className="text-white font-display text-xl">{ingredientMap.size}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm font-body">Checked Off</span>
            <span className="text-neon-green font-display text-xl">{checkedItems.size}</span>
          </div>
        </div>

        {/* Shopping list by category */}
        <div className="space-y-6">
          {Object.entries(categories).map(([category, items]) => {
            if (items.length === 0) return null;
            
            return (
              <div key={category} className="neon-card rounded-lg p-4">
                <h2 className="font-display text-xl text-neon-cyan mb-4">{category}</h2>
                <div className="space-y-2">
                  {items.sort().map(item => {
                    const isChecked = checkedItems.has(item);
                    const itemData = ingredientMap.get(item)!;
                    
                    return (
                      <button
                        key={item}
                        onClick={() => toggleItem(item)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          isChecked
                            ? 'bg-neon-green bg-opacity-10 border-neon-green'
                            : 'bg-arcade-bg border-arcade-border hover:border-neon-cyan'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isChecked ? 'bg-neon-green border-neon-green' : 'border-gray-500'
                            }`}>
                              {isChecked && <span className="text-arcade-bg text-sm">✓</span>}
                            </div>
                            <div className="flex-1">
                              <p className={`font-body ${isChecked ? 'line-through text-gray-500' : 'text-white'}`}>
                                {item}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Used in {itemData.count} meal{itemData.count > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Meal preview */}
        <div className="mt-8 neon-card rounded-lg p-4">
          <h2 className="font-display text-xl text-neon-yellow mb-4">UPCOMING MEALS</h2>
          <div className="space-y-2 text-sm font-body">
            {nextWeekDays.map((day, i) => {
              const meals = day.mealIds.map(id => 
                save.plan.recipesBank.find(r => r.id === id)?.name
              ).filter(Boolean);
              
              return (
                <div key={day.date} className="pb-2 border-b border-arcade-border last:border-0">
                  <p className="text-gray-500 text-xs">Day {i + 1}</p>
                  <p className="text-gray-400">{meals.join(' • ')}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 p-4 bg-arcade-card rounded-lg border border-arcade-border">
          <p className="text-xs text-gray-500 font-body text-center">
            💡 Shopping list updates automatically based on your meal plan
          </p>
        </div>
      </div>
    </div>
  );
}
