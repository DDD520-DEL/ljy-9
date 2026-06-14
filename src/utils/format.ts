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

  const escapedReplacement = replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  cleaned = cleaned.replace(new RegExp(`${escapedReplacement}+`, 'g'), replacement);
  cleaned = cleaned.trim();

  const onlyReplacementAndSpace = new RegExp(`^[\\s${escapedReplacement}]+$`);
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

export const getAccessoryCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    CONTROLLER: '手柄控制器',
    GUIDE_BOOK: '攻略书本',
    LIMITED_EDITION: '限定特典',
    CONSOLE: '游戏主机',
    CABLE: '线材配件',
    MEMORY_CARD: '记忆卡',
    SOUNDTRACK: '原声音乐',
    FIGURINE: '手办模型',
    ART_BOOK: '设定画集',
    POSTER: '海报周边',
    MERCHANDISE: '周边商品',
    OTHER: '其他',
  };
  return labels[category] || category;
};

export const getAccessoryCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    CONTROLLER: 'text-neon-cyan bg-neon-cyan/15 border-neon-cyan/30',
    GUIDE_BOOK: 'text-neon-amber bg-neon-amber/15 border-neon-amber/30',
    LIMITED_EDITION: 'text-neon-pink bg-neon-pink/15 border-neon-pink/30',
    CONSOLE: 'text-neon-purple bg-neon-purple/15 border-neon-purple/30',
    CABLE: 'text-gray-400 bg-gray-400/15 border-gray-400/30',
    MEMORY_CARD: 'text-blue-400 bg-blue-400/15 border-blue-400/30',
    SOUNDTRACK: 'text-pink-400 bg-pink-400/15 border-pink-400/30',
    FIGURINE: 'text-orange-400 bg-orange-400/15 border-orange-400/30',
    ART_BOOK: 'text-teal-400 bg-teal-400/15 border-teal-400/30',
    POSTER: 'text-red-400 bg-red-400/15 border-red-400/30',
    MERCHANDISE: 'text-green-400 bg-green-400/15 border-green-400/30',
    OTHER: 'text-gray-500 bg-gray-500/15 border-gray-500/30',
  };
  return colors[category] || 'text-gray-400 bg-gray-400/15 border-gray-400/30';
};
