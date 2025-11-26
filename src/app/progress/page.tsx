'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/bottom-nav';
import { Activity, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProgressPage() {
  const { user, mealEntries, dailyGoals } = useApp();

  // Calcular dados dos últimos 7 dias
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const weekData = last7Days.map((date) => {
    const dayMeals = mealEntries.filter((entry) => entry.date === date);
    const consumed = dayMeals.reduce(
      (acc, entry) => {
        const nutrition = entry.food.nutritionalInfo;
        const multiplier = entry.servings;
        return {
          calories: acc.calories + nutrition.calories * multiplier,
          protein: acc.protein + nutrition.protein * multiplier,
          carbs: acc.carbs + nutrition.carbs * multiplier,
          fat: acc.fat + nutrition.fat * multiplier,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      calories: Math.round(consumed.calories),
      protein: Math.round(consumed.protein),
      carbs: Math.round(consumed.carbs),
      fat: Math.round(consumed.fat),
      goal: dailyGoals?.calories || 2000,
    };
  });

  // Estatísticas gerais
  const totalDays = last7Days.length;
  const avgCalories = Math.round(
    weekData.reduce((sum, day) => sum + day.calories, 0) / totalDays
  );
  const avgProtein = Math.round(
    weekData.reduce((sum, day) => sum + day.protein, 0) / totalDays
  );

  const daysOnTarget = weekData.filter(
    (day) => Math.abs(day.calories - day.goal) <= day.goal * 0.1
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Progresso</h1>
              <p className="text-sm text-muted-foreground">Acompanhe sua evolução</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Média de Calorias</span>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold">{avgCalories}</p>
              <p className="text-xs text-muted-foreground">últimos 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Média de Proteínas</span>
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{avgProtein}g</p>
              <p className="text-xs text-muted-foreground">últimos 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Dias na Meta</span>
                <TrendingDown className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">
                {daysOnTarget}/{totalDays}
              </p>
              <p className="text-xs text-muted-foreground">últimos 7 dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Goal Info */}
        {user && dailyGoals && (
          <Card>
            <CardHeader>
              <CardTitle>Suas Metas Diárias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <p className="text-xs text-muted-foreground mb-1">Calorias</p>
                  <p className="text-xl font-bold text-emerald-600">{dailyGoals.calories}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-muted-foreground mb-1">Proteínas</p>
                  <p className="text-xl font-bold text-blue-600">{dailyGoals.protein}g</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <p className="text-xs text-muted-foreground mb-1">Carboidratos</p>
                  <p className="text-xl font-bold text-orange-600">{dailyGoals.carbs}g</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <p className="text-xs text-muted-foreground mb-1">Gorduras</p>
                  <p className="text-xl font-bold text-purple-600">{dailyGoals.fat}g</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-muted">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Objetivo:</span>
                  <Badge variant="secondary">
                    {user.goal === 'lose' ? 'Perder Peso' : user.goal === 'gain' ? 'Ganhar Peso' : 'Manter Peso'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Peso Atual:</span>
                  <span className="font-medium">{user.currentWeight} kg</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Peso Objetivo:</span>
                  <span className="font-medium">{user.goalWeight} kg</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Gráficos de Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calories">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calories">Calorias</TabsTrigger>
                <TabsTrigger value="macros">Macronutrientes</TabsTrigger>
              </TabsList>

              <TabsContent value="calories" className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Consumidas"
                    />
                    <Line
                      type="monotone"
                      dataKey="goal"
                      stroke="#6b7280"
                      strokeDasharray="5 5"
                      name="Meta"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="macros" className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="protein" fill="#3b82f6" name="Proteínas (g)" />
                    <Bar dataKey="carbs" fill="#f97316" name="Carboidratos (g)" />
                    <Bar dataKey="fat" fill="#a855f7" name="Gorduras (g)" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
