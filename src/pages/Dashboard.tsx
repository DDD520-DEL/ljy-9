import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import StatsCard from '../components/StatsCard';
import CartridgeCard from '../components/CartridgeCard';
import AchievementBadge from '../components/AchievementBadge';
import PriceChart from '../components/PriceChart';
import PriceAlertBanner from '../components/PriceAlertBanner';
import CollectionValueChart from '../components/CollectionValueChart';
import { Plus, ArrowRight, TrendingUp, Award, FileText, Download, Loader2, BarChart3 } from 'lucide-react';
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

  const [isExporting, setIsExporting] = useState(false);
  const priceFetchedRef = useRef(false);

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
    </div>
  );
};

export default Dashboard;
