'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import BottomNav from '@/components/bottom-nav';
import { Activity, User, Target, Settings, Crown, LogOut } from 'lucide-react';
import { ActivityLevel, Gender, Goal } from '@/lib/types';
import { generateDailyGoals } from '@/lib/calculations';

export default function ProfilePage() {
  const { user, setUser, dailyGoals, setDailyGoals } = useApp();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    age: user?.age.toString() || '',
    height: user?.height.toString() || '',
    currentWeight: user?.currentWeight.toString() || '',
    goalWeight: user?.goalWeight.toString() || '',
    gender: user?.gender || 'male' as Gender,
    activityLevel: user?.activityLevel || 'moderate' as ActivityLevel,
    goal: user?.goal || 'maintain' as Goal,
  });

  const [goalsForm, setGoalsForm] = useState({
    calories: dailyGoals?.calories.toString() || '',
    protein: dailyGoals?.protein.toString() || '',
    carbs: dailyGoals?.carbs.toString() || '',
    fat: dailyGoals?.fat.toString() || '',
    lowCarbMode: dailyGoals?.lowCarbMode || false,
  });

  const handleSaveProfile = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      name: profileForm.name,
      age: parseInt(profileForm.age),
      height: parseInt(profileForm.height),
      currentWeight: parseFloat(profileForm.currentWeight),
      goalWeight: parseFloat(profileForm.goalWeight),
      gender: profileForm.gender,
      activityLevel: profileForm.activityLevel,
      goal: profileForm.goal,
    };

    setUser(updatedUser);

    // Recalcular metas automaticamente
    const newGoals = generateDailyGoals(
      updatedUser.currentWeight,
      updatedUser.height,
      updatedUser.age,
      updatedUser.gender,
      updatedUser.activityLevel,
      updatedUser.goal,
      dailyGoals?.lowCarbMode
    );

    setDailyGoals(newGoals);
    setIsEditingProfile(false);
  };

  const handleSaveGoals = () => {
    if (!dailyGoals) return;

    const updatedGoals = {
      ...dailyGoals,
      calories: parseInt(goalsForm.calories),
      protein: parseInt(goalsForm.protein),
      carbs: parseInt(goalsForm.carbs),
      fat: parseInt(goalsForm.fat),
      lowCarbMode: goalsForm.lowCarbMode,
      isCustom: true,
    };

    setDailyGoals(updatedGoals);
    setIsEditingGoals(false);
  };

  const handleResetGoals = () => {
    if (!user) return;

    const newGoals = generateDailyGoals(
      user.currentWeight,
      user.height,
      user.age,
      user.gender,
      user.activityLevel,
      user.goal,
      goalsForm.lowCarbMode
    );

    setDailyGoals(newGoals);
    setGoalsForm({
      calories: newGoals.calories.toString(),
      protein: newGoals.protein.toString(),
      carbs: newGoals.carbs.toString(),
      fat: newGoals.fat.toString(),
      lowCarbMode: newGoals.lowCarbMode || false,
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!user || !dailyGoals) return null;

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
              <h1 className="text-xl font-bold">Perfil</h1>
              <p className="text-sm text-muted-foreground">Gerencie sua conta</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              {user.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Informações Pessoais</CardTitle>
              <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>Atualize suas informações pessoais</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Nome</Label>
                      <Input
                        id="edit-name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-age">Idade</Label>
                        <Input
                          id="edit-age"
                          type="number"
                          value={profileForm.age}
                          onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-height">Altura (cm)</Label>
                        <Input
                          id="edit-height"
                          type="number"
                          value={profileForm.height}
                          onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-weight">Peso Atual (kg)</Label>
                        <Input
                          id="edit-weight"
                          type="number"
                          step="0.1"
                          value={profileForm.currentWeight}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, currentWeight: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-goal-weight">Peso Objetivo (kg)</Label>
                        <Input
                          id="edit-goal-weight"
                          type="number"
                          step="0.1"
                          value={profileForm.goalWeight}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, goalWeight: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-gender">Sexo</Label>
                      <Select
                        value={profileForm.gender}
                        onValueChange={(value) =>
                          setProfileForm({ ...profileForm, gender: value as Gender })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Feminino</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-activity">Nível de Atividade</Label>
                      <Select
                        value={profileForm.activityLevel}
                        onValueChange={(value) =>
                          setProfileForm({ ...profileForm, activityLevel: value as ActivityLevel })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentário</SelectItem>
                          <SelectItem value="light">Levemente ativo</SelectItem>
                          <SelectItem value="moderate">Moderadamente ativo</SelectItem>
                          <SelectItem value="active">Muito ativo</SelectItem>
                          <SelectItem value="very_active">Extremamente ativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-goal">Objetivo</Label>
                      <Select
                        value={profileForm.goal}
                        onValueChange={(value) =>
                          setProfileForm({ ...profileForm, goal: value as Goal })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lose">Perder peso</SelectItem>
                          <SelectItem value="maintain">Manter peso</SelectItem>
                          <SelectItem value="gain">Ganhar peso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">
                      Salvar Alterações
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Idade</p>
                <p className="font-medium">{user.age} anos</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Altura</p>
                <p className="font-medium">{user.height} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso Atual</p>
                <p className="font-medium">{user.currentWeight} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso Objetivo</p>
                <p className="font-medium">{user.goalWeight} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sexo</p>
                <p className="font-medium">
                  {user.gender === 'male' ? 'Masculino' : user.gender === 'female' ? 'Feminino' : 'Outro'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objetivo</p>
                <p className="font-medium">
                  {user.goal === 'lose' ? 'Perder Peso' : user.goal === 'gain' ? 'Ganhar Peso' : 'Manter Peso'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Metas Diárias</CardTitle>
              <Dialog open={isEditingGoals} onOpenChange={setIsEditingGoals}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Personalizar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Personalizar Metas</DialogTitle>
                    <DialogDescription>
                      {user.isPremium
                        ? 'Ajuste suas metas personalizadas'
                        : 'Recurso disponível apenas para usuários Premium'}
                    </DialogDescription>
                  </DialogHeader>
                  {user.isPremium ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="low-carb">Modo Low Carb</Label>
                        <Switch
                          id="low-carb"
                          checked={goalsForm.lowCarbMode}
                          onCheckedChange={(checked) =>
                            setGoalsForm({ ...goalsForm, lowCarbMode: checked })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-calories">Calorias</Label>
                        <Input
                          id="edit-calories"
                          type="number"
                          value={goalsForm.calories}
                          onChange={(e) =>
                            setGoalsForm({ ...goalsForm, calories: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-protein">Proteínas (g)</Label>
                        <Input
                          id="edit-protein"
                          type="number"
                          value={goalsForm.protein}
                          onChange={(e) => setGoalsForm({ ...goalsForm, protein: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-carbs">Carboidratos (g)</Label>
                        <Input
                          id="edit-carbs"
                          type="number"
                          value={goalsForm.carbs}
                          onChange={(e) => setGoalsForm({ ...goalsForm, carbs: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-fat">Gorduras (g)</Label>
                        <Input
                          id="edit-fat"
                          type="number"
                          value={goalsForm.fat}
                          onChange={(e) => setGoalsForm({ ...goalsForm, fat: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleResetGoals} className="flex-1">
                          Resetar
                        </Button>
                        <Button onClick={handleSaveGoals} className="flex-1">
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Faça upgrade para Premium e personalize suas metas
                      </p>
                      <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        Assinar Premium
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
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
            {dailyGoals.isCustom && (
              <Badge variant="secondary" className="mt-4">
                Metas Personalizadas
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Premium Card */}
        {!user.isPremium && (
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                <CardTitle>Upgrade para Premium</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-600">✓</span>
                  Escaneamento de código de barras
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-600">✓</span>
                  Scan de refeição por foto
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-600">✓</span>
                  Metas personalizadas de macronutrientes
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-600">✓</span>
                  Modo Low Carb / Net Carbs
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-600">✓</span>
                  Relatórios detalhados
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                Assinar Agora
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair da Conta
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
