import type { CollectorLeaderboardEntry } from '../types';
import { collectorLeaderboard } from '../data/mockData';

export type LeaderboardSortKey =
  | 'totalScore'
  | 'collectionCount'
  | 'achievementScore'
  | 'exchangeReputation';

export const leaderboardService = {
  getLeaderboard: (
    sortBy: LeaderboardSortKey = 'totalScore',
    limit: number = 50
  ): CollectorLeaderboardEntry[] => {
    const sorted = [...collectorLeaderboard].sort((a, b) => {
      switch (sortBy) {
        case 'collectionCount':
          return b.collectionCount - a.collectionCount;
        case 'achievementScore':
          return b.achievementScore - a.achievementScore;
        case 'exchangeReputation':
          return b.exchangeReputation - a.exchangeReputation;
        case 'totalScore':
        default:
          return b.totalScore - a.totalScore;
      }
    });

    return sorted.slice(0, limit).map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));
  },

  getMyRank: (userId: string): CollectorLeaderboardEntry | null => {
    const entry = collectorLeaderboard.find((e) => e.userId === userId);
    return entry || null;
  },
};
