export const getYearIndex = (availableYears: number[], selectedYear: number): number => {
  return availableYears.indexOf(selectedYear);
};

export const canNavigateYear = (
  availableYears: number[],
  selectedYear: number,
  direction: -1 | 1
): boolean => {
  const currentIndex = getYearIndex(availableYears, selectedYear);
  if (currentIndex === -1) return false;
  const newIndex = currentIndex - direction;
  return newIndex >= 0 && newIndex < availableYears.length;
};

export const navigateYear = (
  availableYears: number[],
  selectedYear: number,
  direction: -1 | 1
): number | null => {
  const currentIndex = getYearIndex(availableYears, selectedYear);
  if (currentIndex === -1) return null;
  const newIndex = currentIndex - direction;
  if (newIndex >= 0 && newIndex < availableYears.length) {
    return availableYears[newIndex];
  }
  return null;
};

export const getAvailableYears = (
  purchaseDates: (string | undefined | null)[],
  createdAtDates: (string | undefined | null)[] = [],
  includeCurrentYear: boolean = true
): number[] => {
  const years = new Set<number>();

  purchaseDates.forEach((date) => {
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        years.add(d.getFullYear());
      }
    }
  });

  createdAtDates.forEach((date) => {
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        years.add(d.getFullYear());
      }
    }
  });

  if (includeCurrentYear) {
    years.add(new Date().getFullYear());
  }

  return Array.from(years).sort((a, b) => b - a);
};

export const getYearCartridges = <T extends { purchaseDate?: string | null; createdAt?: string | null }>(
  cartridges: T[],
  year: number
): T[] => {
  return cartridges.filter((c) => {
    if (c.purchaseDate) {
      const d = new Date(c.purchaseDate);
      if (!isNaN(d.getTime())) {
        return d.getFullYear() === year;
      }
    }
    if (c.createdAt) {
      const d = new Date(c.createdAt);
      if (!isNaN(d.getTime())) {
        return d.getFullYear() === year;
      }
    }
    return false;
  });
};

export const getMonthlyTrend = <T extends { purchaseDate?: string | null; createdAt?: string | null; purchasePrice?: number }>(
  yearCartridges: T[],
  year: number
): { month: string; 新增数量: number; 累计支出: number }[] => {
  const monthLabels = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月',
  ];

  const data = monthLabels.map((label) => ({
    month: label,
    新增数量: 0,
    累计支出: 0,
  }));

  yearCartridges.forEach((c) => {
    let date: Date | null = null;
    if (c.purchaseDate) {
      const d = new Date(c.purchaseDate);
      if (!isNaN(d.getTime())) date = d;
    }
    if (!date && c.createdAt) {
      const d = new Date(c.createdAt);
      if (!isNaN(d.getTime())) date = d;
    }
    if (date && date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      data[monthIndex].新增数量 += 1;
      data[monthIndex].累计支出 += c.purchasePrice || 0;
    }
  });

  return data;
};

export const getCumulativeTrend = (
  monthlyTrend: { month: string; 新增数量: number }[]
): { month: string; 累计数量: number }[] => {
  let cumulative = 0;
  return monthlyTrend.map((item) => {
    cumulative += item.新增数量;
    return {
      month: item.month,
      累计数量: cumulative,
    };
  });
};

export const getTopExpensive = <T extends { purchasePrice?: number }>(
  yearCartridges: T[],
  topN: number = 5
): T[] => {
  return [...yearCartridges]
    .sort((a, b) => (b.purchasePrice || 0) - (a.purchasePrice || 0))
    .slice(0, topN);
};

export const getPlatformDistribution = <T extends { platform: string }>(
  yearCartridges: T[]
): { name: string; value: number }[] => {
  const map = new Map<string, number>();
  yearCartridges.forEach((c) => {
    map.set(c.platform, (map.get(c.platform) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getYearStats = <T extends { platform: string; series: string; purchasePrice?: number }>(
  yearCartridges: T[]
): {
  totalCount: number;
  totalSpent: number;
  avgPrice: number;
  uniquePlatforms: number;
  uniqueSeries: number;
} => {
  const totalCount = yearCartridges.length;
  const totalSpent = yearCartridges.reduce(
    (sum, c) => sum + (c.purchasePrice || 0),
    0
  );
  const avgPrice = totalCount > 0 ? totalSpent / totalCount : 0;
  const uniquePlatforms = new Set(yearCartridges.map((c) => c.platform)).size;
  const uniqueSeries = new Set(yearCartridges.map((c) => c.series)).size;

  return {
    totalCount,
    totalSpent,
    avgPrice,
    uniquePlatforms,
    uniqueSeries,
  };
};
