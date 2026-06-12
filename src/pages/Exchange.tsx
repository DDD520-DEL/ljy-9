import { useState, useEffect } from 'react';
import { useStore } from '../stores/useStore';
import PixelButton from '../components/PixelButton';
import {
  Repeat,
  ArrowRightLeft,
  Plus,
  Filter,
  ThumbsUp,
  User,
  X,
  Send,
} from 'lucide-react';
import { formatDate, getConditionLabel } from '../utils/format';

const Exchange = () => {
  const {
    exchangeRequests,
    matches,
    fetchExchangeRequests,
    fetchMatches,
    addExchangeRequest,
    fetchUnreadCount,
    fetchNotifications,
  } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'want' | 'have' | 'matches'>('all');
  const [showNewRequest, setShowNewRequest] = useState(false);
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

  const filteredRequests = exchangeRequests.filter((req) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'want') return req.type === 'WANT';
    if (activeTab === 'have') return req.type === 'HAVE';
    return true;
  });

  const tabs = [
    { id: 'all', label: '全部', icon: Filter },
    { id: 'want', label: '求购', icon: ArrowRightLeft },
    { id: 'have', label: '出让', icon: Repeat },
    { id: 'matches', label: '匹配', icon: ThumbsUp },
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

      {matches.length > 0 && (
        <div className="card-pixel p-6 rounded-lg mb-8 border-neon-green/30">
          <h2 className="font-pixel text-sm text-neon-green mb-4 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5" />
            为你推荐 ({matches.length} 个匹配)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.slice(0, 3).map((match) => {
              const matchRequest = exchangeRequests.find((r) => r.id === match.matchRequestId);
              if (!matchRequest) return null;
              return (
                <div
                  key={match.requestId + match.matchRequestId}
                  className="bg-darker-navy/50 p-4 rounded-lg border border-neon-green/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-neon-purple/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-neon-purple" />
                    </div>
                    <span className="font-retro text-gray-300">{match.matchUserName}</span>
                    <span className="ml-auto px-2 py-0.5 bg-neon-green/20 text-neon-green font-pixel text-xs rounded">
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
                    <button className="font-retro text-neon-cyan text-sm hover:text-neon-purple transition-colors">
                      联系TA
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6">
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
          </button>
        ))}
      </div>

      {activeTab === 'matches' ? (
        <div className="space-y-4">
          {matches.length > 0 ? (
            matches.map((match) => {
              const matchRequest = exchangeRequests.find((r) => r.id === match.matchRequestId);
              if (!matchRequest) return null;
              return (
                <div
                  key={match.requestId + match.matchRequestId}
                  className="card-pixel p-5 rounded-lg flex items-center gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-neon-purple/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-neon-purple" />
                      </div>
                      <div>
                        <p className="font-retro text-white">{match.matchUserName}</p>
                        <p className="font-retro text-gray-500 text-sm">{match.details}</p>
                      </div>
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
                  <PixelButton variant="cyan" size="sm">
                    <Send className="w-4 h-4 inline mr-1" />
                    联系
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
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="card-pixel p-5 rounded-lg flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-retro text-white">{request.userName}</span>
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
            ))
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
    </div>
  );
};

export default Exchange;
