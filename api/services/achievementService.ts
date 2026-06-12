import type { Achievement, Cartridge } from '../types';
import { achievements } from '../data/mockData';
import { cartridgeService } from './cartridgeService';

let achievementStore = [...achievements];

export const achievementService = {
  getAchievements: (): Achievement[] => {
    return achievementStore;
  },

  checkAchievements: (): { unlocked: Achievement[] } => {
    const { data: cartridges } = cartridgeService.getCartridges();
    const newlyUnlocked: Achievement[] = [];

    achievementStore = achievementStore.map((achievement) => {
      if (achievement.unlocked) return achievement;

      let progress = 0;
      let isUnlocked = false;

      switch (achievement.condition.type) {
        case 'total_cartridges':
          progress = cartridges.length;
          isUnlocked = progress >= (achievement.condition.value as number);
          break;
        case 'total_platforms':
          progress = new Set(cartridges.map((c) => c.platform)).size;
          isUnlocked = progress >= (achievement.condition.value as number);
          break;
        case 'complete_series': {
          const seriesName = achievement.condition.value as string;
          const seriesCartridges = cartridges.filter((c) => c.series === seriesName);
          progress = seriesCartridges.length;
          isUnlocked = progress >= achievement.progressMax;
          break;
        }
        case 'condition_count': {
          const condition = achievement.condition.value as string;
          progress = cartridges.filter((c) => c.condition === condition).length;
          isUnlocked = progress >= achievement.progressMax;
          break;
        }
        case 'complete_in_box':
          progress = cartridges.filter((c) => c.hasBox && c.hasManual && c.hasCartridge).length;
          isUnlocked = progress >= (achievement.condition.value as number);
          break;
        case 'total_value':
          progress = cartridges.reduce((sum, c) => sum + c.purchasePrice, 0);
          isUnlocked = progress >= (achievement.condition.value as number);
          break;
        case 'publisher_count': {
          const publisher = achievement.condition.value as string;
          progress = cartridges.filter((c) => c.publisher === publisher).length;
          isUnlocked = progress >= achievement.progressMax;
          break;
        }
        case 'decade_count': {
          const decade = achievement.condition.value as string;
          const startYear = parseInt(decade);
          progress = cartridges.filter(
            (c) => c.releaseYear >= startYear && c.releaseYear < startYear + 10
          ).length;
          isUnlocked = progress >= achievement.progressMax;
          break;
        }
        default:
          break;
      }

      if (isUnlocked && !achievement.unlocked) {
        newlyUnlocked.push({
          ...achievement,
          progress,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        });
        return {
          ...achievement,
          progress,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      return { ...achievement, progress: Math.min(progress, achievement.progressMax) };
    });

    return { unlocked: newlyUnlocked };
  },
};
