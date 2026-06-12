import { useState, useEffect } from 'react';
import { useStore } from '../stores/useStore';
import PriceChart from '../components/PriceChart';
import { TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatPrice } from '../utils/format';

const Market = () => {
  const { cartridges, priceHistory, fetchCartridges, fetchPriceHistory } = useStore();
  const [selectedCartridge, setSelectedCartridge] = useState<string>('');

  useEffect(() => {
    fetchCartridges();
  }, []);

  useEffect(() => {
    if (selectedCartridge) {
      fetchPriceHistory(selectedCartridge);
    } else if (cartridges.length > 0) {
      setSelectedCartridge(cartridges[0].id);
      fetchPriceHistory(cartridges[0].id);
    }
  }, [selectedCartridge, cartridges]);

  const selectedCart = cartridges.find((c) => c.id === selectedCartridge);

  const platformStats = [
    { name: '雅虎拍卖', count: 128, avgChange: 5.2, color: 'text-neon-purple' },
    { name: 'Mercari', count: 256, avgChange: 3.8, color: 'text-neon-cyan' },
    { name: 'eBay', count: 89, avgChange: -1.5, color: 'text-neon-pink' },
    { name: '闲鱼', count: 312, avgChange: 8.1, color: 'text-neon-green' },
  ];

  const hotCartridges = cartridges.slice(0, 5).map((c, i) => ({
    ...c,
    priceChange: [8.5, 12.3, -2.1, 5.7, 15.2][i],
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-cyan">行情中心</h1>
        <p className="font-retro text-gray-400 text-lg">
          追踪各平台中古游戏卡带市场价格走势
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {platformStats.map((platform) => (
          <div key={platform.name} className="card-pixel p-4 rounded-lg">
            <h3 className="font-pixel text-xs text-gray-400 mb-2">{platform.name}</h3>
            <p className="font-pixel text-lg text-white mb-2">{platform.count}</p>
            <div className="flex items-center gap-1">
              {platform.avgChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-neon-green" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-neon-red" />
              )}
              <span
                className={`font-retro text-sm ${
                  platform.avgChange >= 0 ? 'text-neon-green' : 'text-neon-red'
                }`}
              >
                {platform.avgChange >= 0 ? '+' : ''}
                {platform.avgChange}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card-pixel p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-pixel text-sm text-neon-cyan flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              价格走势
            </h2>
            <select
              value={selectedCartridge}
              onChange={(e) => setSelectedCartridge(e.target.value)}
              className="font-retro text-sm w-64"
            >
              {cartridges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.platform})
                </option>
              ))}
            </select>
          </div>

          {selectedCart && (
            <div className="mb-4 flex items-end gap-4">
              <div>
                <p className="font-retro text-gray-400">当前均价</p>
                <p className="font-pixel text-2xl text-neon-amber">
                  {formatPrice(Math.round(selectedCart.purchasePrice * 1.2))}
                </p>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <ArrowUpRight className="w-5 h-5 text-neon-green" />
                <span className="font-pixel text-sm text-neon-green">+12.5%</span>
              </div>
            </div>
          )}

          {priceHistory.length > 0 ? (
            <PriceChart priceHistory={priceHistory} height={350} />
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500 font-retro">
              请选择一款游戏查看价格走势
            </div>
          )}
        </div>

        <div className="card-pixel p-6 rounded-lg">
          <h2 className="font-pixel text-sm text-neon-pink mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            热门涨幅榜
          </h2>
          <div className="space-y-3">
            {hotCartridges.map((cartridge, index) => (
              <div
                key={cartridge.id}
                className="flex items-center gap-3 p-3 bg-darker-navy/50 rounded hover:bg-darker-navy transition-colors cursor-pointer"
                onClick={() => setSelectedCartridge(cartridge.id)}
              >
                <span
                  className={`font-pixel text-xs w-6 h-6 flex items-center justify-center rounded ${
                    index === 0
                      ? 'bg-neon-amber/20 text-neon-amber'
                      : index === 1
                      ? 'bg-gray-400/20 text-gray-400'
                      : index === 2
                      ? 'bg-orange-600/20 text-orange-500'
                      : 'bg-gray-700/20 text-gray-500'
                  }`}
                >
                  {index + 1}
                </span>
                <img
                  src={cartridge.coverImage}
                  alt={cartridge.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-retro text-white text-sm truncate">{cartridge.title}</p>
                  <p className="font-retro text-gray-500 text-xs">{cartridge.platform}</p>
                </div>
                <div className="text-right">
                  <p className="font-pixel text-xs text-neon-amber">
                    {formatPrice(cartridge.purchasePrice)}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {cartridge.priceChange >= 0 ? (
                      <ArrowUpRight className="w-3 h-3 text-neon-green" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-neon-red" />
                    )}
                    <span
                      className={`font-retro text-xs ${
                        cartridge.priceChange >= 0 ? 'text-neon-green' : 'text-neon-red'
                      }`}
                    >
                      {cartridge.priceChange >= 0 ? '+' : ''}
                      {cartridge.priceChange}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-pixel p-6 rounded-lg">
        <h2 className="font-pixel text-sm text-neon-purple mb-4">多平台价格对比</h2>
        <div className="overflow-x-auto">
          <table className="w-full font-retro">
            <thead>
              <tr className="border-b-2 border-card-border">
                <th className="text-left py-3 px-4 text-gray-400 font-pixel text-xs">游戏</th>
                <th className="text-center py-3 px-4 text-gray-400 font-pixel text-xs">平台</th>
                <th className="text-right py-3 px-4 text-gray-400 font-pixel text-xs">雅虎拍卖</th>
                <th className="text-right py-3 px-4 text-gray-400 font-pixel text-xs">Mercari</th>
                <th className="text-right py-3 px-4 text-gray-400 font-pixel text-xs">eBay</th>
                <th className="text-right py-3 px-4 text-gray-400 font-pixel text-xs">闲鱼</th>
              </tr>
            </thead>
            <tbody>
              {cartridges.slice(0, 6).map((cartridge) => (
                <tr key={cartridge.id} className="border-b border-card-border/50 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cartridge.coverImage}
                        alt={cartridge.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="text-white">{cartridge.title}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-neon-purple">{cartridge.platform}</td>
                  <td className="text-right py-3 px-4 text-white">
                    {formatPrice(Math.round(cartridge.purchasePrice * 1.1))}
                  </td>
                  <td className="text-right py-3 px-4 text-white">
                    {formatPrice(Math.round(cartridge.purchasePrice * 1.05))}
                  </td>
                  <td className="text-right py-3 px-4 text-white">
                    {formatPrice(Math.round(cartridge.purchasePrice * 1.3))}
                  </td>
                  <td className="text-right py-3 px-4 text-white">
                    {formatPrice(Math.round(cartridge.purchasePrice * 0.95))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Market;
