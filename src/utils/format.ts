export const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return '¥0';
  }
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

export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return formatDate(dateString);
};

const WINDOWS_ILLEGAL_CHARS = /[\\/:*?"<>|]/g;
const WINDOWS_RESERVED_NAMES = new Set([
  'CON', 'PRN', 'AUX', 'NUL',
  'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
]);

export const sanitizeFilename = (
  filename: string,
  replacement: string = '_',
  fallback: string = 'unnamed'
): string => {
  if (!filename) return fallback;

  let cleaned = filename.replace(WINDOWS_ILLEGAL_CHARS, replacement);

  cleaned = cleaned
    .split('\n').join(replacement)
    .split('\r').join(replacement)
    .split('\t').join(replacement)
    .split('\0').join(replacement);

  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/\.+$/g, '');
  cleaned = cleaned.replace(new RegExp(`${replacement}+`, 'g'), replacement);
  cleaned = cleaned.trim();

  const onlyReplacementAndSpace = new RegExp(`^[\\s${replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`);
  if (onlyReplacementAndSpace.test(cleaned)) {
    return fallback;
  }

  const upperName = cleaned.toUpperCase();
  if (WINDOWS_RESERVED_NAMES.has(upperName)) {
    cleaned = `${cleaned}${replacement}file`;
  }

  if (cleaned.length === 0) {
    return fallback;
  }

  const MAX_LENGTH = 200;
  if (cleaned.length > MAX_LENGTH) {
    cleaned = cleaned.substring(0, MAX_LENGTH);
  }

  return cleaned;
};
