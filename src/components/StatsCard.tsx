import { useStore } from '../stores/useStore';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice } from '../utils/format';

const StatsCard = () => {
  const { stats } = useStore();

  if (!stats || !stats.valueChange || !stats.achievementsProgress) return null;

  const totalCollectionValue = (stats.totalValue || 0) + (stats.totalAccessoryValue || 0);

  const statItems = [
    {
      label: '收藏总数',
      value: stats.totalCollectionCount || stats.totalCartridges + (stats.totalAccessories || 0),
      suffix: '件',
      subLabel: `卡带 ${stats.totalCartridges} + 配件 ${stats.totalAccessories || 0}`,
      color: 'text-neon-purple',
      bgColor: 'from-neon-purple/20 to-transparent',
    },
    {
      label: '卡带总数',
      value: stats.totalCartridges,
      suffix: '张',
      color: 'text-neon-cyan',
      bgColor: 'from-neon-cyan/20 to-transparent',
    },
    {
      label: '收藏总价值',
      value: formatPrice(totalCollectionValue),
      suffix: '',
      subLabel: `卡带 ${formatPrice(stats.totalValue)} + 配件 ${formatPrice(stats.totalAccessoryValue || 0)}`,
      color: 'text-neon-amber',
      bgColor: 'from-neon-amber/20 to-transparent',
    },
    {
      label: '配件数量',
      value: stats.totalAccessories || 0,
      suffix: '件',
      color: 'text-neon-pink',
      bgColor: 'from-neon-pink/20 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`card-pixel p-5 rounded-lg bg-gradient-to-b ${item.bgColor}`}
        >
          <p className="font-retro text-gray-400 text-lg mb-1">{item.label}</p>
          <p className={`font-pixel text-xl ${item.color}`}>
            {item.value}
            <span className="text-sm ml-1">{item.suffix}</span>
          </p>
          {item.subLabel && (
            <p className="font-retro text-[10px] text-gray-500 mt-1">
              {item.subLabel}
            </p>
          )}
        </div>
      ))}

      <div className="col-span-2 lg:col-span-4 card-pixel p-5 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-retro text-gray-400 text-lg">市值变化</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="font-retro text-gray-400">本周</span>
                {stats.valueChange.week >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-neon-green" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-neon-red" />
                )}
                <span
                  className={`font-pixel text-sm ${
                    stats.valueChange.week >= 0 ? 'text-neon-green' : 'text-neon-red'
                  }`}
                >
                  {stats.valueChange.week >= 0 ? '+' : ''}
                  {stats.valueChange.week}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-retro text-gray-400">本月</span>
                {stats.valueChange.month >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-neon-green" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-neon-red" />
                )}
                <span
                  className={`font-pixel text-sm ${
                    stats.valueChange.month >= 0 ? 'text-neon-green' : 'text-neon-red'
                  }`}
                >
                  {stats.valueChange.month >= 0 ? '+' : ''}
                  {stats.valueChange.month}%
                </span>
              </div>
            </div>
          </div>
          <div>
            <p className="font-retro text-gray-400 text-lg">成就进度</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="progress-bar w-32">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      (stats.achievementsProgress.unlocked /
                        stats.achievementsProgress.total) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span className="font-pixel text-sm text-neon-purple">
                {stats.achievementsProgress.unlocked}/
                {stats.achievementsProgress.total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
