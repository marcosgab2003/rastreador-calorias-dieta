'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/bottom-nav';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DiaryPage() {
  const { user, getDailySummary, mealEntries } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const summary = getDailySummary(dateString);
  const dayMeals = mealEntries.filter((entry) => entry.date === dateString);

  const handlePreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

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
              <h1 className="text-xl font-bold">Diário Alimentar</h1>
              <p className="text-sm text-muted-foreground">Histórico completo</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Date Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={handlePreviousDay}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isToday ? 'Hoje' : format(selectedDate, 'EEEE', { locale: ptBR })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextDay}
                disabled={isToday}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-1">Calorias</p>
                <p className="text-xl font-bold">{Math.round(summary.consumed.calories)}</p>
                <p className="text-xs text-muted-foreground">/ {summary.goals.calories}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-1">Proteínas</p>
                <p className="text-xl font-bold">{Math.round(summary.consumed.protein)}g</p>
                <p className="text-xs text-muted-foreground">/ {summary.goals.protein}g</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-1">Carboidratos</p>
                <p className="text-xl font-bold">{Math.round(summary.consumed.carbs)}g</p>
                <p className="text-xs text-muted-foreground">/ {summary.goals.carbs}g</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-1">Gorduras</p>
                <p className="text-xl font-bold">{Math.round(summary.consumed.fat)}g</p>
                <p className="text-xs text-muted-foreground">/ {summary.goals.fat}g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meals List */}
        <Card>
          <CardHeader>
            <CardTitle>Refeições Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            {dayMeals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma refeição registrada neste dia
              </p>
            ) : (
              <div className="space-y-3">
                {dayMeals.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{entry.food.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.servings} x {entry.food.servingSize}
                        {entry.food.servingUnit}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(entry.food.nutritionalInfo.calories * entry.servings)} cal
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
