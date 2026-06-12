import type { Cartridge, PriceHistory } from '../types';
import { cartridges, priceHistories } from '../data/mockData';

let cartridgeStore = [...cartridges];
let priceStore = [...priceHistories];

const generateId = () => Math.random().toString(36).substr(2, 9);

export interface ImportResult {
  imported: Cartridge[];
  skipped: { row: number; data: Record<string, any>; reason: string }[];
  errors: { row: number; data: Record<string, any>; reason: string }[];
}

const VALID_CONDITIONS = ['MINT', 'NEAR_MINT', 'VERY_GOOD', 'GOOD', 'FAIR', 'POOR'];
const VALID_REGIONS = ['JPN', 'USA', 'EUR', 'CHN', 'OTHER'];

const parseBoolean = (val: any): boolean => {
  if (typeof val === 'boolean') return val;
  const str = String(val).toLowerCase().trim();
  return ['true', '1', 'yes', 'y', '是', '有'].includes(str);
};

const normalizeString = (str: string): string => {
  return str.toLowerCase().trim().replace(/\s+/g, '');
};

const isDuplicate = (data: Partial<Cartridge>): Cartridge | undefined => {
  return cartridgeStore.find((c) => {
    const sameTitle = normalizeString(c.title) === normalizeString(data.title || '');
    const samePlatform = normalizeString(c.platform) === normalizeString(data.platform || '');
    const sameRegion = c.region === data.region;
    return sameTitle && samePlatform && sameRegion;
  });
};

const validateRow = (data: Record<string, any>, rowIndex: number): { valid: boolean; errors: string[]; parsed?: Omit<Cartridge, 'id' | 'createdAt' | 'updatedAt'> } => {
  const errors: string[] = [];
  const requiredFields = ['title', 'platform'];
  for (const field of requiredFields) {
    if (!data[field] || String(data[field]).trim() === '') {
      errors.push(`缺少必填字段: ${field}`);
    }
  }
  const title = String(data.title || '').trim();
  const platform = String(data.platform || '').trim();
  const series = String(data.series || '').trim();
  const publisher = String(data.publisher || '').trim();
  let releaseYear = parseInt(data.releaseYear);
  if (isNaN(releaseYear)) releaseYear = 1990;
  if (releaseYear < 1970 || releaseYear > 2099) {
    errors.push(`发行年份必须在 1970-2099 之间`);
  }
  let region = (data.region || 'JPN').toString().toUpperCase().trim();
  if (!VALID_REGIONS.includes(region)) {
    if (region === 'JP' || region === '日本' || region === '日版') region = 'JPN';
    else if (region === 'US' || region === '美国' || region === '美版') region = 'USA';
    else if (region === 'EU' || region === '欧洲' || region === '欧版') region = 'EUR';
    else if (region === 'CN' || region === '中国' || region === '国行') region = 'CHN';
    else region = 'OTHER';
  }
  let condition = (data.condition || 'VERY_GOOD').toString().toUpperCase().trim().replace(/\s+/g, '_');
  if (!VALID_CONDITIONS.includes(condition)) {
    const conditionMap: Record<string, string> = {
      '全新': 'MINT',
      '近新': 'NEAR_MINT',
      '很好': 'VERY_GOOD',
      '良好': 'GOOD',
      '一般': 'FAIR',
      '较差': 'POOR',
      'NM': 'NEAR_MINT',
      'VG': 'VERY_GOOD',
      'G': 'GOOD',
      'F': 'FAIR',
      'P': 'POOR',
    };
    condition = conditionMap[condition] || 'VERY_GOOD';
  }
  const hasBox = parseBoolean(data.hasBox ?? true);
  const hasManual = parseBoolean(data.hasManual ?? true);
  const hasCartridge = parseBoolean(data.hasCartridge ?? true);
  let purchasePrice = parseFloat(data.purchasePrice);
  if (isNaN(purchasePrice) || purchasePrice < 0) purchasePrice = 0;
  const purchaseDate = data.purchaseDate || new Date().toISOString().split('T')[0];
  const notes = String(data.notes || '').trim();
  const coverImage = String(data.coverImage || '').trim();
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return {
    valid: true,
    errors: [],
    parsed: {
      title,
      platform,
      series,
      publisher,
      releaseYear,
      region: region as Cartridge['region'],
      condition: condition as Cartridge['condition'],
      hasBox,
      hasManual,
      hasCartridge,
      purchasePrice,
      purchaseDate,
      notes,
      coverImage,
    },
  };
};

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

  previewImport: (rows: Record<string, any>[]): {
    valid: { row: number; data: Omit<Cartridge, 'id' | 'createdAt' | 'updatedAt'>; original: Record<string, any> }[];
    duplicates: { row: number; data: Record<string, any>; reason: string }[];
    errors: { row: number; data: Record<string, any>; reason: string }[];
  } => {
    const valid: { row: number; data: Omit<Cartridge, 'id' | 'createdAt' | 'updatedAt'>; original: Record<string, any> }[] = [];
    const duplicates: { row: number; data: Record<string, any>; reason: string }[] = [];
    const errors: { row: number; data: Record<string, any>; reason: string }[] = [];
    const seenInBatch = new Map<string, number>();

    rows.forEach((row, idx) => {
      const rowNumber = idx + 2;
      const validation = validateRow(row, rowNumber);
      if (!validation.valid) {
        errors.push({
          row: rowNumber,
          data: row,
          reason: validation.errors.join('; '),
        });
        return;
      }
      const parsedData = validation.parsed!;
      const batchKey = `${normalizeString(parsedData.title)}_${normalizeString(parsedData.platform)}_${parsedData.region}`;
      if (seenInBatch.has(batchKey)) {
        const firstRow = seenInBatch.get(batchKey)!;
        duplicates.push({
          row: rowNumber,
          data: row,
          reason: `与导入文件中第 ${firstRow} 行重复 (同名称+同平台+同区域)`,
        });
        return;
      }
      const existingDup = isDuplicate(parsedData);
      if (existingDup) {
        duplicates.push({
          row: rowNumber,
          data: row,
          reason: `与藏品库中已存在的卡带重复: ${existingDup.title} (${existingDup.platform}/${existingDup.region})`,
        });
        return;
      }
      seenInBatch.set(batchKey, rowNumber);
      valid.push({
        row: rowNumber,
        data: parsedData,
        original: row,
      });
    });

    return { valid, duplicates, errors };
  },

  bulkImport: function (rows: Record<string, any>[]): ImportResult {
    const result: ImportResult = {
      imported: [],
      skipped: [],
      errors: [],
    };
    const self = cartridgeService;
    const preview = self.previewImport(rows);

    result.skipped = preview.duplicates;
    result.errors = preview.errors;

    preview.valid.forEach((item: { row: number; data: Omit<Cartridge, 'id' | 'createdAt' | 'updatedAt'>; original: Record<string, any> }) => {
      const imported = self.addCartridge(item.data);
      result.imported.push(imported);
    });

    return result;
  },
};
