'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, DailyGoals, MealEntry, DailySummary, Food } from '@/lib/types';
import { generateDailyGoals } from '@/lib/calculations';
import { supabase, getCurrentUser, getUserProfile, getDailyGoals, getMealEntries, isSupabaseConfigured } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  dailyGoals: DailyGoals | null;
  setDailyGoals: (goals: DailyGoals) => void;
  mealEntries: MealEntry[];
  addMealEntry: (entry: Omit<MealEntry, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  removeMealEntry: (id: string) => Promise<void>;
  getDailySummary: (date: string) => DailySummary;
  isOnboarded: boolean;
  completeOnboarding: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'isPremium'>) => Promise<void>;
  loading: boolean;
  refreshData: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dailyGoals, setDailyGoals] = useState<DailyGoals | null>(null);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Marcar como montado
  useEffect(() => {
    setMounted(true);
  }, []);

  // Carregar dados do usuário autenticado
  useEffect(() => {
    if (!mounted) return;

    // Se Supabase não configurado, apenas marca loading como false
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    loadUserData();

    // Listener para mudanças na autenticação
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadUserData();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setDailyGoals(null);
          setMealEntries([]);
          setIsOnboarded(false);
          router.push('/auth');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [mounted]);

  const loadUserData = async () => {
    if (!mounted || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const authUser = await getCurrentUser();

      if (!authUser) {
        setLoading(false);
        return;
      }

      // Carregar perfil do usuário
      try {
        const profile = await getUserProfile(authUser.id);
        
        const userProfile: UserProfile = {
          id: profile.id,
          name: profile.name,
          email: authUser.email || '',
          age: profile.age,
          height: profile.height,
          currentWeight: profile.current_weight,
          goalWeight: profile.goal_weight,
          gender: profile.gender,
          activityLevel: profile.activity_level,
          goal: profile.goal,
          isPremium: profile.is_premium,
          createdAt: new Date(profile.created_at),
        };

        setUser(userProfile);
        setIsOnboarded(true);

        // Carregar metas diárias
        const goals = await getDailyGoals(authUser.id);
        setDailyGoals({
          calories: goals.calories,
          protein: goals.protein,
          carbs: goals.carbs,
          fat: goals.fat,
          water: goals.water,
          isCustom: goals.is_custom,
          lowCarbMode: goals.low_carb_mode,
        });

        // Carregar refeições de hoje
        const today = new Date().toISOString().split('T')[0];
        await loadMealEntries(authUser.id, today);
      } catch (error: any) {
        // Se não tem perfil, precisa fazer onboarding
        if (error.code === 'PGRST116') {
          setIsOnboarded(false);
        } else {
          console.error('Erro ao carregar dados:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMealEntries = async (userId: string, date: string) => {
    if (!mounted || !isSupabaseConfigured()) return;
    
    try {
      const entries = await getMealEntries(userId, date);
      
      const formattedEntries: MealEntry[] = entries.map((entry: any) => ({
        id: entry.id,
        userId: entry.user_id,
        foodId: entry.food_id,
        food: {
          id: entry.food.id,
          name: entry.food.name,
          brand: entry.food.brand,
          category: entry.food.category,
          servingSize: entry.food.serving_size,
          servingUnit: entry.food.serving_unit,
          nutritionalInfo: {
            calories: entry.food.calories,
            protein: entry.food.protein,
            carbs: entry.food.carbs,
            fat: entry.food.fat,
            fiber: entry.food.fiber,
            sugar: entry.food.sugar,
            sodium: entry.food.sodium,
          },
          barcode: entry.food.barcode,
          isCustom: entry.food.is_custom,
          userId: entry.food.user_id,
          usageCount: entry.food.usage_count,
        },
        mealType: entry.meal_type,
        servings: entry.servings,
        date: entry.date,
        createdAt: new Date(entry.created_at),
      }));

      setMealEntries(formattedEntries);
    } catch (error) {
      console.error('Erro ao carregar refeições:', error);
    }
  };

  const refreshData = async () => {
    if (!user || !mounted || !isSupabaseConfigured()) return;
    const today = new Date().toISOString().split('T')[0];
    await loadMealEntries(user.id, today);
  };

  const completeOnboarding = async (profile: Omit<UserProfile, 'id' | 'createdAt' | 'isPremium'>) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase não configurado');
    }

    try {
      // Tentar obter usuário com retry (aguardar sessão estar pronta)
      let authUser = null;
      let attempts = 0;
      const maxAttempts = 5;

      while (!authUser && attempts < maxAttempts) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            authUser = session.user;
            break;
          }
        } catch (err) {
          console.log('Aguardando sessão...', attempts + 1);
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Aguardar 500ms
        }
      }

      if (!authUser) {
        throw new Error('Sessão não estabelecida. Por favor, faça login novamente.');
      }

      // Calcular metas
      const goals = generateDailyGoals(
        profile.currentWeight,
        profile.height,
        profile.age,
        profile.gender,
        profile.activityLevel,
        profile.goal
      );

      // Inserir perfil no banco
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authUser.id,
          name: profile.name,
          age: profile.age,
          height: profile.height,
          current_weight: profile.currentWeight,
          goal_weight: profile.goalWeight,
          gender: profile.gender,
          activity_level: profile.activityLevel,
          goal: profile.goal,
          is_premium: false,
        });

      if (profileError) throw profileError;

      // Inserir metas no banco
      const { error: goalsError } = await supabase
        .from('daily_goals')
        .insert({
          user_id: authUser.id,
          calories: goals.calories,
          protein: goals.protein,
          carbs: goals.carbs,
          fat: goals.fat,
          water: goals.water || 2000,
          is_custom: goals.isCustom,
          low_carb_mode: goals.lowCarbMode || false,
        });

      if (goalsError) throw goalsError;

      // Atualizar estado local
      const newUser: UserProfile = {
        ...profile,
        id: authUser.id,
        isPremium: false,
        createdAt: new Date(),
      };

      setUser(newUser);
      setDailyGoals(goals);
      setIsOnboarded(true);
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      throw error;
    }
  };

  const addMealEntry = async (entry: Omit<MealEntry, 'id' | 'userId' | 'createdAt'>) => {
    if (!user || !mounted || !isSupabaseConfigured() || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('meal_entries')
        .insert({
          user_id: user.id,
          food_id: entry.foodId,
          meal_type: entry.mealType,
          servings: entry.servings,
          date: entry.date,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar contador de uso do alimento
      await supabase.rpc('increment_food_usage', { food_id: entry.foodId });

      // Recarregar refeições
      await refreshData();
    } catch (error) {
      console.error('Erro ao adicionar refeição:', error);
      throw error;
    }
  };

  const removeMealEntry = async (id: string) => {
    if (!mounted || !isSupabaseConfigured() || !supabase) return;

    try {
      const { error } = await supabase
        .from('meal_entries')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado local
      setMealEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error('Erro ao remover refeição:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
  };

  const getDailySummary = (date: string): DailySummary => {
    const todayEntries = mealEntries.filter((entry) => entry.date === date);

    const consumed = todayEntries.reduce(
      (acc, entry) => {
        const nutrition = entry.food.nutritionalInfo;
        const multiplier = entry.servings;

        return {
          calories: acc.calories + nutrition.calories * multiplier,
          protein: acc.protein + nutrition.protein * multiplier,
          carbs: acc.carbs + nutrition.carbs * multiplier,
          fat: acc.fat + nutrition.fat * multiplier,
          fiber: (acc.fiber || 0) + (nutrition.fiber || 0) * multiplier,
          sugar: (acc.sugar || 0) + (nutrition.sugar || 0) * multiplier,
          sodium: (acc.sodium || 0) + (nutrition.sodium || 0) * multiplier,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
    );

    return {
      date,
      consumed,
      burned: 0,
      goals: dailyGoals || {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 67,
        isCustom: false,
      },
      water: 0,
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        dailyGoals,
        setDailyGoals,
        mealEntries,
        addMealEntry,
        removeMealEntry,
        getDailySummary,
        isOnboarded,
        completeOnboarding,
        loading,
        refreshData,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
