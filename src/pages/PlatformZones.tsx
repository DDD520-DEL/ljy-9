import { useMemo } from 'react';
import { useStore } from '../stores/useStore';
import { useNavigate } from 'react-router-dom';
import type { EncyclopediaPlatform } from '../types';
import {
  Gamepad2,
  Package,
  TrendingUp,
  Star,
  Layers,
  ChevronRight,
  Crown,
  Sparkles,
  Zap,
  Gauge,
} from 'lucide-react';
import { formatPrice, getConditionLabel, getConditionColor } from '../utils/format';
import CartridgeCard from '../components/CartridgeCard';

const platforms: EncyclopediaPlatform[] = [
  { name: 'FC', fullName: 'Family Computer (NES)', manufacturer: '任天堂', releaseYear: 1983, generation: '第三代', totalGames: 10, icon: '🎮', color: 'neon-red' },
  { name: 'SFC', fullName: 'Super Famicom (SNES)', manufacturer: '任天堂', releaseYear: 1990, generation: '第四代', totalGames: 10, icon: '🕹️', color: 'neon-purple' },
  { name: 'GB', fullName: 'Game Boy', manufacturer: '任天堂', releaseYear: 1989, generation: '掌机初代', totalGames: 8, icon: '📱', color: 'neon-green' },
  { name: 'MD', fullName: 'Mega Drive (Genesis)', manufacturer: '世嘉', releaseYear: 1988, generation: '第四代', totalGames: 5, icon: '🎯', color: 'neon-cyan' },
  { name: 'PS', fullName: 'PlayStation', manufacturer: '索尼', releaseYear: 1994, generation: '第五代', totalGames: 5, icon: '💿', color: 'neon-pink' },
  { name: 'N64', fullName: 'Nintendo 64', manufacturer: '任天堂', releaseYear: 1996, generation: '第五代', totalGames: 5, icon: '🎪', color: 'neon-amber' },
];

const colorMap: Record<string, { text: string; bg: string; border: string; ring: string; gradient: string }> = {
  'neon-red': { text: 'text-neon-red', bg: 'bg-neon-red/20', border: 'border-neon-red/50', ring: 'ring-neon-red/40', gradient: 'from-neon-red/30 to-transparent' },
  'neon-purple': { text: 'text-neon-purple', bg: 'bg-neon-purple/20', border: 'border-neon-purple/50', ring: 'ring-neon-purple/40', gradient: 'from-neon-purple/30 to-transparent' },
  'neon-green': { text: 'text-neon-green', bg: 'bg-neon-green/20', border: 'border-neon-green/50', ring: 'ring-neon-green/40', gradient: 'from-neon-green/30 to-transparent' },
  'neon-cyan': { text: 'text-neon-cyan', bg: 'bg-neon-cyan/20', border: 'border-neon-cyan/50', ring: 'ring-neon-cyan/40', gradient: 'from-neon-cyan/30 to-transparent' },
  'neon-pink': { text: 'text-neon-pink', bg: 'bg-neon-pink/20', border: 'border-neon-pink/50', ring: 'ring-neon-pink/40', gradient: 'from-neon-pink/30 to-transparent' },
  'neon-amber': { text: 'text-neon-amber', bg: 'bg-neon-amber/20', border: 'border-neon-amber/50', ring: 'ring-neon-amber/40', gradient: 'from-neon-amber/30 to-transparent' },
};

const rarityOrder = ['MINT', 'NEAR_MINT', 'VERY_GOOD', 'GOOD', 'FAIR', 'POOR'];

const getRarityIcon = (condition: string) => {
  switch (condition) {
    case 'MINT':
      return Crown;
    case 'NEAR_MINT':
      return Sparkles;
    case 'VERY_GOOD':
      return Star;
    case 'GOOD':
      return Zap;
    default:
      return Gauge;
  }
};

