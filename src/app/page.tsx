'use client';

import { useApp } from '@/lib/app-context';
import OnboardingFlow from '@/components/onboarding-flow';
import DashboardSummary from '@/components/dashboard-summary';
import MealTracker from '@/components/meal-tracker';
import BottomNav from '@/components/bottom-nav';
import { Activity } from 'lucide-react';

export default function Home() {
  const { isOnboarded, user } = useApp();

  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">FitTrack</h1>
                <p className="text-sm text-muted-foreground">Olá, {user?.name}!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Hoje</p>
              <p className="text-sm font-semibold">
                {new Date().toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Dashboard Summary */}
        <DashboardSummary />

        {/* Meal Tracker */}
        <div>
          <h2 className="text-xl font-bold mb-4">Refeições de Hoje</h2>
          <MealTracker />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
