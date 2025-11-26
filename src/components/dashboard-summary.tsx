'use client';

import { useApp } from '@/lib/app-context';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { calculateRemainingCalories, calculateProgress } from '@/lib/calculations';

export default function DashboardSummary() {
  const { getDailySummary } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const summary = getDailySummary(today);

  const remaining = calculateRemainingCalories(
    summary.consumed.calories,
    summary.burned,
    summary.goals.calories
  );

  const calorieProgress = calculateProgress(summary.consumed.calories, summary.goals.calories);
  const proteinProgress = calculateProgress(summary.consumed.protein, summary.goals.protein);
  const carbsProgress = calculateProgress(summary.consumed.carbs, summary.goals.carbs);
  const fatProgress = calculateProgress(summary.consumed.fat, summary.goals.fat);

  return (
    <div className="space-y-4">
      {/* Calorias Principal */}
      <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Calorias Restantes</p>
              <h2 className="text-4xl font-bold">{remaining}</h2>
            </div>
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
              <Flame className="h-8 w-8" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs opacity-90">Meta</p>
              <p className="text-lg font-semibold">{summary.goals.calories}</p>
            </div>
            <div>
              <p className="text-xs opacity-90">Consumidas</p>
              <p className="text-lg font-semibold">{Math.round(summary.consumed.calories)}</p>
            </div>
            <div>
              <p className="text-xs opacity-90">Queimadas</p>
              <p className="text-lg font-semibold">{summary.burned}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macronutrientes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Proteínas */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Proteínas</span>
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{Math.round(summary.consumed.protein)}</span>
                <span className="text-sm text-muted-foreground">/ {summary.goals.protein}g</span>
              </div>
              <Progress value={Math.min(proteinProgress, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">{proteinProgress}% da meta</p>
            </div>
          </CardContent>
        </Card>

        {/* Carboidratos */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Carboidratos</span>
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{Math.round(summary.consumed.carbs)}</span>
                <span className="text-sm text-muted-foreground">/ {summary.goals.carbs}g</span>
              </div>
              <Progress value={Math.min(carbsProgress, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">{carbsProgress}% da meta</p>
            </div>
          </CardContent>
        </Card>

        {/* Gorduras */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Gorduras</span>
              <TrendingDown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{Math.round(summary.consumed.fat)}</span>
                <span className="text-sm text-muted-foreground">/ {summary.goals.fat}g</span>
              </div>
              <Progress value={Math.min(fatProgress, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">{fatProgress}% da meta</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
