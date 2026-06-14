import type { Accessory, AccessoryCategory } from '../types';
import { accessories } from '../data/mockData';

let accessoryStore = [...accessories];

const generateId = () => Math.random().toString(36).substr(2, 9);

const VALID_CONDITIONS = ['MINT', 'NEAR_MINT', 'VERY_GOOD', 'GOOD', 'FAIR', 'POOR'];
const VALID_CATEGORIES: AccessoryCategory[] = [
  'CONTROLLER', 'GUIDE_BOOK', 'LIMITED_EDITION', 'CONSOLE',
  'CABLE', 'MEMORY_CARD', 'SOUNDTRACK', 'FIGURINE',
  'ART_BOOK', 'POSTER', 'MERCHANDISE', 'OTHER'
];

const normalizeString = (str: string): string => {
  return str.toLowerCase().trim().replace(/\s+/g, '');
};

export const accessoryService = {
  getAccessories: (params: {
    category?: string;
    platform?: string;
    condition?: string;
    sort?: string;
    search?: string;
  } = {}): { data: Accessory[]; total: number } => {
    let result = [...accessoryStore];

    if (params.category) {
      result = result.filter((a) => a.category === params.category);
    }
    if (params.platform) {
      result = result.filter((a) => a.platform === params.platform);
    }
    if (params.condition) {
      result = result.filter((a) => a.condition === params.condition);
    }
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(searchLower) ||
          (a.series && a.series.toLowerCase().includes(searchLower)) ||
          (a.manufacturer && a.manufacturer.toLowerCase().includes(searchLower)) ||
          a.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    if (params.sort) {
      switch (params.sort) {
        case 'price_asc':
          result.sort((a, b) => a.purchasePrice - b.purchasePrice);
          break;
        case 'price_desc':
          result.sort((a, b) => b.purchasePrice - a.purchasePrice);
          break;
        case 'name_asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'date_asc':
          result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'date_desc':
        default:
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }

    return { data: result, total: result.length };
  },

  getAccessory: (id: string): Accessory | undefined => {
    return accessoryStore.find((a) => a.id === id);
  },

  addAccessory: (data: Omit<Accessory, 'id' | 'createdAt' | 'updatedAt'>): Accessory => {
    const now = new Date().toISOString();
    const newAccessory: Accessory = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    accessoryStore.push(newAccessory);
    return newAccessory;
  },

  updateAccessory: (id: string, data: Partial<Accessory>): Accessory | undefined => {
    const index = accessoryStore.findIndex((a) => a.id === id);
    if (index === -1) return undefined;
    accessoryStore[index] = {
      ...accessoryStore[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return accessoryStore[index];
  },

  deleteAccessory: (id: string): boolean => {
    const index = accessoryStore.findIndex((a) => a.id === id);
    if (index === -1) return false;
    accessoryStore.splice(index, 1);
    return true;
  },

  getCategories: (): AccessoryCategory[] => {
    return VALID_CATEGORIES;
  },

  getPlatforms: (): string[] => {
    return [...new Set(accessoryStore.map((a) => a.platform).filter(Boolean) as string[])].sort();
  },

  getTags: (): string[] => {
    const allTags = new Set<string>();
    accessoryStore.forEach((a) => a.tags.forEach((t) => allTags.add(t)));
    return [...allTags].sort();
  },

  getStats: (): { count: number; totalValue: number; recent: Accessory[] } => {
    const count = accessoryStore.length;
    const totalValue = accessoryStore.reduce((sum, a) => sum + a.purchasePrice * a.quantity, 0);
    const recent = [...accessoryStore]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    return { count, totalValue, recent };
  },

  isValidCondition: (condition: string): boolean => {
    return VALID_CONDITIONS.includes(condition);
  },

  isValidCategory: (category: string): boolean => {
    return VALID_CATEGORIES.includes(category as AccessoryCategory);
  },
};
