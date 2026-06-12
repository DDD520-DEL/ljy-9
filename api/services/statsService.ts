import type { Stats } from '../types';
import { cartridgeService } from './cartridgeService';
import { achievementService } from './achievementService';

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
};
