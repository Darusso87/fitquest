'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingData } from '@/lib/types';
import { initializeGameSave } from '@/lib/plan-generator';
import { storage } from '@/lib/storage';

const COMMON_FOODS = [
  'Chicken', 'Beef', 'Fish', 'Eggs', 'Rice', 'Pasta', 'Bread',
  'Oats', 'Vegetables', 'Fruits', 'Nuts', 'Yogurt', 'Cheese',
  'Beans', 'Tofu', 'Turkey', 'Pork', 'Potatoes', 'Quinoa'
];

const COMMON_ALLERGIES = [
  'Dairy', 'Gluten', 'Nuts', 'Shellfish', 'Soy', 'Eggs'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({
    limitations: { type: 'none' },
    allergies: { hasAllergies: false },
    foodsLike: [],
    foodsDislike: [],
  });
  const [errors, setErrors] = useState<string>('');
  const [customFood, setCustomFood] = useState('');
  const [photo, setPhoto] = useState<string>('');

  const totalSteps = 20;

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors('');
  };

  const validateStep = (): boolean => {
    setErrors('');
    
    switch (step) {
      case 1:
        if (!data.age || data.age < 13 || data.age > 100) {
          setErrors('Please enter a valid age (13-100)');
          return false;
        }
        break;
      case 2:
        if (!data.sex) {
          setErrors('Please select your sex');
          return false;
        }
        break;
      case 3:
        if (!data.height || data.height < 100 || data.height > 250) {
          setErrors('Please enter a valid height (100-250 cm)');
          return false;
        }
        break;
      case 4:
        if (!data.weight || data.weight < 30 || data.weight > 300) {
          setErrors('Please enter a valid weight (30-300 kg)');
          return false;
        }
        break;
      case 13:
        if (data.limitations?.type === 'other' && !data.limitations?.details) {
          setErrors('Please describe your limitation');
          return false;
        }
        break;
      case 14:
        if (!data.foodsLike || data.foodsLike.length < 5) {
          setErrors('Please select at least 5 foods you like');
          return false;
        }
        break;
      case 16:
        if (data.allergies?.hasAllergies && !data.allergies?.details) {
          setErrors('Please specify your allergies');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    if (!validateStep()) return;
    
    const completeData: OnboardingData = {
      age: data.age!,
      sex: data.sex!,
      height: data.height!,
      weight: data.weight!,
      activityLevel: data.activityLevel!,
      typicalSleep: data.typicalSleep!,
      experience: data.experience!,
      goalType: data.goalType!,
      timeline: data.timeline!,
      trainingDays: data.trainingDays!,
      minutesPerSession: data.minutesPerSession!,
      equipment: 'none', // HOME WORKOUT APP - No equipment needed!
      limitations: data.limitations!,
      foodsLike: data.foodsLike!,
      foodsDislike: data.foodsDislike || [],
      allergies: data.allergies!,
      cookingTime: data.cookingTime!,
      mealsPerDay: data.mealsPerDay!,
      coachTone: data.coachTone!,
      photo: photo && photo !== 'skip' ? photo : undefined,
    };

    // Generate plan and save
    const gameSave = initializeGameSave(completeData);
    storage.save(gameSave);
    
    router.push('/dashboard');
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFood = (food: string, isLike: boolean) => {
    const key = isLike ? 'foodsLike' : 'foodsDislike';
    const current = data[key] || [];
    if (current.includes(food)) {
      updateData(key, current.filter(f => f !== food));
    } else {
      updateData(key, [...current, food]);
    }
  };

  const addCustomFood = (isLike: boolean) => {
    if (customFood.trim()) {
      toggleFood(customFood.trim(), isLike);
      setCustomFood('');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-2">HOW OLD ARE YOU?</h2>
            <input
              type="number"
              value={data.age || ''}
              onChange={(e) => updateData('age', parseInt(e.target.value))}
              className="w-full px-6 py-4 bg-arcade-card border-2 border-arcade-border rounded-lg text-2xl text-center text-white focus:border-neon-cyan focus:outline-none"
              placeholder="25"
            />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">SEX</h2>
            <div className="space-y-3">
              {(['male', 'female', 'other'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('sex', option)}
                  className={`w-full py-4 px-6 rounded-lg font-body text-lg transition-all ${
                    data.sex === option
                      ? 'bg-neon-cyan text-arcade-bg border-2 border-neon-cyan'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-cyan'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-2">HEIGHT (CM)</h2>
            <input
              type="number"
              value={data.height || ''}
              onChange={(e) => updateData('height', parseInt(e.target.value))}
              className="w-full px-6 py-4 bg-arcade-card border-2 border-arcade-border rounded-lg text-2xl text-center text-white focus:border-neon-cyan focus:outline-none"
              placeholder="175"
            />
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-2">WEIGHT (KG)</h2>
            <input
              type="number"
              value={data.weight || ''}
              onChange={(e) => updateData('weight', parseInt(e.target.value))}
              className="w-full px-6 py-4 bg-arcade-card border-2 border-arcade-border rounded-lg text-2xl text-center text-white focus:border-neon-cyan focus:outline-none"
              placeholder="70"
            />
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">ACTIVITY LEVEL</h2>
            <div className="space-y-3">
              {(['low', 'medium', 'high'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('activityLevel', option)}
                  className={`w-full py-4 px-6 rounded-lg font-body text-lg transition-all ${
                    data.activityLevel === option
                      ? 'bg-neon-pink text-white border-2 border-neon-pink'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-pink'
                  }`}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-2">TYPICAL SLEEP (HOURS)</h2>
            <input
              type="number"
              step="0.5"
              value={data.typicalSleep || ''}
              onChange={(e) => updateData('typicalSleep', parseFloat(e.target.value))}
              className="w-full px-6 py-4 bg-arcade-card border-2 border-arcade-border rounded-lg text-2xl text-center text-white focus:border-neon-cyan focus:outline-none"
              placeholder="7.5"
            />
          </div>
        );
      
      case 7:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">EXPERIENCE</h2>
            <div className="space-y-3">
              {(['beginner', 'intermediate', 'advanced'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('experience', option)}
                  className={`w-full py-4 px-6 rounded-lg font-body text-lg transition-all ${
                    data.experience === option
                      ? 'bg-neon-yellow text-arcade-bg border-2 border-neon-yellow'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-yellow'
                  }`}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 8:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">GOAL TYPE</h2>
            <div className="space-y-3">
              {(['fat loss', 'build muscle', 'strength', 'endurance', 'general health'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('goalType', option)}
                  className={`w-full py-4 px-6 rounded-lg font-body text-lg transition-all ${
                    data.goalType === option
                      ? 'bg-neon-green text-arcade-bg border-2 border-neon-green'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-green'
                  }`}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 9:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">TIMELINE (WEEKS)</h2>
            <div className="grid grid-cols-3 gap-3">
              {([4, 8, 12] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('timeline', option)}
                  className={`py-6 rounded-lg font-display text-2xl transition-all ${
                    data.timeline === option
                      ? 'bg-neon-cyan text-arcade-bg border-2 border-neon-cyan'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-cyan'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 10:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">TRAINING DAYS/WEEK</h2>
            <div className="grid grid-cols-3 gap-3">
              {([2, 3, 4, 5, 6] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('trainingDays', option)}
                  className={`py-6 rounded-lg font-display text-2xl transition-all ${
                    data.trainingDays === option
                      ? 'bg-neon-pink text-white border-2 border-neon-pink'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-pink'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 11:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">MINUTES/SESSION</h2>
            <div className="grid grid-cols-2 gap-3">
              {([20, 30, 45, 60] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('minutesPerSession', option)}
                  className={`py-6 rounded-lg font-display text-2xl transition-all ${
                    data.minutesPerSession === option
                      ? 'bg-neon-yellow text-arcade-bg border-2 border-neon-yellow'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-yellow'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 12:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">HOME WORKOUT</h2>
            <div className="neon-card p-6 rounded-lg text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="font-display text-2xl text-neon-yellow mb-3">
                NO EQUIPMENT NEEDED
              </h3>
              <p className="text-gray-300 font-body mb-4">
                This app focuses on bodyweight exercises you can do anywhere!
              </p>
              <div className="text-left space-y-2 text-sm text-gray-400">
                <p>✓ No gym membership required</p>
                <p>✓ No expensive equipment</p>
                <p>✓ Just you, your body, and determination</p>
                <p className="text-neon-cyan mt-4">Optional household items:</p>
                <p>• Chair (for dips, step-ups)</p>
                <p>• Wall (for wall sits)</p>
                <p>• Water bottles (light resistance)</p>
              </div>
            </div>
          </div>
        );
      
      case 13:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">LIMITATIONS</h2>
            <div className="space-y-3">
              {(['none', 'lower', 'upper', 'back', 'other'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('limitations', { type: option })}
                  className={`w-full py-4 px-6 rounded-lg font-body text-lg transition-all ${
                    data.limitations?.type === option
                      ? 'bg-neon-cyan text-arcade-bg border-2 border-neon-cyan'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-cyan'
                  }`}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
            {data.limitations?.type === 'other' && (
              <input
                type="text"
                value={data.limitations?.details || ''}
                onChange={(e) => updateData('limitations', { type: 'other', details: e.target.value })}
                className="w-full px-4 py-3 bg-arcade-card border-2 border-neon-cyan rounded-lg text-white focus:outline-none mt-4"
                placeholder="Describe your limitation..."
              />
            )}
          </div>
        );
      
      case 14:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl text-neon-cyan mb-2">FOODS YOU LIKE</h2>
            <p className="text-gray-400 text-sm">Select at least 5</p>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              {COMMON_FOODS.map(food => (
                <button
                  key={food}
                  onClick={() => toggleFood(food, true)}
                  className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                    data.foodsLike?.includes(food)
                      ? 'bg-neon-green text-arcade-bg'
                      : 'bg-arcade-card border border-arcade-border text-white hover:border-neon-green'
                  }`}
                >
                  {food}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={customFood}
                onChange={(e) => setCustomFood(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomFood(true)}
                className="flex-1 px-4 py-2 bg-arcade-card border border-arcade-border rounded-lg text-white text-sm focus:outline-none focus:border-neon-green"
                placeholder="Add custom food..."
              />
              <button
                onClick={() => addCustomFood(true)}
                className="px-4 py-2 bg-neon-green text-arcade-bg rounded-lg text-sm font-body"
              >
                ADD
              </button>
            </div>
            <p className="text-neon-green text-sm">Selected: {data.foodsLike?.length || 0}</p>
          </div>
        );
      
      case 15:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl text-neon-cyan mb-2">FOODS YOU DISLIKE</h2>
            <p className="text-gray-400 text-sm">Optional</p>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              {COMMON_FOODS.map(food => (
                <button
                  key={food}
                  onClick={() => toggleFood(food, false)}
                  className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                    data.foodsDislike?.includes(food)
                      ? 'bg-neon-pink text-white'
                      : 'bg-arcade-card border border-arcade-border text-white hover:border-neon-pink'
                  }`}
                >
                  {food}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 16:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">ALLERGIES</h2>
            <div className="space-y-3">
              <button
                onClick={() => updateData('allergies', { hasAllergies: false })}
                className={`w-full py-4 px-6 rounded-lg font-body text-lg transition-all ${
                  !data.allergies?.hasAllergies
                    ? 'bg-neon-green text-arcade-bg border-2 border-neon-green'
                    : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-green'
                }`}
              >
                NONE
              </button>
              <button
                onClick={() => updateData('allergies', { hasAllergies: true, details: data.allergies?.details })}
                className={`w-full py-4 px-6 rounded-lg font-body text-lg transition-all ${
                  data.allergies?.hasAllergies
                    ? 'bg-neon-pink text-white border-2 border-neon-pink'
                    : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-pink'
                }`}
              >
                I HAVE ALLERGIES
              </button>
            </div>
            {data.allergies?.hasAllergies && (
              <>
                <div className="flex flex-wrap gap-2 mt-4">
                  {COMMON_ALLERGIES.map(allergy => (
                    <button
                      key={allergy}
                      onClick={() => {
                        const current = data.allergies?.details || '';
                        const list = current.split(',').map(s => s.trim()).filter(Boolean);
                        if (list.includes(allergy)) {
                          updateData('allergies', { hasAllergies: true, details: list.filter(a => a !== allergy).join(', ') });
                        } else {
                          updateData('allergies', { hasAllergies: true, details: [...list, allergy].join(', ') });
                        }
                      }}
                      className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                        data.allergies?.details?.includes(allergy)
                          ? 'bg-neon-pink text-white'
                          : 'bg-arcade-card border border-arcade-border text-white hover:border-neon-pink'
                      }`}
                    >
                      {allergy}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={data.allergies?.details || ''}
                  onChange={(e) => updateData('allergies', { hasAllergies: true, details: e.target.value })}
                  className="w-full px-4 py-3 bg-arcade-card border-2 border-neon-pink rounded-lg text-white focus:outline-none"
                  placeholder="e.g., Dairy, Nuts..."
                />
              </>
            )}
          </div>
        );
      
      case 17:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">COOKING TIME</h2>
            <div className="space-y-3">
              {(['low', 'medium', 'high'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('cookingTime', option)}
                  className={`w-full py-4 px-6 rounded-lg font-body text-lg transition-all ${
                    data.cookingTime === option
                      ? 'bg-neon-yellow text-arcade-bg border-2 border-neon-yellow'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-yellow'
                  }`}
                >
                  {option.toUpperCase()} ({option === 'low' ? '<15min' : option === 'medium' ? '15-30min' : '30min+'})
                </button>
              ))}
            </div>
          </div>
        );
      
      case 18:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">MEALS PER DAY</h2>
            <div className="grid grid-cols-3 gap-3">
              {([2, 3, 4, 5] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('mealsPerDay', option)}
                  className={`py-6 rounded-lg font-display text-2xl transition-all ${
                    data.mealsPerDay === option
                      ? 'bg-neon-green text-arcade-bg border-2 border-neon-green'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-green'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 19:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">COACH TONE</h2>
            <div className="space-y-3">
              {(['strict', 'friendly', 'competitive'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => updateData('coachTone', option)}
                  className={`w-full py-4 px-6 rounded-lg font-body text-lg transition-all ${
                    data.coachTone === option
                      ? 'bg-neon-purple text-white border-2 border-neon-purple'
                      : 'bg-arcade-card border-2 border-arcade-border text-white hover:border-neon-purple'
                  }`}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 20:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-neon-cyan mb-4">BEFORE PHOTO</h2>
            <p className="text-gray-400 text-sm">Optional - Track your transformation</p>
            
            {photo ? (
              <div className="relative">
                <img src={photo} alt="Before" className="w-full h-64 object-cover rounded-lg border-2 border-neon-cyan" />
                <button
                  onClick={() => setPhoto('')}
                  className="absolute top-2 right-2 px-4 py-2 bg-neon-pink text-white rounded-lg font-body text-sm"
                >
                  CHANGE
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                  <div className="w-full py-12 border-2 border-dashed border-neon-cyan rounded-lg text-center cursor-pointer hover:bg-arcade-card transition-all">
                    <div className="text-neon-cyan text-4xl mb-2">📷</div>
                    <p className="text-white font-body">TAKE PHOTO</p>
                  </div>
                </label>
                
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                  <div className="w-full py-6 border-2 border-arcade-border rounded-lg text-center cursor-pointer hover:border-neon-cyan transition-all">
                    <p className="text-gray-400 font-body">or UPLOAD FILE</p>
                  </div>
                </label>

                <button
                  onClick={() => setPhoto('skip')}
                  className="w-full py-3 bg-arcade-card border border-arcade-border rounded-lg text-gray-400 font-body text-sm hover:border-gray-500 transition-all"
                >
                  SKIP - No Photo
                </button>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Progress bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-display text-neon-cyan text-sm">QUEST SETUP</span>
          <span className="font-body text-gray-400 text-sm">{step}/{totalSteps}</span>
        </div>
        <div className="h-2 bg-arcade-border rounded-full overflow-hidden progress-bar">
          <div 
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        {renderStep()}

        {/* Error message */}
        {errors && (
          <div className="mt-4 p-4 bg-neon-pink bg-opacity-20 border border-neon-pink rounded-lg">
            <p className="text-neon-pink text-sm font-body">{errors}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="flex-1 py-3 px-6 bg-arcade-card border-2 border-arcade-border rounded-lg text-white font-body hover:border-gray-500 transition-all"
            >
              BACK
            </button>
          )}
          
          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="flex-1 arcade-btn py-3 px-6 bg-gradient-to-r from-neon-cyan to-neon-pink text-white font-body rounded-lg hover:scale-105 transition-transform"
            >
              NEXT
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 arcade-btn py-3 px-6 bg-gradient-to-r from-neon-green to-neon-yellow text-arcade-bg font-display rounded-lg hover:scale-105 transition-transform"
            >
              START QUEST
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
