import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import StatsCard from '../components/StatsCard';
import CartridgeCard from '../components/CartridgeCard';
import AccessoryCard from '../components/AccessoryCard';
import AchievementBadge from '../components/AchievementBadge';
import PriceChart from '../components/PriceChart';
import PriceAlertBanner from '../components/PriceAlertBanner';
import CollectionValueChart from '../components/CollectionValueChart';
import { Plus, ArrowRight, TrendingUp, Award, FileText, Download, Loader2, BarChart3, Gift, ChevronRight, Package } from 'lucide-react';
import { generateReportData } from '../utils/report';
import { exportReportPDF } from '../utils/pdfExport';

const Dashboard = () => {
  const {
    stats,
    achievements,
    priceHistory,
    cartridges,
    fetchCartridges,
    fetchStats,
    fetchAchievements,
    fetchPriceHistory,
  } = useStore();

  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const priceFetchedRef = useRef(false);

  const anniversaryList = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return cartridges
      .filter((c) => {
        if (!c.purchaseDate) return false;
        const d = new Date(c.purchaseDate);
        return d.getMonth() === currentMonth && d.getFullYear() < currentYear;
      })
      .map((c) => {
        const d = new Date(c.purchaseDate);
        const years = currentYear - d.getFullYear();
        return { cartridge: c, years };
      })
      .sort((a, b) => a.years - b.years);
  }, [cartridges]);

  const handleExportReport = async () => {
    if (isExporting || cartridges.length === 0) return;
    
    setIsExporting(true);
    try {
      const reportData = generateReportData(cartridges);
      await exportReportPDF(reportData);
    } catch (error) {
      console.error('导出报告失败:', error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchCartridges();
    fetchStats();
    fetchAchievements();
  }, []);

  useEffect(() => {
    if (!priceFetchedRef.current && cartridges.length > 0) {
      priceFetchedRef.current = true;
      fetchPriceHistory(cartridges[0].id);
    }
  }, [cartridges]);

  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  const safeCartridges = Array.isArray(cartridges) ? cartridges : [];

  const recentAdditionsList = stats?.recentAdditions || [];
  const latestAchievements = safeAchievements.filter((a) => a.unlocked).slice(0, 4);
  const sampleCartridge = safeCartridges[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <PriceAlertBanner />

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-purple">
            欢迎回来，收藏家！
          </h1>
          <p className="font-retro text-gray-400 text-lg">
            管理你的中古游戏卡带收藏，追踪市场行情
          </p>
        </div>
        <button
          onClick={handleExportReport}
          disabled={isExporting || cartridges.length === 0}
          className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <Download className="w-4 h-4" />
              导出估值报告
            </>
          )}
        </button>
      </div>

      <div className="mb-8">
        <StatsCard />
      </div>

      {anniversaryList.length > 0 && (
        <div className="card-pixel p-6 rounded-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-pixel text-sm text-neon-amber flex items-center gap-2">
              <Gift className="w-5 h-5" />
              本月购入周年纪念
            </h2>
            <span className="font-retro text-gray-500 text-xs">
              {anniversaryList.length} 个纪念
            </span>
          </div>
          <div className="space-y-2">
            {anniversaryList.map(({ cartridge, years }) => (
              <button
                key={cartridge.id}
                onClick={() => navigate(`/collection/${cartridge.id}`)}
                className="w-full flex items-center gap-4 p-3 rounded-lg bg-card-bg/50 hover:bg-card-bg transition-colors group text-left"
              >
                {cartridge.coverImage ? (
                  <img
                    src={cartridge.coverImage}
                    alt={cartridge.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-card-border flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-retro text-white text-sm truncate group-hover:text-neon-cyan transition-colors">
                    {cartridge.title}
                  </p>
                  <p className="font-retro text-gray-500 text-xs">
                    {cartridge.platform} · 购入于 {new Date(cartridge.purchaseDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`font-pixel text-xs px-2 py-1 rounded ${
                    years >= 10 ? 'text-neon-amber bg-neon-amber/10' :
                    years >= 5 ? 'text-neon-pink bg-neon-pink/10' :
                    'text-neon-cyan bg-neon-cyan/10'
                  }`}>
                    {years}周年
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-neon-cyan transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card-pixel p-6 rounded-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-pixel text-sm text-neon-amber flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            收藏价值月度追踪
          </h2>
          <span className="font-retro text-gray-500 text-xs">近6个月</span>
        </div>
        <CollectionValueChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card-pixel p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-pixel text-sm text-neon-cyan flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              市场行情概览
            </h2>
            <Link
              to="/market"
              className="font-retro text-neon-purple hover:text-neon-cyan transition-colors text-sm flex items-center gap-1"
            >
              查看详情
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {sampleCartridge && priceHistory.length > 0 ? (
            <>
              <p className="font-retro text-gray-400 mb-2">
                {sampleCartridge.title} - 近12个月价格走势
              </p>
              <PriceChart priceHistory={priceHistory} height={250} />
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 font-retro">
              暂无价格数据
            </div>
          )}
        </div>

        <div className="card-pixel p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-pixel text-sm text-neon-pink flex items-center gap-2">
              <Award className="w-5 h-5" />
              最近成就
            </h2>
            <Link
              to="/achievements"
              className="font-retro text-neon-purple hover:text-neon-cyan transition-colors text-sm flex items-center gap-1"
            >
              全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {latestAchievements.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {latestAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  size="sm"
                  showProgress={false}
                />
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500 font-retro">
              暂无解锁成就
            </div>
          )}
        </div>
      </div>

      <div className="card-pixel p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-pixel text-sm text-neon-green">最近添加</h2>
          <Link
            to="/collection/add"
            className="pixel-btn pixel-btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加卡带
          </Link>
        </div>
        {recentAdditionsList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentAdditionsList.map((cartridge) => (
              <CartridgeCard key={cartridge.id} cartridge={cartridge} />
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500 font-retro">
            暂无收藏，快去添加你的第一张卡带吧！
          </div>
        )}
      </div>

      <div className="card-pixel p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-pixel text-sm text-neon-pink flex items-center gap-2">
            <Package className="w-4 h-4" />
            最近添加配件
          </h2>
          <Link
            to="/accessories/add"
            className="pixel-btn pixel-btn-primary text-xs flex items-center gap-2"
            style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}
          >
            <Plus className="w-4 h-4" />
            添加配件
          </Link>
        </div>
        {(stats?.recentAccessories?.length || 0) > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats!.recentAccessories!.map((accessory) => (
              <AccessoryCard key={accessory.id} accessory={accessory} />
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500 font-retro">
            暂无配件收藏
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
