import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../stores/useStore';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { formatPrice } from '../utils/format';
import {
  getAvailableYears,
  getYearCartridges,
  getMonthlyTrend,
  getCumulativeTrend,
  getTopExpensive,
  getPlatformDistribution,
  getYearStats,
  navigateYear,
  canNavigateYear,
} from '../utils/yearlyReview';
import {
  Calendar,
  Trophy,
  TrendingUp,
  PieChart as PieChartIcon,
  Crown,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  DollarSign,
  Package,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

const PLATFORM_COLORS = [
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#6366f1',
  '#14b8a6',
  '#f97316',
  '#84cc16',
  '#a855f7',
  '#0ea5e9',
];

const YearlyReview = () => {
  const { cartridges, fetchCartridges } = useStore();

  const availableYears = useMemo(() => {
    const purchaseDates = cartridges.map((c) => c.purchaseDate);
    const createdAtDates = cartridges.map((c) => c.createdAt);
    return getAvailableYears(purchaseDates, createdAtDates, true);
  }, [cartridges]);

  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears.length > 0 ? availableYears[0] : new Date().getFullYear()
  );

  useEffect(() => {
    fetchCartridges();
  }, []);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  const yearCartridges = useMemo(() => {
    return getYearCartridges(cartridges, selectedYear);
  }, [cartridges, selectedYear]);

  const monthlyTrend = useMemo(() => {
    return getMonthlyTrend(yearCartridges, selectedYear);
  }, [yearCartridges, selectedYear]);

  const cumulativeTrend = useMemo(() => {
    return getCumulativeTrend(monthlyTrend);
  }, [monthlyTrend]);

  const top5Expensive = useMemo(() => {
    return getTopExpensive(yearCartridges, 5);
  }, [yearCartridges]);

  const platformDistribution = useMemo(() => {
    return getPlatformDistribution(yearCartridges);
  }, [yearCartridges]);

  const yearStats = useMemo(() => {
    return getYearStats(yearCartridges);
  }, [yearCartridges]);

  const canGoPrev = canNavigateYear(availableYears, selectedYear, -1);
  const canGoNext = canNavigateYear(availableYears, selectedYear, 1);

  const handleNavigateYear = (direction: -1 | 1) => {
    const newYear = navigateYear(availableYears, selectedYear, direction);
    if (newYear !== null) {
      setSelectedYear(newYear);
    }
  };

  const LineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-darker-navy border-2 border-neon-purple/50 p-3 rounded">
          <p className="font-retro text-gray-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 font-retro"
            >
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="text-white">
                {entry.name === '累计支出'
                  ? formatPrice(entry.value)
                  : `${entry.value} 张`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-darker-navy border-2 border-neon-amber/50 p-3 rounded">
          <p className="font-retro text-gray-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 font-retro"
            >
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="text-white">{entry.value} 张</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = platformDistribution.reduce((s, d) => s + d.value, 0);
      const percent = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-darker-navy border-2 border-neon-cyan/50 p-3 rounded">
          <p className="font-retro text-white mb-1">{data.name}</p>
          <p className="font-retro text-neon-cyan">
            {data.value} 张 ({percent}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const getNavButtonClass = (enabled: boolean) => {
    const base =
      'w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all duration-200';
    if (enabled) {
      return `${base} bg-card-bg border-card-border text-gray-400 hover:text-white hover:border-neon-purple hover:bg-neon-purple/10 cursor-pointer`;
    }
    return `${base} bg-darker-navy border-card-border/50 text-gray-700 cursor-not-allowed opacity-50 grayscale`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="font-retro text-gray-400 hover:text-neon-cyan transition-colors text-sm flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回仪表盘
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-purple flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-neon-amber" />
              年度收藏回顾
            </h1>
            <p className="font-retro text-gray-400 text-lg">
              按自然年汇总你的收藏旅程，记录每一年的收获
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigateYear(1)}
              disabled={!canGoNext}
              aria-disabled={!canGoNext}
              aria-label="下一年"
              title={canGoNext ? '前往下一年' : '已经是最新年份'}
              className={getNavButtonClass(canGoNext)}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-5 py-3 card-pixel rounded-lg border-neon-purple/50">
              <Calendar className="w-5 h-5 text-neon-purple" />
              <span className="font-pixel text-xl text-neon-purple neon-glow-purple">
                {selectedYear}
              </span>
            </div>

            <button
              onClick={() => handleNavigateYear(-1)}
              disabled={!canGoPrev}
              aria-disabled={!canGoPrev}
              aria-label="上一年"
              title={canGoPrev ? '前往上一年' : '已经是最早年份'}
              className={getNavButtonClass(canGoPrev)}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card-pixel p-5 rounded-lg bg-gradient-to-b from-neon-purple/20 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-neon-purple" />
            <p className="font-retro text-gray-400 text-lg">年度新增</p>
          </div>
          <p className="font-pixel text-2xl text-neon-purple">
            {yearStats.totalCount}
            <span className="text-sm ml-1">张</span>
          </p>
        </div>

        <div className="card-pixel p-5 rounded-lg bg-gradient-to-b from-neon-amber/20 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-neon-amber" />
            <p className="font-retro text-gray-400 text-lg">年度支出</p>
          </div>
          <p className="font-pixel text-2xl text-neon-amber">
            {formatPrice(yearStats.totalSpent)}
          </p>
        </div>

        <div className="card-pixel p-5 rounded-lg bg-gradient-to-b from-neon-cyan/20 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-neon-cyan" />
            <p className="font-retro text-gray-400 text-lg">均价</p>
          </div>
          <p className="font-pixel text-2xl text-neon-cyan">
            {formatPrice(Math.round(yearStats.avgPrice))}
          </p>
        </div>

        <div className="card-pixel p-5 rounded-lg bg-gradient-to-b from-neon-green/20 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <Gamepad2 className="w-5 h-5 text-neon-green" />
            <p className="font-retro text-gray-400 text-lg">平台数</p>
          </div>
          <p className="font-pixel text-2xl text-neon-green">
            {yearStats.uniquePlatforms}
            <span className="text-sm ml-1">个</span>
          </p>
        </div>

        <div className="card-pixel p-5 rounded-lg bg-gradient-to-b from-neon-pink/20 to-transparent col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-neon-pink" />
            <p className="font-retro text-gray-400 text-lg">系列数</p>
          </div>
          <p className="font-pixel text-2xl text-neon-pink">
            {yearStats.uniqueSeries}
            <span className="text-sm ml-1">个</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card-pixel p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-neon-cyan" />
            <h2 className="font-pixel text-sm text-neon-cyan">
              新增数量趋势曲线
            </h2>
          </div>
          {yearStats.totalCount > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    tick={{
                      fill: '#9ca3af',
                      fontSize: 14,
                      fontFamily: 'VT323',
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#6b7280"
                    tick={{
                      fill: '#9ca3af',
                      fontSize: 14,
                      fontFamily: 'VT323',
                    }}
                    label={{
                      value: '数量(张)',
                      angle: -90,
                      position: 'insideLeft',
                      style: {
                        fill: '#9ca3af',
                        fontFamily: 'VT323',
                        fontSize: 14,
                      },
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#6b7280"
                    tick={{
                      fill: '#9ca3af',
                      fontSize: 14,
                      fontFamily: 'VT323',
                    }}
                    tickFormatter={(v) => `¥${v}`}
                    label={{
                      value: '支出(元)',
                      angle: 90,
                      position: 'insideRight',
                      style: {
                        fill: '#9ca3af',
                        fontFamily: 'VT323',
                        fontSize: 14,
                      },
                    }}
                  />
                  <Tooltip content={<LineTooltip />} />
                  <Legend
                    wrapperStyle={{
                      fontFamily: 'VT323',
                      fontSize: '16px',
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="新增数量"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', r: 4 }}
                    activeDot={{
                      r: 7,
                      stroke: '#fff',
                      strokeWidth: 2,
                      fill: '#06b6d4',
                    }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="累计支出"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 4 }}
                    activeDot={{
                      r: 7,
                      stroke: '#fff',
                      strokeWidth: 2,
                      fill: '#f59e0b',
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-gray-500 font-retro gap-3">
              <TrendingUp className="w-12 h-12 text-gray-600" />
              <p>该年度暂无收藏数据</p>
            </div>
          )}
        </div>

        <div className="card-pixel p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-neon-pink" />
            <h2 className="font-pixel text-sm text-neon-pink">平台发布占比</h2>
          </div>
          {platformDistribution.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformDistribution}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    outerRadius={90}
                    innerRadius={45}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#0a0e1a"
                    strokeWidth={2}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {platformDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-gray-500 font-retro gap-3">
              <PieChartIcon className="w-12 h-12 text-gray-600" />
              <p>该年度暂无收藏数据</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card-pixel p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-neon-amber" />
              <h2 className="font-pixel text-sm text-neon-amber">
                年度最贵购入 TOP 5
              </h2>
            </div>
            {top5Expensive.length > 0 && (
              <Link
                to="/collection"
                className="font-retro text-neon-purple hover:text-neon-cyan transition-colors text-sm"
              >
                查看全部 →
              </Link>
            )}
          </div>

          {top5Expensive.length > 0 ? (
            <div className="space-y-3">
              {top5Expensive.map((cartridge: any, index: number) => (
                <Link
                  key={cartridge.id}
                  to={`/collection/${cartridge.id}`}
                  className="card-pixel p-4 rounded-lg flex items-center gap-4 group hover:border-neon-amber/50 transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-pixel text-lg shrink-0 ${
                      index === 0
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white'
                        : index === 1
                        ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                        : index === 2
                        ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                        : 'bg-card-border text-gray-300'
                    }`}
                  >
                    #{index + 1}
                  </div>

                  <img
                    src={cartridge.coverImage}
                    alt={cartridge.title}
                    className="w-16 h-16 object-cover rounded shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-pixel text-sm text-white group-hover:text-neon-cyan transition-colors truncate">
                      {cartridge.title}
                    </h3>
                    <p className="font-retro text-gray-400 text-sm">
                      {cartridge.platform} · {cartridge.series} ·{' '}
                      {cartridge.releaseYear}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-pixel text-xl text-neon-amber neon-glow-amber">
                      {formatPrice(cartridge.purchasePrice)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 font-retro gap-3">
              <Crown className="w-12 h-12 text-gray-600" />
              <p>该年度暂无收藏数据</p>
              <Link
                to="/collection/add"
                className="pixel-btn pixel-btn-primary text-xs mt-2"
              >
                添加卡带
              </Link>
            </div>
          )}
        </div>

        <div className="card-pixel p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-neon-green" />
            <h2 className="font-pixel text-sm text-neon-green">累计增长趋势</h2>
          </div>
          {yearStats.totalCount > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cumulativeTrend}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    tick={{
                      fill: '#9ca3af',
                      fontSize: 14,
                      fontFamily: 'VT323',
                    }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{
                      fill: '#9ca3af',
                      fontSize: 14,
                      fontFamily: 'VT323',
                    }}
                    label={{
                      value: '累计(张)',
                      angle: -90,
                      position: 'insideLeft',
                      style: {
                        fill: '#9ca3af',
                        fontFamily: 'VT323',
                        fontSize: 14,
                      },
                    }}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Bar
                    dataKey="累计数量"
                    fill="#10b981"
                    stroke="#059669"
                    strokeWidth={1}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-gray-500 font-retro gap-3">
              <TrendingUp className="w-12 h-12 text-gray-600" />
              <p>该年度暂无收藏数据</p>
            </div>
          )}
        </div>
      </div>

      {availableYears.length > 1 && (
        <div className="card-pixel p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-neon-purple" />
            <h2 className="font-pixel text-sm text-neon-purple">历史年份</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {availableYears.map((year) => {
              const yearCount = getYearCartridges(cartridges, year).length;
              const isActive = year === selectedYear;
              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-5 py-3 rounded-lg font-pixel text-sm transition-all border-2 ${
                    isActive
                      ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-neon-purple'
                      : 'bg-card-bg border-card-border text-gray-400 hover:text-white hover:border-neon-purple/50 hover:bg-neon-purple/5'
                  }`}
                >
                  <span>{year}</span>
                  <span className="ml-2 text-xs opacity-70">({yearCount}张)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearlyReview;
