import type { Cartridge } from '../types';
import { getConditionLabel, formatPrice, getRegionLabel } from './format';

export interface ValueDistributionItem {
  range: string;
  count: number;
  totalValue: number;
}

export interface RarityAnalysisItem {
  condition: string;
  count: number;
  percentage: number;
  avgValue: number;
}

export interface PlatformStats {
  platform: string;
  count: number;
  totalValue: number;
  avgValue: number;
}

export interface CollectionOverview {
  totalCartridges: number;
  totalValue: number;
  avgValue: number;
  totalPlatforms: number;
  totalSeries: number;
  totalPublishers: number;
  completeInBox: number;
  completeInBoxPercentage: number;
  mostValuable: Cartridge | null;
  leastValuable: Cartridge | null;
  reportDate: string;
}

export interface ReportData {
  overview: CollectionOverview;
  valueDistribution: ValueDistributionItem[];
  rarityAnalysis: RarityAnalysisItem[];
  platformStats: PlatformStats[];
  topValuable: Cartridge[];
  conditionBreakdown: { condition: string; count: number; percentage: number }[];
}

const getValueRangeIndex = (price: number, ranges: number[]): number => {
  for (let i = 0; i < ranges.length - 1; i++) {
    if (price >= ranges[i] && price < ranges[i + 1]) {
      return i;
    }
  }
  return ranges.length - 2;
};

export const generateReportData = (cartridges: Cartridge[]): ReportData => {
  const totalCartridges = cartridges.length;
  const totalValue = cartridges.reduce((sum, c) => sum + c.purchasePrice, 0);
  const avgValue = totalCartridges > 0 ? totalValue / totalCartridges : 0;
  const platforms = new Set(cartridges.map((c) => c.platform));
  const series = new Set(cartridges.map((c) => c.series).filter(Boolean));
  const publishers = new Set(cartridges.map((c) => c.publisher).filter(Boolean));
  const completeInBox = cartridges.filter((c) => c.hasBox && c.hasManual && c.hasCartridge).length;
  const completeInBoxPercentage = totalCartridges > 0 ? (completeInBox / totalCartridges) * 100 : 0;

  const sortedByValue = [...cartridges].sort((a, b) => b.purchasePrice - a.purchasePrice);
  const mostValuable = sortedByValue[0] || null;
  const leastValuable = sortedByValue[sortedByValue.length - 1] || null;

  const valueRanges = [0, 200, 500, 1000, 2000, 5000, Infinity];
  const rangeLabels = ['0-200元', '200-500元', '500-1000元', '1000-2000元', '2000-5000元', '5000元以上'];
  const valueDistribution: ValueDistributionItem[] = rangeLabels.map((range, i) => ({
    range,
    count: 0,
    totalValue: 0,
  }));

  cartridges.forEach((c) => {
    const idx = getValueRangeIndex(c.purchasePrice, valueRanges);
    valueDistribution[idx].count++;
    valueDistribution[idx].totalValue += c.purchasePrice;
  });

  const conditions = ['MINT', 'NEAR_MINT', 'VERY_GOOD', 'GOOD', 'FAIR', 'POOR'];
  const conditionMap = new Map<string, { count: number; totalValue: number }>();
  conditions.forEach((c) => conditionMap.set(c, { count: 0, totalValue: 0 }));

  cartridges.forEach((c) => {
    const entry = conditionMap.get(c.condition);
    if (entry) {
      entry.count++;
      entry.totalValue += c.purchasePrice;
    }
  });

  const rarityAnalysis: RarityAnalysisItem[] = conditions.map((condition) => {
    const entry = conditionMap.get(condition) || { count: 0, totalValue: 0 };
    return {
      condition: getConditionLabel(condition),
      count: entry.count,
      percentage: totalCartridges > 0 ? (entry.count / totalCartridges) * 100 : 0,
      avgValue: entry.count > 0 ? entry.totalValue / entry.count : 0,
    };
  });

  const conditionBreakdown = conditions.map((condition) => {
    const entry = conditionMap.get(condition) || { count: 0, totalValue: 0 };
    return {
      condition: getConditionLabel(condition),
      count: entry.count,
      percentage: totalCartridges > 0 ? (entry.count / totalCartridges) * 100 : 0,
    };
  });

  const platformMap = new Map<string, { count: number; totalValue: number }>();
  cartridges.forEach((c) => {
    if (!platformMap.has(c.platform)) {
      platformMap.set(c.platform, { count: 0, totalValue: 0 });
    }
    const entry = platformMap.get(c.platform)!;
    entry.count++;
    entry.totalValue += c.purchasePrice;
  });

  const platformStats: PlatformStats[] = Array.from(platformMap.entries())
    .map(([platform, data]) => ({
      platform,
      count: data.count,
      totalValue: data.totalValue,
      avgValue: data.count > 0 ? data.totalValue / data.count : 0,
    }))
    .sort((a, b) => b.totalValue - a.totalValue);

  const topValuable = sortedByValue.slice(0, 5);

  const reportDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    overview: {
      totalCartridges,
      totalValue,
      avgValue,
      totalPlatforms: platforms.size,
      totalSeries: series.size,
      totalPublishers: publishers.size,
      completeInBox,
      completeInBoxPercentage,
      mostValuable,
      leastValuable,
      reportDate,
    },
    valueDistribution,
    rarityAnalysis,
    platformStats,
    topValuable,
    conditionBreakdown,
  };
};
