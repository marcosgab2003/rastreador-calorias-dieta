'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityLevel, Gender, Goal } from '@/lib/types';
import { User, Target, Activity, TrendingUp } from 'lucide-react';

export default function OnboardingFlow() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    currentWeight: '',
    goalWeight: '',
    gender: '' as Gender,
    activityLevel: '' as ActivityLevel,
    goal: '' as Goal,
  });

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleComplete = () => {
    completeOnboarding({
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      currentWeight: parseFloat(formData.currentWeight),
      goalWeight: parseFloat(formData.goalWeight),
      gender: formData.gender,
      activityLevel: formData.activityLevel,
      goal: formData.goal,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">FitTrack</CardTitle>
          </div>
          <CardDescription>
            Passo {step} de 4 - Configure seu perfil para começar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Informações Básicas */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold">Informações Básicas</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Sexo</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value as Gender })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Medidas */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold">Suas Medidas</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentWeight">Peso Atual (kg)</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={formData.currentWeight}
                  onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goalWeight">Peso Objetivo (kg)</Label>
                <Input
                  id="goalWeight"
                  type="number"
                  step="0.1"
                  placeholder="65.0"
                  value={formData.goalWeight}
                  onChange={(e) => setFormData({ ...formData, goalWeight: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Atividade Física */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold">Nível de Atividade</h3>
              </div>
              <div className="space-y-2">
                <Label>Quão ativo você é?</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, activityLevel: value as ActivityLevel })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                    <SelectItem value="light">Levemente ativo (1-3 dias/semana)</SelectItem>
                    <SelectItem value="moderate">Moderadamente ativo (3-5 dias/semana)</SelectItem>
                    <SelectItem value="active">Muito ativo (6-7 dias/semana)</SelectItem>
                    <SelectItem value="very_active">Extremamente ativo (atleta)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Objetivo */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold">Seu Objetivo</h3>
              </div>
              <div className="space-y-2">
                <Label>O que você deseja alcançar?</Label>
                <Select
                  value={formData.goal}
                  onValueChange={(value) => setFormData({ ...formData, goal: value as Goal })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Perder peso</SelectItem>
                    <SelectItem value="maintain">Manter peso</SelectItem>
                    <SelectItem value="gain">Ganhar peso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mt-4">
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  ✨ Vamos calcular automaticamente suas metas diárias de calorias e macronutrientes
                  baseado nas suas informações!
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Voltar
              </Button>
            )}
            {step < 4 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                disabled={
                  (step === 1 && (!formData.name || !formData.email || !formData.age || !formData.gender)) ||
                  (step === 2 && (!formData.height || !formData.currentWeight || !formData.goalWeight)) ||
                  (step === 3 && !formData.activityLevel)
                }
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                disabled={!formData.goal}
              >
                Começar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
