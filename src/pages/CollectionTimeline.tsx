import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import { ChevronDown, ChevronRight, Calendar, Tag, Library, Loader2, Grid } from 'lucide-react';
import { formatDate, formatPrice } from '../utils/format';
import type { Cartridge } from '../types';

interface YearGroup {
  year: number;
  cartridges: Cartridge[];
  totalValue: number;
}

const CollectionTimeline = () => {
  const { cartridges, isLoading, fetchCartridges } = useStore();
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  const yearGroups = useMemo(() => {
    const groups = new Map<number, Cartridge[]>();

    cartridges.forEach((cartridge) => {
      if (cartridge.purchaseDate) {
        const year = new Date(cartridge.purchaseDate).getFullYear();
        if (!groups.has(year)) {
          groups.set(year, []);
        }
        groups.get(year)!.push(cartridge);
      }
    });

    const sortedYears = Array.from(groups.keys()).sort((a, b) => b - a);

    return sortedYears.map((year) => {
      const yearCartridges = groups
        .get(year)!
        .sort(
          (a, b) =>
            new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
        );

      const totalValue = yearCartridges.reduce(
        (sum, c) => sum + (c.purchasePrice || 0),
        0
      );

      return {
        year,
        cartridges: yearCartridges,
        totalValue,
      };
    });
  }, [cartridges]);

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedYears(new Set(yearGroups.map((g) => g.year)));
  };

  const collapseAll = () => {
    setExpandedYears(new Set());
  };

  const totalAllValue = useMemo(() => {
    return cartridges.reduce((sum, c) => sum + (c.purchasePrice || 0), 0);
  }, [cartridges]);

  const getYearColor = (year: number) => {
    const currentYear = new Date().getFullYear();
    const diff = currentYear - year;
    if (diff === 0) return 'text-neon-green';
    if (diff === 1) return 'text-neon-cyan';
    if (diff <= 3) return 'text-neon-purple';
    if (diff <= 5) return 'text-neon-pink';
    return 'text-neon-amber';
  };

  const getYearBgColor = (year: number) => {
    const currentYear = new Date().getFullYear();
    const diff = currentYear - year;
    if (diff === 0) return 'bg-neon-green/10 border-neon-green/30';
    if (diff === 1) return 'bg-neon-cyan/10 border-neon-cyan/30';
    if (diff <= 3) return 'bg-neon-purple/10 border-neon-purple/30';
    if (diff <= 5) return 'bg-neon-pink/10 border-neon-pink/30';
    return 'bg-neon-amber/10 border-neon-amber/30';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-cyan">
            收藏时间轴
          </h1>
          <p className="font-retro text-gray-400 text-lg">
            共 {cartridges.length} 张卡带 · 总投入 {formatPrice(totalAllValue)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/collection"
            className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            返回藏品库
          </Link>
          <button
            onClick={expandAll}
            className="pixel-btn pixel-btn-primary text-xs"
          >
            展开全部
          </button>
          <button
            onClick={collapseAll}
            className="pixel-btn pixel-btn-primary text-xs"
          >
            折叠全部
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
        </div>
      ) : yearGroups.length > 0 ? (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink rounded-full" />

          {yearGroups.map((group, groupIndex) => {
            const isExpanded = expandedYears.has(group.year);
            return (
              <div key={group.year} className="relative mb-8">
                <div className="flex items-start gap-6">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 ${getYearBgColor(
                      group.year
                    )}`}
                  >
                    <Calendar
                      className={`w-7 h-7 ${getYearColor(group.year)}`}
                    />
                  </div>

                  <div className="flex-1">
                    <button
                      onClick={() => toggleYear(group.year)}
                      className={`w-full card-pixel p-4 rounded-lg border-2 transition-all hover:scale-[1.01] ${getYearBgColor(
                        group.year
                      )}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span
                            className={`font-pixel text-2xl ${getYearColor(
                              group.year
                            )}`}
                          >
                            {group.year}
                          </span>
                          <span className="font-retro text-gray-400">
                            {group.cartridges.length} 张卡带
                          </span>
                          <span className="font-retro text-neon-amber">
                            投入 {formatPrice(group.totalValue)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown
                              className={`w-5 h-5 ${getYearColor(group.year)}`}
                            />
                          ) : (
                            <ChevronRight
                              className={`w-5 h-5 ${getYearColor(group.year)}`}
                            />
                          )}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-4 pl-8">
                        {group.cartridges.map((cartridge, index) => {
                          const purchaseDate = new Date(
                            cartridge.purchaseDate
                          );
                          const month = purchaseDate.getMonth() + 1;
                          const day = purchaseDate.getDate();

                          return (
                            <div
                              key={cartridge.id}
                              className="relative"
                            >
                              <div className="absolute -left-10 top-8 w-8 h-0.5 bg-card-border" />
                              <div className="absolute -left-12 top-5 w-4 h-4 rounded-full bg-darker-navy border-2 border-neon-purple flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-neon-purple" />
                              </div>

                              <Link
                                to={`/collection/${cartridge.id}`}
                                className="block card-pixel p-4 rounded-lg hover:border-neon-purple/50 transition-all group"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-card-border">
                                    <img
                                      src={cartridge.coverImage}
                                      alt={cartridge.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                      <span className="font-pixel text-xs text-neon-purple">
                                        {month}月{day}日
                                      </span>
                                      <span className="px-2 py-0.5 bg-neon-purple/20 text-neon-purple font-pixel text-[10px] rounded">
                                        {cartridge.platform}
                                      </span>
                                      <span className="font-retro text-gray-500 text-sm">
                                        {cartridge.series}
                                      </span>
                                    </div>
                                    <h3 className="font-pixel text-sm text-white mb-2 group-hover:text-neon-cyan transition-colors">
                                      {cartridge.title}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-1">
                                        <Tag className="w-4 h-4 text-neon-amber" />
                                        <span className="font-pixel text-sm text-neon-amber">
                                          {formatPrice(
                                            cartridge.purchasePrice
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="font-retro text-sm text-gray-500">
                                          {formatDate(
                                            cartridge.purchaseDate
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-shrink-0 text-right">
                                    <div className="font-retro text-xs text-gray-500 mb-1">
                                      第 {index + 1} 张 / {group.year}
                                    </div>
                                    <div className="font-retro text-xs text-gray-600">
                                      {cartridge.releaseYear}年发行
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Library className="w-16 h-16 text-gray-600" />
          <p className="font-retro text-gray-500 text-xl">暂无卡带收藏</p>
          <Link
            to="/collection/add"
            className="pixel-btn pixel-btn-primary text-xs"
          >
            添加第一张卡带
          </Link>
        </div>
      )}
    </div>
  );
};

export default CollectionTimeline;
