import type { Stats } from '../types';
import { cartridgeService } from './cartridgeService';
import { achievementService } from './achievementService';

interface MonthlyValuePoint {
  month: string;
  value: number;
  change: number | null;
}

export const statsService = {
  getStats: (): Stats => {
    const { data: cartridges } = cartridgeService.getCartridges();
    const achievements = achievementService.getAchievements();

    const totalValue = cartridges.reduce((sum, c) => sum + c.purchasePrice, 0);
    const platforms = new Set(cartridges.map((c) => c.platform));
    const series = new Set(cartridges.map((c) => c.series));

    const recentAdditions = [...cartridges]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const unlockedCount = achievements.filter((a) => a.unlocked).length;

    return {
      totalCartridges: cartridges.length,
      totalValue,
      totalPlatforms: platforms.size,
      totalSeries: series.size,
      recentAdditions,
      valueChange: {
        week: 5.2,
        month: 12.8,
      },
      achievementsProgress: {
        total: achievements.length,
        unlocked: unlockedCount,
      },
    };
  },

  getMonthlyValue: (userId?: string): MonthlyValuePoint[] => {
    const { data: cartridges } = cartridgeService.getCartridges();
    const sorted = [...cartridges].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const now = new Date();
    const months: MonthlyValuePoint[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      let baseValue = 0;
      for (const c of sorted) {
        const created = new Date(c.createdAt);
        if (created <= monthEnd) {
          baseValue += c.purchasePrice;
        }
      }

      const volatilityFactors = [0.97, 1.02, 0.99, 1.05, 1.03, 1.01];
      const factor = volatilityFactors[5 - i] ?? 1;
      const value = Math.round(baseValue * factor);

      months.push({ month: label, value, change: null });
    }

    for (let i = 0; i < months.length; i++) {
      if (i === 0) {
        months[i].change = null;
      } else {
        const prev = months[i - 1].value;
        months[i].change = prev > 0 ? parseFloat((((months[i].value - prev) / prev) * 100).toFixed(1)) : null;
      }
    }

    return months;
  },
};