const PlatformZones = () => {
  const navigate = useNavigate();
  const { cartridges, setFilters } = useStore();

  const safeCartridges = Array.isArray(cartridges) ? cartridges : [];

  const platformStats = useMemo(() => {
    return platforms.map((platform) => {
      const platformCartridges = safeCartridges.filter((c) => c.platform === platform.name);
      const totalCount = platformCartridges.length;
      const totalValue = platformCartridges.reduce((sum, c) => sum + (c.purchasePrice || 0), 0);

      const rarityDistribution: Record<string, number> = {};
      rarityOrder.forEach((r) => (rarityDistribution[r] = 0));
      platformCartridges.forEach((c) => {
        if (rarityDistribution[c.condition] !== undefined) {
          rarityDistribution[c.condition]++;
        }
      });

      const representativeWorks = [...platformCartridges]
        .sort((a, b) => {
          const conditionScore: Record<string, number> = {
            MINT: 6, NEAR_MINT: 5, VERY_GOOD: 4, GOOD: 3, FAIR: 2, POOR: 1,
          };
          const scoreDiff = (conditionScore[b.condition] || 0) - (conditionScore[a.condition] || 0);
          if (scoreDiff !== 0) return scoreDiff;
          return b.purchasePrice - a.purchasePrice;
        })
        .slice(0, 4);

      const hasBoxCount = platformCartridges.filter((c) => c.hasBox).length;
      const hasManualCount = platformCartridges.filter((c) => c.hasManual).length;
      const completeInBox = platformCartridges.filter((c) => c.hasBox && c.hasManual && c.hasCartridge).length;

      return {
        platform,
        cartridges: platformCartridges,
        totalCount,
        totalValue,
        rarityDistribution,
        representativeWorks,
        hasBoxCount,
        hasManualCount,
        completeInBox,
      };
    });
  }, [safeCartridges]);

  const totalStats = useMemo(() => {
    const totalCollected = platformStats.reduce((sum, p) => sum + p.totalCount, 0);
    const totalVal = platformStats.reduce((sum, p) => sum + p.totalValue, 0);
    const platformsWithGames = platformStats.filter((p) => p.totalCount > 0).length;
    return { totalCollected, totalVal, platformsWithGames };
  }, [platformStats]);

  const handleGoToCollection = (platformName: string) => {
    setFilters({ platform: [platformName], series: [], publisher: [], condition: [], tags: [], search: '' });
    navigate('/collection');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-green flex items-center gap-3">
          <Gamepad2 className="w-7 h-7" />
          平台专区
        </h1>
        <p className="font-retro text-gray-400 text-lg">
          按平台分类浏览你的收藏，查看各平台的收藏数据与稀有度分布
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-pixel p-4 rounded-lg bg-gradient-to-b from-neon-purple/20 to-transparent">
          <p className="font-retro text-gray-400 text-sm">覆盖平台</p>
          <p className="font-pixel text-2xl text-neon-purple mt-1">
            {totalStats.platformsWithGames}
            <span className="text-sm ml-1 text-gray-500">/{platforms.length}</span>
          </p>
        </div>
        <div className="card-pixel p-4 rounded-lg bg-gradient-to-b from-neon-cyan/20 to-transparent">
          <p className="font-retro text-gray-400 text-sm">卡带总数</p>
          <p className="font-pixel text-2xl text-neon-cyan mt-1">
            {totalStats.totalCollected}
            <span className="text-sm ml-1">张</span>
          </p>
        </div>
        <div className="card-pixel p-4 rounded-lg bg-gradient-to-b from-neon-amber/20 to-transparent">
          <p className="font-retro text-gray-400 text-sm">收藏总价值</p>
          <p className="font-pixel text-2xl text-neon-amber mt-1">{formatPrice(totalStats.totalVal)}</p>
        </div>
        <div className="card-pixel p-4 rounded-lg bg-gradient-to-b from-neon-green/20 to-transparent">
          <p className="font-retro text-gray-400 text-sm">箱说全数量</p>
          <p className="font-pixel text-2xl text-neon-green mt-1">
            {platformStats.reduce((sum, p) => sum + p.completeInBox, 0)}
            <span className="text-sm ml-1">张</span>
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {platformStats.map(({ platform, cartridges: pCartridges, totalCount, totalValue, rarityDistribution, representativeWorks, hasBoxCount, hasManualCount, completeInBox }) => {
          const colors = colorMap[platform.color] || colorMap['neon-purple'];
          const maxRarity = Math.max(...Object.values(rarityDistribution), 1);

          return (
            <div
              key={platform.name}
              className={`card-pixel rounded-lg overflow-hidden border-2 ${colors.border} bg-gradient-to-b ${colors.gradient}`}
            >
              <div className="p-6 border-b border-card-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center text-4xl`}>
                      {platform.icon}
                    </div>
                    <div>
                      <h2 className={`font-pixel text-xl ${colors.text} flex items-center gap-2`}>
                        {platform.name} 专区
                        {totalCount > 0 && (
                          <span className={`px-2 py-0.5 text-[10px] font-pixel rounded ${colors.bg} ${colors.text}`}>
                            已收录
                          </span>
                        )}
                      </h2>
                      <p className="font-retro text-gray-400 text-sm mt-1">
                        {platform.fullName} · {platform.manufacturer} · {platform.generation} · {platform.releaseYear}年发售
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGoToCollection(platform.name)}
                    className={`self-start md:self-center px-4 py-2 font-retro text-sm rounded border-2 ${colors.border} ${colors.bg} ${colors.text} hover:bg-white/5 transition-colors flex items-center gap-2`}
                  >
                    查看全部藏品
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-darker-navy/60 rounded-lg p-4 border border-card-border">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Layers className="w-4 h-4" />
                      <span className="font-retro text-xs">收藏总数</span>
                    </div>
                    <p className={`font-pixel text-lg ${colors.text}`}>
                      {totalCount}
                      <span className="text-xs ml-1 text-gray-500">张</span>
                    </p>
                  </div>
                  <div className="bg-darker-navy/60 rounded-lg p-4 border border-card-border">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-retro text-xs">总价值</span>
                    </div>
                    <p className="font-pixel text-lg text-neon-amber">{formatPrice(totalValue)}</p>
                  </div>
                  <div className="bg-darker-navy/60 rounded-lg p-4 border border-card-border">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Package className="w-4 h-4" />
                      <span className="font-retro text-xs">盒/说</span>
                    </div>
                    <p className="font-pixel text-lg text-white">
                      <span className="text-neon-green">{hasBoxCount}</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-neon-cyan">{hasManualCount}</span>
                    </p>
                  </div>
                  <div className="bg-darker-navy/60 rounded-lg p-4 border border-card-border">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Star className="w-4 h-4" />
                      <span className="font-retro text-xs">箱说全</span>
                    </div>
                    <p className="font-pixel text-lg text-neon-green">
                      {completeInBox}
                      <span className="text-xs ml-1 text-gray-500">张</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                <div className="lg:col-span-2">
                  <h3 className="font-pixel text-sm text-white mb-4 flex items-center gap-2">
                    <Star className={`w-4 h-4 ${colors.text}`} />
                    代表作
                    {representativeWorks.length > 0 && (
                      <span className="font-retro text-xs text-gray-500">按品相与价值排序</span>
                    )}
                  </h3>
                  {representativeWorks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {representativeWorks.map((cartridge) => (
                        <CartridgeCard
                          key={cartridge.id}
                          cartridge={cartridge}
                          showWishlistButton={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-darker-navy/40 rounded-lg border border-dashed border-card-border">
                      <div className="text-center">
                        <Gamepad2 className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                        <p className="font-retro text-gray-500">该平台暂无收藏</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-pixel text-sm text-white mb-4 flex items-center gap-2">
                    <Crown className={`w-4 h-4 ${colors.text}`} />
                    稀有度分布
                  </h3>
                  {totalCount > 0 ? (
                    <div className="space-y-3 bg-darker-navy/40 rounded-lg p-4 border border-card-border">
                      {rarityOrder.map((condition) => {
                        const count = rarityDistribution[condition];
                        const percent = (count / totalCount) * 100;
                        const Icon = getRarityIcon(condition);
                        return (
                          <div key={condition}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Icon className={`w-3.5 h-3.5 ${getConditionColor(condition)}`} />
                                <span className="font-retro text-xs text-gray-300">
                                  {getConditionLabel(condition)}
                                </span>
                              </div>
                              <span className={`font-pixel text-xs ${getConditionColor(condition)}`}>
                                {count}
                                <span className="text-gray-500 ml-1">({percent.toFixed(0)}%)</span>
                              </span>
                            </div>
                            <div className="h-2 bg-darker-navy rounded overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  count > 0
                                    ? condition === 'MINT'
                                      ? 'bg-gradient-to-r from-neon-green to-emerald-400'
                                      : condition === 'NEAR_MINT'
                                      ? 'bg-gradient-to-r from-neon-cyan to-sky-400'
                                      : condition === 'VERY_GOOD'
                                      ? 'bg-gradient-to-r from-neon-amber to-yellow-400'
                                      : condition === 'GOOD'
                                      ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                                      : condition === 'FAIR'
                                      ? 'bg-gradient-to-r from-orange-700 to-orange-500'
                                      : 'bg-gradient-to-r from-neon-red to-red-400'
                                    : 'bg-gray-700'
                                }`}
                                style={{ width: `${(count / maxRarity) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div className="pt-3 mt-3 border-t border-card-border">
                        <div className="flex items-center justify-between">
                          <span className="font-retro text-xs text-gray-500">总计</span>
                          <span className="font-pixel text-sm text-white">{totalCount} 张</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-darker-navy/40 rounded-lg border border-dashed border-card-border">
                      <div className="text-center">
                        <Crown className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                        <p className="font-retro text-gray-500">暂无数据</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformZones;
