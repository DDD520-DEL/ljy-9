import { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import PixelButton from './PixelButton';
import type { Exchange } from '../types';

interface ReviewModalProps {
  exchange: Exchange;
  currentUserId: string;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
  isLoading?: boolean;
}

const ReviewModal = ({ exchange, currentUserId, onClose, onSubmit, isLoading }: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const isInitiator = exchange.initiatorUserId === currentUserId;
  const targetUser = isInitiator ? exchange.targetUserName : exchange.initiatorUserName;
  const targetUserId = isInitiator ? exchange.targetUserId : exchange.initiatorUserId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;
    onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card-pixel p-6 rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-pixel text-lg text-neon-cyan">评价交易</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-darker-navy/50 rounded-lg">
          <p className="font-retro text-gray-400 text-sm mb-2">交易物品</p>
          <p className="font-pixel text-white text-sm">{exchange.cartridgeTitle}</p>
          <p className="font-retro text-gray-500 text-xs mt-1">
            与 <span className="text-neon-purple">{targetUser}</span> 的交易
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-pixel text-xs text-neon-purple mb-3">
              评分 *
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center font-retro text-sm mt-2">
              {rating === 1 && <span className="text-red-400">很差</span>}
              {rating === 2 && <span className="text-orange-400">较差</span>}
              {rating === 3 && <span className="text-yellow-400">一般</span>}
              {rating === 4 && <span className="text-neon-cyan">满意</span>}
              {rating === 5 && <span className="text-neon-green">非常满意</span>}
            </p>
          </div>

          <div>
            <label className="block font-pixel text-xs text-neon-purple mb-2">
              评价内容
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={200}
              placeholder="分享一下这次交易的体验..."
              className="w-full"
            />
            <p className="text-right font-retro text-xs text-gray-500 mt-1">
              {comment.length}/200
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <PixelButton
              type="button"
              variant="primary"
              onClick={onClose}
              disabled={isLoading}
            >
              取消
            </PixelButton>
            <PixelButton
              type="submit"
              variant="cyan"
              disabled={rating < 1 || isLoading}
            >
              <Send className="w-4 h-4 inline mr-2" />
              {isLoading ? '提交中...' : '提交评价'}
            </PixelButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
