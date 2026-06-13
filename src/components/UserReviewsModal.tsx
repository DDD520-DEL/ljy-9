import { Star, X } from 'lucide-react';
import { formatDate } from '../utils/format';
import type { Review, UserRating } from '../types';

interface UserReviewsModalProps {
  userName: string;
  rating: UserRating | undefined;
  reviews: Review[];
  onClose: () => void;
}

const UserReviewsModal = ({ userName, rating, reviews, onClose }: UserReviewsModalProps) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card-pixel p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-pixel text-lg text-neon-cyan">{userName} 的信用评价</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {rating && rating.totalReviews > 0 && (
          <div className="mb-6 p-4 bg-darker-navy/50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-retro text-gray-400 text-sm">平均评分</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-pixel text-3xl text-neon-green">
                    {rating.averageRating.toFixed(1)}
                  </span>
                  <Star className="w-6 h-6 text-neon-green fill-current" />
                </div>
              </div>
              <div className="text-right">
                <p className="font-retro text-gray-400 text-sm">累计评价</p>
                <p className="font-pixel text-2xl text-white mt-1">
                  {rating.totalReviews}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = rating.ratingDistribution[star as keyof typeof rating.ratingDistribution];
                const percentage = rating.totalReviews > 0 ? (count / rating.totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="font-retro text-sm text-gray-400 w-8">{star}星</span>
                    <div className="flex-1 h-2 bg-darker-navy rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neon-green transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="font-retro text-sm text-gray-400 w-12 text-right">
                      {count}条
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-4 bg-darker-navy/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
                      <span className="font-pixel text-xs text-white">
                        {review.fromUserName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-retro text-white text-sm">{review.fromUserName}</p>
                      <p className="font-retro text-gray-500 text-xs">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                {review.comment && (
                  <p className="font-retro text-gray-300 text-sm mt-2">{review.comment}</p>
                )}
                <p className="font-retro text-gray-500 text-xs mt-2">
                  交易物品：{review.cartridgeTitle}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="font-retro text-gray-500">暂无评价</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReviewsModal;
