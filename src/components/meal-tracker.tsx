'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Coffee, Sun, Moon, Cookie, Trash2 } from 'lucide-react';
import { MealType } from '@/lib/types';
import AddFoodDialog from './add-food-dialog';

const mealIcons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snacks: Cookie,
};

const mealLabels = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
  snacks: 'Lanches',
};

export default function MealTracker() {
  const { mealEntries, removeMealEntry } = useApp();
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const today = new Date().toISOString().split('T')[0];

  const todayMeals = mealEntries.filter((entry) => entry.date === today);

  const getMealEntries = (mealType: MealType) => {
    return todayMeals.filter((entry) => entry.mealType === mealType);
  };

  const getMealCalories = (mealType: MealType) => {
    return getMealEntries(mealType).reduce(
      (sum, entry) => sum + entry.food.nutritionalInfo.calories * entry.servings,
      0
    );
  };

  const renderMealCard = (mealType: MealType) => {
    const Icon = mealIcons[mealType];
    const entries = getMealEntries(mealType);
    const totalCalories = getMealCalories(mealType);

    return (
      <Card key={mealType}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-lg">{mealLabels[mealType]}</CardTitle>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setSelectedMeal(mealType)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum alimento adicionado</p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{entry.food.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.servings} x {entry.food.servingSize}
                      {entry.food.servingUnit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {Math.round(entry.food.nutritionalInfo.calories * entry.servings)} cal
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeMealEntry(entry.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-bold">{Math.round(totalCalories)} calorias</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map(renderMealCard)}
      </div>

      {selectedMeal && (
        <AddFoodDialog
          mealType={selectedMeal}
          open={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </>
  );
}
