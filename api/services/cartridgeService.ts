import type { Cartridge, PriceHistory } from '../types';
import { cartridges, priceHistories } from '../data/mockData';

let cartridgeStore = [...cartridges];
let priceStore = [...priceHistories];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const cartridgeService = {
  getCartridges: (params: {
    platform?: string;
    series?: string;
    publisher?: string;
    condition?: string;
    sort?: string;
    search?: string;
  } = {}): { data: Cartridge[]; total: number } => {
    let result = [...cartridgeStore];

    if (params.platform) {
      result = result.filter((c) => c.platform === params.platform);
    }
    if (params.series) {
      result = result.filter((c) => c.series === params.series);
    }
    if (params.publisher) {
      result = result.filter((c) => c.publisher === params.publisher);
    }
    if (params.condition) {
      result = result.filter((c) => c.condition === params.condition);
    }
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.series.toLowerCase().includes(searchLower) ||
          c.publisher.toLowerCase().includes(searchLower)
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
        case 'year_asc':
          result.sort((a, b) => a.releaseYear - b.releaseYear);
          break;
        case 'year_desc':
          result.sort((a, b) => b.releaseYear - a.releaseYear);
          break;
        case 'date_desc':
        default:
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }

    return { data: result, total: result.length };
  },

  getCartridge: (id: string): Cartridge | undefined => {
    return cartridgeStore.find((c) => c.id === id);
  },

  addCartridge: (data: Omit<Cartridge, 'id' | 'createdAt' | 'updatedAt'>): Cartridge => {
    const now = new Date().toISOString();
    const newCartridge: Cartridge = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    cartridgeStore.push(newCartridge);
    return newCartridge;
  },

  updateCartridge: (id: string, data: Partial<Cartridge>): Cartridge | undefined => {
    const index = cartridgeStore.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    cartridgeStore[index] = {
      ...cartridgeStore[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return cartridgeStore[index];
  },

  deleteCartridge: (id: string): boolean => {
    const index = cartridgeStore.findIndex((c) => c.id === id);
    if (index === -1) return false;
    cartridgeStore.splice(index, 1);
    return true;
  },

  getPriceHistory: (cartridgeId: string): PriceHistory[] => {
    return priceStore.filter((p) => p.cartridgeId === cartridgeId);
  },

  getPlatforms: (): string[] => {
    return [...new Set(cartridgeStore.map((c) => c.platform))].sort();
  },

  getSeries: (): string[] => {
    return [...new Set(cartridgeStore.map((c) => c.series))].sort();
  },

  getPublishers: (): string[] => {
    return [...new Set(cartridgeStore.map((c) => c.publisher))].sort();
  },
};
