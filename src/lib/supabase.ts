import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validação das variáveis de ambiente
const isConfigured = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key');

if (!isConfigured) {
  console.warn('⚠️ Supabase não configurado. Configure as variáveis de ambiente para usar funcionalidades do banco de dados.');
}

// Criar cliente apenas se configurado
export const supabase = isConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null as any;

// Helper para verificar se Supabase está configurado
export function isSupabaseConfigured() {
  return isConfigured;
}

// Helper para obter usuário atual
export async function getCurrentUser() {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
}

// Helper para obter perfil do usuário
export async function getUserProfile(userId: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Helper para obter metas diárias
export async function getDailyGoals(userId: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Helper para obter refeições do dia
export async function getMealEntries(userId: string, date: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('meal_entries')
    .select(`
      *,
      food:foods(*)
    `)
    .eq('user_id', userId)
    .eq('date', date)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// Helper para adicionar refeição
export async function addMealEntry(entry: {
  user_id: string;
  food_id: string;
  meal_type: string;
  servings: number;
  date: string;
}) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('meal_entries')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Helper para buscar alimentos
export async function searchFoods(query: string, userId?: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  let queryBuilder = supabase
    .from('foods')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(20);

  if (userId) {
    queryBuilder = queryBuilder.or(`is_custom.eq.false,user_id.eq.${userId}`);
  } else {
    queryBuilder = queryBuilder.eq('is_custom', false);
  }

  const { data, error } = await queryBuilder;

  if (error) throw error;
  return data;
}

// Helper para adicionar log de água
export async function addWaterLog(userId: string, amount: number, date: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('water_logs')
    .insert({ user_id: userId, amount, date })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Helper para obter logs de água do dia
export async function getWaterLogs(userId: string, date: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date);

  if (error) throw error;
  return data;
}

// Helper para adicionar exercício
export async function addExercise(exercise: {
  user_id: string;
  name: string;
  duration: number;
  calories_burned: number;
  date: string;
}) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('exercises')
    .insert(exercise)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Helper para obter exercícios do dia
export async function getExercises(userId: string, date: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date);

  if (error) throw error;
  return data;
}

// Helper para adicionar log de peso
export async function addWeightLog(userId: string, weight: number, date: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('weight_logs')
    .insert({ user_id: userId, weight, date })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Helper para obter histórico de peso
export async function getWeightLogs(userId: string, limit = 30) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
