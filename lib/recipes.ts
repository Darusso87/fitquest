import { Meal } from './types';

export const RECIPE_BANK: Meal[] = [
  // Breakfast - High Protein
  {
    id: 'bf_1',
    name: 'Protein Power Oats',
    type: 'breakfast',
    protein: 35,
    carbs: 45,
    fats: 12,
    calories: 420,
    veggieServings: 0,
    cookingTime: 10,
    ingredients: ['Oats 60g', 'Protein powder 30g', 'Banana', 'Berries', 'Almond butter 1 tbsp'],
    instructions: ['Cook oats', 'Mix in protein powder', 'Top with banana and berries', 'Add almond butter'],
  },
  {
    id: 'bf_2',
    name: 'Egg White Scramble',
    type: 'breakfast',
    protein: 40,
    carbs: 25,
    fats: 15,
    calories: 395,
    veggieServings: 2,
    cookingTime: 15,
    ingredients: ['Egg whites 250ml', 'Spinach', 'Tomatoes', 'Mushrooms', 'Toast 2 slices'],
    instructions: ['Sauté vegetables', 'Add egg whites', 'Scramble until cooked', 'Serve with toast'],
  },
  {
    id: 'bf_3',
    name: 'Greek Yogurt Bowl',
    type: 'breakfast',
    protein: 30,
    carbs: 40,
    fats: 10,
    calories: 370,
    veggieServings: 0,
    cookingTime: 5,
    ingredients: ['Greek yogurt 250g', 'Granola 40g', 'Mixed berries', 'Honey 1 tbsp', 'Almonds'],
    instructions: ['Layer yogurt in bowl', 'Add granola', 'Top with berries', 'Drizzle honey', 'Sprinkle almonds'],
  },
  
  // Lunch - Balanced
  {
    id: 'ln_1',
    name: 'Grilled Chicken Salad',
    type: 'lunch',
    protein: 45,
    carbs: 30,
    fats: 18,
    calories: 465,
    veggieServings: 3,
    cookingTime: 20,
    ingredients: ['Chicken breast 200g', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing', 'Quinoa 50g'],
    instructions: ['Grill chicken', 'Cook quinoa', 'Chop vegetables', 'Assemble salad', 'Add dressing'],
  },
  {
    id: 'ln_2',
    name: 'Turkey Wrap Power',
    type: 'lunch',
    protein: 38,
    carbs: 45,
    fats: 15,
    calories: 475,
    veggieServings: 2,
    cookingTime: 10,
    ingredients: ['Whole wheat wrap', 'Turkey breast 150g', 'Lettuce', 'Tomato', 'Avocado', 'Mustard'],
    instructions: ['Layer turkey on wrap', 'Add vegetables', 'Spread mustard', 'Roll tightly', 'Slice in half'],
  },
  {
    id: 'ln_3',
    name: 'Salmon Rice Bowl',
    type: 'lunch',
    protein: 42,
    carbs: 50,
    fats: 20,
    calories: 560,
    veggieServings: 2,
    cookingTime: 25,
    ingredients: ['Salmon fillet 180g', 'Brown rice 80g', 'Broccoli', 'Carrots', 'Soy sauce', 'Sesame seeds'],
    instructions: ['Bake salmon', 'Cook rice', 'Steam vegetables', 'Assemble bowl', 'Drizzle soy sauce'],
  },
  {
    id: 'ln_4',
    name: 'Beef Stir-Fry',
    type: 'lunch',
    protein: 40,
    carbs: 45,
    fats: 18,
    calories: 510,
    veggieServings: 3,
    cookingTime: 20,
    ingredients: ['Lean beef 180g', 'Bell peppers', 'Snap peas', 'Onions', 'Rice noodles 80g', 'Stir-fry sauce'],
    instructions: ['Cook noodles', 'Stir-fry beef', 'Add vegetables', 'Toss with sauce', 'Combine all'],
  },
  
  // Dinner - Hearty
  {
    id: 'dn_1',
    name: 'Chicken & Sweet Potato',
    type: 'dinner',
    protein: 50,
    carbs: 55,
    fats: 16,
    calories: 560,
    veggieServings: 2,
    cookingTime: 35,
    ingredients: ['Chicken breast 220g', 'Sweet potato large', 'Green beans', 'Olive oil', 'Spices'],
    instructions: ['Bake sweet potato', 'Grill chicken', 'Steam green beans', 'Season everything', 'Plate and serve'],
  },
  {
    id: 'dn_2',
    name: 'Lean Beef Bowl',
    type: 'dinner',
    protein: 48,
    carbs: 50,
    fats: 20,
    calories: 590,
    veggieServings: 3,
    cookingTime: 30,
    ingredients: ['Ground beef 200g', 'Rice 80g', 'Mixed vegetables', 'Black beans', 'Salsa'],
    instructions: ['Cook beef', 'Prepare rice', 'Heat beans', 'Steam vegetables', 'Build bowl with toppings'],
  },
  {
    id: 'dn_3',
    name: 'Baked Fish & Veggies',
    type: 'dinner',
    protein: 45,
    carbs: 40,
    fats: 18,
    calories: 510,
    veggieServings: 3,
    cookingTime: 30,
    ingredients: ['White fish 200g', 'Asparagus', 'Zucchini', 'Baby potatoes', 'Lemon', 'Herbs'],
    instructions: ['Prep vegetables', 'Season fish', 'Bake everything together', 'Squeeze lemon', 'Serve hot'],
  },
  {
    id: 'dn_4',
    name: 'Turkey Meatballs Pasta',
    type: 'dinner',
    protein: 42,
    carbs: 60,
    fats: 15,
    calories: 565,
    veggieServings: 2,
    cookingTime: 35,
    ingredients: ['Ground turkey 200g', 'Whole wheat pasta 80g', 'Marinara sauce', 'Spinach', 'Parmesan'],
    instructions: ['Form meatballs', 'Bake meatballs', 'Cook pasta', 'Heat sauce with spinach', 'Combine and top with cheese'],
  },
  
  // Snacks
  {
    id: 'sn_1',
    name: 'Protein Smoothie',
    type: 'snack',
    protein: 30,
    carbs: 35,
    fats: 8,
    calories: 330,
    veggieServings: 0,
    cookingTime: 5,
    ingredients: ['Protein powder 30g', 'Banana', 'Spinach handful', 'Almond milk', 'Ice'],
    instructions: ['Add all ingredients to blender', 'Blend until smooth', 'Pour and enjoy'],
  },
  {
    id: 'sn_2',
    name: 'Apple & Nut Butter',
    type: 'snack',
    protein: 8,
    carbs: 30,
    fats: 16,
    calories: 290,
    veggieServings: 0,
    cookingTime: 2,
    ingredients: ['Apple', 'Almond butter 2 tbsp'],
    instructions: ['Slice apple', 'Serve with nut butter'],
  },
  {
    id: 'sn_3',
    name: 'Cottage Cheese Bowl',
    type: 'snack',
    protein: 25,
    carbs: 15,
    fats: 5,
    calories: 210,
    veggieServings: 0,
    cookingTime: 3,
    ingredients: ['Cottage cheese 200g', 'Berries', 'Cinnamon'],
    instructions: ['Scoop cottage cheese', 'Top with berries', 'Sprinkle cinnamon'],
  },
  
  // Low cooking time options
  {
    id: 'bf_quick_1',
    name: 'Quick Protein Toast',
    type: 'breakfast',
    protein: 25,
    carbs: 35,
    fats: 12,
    calories: 350,
    veggieServings: 1,
    cookingTime: 5,
    ingredients: ['Whole wheat toast 2 slices', 'Peanut butter', 'Banana', 'Chia seeds'],
    instructions: ['Toast bread', 'Spread peanut butter', 'Top with banana', 'Sprinkle chia seeds'],
  },
  {
    id: 'ln_quick_1',
    name: 'Tuna Power Salad',
    type: 'lunch',
    protein: 35,
    carbs: 20,
    fats: 12,
    calories: 340,
    veggieServings: 3,
    cookingTime: 8,
    ingredients: ['Canned tuna 200g', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil'],
    instructions: ['Drain tuna', 'Chop vegetables', 'Mix in bowl', 'Drizzle oil', 'Toss together'],
  },
  
  // High cooking time options
  {
    id: 'dn_slow_1',
    name: 'Slow-Cooked Chicken Curry',
    type: 'dinner',
    protein: 48,
    carbs: 55,
    fats: 18,
    calories: 590,
    veggieServings: 3,
    cookingTime: 60,
    ingredients: ['Chicken thighs 250g', 'Curry sauce', 'Mixed vegetables', 'Basmati rice 80g', 'Naan bread'],
    instructions: ['Marinate chicken', 'Slow cook with curry sauce', 'Add vegetables halfway', 'Cook rice', 'Serve with naan'],
  },
];

export function filterRecipesByPreferences(
  recipes: Meal[],
  likes: string[],
  dislikes: string[],
  allergies: string,
  cookingTime: 'low' | 'medium' | 'high'
): Meal[] {
  const maxCookingTime = cookingTime === 'low' ? 15 : cookingTime === 'medium' ? 30 : 90;
  
  return recipes.filter(recipe => {
    // Filter by cooking time
    if (recipe.cookingTime > maxCookingTime) return false;
    
    // Filter by dislikes
    const hasDisliked = recipe.ingredients.some(ing => 
      dislikes.some(dislike => ing.toLowerCase().includes(dislike.toLowerCase()))
    );
    if (hasDisliked) return false;
    
    // Filter by allergies (basic check)
    if (allergies) {
      const allergyList = allergies.toLowerCase().split(',').map(a => a.trim());
      const hasAllergen = recipe.ingredients.some(ing =>
        allergyList.some(allergen => ing.toLowerCase().includes(allergen))
      );
      if (hasAllergen) return false;
    }
    
    return true;
  });
}
