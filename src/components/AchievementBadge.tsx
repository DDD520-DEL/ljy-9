import type { Achievement } from '../types';
import {
  Gamepad2,
  Library,
  Trophy,
  Sparkles,
  Monitor,
  Crown,
  Package,
  Gem,
  Clock,
  Banknote,
  Star,
  Repeat,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Gamepad2,
  Library,
  Trophy,
  Sparkles,
  Monitor,
  Crown,
  Package,
  Gem,
  Clock,
  Banknote,
  Star,
  Repeat,
};

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const AchievementBadge = ({ achievement, size = 'md', showProgress = true }: AchievementBadgeProps) => {
  const Icon = iconMap[achievement.icon] || Trophy;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const progress = (achievement.progress / achievement.progressMax) * 100;

  return (
    <div className={`card-pixel p-4 rounded-lg ${achievement.unlocked ? 'border-neon-purple/50' : 'opacity-60'}`}>
      <div className="flex flex-col items-center text-center">
        <div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center mb-3 ${
            achievement.unlocked
              ? 'bg-gradient-to-br from-neon-purple to-neon-pink shadow-neon-purple'
              : 'bg-gray-700'
          }`}
        >
          <Icon
            className={`${iconSizeClasses[size]} ${
              achievement.unlocked ? 'text-white' : 'text-gray-500'
            }`}
          />
        </div>

        <h4
          className={`font-pixel text-xs mb-1 ${
            achievement.unlocked ? 'text-neon-cyan neon-glow-cyan' : 'text-gray-400'
          }`}
        >
          {achievement.name}
        </h4>

        <p className="font-retro text-gray-400 text-sm mb-2">{achievement.description}</p>

        {showProgress && !achievement.unlocked && (
          <div className="w-full">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-1 font-retro">
              {achievement.progress} / {achievement.progressMax}
            </p>
          </div>
        )}

        {achievement.unlocked && achievement.unlockedAt && (
          <p className="text-xs text-neon-green font-retro mt-1">
            已解锁
          </p>
        )}
      </div>
    </div>
  );
};

export default AchievementBadge;
