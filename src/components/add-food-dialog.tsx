'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Star, Clock, Plus } from 'lucide-react';
import { MealType, Food } from '@/lib/types';
import { searchFoods, getMostUsedFoods, getFavoriteFoods } from '@/lib/food-database';

interface AddFoodDialogProps {
  mealType: MealType;
  open: boolean;
  onClose: () => void;
}

export default function AddFoodDialog({ mealType, open, onClose }: AddFoodDialogProps) {
  const { addMealEntry } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servings, setServings] = useState('1');

  const mostUsed = getMostUsedFoods(10);
  const favorites = getFavoriteFoods();

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchFoods(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleAddFood = () => {
    if (!selectedFood) return;

    const today = new Date().toISOString().split('T')[0];
    addMealEntry({
      foodId: selectedFood.id,
      food: selectedFood,
      mealType,
      servings: parseFloat(servings),
      date: today,
    });

    setSelectedFood(null);
    setServings('1');
    setSearchQuery('');
    onClose();
  };

  const renderFoodItem = (food: Food) => (
    <div
      key={food.id}
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        selectedFood?.id === food.id
          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
          : 'border-border hover:border-emerald-300 hover:bg-muted/50'
      }`}
      onClick={() => setSelectedFood(food)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-medium text-sm">{food.name}</p>
          {food.brand && <p className="text-xs text-muted-foreground">{food.brand}</p>}
          <p className="text-xs text-muted-foreground mt-1">
            {food.servingSize}
            {food.servingUnit} • {food.nutritionalInfo.calories} cal
          </p>
        </div>
        <div className="text-right">
          <Badge variant="secondary" className="text-xs">
            {Math.round(food.nutritionalInfo.protein)}g P
          </Badge>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <Badge variant="outline" className="text-xs">
          C: {Math.round(food.nutritionalInfo.carbs)}g
        </Badge>
        <Badge variant="outline" className="text-xs">
          G: {Math.round(food.nutritionalInfo.fat)}g
        </Badge>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Adicionar Alimento</DialogTitle>
          <DialogDescription>Busque e adicione alimentos à sua refeição</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar alimentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Food Selection */}
          {!selectedFood ? (
            <Tabs defaultValue="search" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="search">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </TabsTrigger>
                <TabsTrigger value="recent">
                  <Clock className="h-4 w-4 mr-2" />
                  Recentes
                </TabsTrigger>
                <TabsTrigger value="favorites">
                  <Star className="h-4 w-4 mr-2" />
                  Favoritos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="flex-1 overflow-hidden">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 pr-4">
                    {searchQuery.trim() === '' ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Digite para buscar alimentos
                      </p>
                    ) : searchResults.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Nenhum alimento encontrado
                      </p>
                    ) : (
                      searchResults.map(renderFoodItem)
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="recent" className="flex-1 overflow-hidden">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 pr-4">
                    {mostUsed.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Nenhum alimento recente
                      </p>
                    ) : (
                      mostUsed.map(renderFoodItem)
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="favorites" className="flex-1 overflow-hidden">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 pr-4">
                    {favorites.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Nenhum favorito ainda
                      </p>
                    ) : (
                      favorites.map(renderFoodItem)
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          ) : (
            /* Selected Food Details */
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <h4 className="font-semibold mb-1">{selectedFood.name}</h4>
                {selectedFood.brand && (
                  <p className="text-sm text-muted-foreground">{selectedFood.brand}</p>
                )}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Calorias</p>
                    <p className="text-lg font-bold">{selectedFood.nutritionalInfo.calories}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Porção</p>
                    <p className="text-lg font-bold">
                      {selectedFood.servingSize}
                      {selectedFood.servingUnit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Proteínas</p>
                    <p className="text-lg font-bold">{selectedFood.nutritionalInfo.protein}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Carboidratos</p>
                    <p className="text-lg font-bold">{selectedFood.nutritionalInfo.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gorduras</p>
                    <p className="text-lg font-bold">{selectedFood.nutritionalInfo.fat}g</p>
                  </div>
                  {selectedFood.nutritionalInfo.fiber && (
                    <div>
                      <p className="text-xs text-muted-foreground">Fibras</p>
                      <p className="text-lg font-bold">{selectedFood.nutritionalInfo.fiber}g</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Quantidade de Porções</Label>
                <Input
                  id="servings"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Total: {Math.round(selectedFood.nutritionalInfo.calories * parseFloat(servings))}{' '}
                  calorias
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedFood(null)} className="flex-1">
                  Voltar
                </Button>
                <Button
                  onClick={handleAddFood}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
