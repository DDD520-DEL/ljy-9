export const formatPrice = (price: number): string => {
  return `¥${price.toLocaleString('zh-CN')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getConditionLabel = (condition: string): string => {
  const labels: Record<string, string> = {
    MINT: '全新',
    NEAR_MINT: '近新',
    VERY_GOOD: '很好',
    GOOD: '良好',
    FAIR: '一般',
    POOR: '较差',
  };
  return labels[condition] || condition;
};

export const getConditionColor = (condition: string): string => {
  const colors: Record<string, string> = {
    MINT: 'text-neon-green',
    NEAR_MINT: 'text-neon-cyan',
    VERY_GOOD: 'text-neon-amber',
    GOOD: 'text-orange-400',
    FAIR: 'text-orange-600',
    POOR: 'text-neon-red',
  };
  return colors[condition] || 'text-gray-400';
};

export const getRegionLabel = (region: string): string => {
  const labels: Record<string, string> = {
    JPN: '日版',
    USA: '美版',
    EUR: '欧版',
    CHN: '国行',
    OTHER: '其他',
  };
  return labels[region] || region;
};

export const getAchievementCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    collection: '收藏成就',
    series: '系列成就',
    rare: '稀有成就',
    milestone: '里程碑',
  };
  return labels[category] || category;
};

export const getPlatformColor = (platform: string): string => {
  const colors: Record<string, string> = {
    FC: 'bg-red-600',
    SFC: 'bg-purple-600',
    GB: 'bg-gray-500',
    GBA: 'bg-blue-600',
    NES: 'bg-gray-700',
    SNES: 'bg-indigo-600',
    MD: 'bg-black',
    PS: 'bg-gray-800',
  };
  return colors[platform] || 'bg-card-border';
};
