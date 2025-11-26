// Cálculos de calorias e macronutrientes

import { ActivityLevel, Gender, Goal, DailyGoals } from './types';

// Fórmula de Harris-Benedict para calcular TMB (Taxa Metabólica Basal)
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

// Multiplicadores de atividade física
const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Calcular TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * activityMultipliers[activityLevel];
}

// Calcular meta de calorias baseado no objetivo
export function calculateCalorieGoal(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel,
  goal: Goal
): number {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500); // Déficit de 500 calorias
    case 'gain':
      return Math.round(tdee + 500); // Superávit de 500 calorias
    case 'maintain':
    default:
      return Math.round(tdee);
  }
}

// Calcular distribuição de macronutrientes
export function calculateMacros(
  calorieGoal: number,
  goal: Goal,
  lowCarbMode: boolean = false
): { protein: number; carbs: number; fat: number } {
  if (lowCarbMode) {
    // Low Carb: 30% proteína, 10% carbs, 60% gordura
    return {
      protein: Math.round((calorieGoal * 0.3) / 4),
      carbs: Math.round((calorieGoal * 0.1) / 4),
      fat: Math.round((calorieGoal * 0.6) / 9),
    };
  }

  // Distribuição padrão baseada no objetivo
  switch (goal) {
    case 'lose':
      // 40% proteína, 30% carbs, 30% gordura
      return {
        protein: Math.round((calorieGoal * 0.4) / 4),
        carbs: Math.round((calorieGoal * 0.3) / 4),
        fat: Math.round((calorieGoal * 0.3) / 9),
      };
    case 'gain':
      // 30% proteína, 40% carbs, 30% gordura
      return {
        protein: Math.round((calorieGoal * 0.3) / 4),
        carbs: Math.round((calorieGoal * 0.4) / 4),
        fat: Math.round((calorieGoal * 0.3) / 9),
      };
    case 'maintain':
    default:
      // 30% proteína, 40% carbs, 30% gordura
      return {
        protein: Math.round((calorieGoal * 0.3) / 4),
        carbs: Math.round((calorieGoal * 0.4) / 4),
        fat: Math.round((calorieGoal * 0.3) / 9),
      };
  }
}

// Gerar metas diárias completas
export function generateDailyGoals(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel,
  goal: Goal,
  lowCarbMode: boolean = false
): DailyGoals {
  const calories = calculateCalorieGoal(weight, height, age, gender, activityLevel, goal);
  const macros = calculateMacros(calories, goal, lowCarbMode);

  return {
    calories,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    water: weight * 35, // 35ml por kg de peso corporal
    isCustom: false,
    lowCarbMode,
  };
}

// Calcular net carbs (carboidratos líquidos)
export function calculateNetCarbs(carbs: number, fiber: number): number {
  return Math.max(0, carbs - fiber);
}

// Calcular percentual de progresso
export function calculateProgress(consumed: number, goal: number): number {
  return Math.round((consumed / goal) * 100);
}

// Calcular calorias restantes
export function calculateRemainingCalories(
  consumed: number,
  burned: number,
  goal: number
): number {
  return goal - consumed + burned;
}
