export interface Cartridge {
  id: string;
  title: string;
  platform: string;
  series: string;
  publisher: string;
  releaseYear: number;
  region: 'JPN' | 'USA' | 'EUR' | 'CHN' | 'OTHER';
  condition: 'MINT' | 'NEAR_MINT' | 'VERY_GOOD' | 'GOOD' | 'FAIR' | 'POOR';
  hasBox: boolean;
  hasManual: boolean;
  hasCartridge: boolean;
  purchasePrice: number;
  purchaseDate: string;
  notes: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceHistory {
  id: string;
  cartridgeId: string;
  platform: string;
  price: number;
  date: string;
  source: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'collection' | 'series' | 'rare' | 'milestone';
  condition: {
    type: string;
    value: number | string;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  progressMax: number;
}

export interface ExchangeRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'WANT' | 'HAVE';
  cartridgeTitle: string;
  platform: string;
  description: string;
  condition: string;
  createdAt: string;
}

export interface MatchResult {
  requestId: string;
  matchRequestId: string;
  matchUserId: string;
  matchUserName: string;
  score: number;
  details: string;
}

export interface ExchangeNotification {
  id: string;
  userId: string;
  type: 'MATCH_FOUND';
  matchRequestId: string;
  matchUserName: string;
  matchCartridgeTitle: string;
  matchPlatform: string;
  matchType: 'WANT' | 'HAVE';
  myRequestId: string;
  myCartridgeTitle: string;
  score: number;
  details: string;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  exchangeId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  rating: number;
  comment: string;
  cartridgeTitle: string;
  createdAt: string;
}

export interface UserRating {
  userId: string;
  userName: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface Exchange {
  id: string;
  requestId: string;
  matchRequestId: string;
  initiatorUserId: string;
  initiatorUserName: string;
  targetUserId: string;
  targetUserName: string;
  cartridgeTitle: string;
  platform: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  initiatorReviewed: boolean;
  targetReviewed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Stats {
  totalCartridges: number;
  totalValue: number;
  totalPlatforms: number;
  totalSeries: number;
  recentAdditions: Cartridge[];
  valueChange: {
    week: number;
    month: number;
  };
  achievementsProgress: {
    total: number;
    unlocked: number;
  };
}

export interface PriceAlert {
  id: string;
  cartridgeId: string;
  cartridgeTitle: string;
  cartridgePlatform: string;
  coverImage: string;
  threshold: number;
  currentPrice: number;
  priceChangePercent: number;
  direction: 'UP' | 'DOWN';
  days: number;
  createdAt: string;
}

export interface PriceAlertSettings {
  threshold: number;
  enabled: boolean;
}

export interface CollectorLeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  rank: number;
  prevRank?: number;
  collectionCount: number;
  collectionScore: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  achievementScore: number;
  exchangeReputation: number;
  exchangeScore: number;
  totalScore: number;
  completedExchanges: number;
  joinedAt: string;
}
