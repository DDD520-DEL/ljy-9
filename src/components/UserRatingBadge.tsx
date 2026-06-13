import { Star } from 'lucide-react';
import type { UserRating } from '../types';

interface UserRatingBadgeProps {
  rating: UserRating | undefined;
  showCount?: boolean;
  size?: 'sm' | 'md';
}

const UserRatingBadge = ({ rating, showCount = true, size = 'md' }: UserRatingBadgeProps) => {
  if (!rating || rating.totalReviews === 0) {
    return (
      <div className="flex items-center gap-1">
        <Star className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-500`} />
        <span className={`font-retro ${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-500`}>
          暂无评价
        </span>
      </div>
    );
  }

  const getRatingColor = (avg: number) => {
    if (avg >= 4.5) return 'text-neon-green';
    if (avg >= 4.0) return 'text-neon-cyan';
    if (avg >= 3.0) return 'text-yellow-400';
    if (avg >= 2.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBgColor = (avg: number) => {
    if (avg >= 4.5) return 'bg-neon-green/20';
    if (avg >= 4.0) return 'bg-neon-cyan/20';
    if (avg >= 3.0) return 'bg-yellow-400/20';
    if (avg >= 2.0) return 'bg-orange-400/20';
    return 'bg-red-400/20';
  };

  const colorClass = getRatingColor(rating.averageRating);
  const bgClass = getBgColor(rating.averageRating);

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${bgClass}`}>
        <Star className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} ${colorClass} fill-current`} />
        <span className={`font-pixel ${size === 'sm' ? 'text-xs' : 'text-sm'} ${colorClass}`}>
          {rating.averageRating.toFixed(1)}
        </span>
      </div>
      {showCount && (
        <span className={`font-retro ${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-400`}>
          ({rating.totalReviews}条评价)
        </span>
      )}
    </div>
  );
};

export default UserRatingBadge;
