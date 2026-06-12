import { useState, useEffect } from 'react';
import { useStore } from '../stores/useStore';
import AchievementBadge from '../components/AchievementBadge';
import { Trophy, Award, Gem, Library, Star } from 'lucide-react';

const Achievements = () => {
  const { achievements, fetchAchievements } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const categories = [
    { id: 'all', label: '全部', icon: Trophy },
    { id: 'collection', label: '收藏成就', icon: Library },
    { id: 'series', label: '系列成就', icon: Star },
    { id: 'rare', label: '稀有成就', icon: Gem },
    { id: 'milestone', label: '里程碑', icon: Award },
  ];

  const filteredAchievements =
    activeCategory === 'all'
      ? achievements
      : achievements.filter((a) => a.category === activeCategory);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-pink">成就中心</h1>
        <p className="font-retro text-gray-400 text-lg">
          追踪你的收藏里程碑，解锁专属成就
        </p>
      </div>

      <div className="card-pixel p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-neon-purple">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-pixel text-3xl text-neon-amber">{unlockedCount}</span>
              <span className="font-retro text-gray-400 text-xl">/ {totalCount} 已解锁</span>
            </div>
            <div className="progress-bar h-4">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="font-retro text-gray-500 mt-2">
              完成度 {progress.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs border-2 transition-all ${
              activeCategory === category.id
                ? 'bg-neon-purple/20 border-neon-purple text-neon-purple'
                : 'border-card-border text-gray-400 hover:border-gray-600 hover:text-white'
            }`}
          >
            <category.icon className="w-4 h-4" />
            {category.label}
          </button>
        ))}
      </div>

      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAchievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} size="md" />
          ))}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="font-retro text-gray-500 text-xl">该分类暂无成就</p>
        </div>
      )}

      <div className="mt-12">
        <h2 className="font-pixel text-lg text-neon-cyan mb-6">即将解锁</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements
            .filter((a) => !a.unlocked && a.progress > 0)
            .slice(0, 3)
            .map((achievement) => {
              const progress = (achievement.progress / achievement.progressMax) * 100;
              const remaining = achievement.progressMax - achievement.progress;
              return (
                <div
                  key={achievement.id}
                  className="card-pixel p-5 rounded-lg border-dashed border-2 border-neon-purple/30"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-pixel text-xs text-gray-300">{achievement.name}</h3>
                      <p className="font-retro text-gray-500 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="font-retro text-gray-500 text-sm mt-2">
                    还差 {remaining} 个即可解锁
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
