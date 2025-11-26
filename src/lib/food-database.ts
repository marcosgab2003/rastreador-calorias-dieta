// Banco de dados de alimentos (simulado com dados locais)

import { Food } from './types';

export const foodDatabase: Food[] = [
  // Comida Caseira - Brasileira
  {
    id: 'food-001',
    name: 'Arroz Branco Cozido',
    category: 'homemade',
    servingSize: 100,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      fiber: 0.4,
    },
    usageCount: 0,
  },
  {
    id: 'food-002',
    name: 'Feijão Preto Cozido',
    category: 'homemade',
    servingSize: 100,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 77,
      protein: 4.5,
      carbs: 14,
      fat: 0.5,
      fiber: 4.5,
    },
    usageCount: 0,
  },
  {
    id: 'food-003',
    name: 'Peito de Frango Grelhado',
    category: 'homemade',
    servingSize: 100,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
    },
    usageCount: 0,
  },
  {
    id: 'food-004',
    name: 'Ovo Cozido',
    category: 'homemade',
    servingSize: 50,
    servingUnit: 'unidade',
    nutritionalInfo: {
      calories: 78,
      protein: 6.3,
      carbs: 0.6,
      fat: 5.3,
      fiber: 0,
    },
    usageCount: 0,
  },
  {
    id: 'food-005',
    name: 'Batata Doce Cozida',
    category: 'homemade',
    servingSize: 100,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 86,
      protein: 1.6,
      carbs: 20,
      fat: 0.1,
      fiber: 3,
    },
    usageCount: 0,
  },
  {
    id: 'food-006',
    name: 'Banana',
    category: 'homemade',
    servingSize: 100,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
    },
    usageCount: 0,
  },
  {
    id: 'food-007',
    name: 'Maçã',
    category: 'homemade',
    servingSize: 100,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4,
      sugar: 10,
    },
    usageCount: 0,
  },
  {
    id: 'food-008',
    name: 'Aveia em Flocos',
    category: 'homemade',
    servingSize: 40,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 152,
      protein: 5.4,
      carbs: 27,
      fat: 2.7,
      fiber: 4,
    },
    usageCount: 0,
  },
  {
    id: 'food-009',
    name: 'Leite Integral',
    category: 'homemade',
    servingSize: 200,
    servingUnit: 'ml',
    nutritionalInfo: {
      calories: 122,
      protein: 6.4,
      carbs: 9,
      fat: 6.2,
      sugar: 9,
    },
    usageCount: 0,
  },
  {
    id: 'food-010',
    name: 'Pão Francês',
    category: 'homemade',
    servingSize: 50,
    servingUnit: 'unidade',
    nutritionalInfo: {
      calories: 135,
      protein: 4.5,
      carbs: 27,
      fat: 1,
      fiber: 1.5,
    },
    usageCount: 0,
  },

  // Produtos Industrializados
  {
    id: 'food-011',
    name: 'Whey Protein',
    brand: 'Genérico',
    category: 'packaged',
    servingSize: 30,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 120,
      protein: 24,
      carbs: 3,
      fat: 1.5,
      fiber: 0,
    },
    usageCount: 0,
  },
  {
    id: 'food-012',
    name: 'Iogurte Grego Natural',
    brand: 'Genérico',
    category: 'packaged',
    servingSize: 170,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0.7,
      sugar: 6,
    },
    usageCount: 0,
  },
  {
    id: 'food-013',
    name: 'Pasta de Amendoim Integral',
    brand: 'Genérico',
    category: 'packaged',
    servingSize: 20,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 120,
      protein: 5,
      carbs: 4,
      fat: 10,
      fiber: 2,
    },
    usageCount: 0,
  },
  {
    id: 'food-014',
    name: 'Queijo Minas Frescal',
    brand: 'Genérico',
    category: 'packaged',
    servingSize: 30,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 70,
      protein: 5.4,
      carbs: 1.2,
      fat: 5,
      sodium: 180,
    },
    usageCount: 0,
  },
  {
    id: 'food-015',
    name: 'Atum em Lata (água)',
    brand: 'Genérico',
    category: 'packaged',
    servingSize: 80,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 90,
      protein: 20,
      carbs: 0,
      fat: 1,
      sodium: 300,
    },
    usageCount: 0,
  },

  // Restaurantes / Fast Food
  {
    id: 'food-016',
    name: 'Big Mac',
    brand: "McDonald's",
    category: 'restaurant',
    servingSize: 1,
    servingUnit: 'unidade',
    nutritionalInfo: {
      calories: 563,
      protein: 26,
      carbs: 45,
      fat: 33,
      fiber: 3,
      sodium: 1007,
    },
    usageCount: 0,
  },
  {
    id: 'food-017',
    name: 'Pizza Margherita',
    brand: 'Genérico',
    category: 'restaurant',
    servingSize: 1,
    servingUnit: 'fatia',
    nutritionalInfo: {
      calories: 250,
      protein: 11,
      carbs: 30,
      fat: 10,
      fiber: 2,
      sodium: 600,
    },
    usageCount: 0,
  },
  {
    id: 'food-018',
    name: 'Açaí com Granola e Banana',
    brand: 'Genérico',
    category: 'restaurant',
    servingSize: 300,
    servingUnit: 'ml',
    nutritionalInfo: {
      calories: 380,
      protein: 6,
      carbs: 58,
      fat: 15,
      fiber: 8,
      sugar: 35,
    },
    usageCount: 0,
  },
  {
    id: 'food-019',
    name: 'Prato Feito (PF) Completo',
    brand: 'Genérico',
    category: 'restaurant',
    servingSize: 1,
    servingUnit: 'prato',
    nutritionalInfo: {
      calories: 650,
      protein: 35,
      carbs: 80,
      fat: 18,
      fiber: 12,
    },
    usageCount: 0,
  },
  {
    id: 'food-020',
    name: 'Sushi - Salmão (8 peças)',
    brand: 'Genérico',
    category: 'restaurant',
    servingSize: 8,
    servingUnit: 'peças',
    nutritionalInfo: {
      calories: 350,
      protein: 18,
      carbs: 45,
      fat: 10,
      fiber: 1,
      sodium: 800,
    },
    usageCount: 0,
  },

  // Lanches e Snacks
  {
    id: 'food-021',
    name: 'Castanha de Caju',
    category: 'packaged',
    servingSize: 30,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 170,
      protein: 5,
      carbs: 9,
      fat: 14,
      fiber: 1,
    },
    usageCount: 0,
  },
  {
    id: 'food-022',
    name: 'Chocolate 70% Cacau',
    brand: 'Genérico',
    category: 'packaged',
    servingSize: 25,
    servingUnit: 'g',
    nutritionalInfo: {
      calories: 135,
      protein: 2.5,
      carbs: 13,
      fat: 9,
      fiber: 3,
      sugar: 8,
    },
    usageCount: 0,
  },
  {
    id: 'food-023',
    name: 'Tapioca com Queijo',
    category: 'homemade',
    servingSize: 1,
    servingUnit: 'unidade',
    nutritionalInfo: {
      calories: 180,
      protein: 7,
      carbs: 28,
      fat: 5,
      fiber: 1,
    },
    usageCount: 0,
  },
  {
    id: 'food-024',
    name: 'Sanduíche Natural de Frango',
    category: 'restaurant',
    servingSize: 1,
    servingUnit: 'unidade',
    nutritionalInfo: {
      calories: 320,
      protein: 22,
      carbs: 38,
      fat: 8,
      fiber: 4,
    },
    usageCount: 0,
  },
  {
    id: 'food-025',
    name: 'Suco de Laranja Natural',
    category: 'homemade',
    servingSize: 200,
    servingUnit: 'ml',
    nutritionalInfo: {
      calories: 90,
      protein: 1.4,
      carbs: 21,
      fat: 0.2,
      fiber: 0.4,
      sugar: 18,
    },
    usageCount: 0,
  },
];

// Funções auxiliares para busca e filtro
export function searchFoods(query: string): Food[] {
  const lowerQuery = query.toLowerCase();
  return foodDatabase.filter(
    (food) =>
      food.name.toLowerCase().includes(lowerQuery) ||
      food.brand?.toLowerCase().includes(lowerQuery)
  );
}

export function getFoodById(id: string): Food | undefined {
  return foodDatabase.find((food) => food.id === id);
}

export function getFoodsByCategory(category: Food['category']): Food[] {
  return foodDatabase.filter((food) => food.category === category);
}

export function getMostUsedFoods(limit: number = 10): Food[] {
  return [...foodDatabase]
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit);
}

export function getFavoriteFoods(): Food[] {
  return foodDatabase.filter((food) => food.isFavorite);
}
