// Types para o aplicativo de rastreamento de dieta

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Gender = 'male' | 'female' | 'other';
export type Goal = 'lose' | 'maintain' | 'gain';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number; // cm
  currentWeight: number; // kg
  goalWeight: number; // kg
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  isPremium: boolean;
  createdAt: Date;
}

export interface NutritionalInfo {
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber?: number; // g
  sugar?: number; // g
  sodium?: number; // mg
  netCarbs?: number; // g (carbs - fiber)
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  category: 'homemade' | 'packaged' | 'restaurant' | 'custom';
  servingSize: number;
  servingUnit: string; // g, ml, unidade, etc
  nutritionalInfo: NutritionalInfo;
  barcode?: string;
  isFavorite?: boolean;
  isCustom?: boolean;
  userId?: string; // para alimentos customizados
  usageCount?: number;
}

export interface MealEntry {
  id: string;
  userId: string;
  foodId: string;
  food: Food;
  mealType: MealType;
  servings: number;
  date: string; // YYYY-MM-DD
  createdAt: Date;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water?: number; // ml
  isCustom: boolean;
  lowCarbMode?: boolean;
}

export interface DailySummary {
  date: string;
  consumed: NutritionalInfo;
  burned: number; // calorias queimadas
  goals: DailyGoals;
  water: number; // ml consumidos
  weight?: number;
}

export interface Exercise {
  id: string;
  userId: string;
  name: string;
  duration: number; // minutos
  caloriesBurned: number;
  date: string;
  createdAt: Date;
}

export interface WaterLog {
  id: string;
  userId: string;
  amount: number; // ml
  date: string;
  createdAt: Date;
}

export interface WeightLog {
  id: string;
  userId: string;
  weight: number; // kg
  date: string;
  createdAt: Date;
}

export interface Recipe {
  id: string;
  userId: string;
  name: string;
  ingredients: {
    foodId: string;
    servings: number;
  }[];
  servings: number;
  nutritionalInfo: NutritionalInfo;
  instructions?: string;
  isFavorite?: boolean;
}
