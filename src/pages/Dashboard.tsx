import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import StatsCard from '../components/StatsCard';
import CartridgeCard from '../components/CartridgeCard';
import AchievementBadge from '../components/AchievementBadge';
import PriceChart from '../components/PriceChart';
import { Plus, ArrowRight, TrendingUp, Award } from 'lucide-react';

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

  useEffect(() => {
    fetchCartridges();
    fetchStats();
    fetchAchievements();
    if (cartridges.length > 0) {
      fetchPriceHistory(cartridges[0].id);
    }
  }, []);

  const recentAdditionsList = stats?.recentAdditions || [];
  const latestAchievements = achievements.filter((a) => a.unlocked).slice(0, 4);
  const sampleCartridge = cartridges[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-purple">
          欢迎回来，收藏家！
        </h1>
        <p className="font-retro text-gray-400 text-lg">
          管理你的中古游戏卡带收藏，追踪市场行情
        </p>
      </div>

      <div className="mb-8">
        <StatsCard />
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
