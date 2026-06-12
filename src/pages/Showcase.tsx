import { useState, useEffect } from 'react';
import { useStore } from '../stores/useStore';
import CartridgeCard from '../components/CartridgeCard';
import PixelButton from '../components/PixelButton';
import { Share2, Copy, Check, Settings, Image } from 'lucide-react';

const Showcase = () => {
  const { cartridges, stats, fetchCartridges, fetchStats } = useStore();
  const [copied, setCopied] = useState(false);
  const [showcaseName, setShowcaseName] = useState('像素收藏家的游戏宝库');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCartridges();
    fetchStats();
  }, []);

  const featuredCartridges = cartridges.slice(0, 6);

  const handleCopyLink = () => {
    const link = `https://retrovault.app/showcase/user123`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statItems = stats
    ? [
        { label: '卡带总数', value: stats.totalCartridges, suffix: '张' },
        { label: '收藏价值', value: `¥${stats.totalValue.toLocaleString()}`, suffix: '' },
        { label: '覆盖平台', value: stats.totalPlatforms, suffix: '个' },
        { label: '游戏系列', value: stats.totalSeries, suffix: '个' },
      ]
    : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-cyan">我的展示页</h1>
          <p className="font-retro text-gray-400 text-lg">
            生成个性化收藏展示页，分享给同好
          </p>
        </div>
        <div className="flex gap-3">
          <PixelButton variant="primary" onClick={() => setIsEditing(!isEditing)}>
            <Settings className="w-4 h-4 inline mr-2" />
            {isEditing ? '完成编辑' : '编辑展示'}
          </PixelButton>
          <PixelButton variant="cyan" onClick={handleCopyLink}>
            {copied ? (
              <>
                <Check className="w-4 h-4 inline mr-2" />
                已复制
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 inline mr-2" />
                复制链接
              </>
            )}
          </PixelButton>
        </div>
      </div>

      <div className="card-pixel overflow-hidden rounded-lg">
        <div className="relative h-48 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan">
          <div className="absolute inset-0 bg-darker-navy/40" />
          <div className="absolute inset-0 scanlines" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card-bg to-transparent" />
        </div>

        <div className="px-8 pb-8 -mt-16 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink border-4 border-card-bg flex items-center justify-center shadow-neon-purple">
              <Image className="w-16 h-16 text-white" />
            </div>

            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={showcaseName}
                  onChange={(e) => setShowcaseName(e.target.value)}
                  className="font-pixel text-xl text-white bg-transparent border-b-2 border-neon-purple w-full max-w-md outline-none"
                />
              ) : (
                <h2 className="font-pixel text-xl text-white neon-glow-purple">
                  {showcaseName}
                </h2>
              )}
              <p className="font-retro text-gray-400 text-lg mt-1">
                中古游戏卡带收藏家 · 复古游戏爱好者
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {statItems.map((item, index) => (
              <div key={index} className="text-center p-4 bg-darker-navy/50 rounded-lg">
                <p className="font-pixel text-lg text-neon-cyan mb-1">
                  {item.value}
                  <span className="text-sm ml-1">{item.suffix}</span>
                </p>
                <p className="font-retro text-gray-400 text-sm">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-pixel text-sm text-neon-pink">精选藏品</h3>
              <span className="font-retro text-gray-500 text-sm">
                共 {cartridges.length} 张
              </span>
            </div>

            {featuredCartridges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {featuredCartridges.map((cartridge) => (
                  <CartridgeCard key={cartridge.id} cartridge={cartridge} />
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500 font-retro">
                暂无藏品，快去添加吧！
              </div>
            )}
          </div>

          <div className="mt-10">
            <h3 className="font-pixel text-sm text-neon-green mb-6">收藏统计</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-darker-navy/50 p-5 rounded-lg">
                <h4 className="font-retro text-gray-400 mb-4">平台分布</h4>
                <div className="space-y-2">
                  {['FC', 'SFC', 'GB'].map((platform, i) => {
                    const count = cartridges.filter((c) => c.platform === platform).length;
                    const percentage = cartridges.length > 0 ? (count / cartridges.length) * 100 : 0;
                    return (
                      <div key={platform}>
                        <div className="flex justify-between font-retro text-sm mb-1">
                          <span className="text-gray-300">{platform}</span>
                          <span className="text-gray-500">{count}张</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-darker-navy/50 p-5 rounded-lg">
                <h4 className="font-retro text-gray-400 mb-4">品相分布</h4>
                <div className="space-y-2">
                  {['MINT', 'NEAR_MINT', 'VERY_GOOD', 'GOOD'].map((condition) => {
                    const count = cartridges.filter((c) => c.condition === condition).length;
                    const percentage = cartridges.length > 0 ? (count / cartridges.length) * 100 : 0;
                    return (
                      <div key={condition}>
                        <div className="flex justify-between font-retro text-sm mb-1">
                          <span className="text-gray-300">
                            {condition === 'MINT'
                              ? '全新'
                              : condition === 'NEAR_MINT'
                              ? '近新'
                              : condition === 'VERY_GOOD'
                              ? '很好'
                              : '良好'}
                          </span>
                          <span className="text-gray-500">{count}张</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-darker-navy/30 rounded-lg border border-dashed border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-pixel text-sm text-neon-amber mb-2">分享你的收藏</h4>
                <p className="font-retro text-gray-400">
                  将你的收藏展示页分享给同好，一起交流收藏心得
                </p>
              </div>
              <div className="flex gap-2">
                <PixelButton variant="cyan" onClick={handleCopyLink}>
                  <Copy className="w-4 h-4 inline mr-2" />
                  复制链接
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
