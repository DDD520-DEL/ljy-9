import { useState, useEffect } from 'react';
import { useStore } from '../stores/useStore';
import PixelButton from '../components/PixelButton';
import UserRatingBadge from '../components/UserRatingBadge';
import ReviewModal from '../components/ReviewModal';
import UserReviewsModal from '../components/UserReviewsModal';
import {
  Repeat,
  ArrowRightLeft,
  Plus,
  Filter,
  ThumbsUp,
  User,
  X,
  Send,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  History,
  MessageSquare,
} from 'lucide-react';
import { formatDate, getConditionLabel } from '../utils/format';
import type { Exchange, Review as ReviewType } from '../types';

const Exchange = () => {
  const {
    currentUser,
    exchangeRequests,
    matches,
    userRatings,
    reviews,
    exchanges,
    pendingReviews,
    fetchExchangeRequests,
    fetchMatches,
    addExchangeRequest,
    fetchUnreadCount,
    fetchNotifications,
    fetchAllUserRatings,
    fetchReviews,
    addReview,
    fetchExchanges,
    fetchPendingReviews,
    completeExchange,
    createExchange,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'want' | 'have' | 'matches' | 'my-exchanges'>('all');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: 'WANT' as 'WANT' | 'HAVE',
    cartridgeTitle: '',
    platform: '',
    condition: 'VERY_GOOD',
    description: '',
  });

  useEffect(() => {
    fetchExchangeRequests();
    fetchMatches();
    fetchAllUserRatings();
    fetchExchanges();
    fetchPendingReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addExchangeRequest(newRequest);
    await fetchUnreadCount();
    await fetchNotifications();
    setShowNewRequest(false);
    setNewRequest({
      type: 'WANT',
      cartridgeTitle: '',
      platform: '',
      condition: 'VERY_GOOD',
      description: '',
    });
  };

  const handleStartExchange = async (match: any) => {
    const matchRequest = exchangeRequests.find((r) => r.id === match.matchRequestId);
    if (!matchRequest) return;

    const newExchange = await createExchange({
      requestId: match.requestId,
      matchRequestId: match.matchRequestId,
      targetUserId: match.matchUserId,
      targetUserName: match.matchUserName,
      cartridgeTitle: matchRequest.cartridgeTitle,
      platform: matchRequest.platform,
    });

    if (newExchange) {
      setActiveTab('my-exchanges');
    }
  };

  const handleCompleteExchange = async (exchangeId: string) => {
    try {
      await completeExchange(exchangeId);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleOpenReview = (exchange: Exchange) => {
    setSelectedExchange(exchange);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (data: { rating: number; comment: string }) => {
    if (!selectedExchange) return;

    setIsSubmittingReview(true);
    try {
      const isInitiator = selectedExchange.initiatorUserId === currentUser.id;
      const targetUserId = isInitiator ? selectedExchange.targetUserId : selectedExchange.initiatorUserId;
      const targetUserName = isInitiator ? selectedExchange.targetUserName : selectedExchange.initiatorUserName;

      await addReview({
        exchangeId: selectedExchange.id,
        toUserId: targetUserId,
        toUserName: targetUserName,
        rating: data.rating,
        comment: data.comment,
        cartridgeTitle: selectedExchange.cartridgeTitle,
      });

      setShowReviewModal(false);
      setSelectedExchange(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleViewUserReviews = async (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    await fetchReviews(userId);
    setShowReviewsModal(true);
  };

  const getUserRating = (userId: string) => {
    return userRatings.find((r) => r.userId === userId);
  };

  const getSelectedUserReviews = (): ReviewType[] => {
    if (!selectedUserId) return [];
    return reviews.filter((r) => r.toUserId === selectedUserId);
  };

  const filteredRequests = exchangeRequests.filter((req) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'want') return req.type === 'WANT';
    if (activeTab === 'have') return req.type === 'HAVE';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 font-pixel text-xs rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            进行中
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 bg-neon-green/20 text-neon-green font-pixel text-xs rounded flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            已完成
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2 py-0.5 bg-red-400/20 text-red-400 font-pixel text-xs rounded flex items-center gap-1">
            <X className="w-3 h-3" />
            已取消
          </span>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'all', label: '全部', icon: Filter },
    { id: 'want', label: '求购', icon: ArrowRightLeft },
    { id: 'have', label: '出让', icon: Repeat },
    { id: 'matches', label: '匹配', icon: ThumbsUp },
    { id: 'my-exchanges', label: '我的交易', icon: History },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-green">交换广场</h1>
          <p className="font-retro text-gray-400 text-lg">
            发布交换需求，找到志同道合的收藏家
          </p>
        </div>
        <PixelButton variant="primary" onClick={() => setShowNewRequest(true)}>
          <Plus className="w-4 h-4 inline mr-2" />
          发布需求
        </PixelButton>
      </div>

      {pendingReviews.length > 0 && (
        <div className="card-pixel p-6 rounded-lg mb-6 border-neon-yellow/30 bg-neon-yellow/5">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-neon-yellow" />
            <h2 className="font-pixel text-sm text-neon-yellow">
              有待评价的交易 ({pendingReviews.length} 笔)
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {pendingReviews.map((exchange) => {
              const otherUser = exchange.initiatorUserId === currentUser.id
                ? exchange.targetUserName
                : exchange.initiatorUserName;
              return (
                <button
                  key={exchange.id}
                  onClick={() => handleOpenReview(exchange)}
                  className="flex items-center gap-2 px-4 py-2 bg-darker-navy/50 rounded-lg border border-neon-yellow/30 hover:border-neon-yellow transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-neon-yellow" />
                  <span className="font-retro text-sm text-white">{exchange.cartridgeTitle}</span>
                  <span className="font-retro text-xs text-gray-400">与 {otherUser}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {matches.length > 0 && activeTab !== 'matches' && activeTab !== 'my-exchanges' && (
        <div className="card-pixel p-6 rounded-lg mb-8 border-neon-green/30">
          <h2 className="font-pixel text-sm text-neon-green mb-4 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5" />
            为你推荐 ({matches.length} 个匹配)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.slice(0, 3).map((match) => {
              const matchRequest = exchangeRequests.find((r) => r.id === match.matchRequestId);
              if (!matchRequest) return null;
              const rating = getUserRating(match.matchUserId);
              return (
                <div
                  key={match.requestId + match.matchRequestId}
                  className="bg-darker-navy/50 p-4 rounded-lg border border-neon-green/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-neon-purple/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-neon-purple" />
                    </div>
                    <div className="flex-1">
                      <span className="font-retro text-gray-300">{match.matchUserName}</span>
                      <button
                        onClick={() => handleViewUserReviews(match.matchUserId, match.matchUserName)}
                        className="block"
                      >
                        <UserRatingBadge rating={rating} showCount size="sm" />
                      </button>
                    </div>
                    <span className="px-2 py-0.5 bg-neon-green/20 text-neon-green font-pixel text-xs rounded">
                      {match.score}%匹配
                    </span>
                  </div>
                  <p className="font-pixel text-xs text-white mb-1">{matchRequest.cartridgeTitle}</p>
                  <p className="font-retro text-gray-400 text-sm mb-2">{match.details}</p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 text-xs font-pixel rounded ${
                        matchRequest.type === 'WANT'
                          ? 'bg-neon-pink/20 text-neon-pink'
                          : 'bg-neon-cyan/20 text-neon-cyan'
                      }`}
                    >
                      {matchRequest.type === 'WANT' ? '求购' : '出让'}
                    </span>
                    <PixelButton
                      variant="cyan"
                      size="sm"
                      onClick={() => handleStartExchange(match)}
                    >
                      <Send className="w-4 h-4 inline mr-1" />
                      发起交易
                    </PixelButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs border-2 transition-all ${
              activeTab === tab.id
                ? 'bg-neon-purple/20 border-neon-purple text-neon-purple'
                : 'border-card-border text-gray-400 hover:border-gray-600 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'my-exchanges' && pendingReviews.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-neon-yellow text-black flex items-center justify-center text-xs">
                {pendingReviews.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'my-exchanges' ? (
        <div className="space-y-4">
          {exchanges.length > 0 ? (
            exchanges.map((exchange) => {
              const otherUserId = exchange.initiatorUserId === currentUser.id
                ? exchange.targetUserId
                : exchange.initiatorUserId;
              const otherUserName = exchange.initiatorUserId === currentUser.id
                ? exchange.targetUserName
                : exchange.initiatorUserName;
              const rating = getUserRating(otherUserId);
              const needsReview =
                exchange.status === 'COMPLETED' &&
                ((exchange.initiatorUserId === currentUser.id && !exchange.initiatorReviewed) ||
                  (exchange.targetUserId === currentUser.id && !exchange.targetReviewed));

              return (
                <div
                  key={exchange.id}
                  className="card-pixel p-5 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-retro text-white">{otherUserName}</span>
                        <button
                          onClick={() => handleViewUserReviews(otherUserId, otherUserName)}
                        >
                          <UserRatingBadge rating={rating} showCount size="sm" />
                        </button>
                        {getStatusBadge(exchange.status)}
                        {needsReview && (
                          <span className="px-2 py-0.5 bg-neon-yellow/20 text-neon-yellow font-pixel text-xs rounded animate-pulse">
                            待评价
                          </span>
                        )}
                      </div>
                      <h3 className="font-pixel text-sm text-white mb-1">
                        {exchange.cartridgeTitle}
                      </h3>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-neon-purple/20 text-neon-purple font-pixel text-xs rounded">
                          {exchange.platform}
                        </span>
                        <span className="font-retro text-gray-500 text-sm">
                          发起时间：{formatDate(exchange.createdAt)}
                        </span>
                        {exchange.completedAt && (
                          <span className="font-retro text-gray-500 text-sm">
                            完成时间：{formatDate(exchange.completedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {exchange.status === 'PENDING' && (
                        <PixelButton
                          variant="cyan"
                          size="sm"
                          onClick={() => handleCompleteExchange(exchange.id)}
                        >
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          确认完成
                        </PixelButton>
                      )}
                      {needsReview && (
                        <PixelButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenReview(exchange)}
                        >
                          <Star className="w-4 h-4 inline mr-1" />
                          去评价
                        </PixelButton>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="font-retro text-gray-500 text-xl">暂无交易记录</p>
            </div>
          )}
        </div>
      ) : activeTab === 'matches' ? (
        <div className="space-y-4">
          {matches.length > 0 ? (
            matches.map((match) => {
              const matchRequest = exchangeRequests.find((r) => r.id === match.matchRequestId);
              if (!matchRequest) return null;
              const rating = getUserRating(match.matchUserId);
              return (
                <div
                  key={match.requestId + match.matchRequestId}
                  className="card-pixel p-5 rounded-lg flex items-center gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="w-10 h-10 rounded-full bg-neon-purple/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-neon-purple" />
                      </div>
                      <div>
                        <p className="font-retro text-white">{match.matchUserName}</p>
                        <button
                          onClick={() => handleViewUserReviews(match.matchUserId, match.matchUserName)}
                        >
                          <UserRatingBadge rating={rating} showCount size="sm" />
                        </button>
                      </div>
                      <p className="font-retro text-gray-500 text-sm">{match.details}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-pixel rounded ${
                          matchRequest.type === 'WANT'
                            ? 'bg-neon-pink/20 text-neon-pink'
                            : 'bg-neon-cyan/20 text-neon-cyan'
                        }`}
                      >
                        {matchRequest.type === 'WANT' ? '求购' : '出让'}
                      </span>
                      <span className="font-pixel text-sm text-white">
                        {matchRequest.cartridgeTitle}
                      </span>
                      <span className="font-retro text-gray-500 text-sm">
                        {matchRequest.platform}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-neon-green flex items-center justify-center mb-1">
                      <span className="font-pixel text-lg text-neon-green">{match.score}%</span>
                    </div>
                    <p className="font-retro text-gray-500 text-xs">匹配度</p>
                  </div>
                  <PixelButton variant="cyan" size="sm" onClick={() => handleStartExchange(match)}>
                    <Send className="w-4 h-4 inline mr-1" />
                    发起交易
                  </PixelButton>
                </div>
              );
            })
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="font-retro text-gray-500 text-xl">暂无匹配结果</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
              const rating = getUserRating(request.userId);
              return (
                <div
                  key={request.id}
                  className="card-pixel p-5 rounded-lg flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-retro text-white">{request.userName}</span>
                      <button
                        onClick={() => handleViewUserReviews(request.userId, request.userName)}
                      >
                        <UserRatingBadge rating={rating} showCount size="sm" />
                      </button>
                      <span
                        className={`px-2 py-0.5 text-xs font-pixel rounded ${
                          request.type === 'WANT'
                            ? 'bg-neon-pink/20 text-neon-pink'
                            : 'bg-neon-cyan/20 text-neon-cyan'
                        }`}
                      >
                        {request.type === 'WANT' ? '求购' : '出让'}
                      </span>
                      <span className="font-retro text-gray-500 text-sm">
                        {formatDate(request.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-pixel text-sm text-white mb-1">
                      {request.cartridgeTitle}
                    </h3>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 bg-neon-purple/20 text-neon-purple font-pixel text-xs rounded">
                        {request.platform}
                      </span>
                      <span className="font-retro text-gray-400 text-sm">
                        品相：{getConditionLabel(request.condition)}
                      </span>
                    </div>
                    <p className="font-retro text-gray-400">{request.description}</p>
                  </div>
                  <PixelButton variant="primary" size="sm">
                    <Repeat className="w-4 h-4 inline mr-1" />
                    交换
                  </PixelButton>
                </div>
              );
            })
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="font-retro text-gray-500 text-xl">暂无交换需求</p>
            </div>
          )}
        </div>
      )}

      {showNewRequest && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card-pixel p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-pixel text-lg text-neon-cyan">发布交换需求</h2>
              <button
                onClick={() => setShowNewRequest(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-pixel text-xs text-neon-purple mb-2">
                  需求类型
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setNewRequest({ ...newRequest, type: 'WANT' })}
                    className={`flex-1 py-3 font-pixel text-xs border-2 transition-all ${
                      newRequest.type === 'WANT'
                        ? 'bg-neon-pink/20 border-neon-pink text-neon-pink'
                        : 'border-card-border text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    求购
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRequest({ ...newRequest, type: 'HAVE' })}
                    className={`flex-1 py-3 font-pixel text-xs border-2 transition-all ${
                      newRequest.type === 'HAVE'
                        ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
                        : 'border-card-border text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    出让
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-pixel text-xs text-neon-purple mb-2">
                  游戏名称 *
                </label>
                <input
                  type="text"
                  value={newRequest.cartridgeTitle}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, cartridgeTitle: e.target.value })
                  }
                  required
                  placeholder="例如：超级马里奥兄弟"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-pixel text-xs text-neon-purple mb-2">
                    平台
                  </label>
                  <input
                    type="text"
                    value={newRequest.platform}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, platform: e.target.value })
                    }
                    placeholder="FC / SFC / GB"
                  />
                </div>
                <div>
                  <label className="block font-pixel text-xs text-neon-purple mb-2">
                    期望品相
                  </label>
                  <select
                    value={newRequest.condition}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, condition: e.target.value })
                    }
                  >
                    <option value="MINT">全新</option>
                    <option value="NEAR_MINT">近新</option>
                    <option value="VERY_GOOD">很好</option>
                    <option value="GOOD">良好</option>
                    <option value="FAIR">一般</option>
                    <option value="POOR">较差</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-pixel text-xs text-neon-purple mb-2">
                  详细描述
                </label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, description: e.target.value })
                  }
                  rows={3}
                  placeholder="描述你的交换条件或更多细节..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <PixelButton
                  type="button"
                  variant="primary"
                  onClick={() => setShowNewRequest(false)}
                >
                  取消
                </PixelButton>
                <PixelButton type="submit" variant="cyan">
                  发布
                </PixelButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && selectedExchange && (
        <ReviewModal
          exchange={selectedExchange}
          currentUserId={currentUser.id}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedExchange(null);
          }}
          onSubmit={handleSubmitReview}
          isLoading={isSubmittingReview}
        />
      )}

      {showReviewsModal && selectedUserId && (
        <UserReviewsModal
          userName={selectedUserName}
          rating={getUserRating(selectedUserId)}
          reviews={getSelectedUserReviews()}
          onClose={() => {
            setShowReviewsModal(false);
            setSelectedUserId(null);
          }}
        />
      )}
    </div>
  );
};

export default Exchange;
