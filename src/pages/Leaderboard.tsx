import { useState, useEffect } from 'react';
import { useStore } from '../stores/useStore';
import UserRatingBadge from '../components/UserRatingBadge';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Library,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  User,
  ArrowUpDown,
} from 'lucide-react';
import type { CollectorLeaderboardEntry } from '../types';

type SortKey = 'totalScore' | 'collectionCount' | 'achievementScore' | 'exchangeReputation';

const sortTabs: { key: SortKey; label: string; icon: typeof Trophy; description: string }[] = [
  { key: 'totalScore', label: '综合排名', icon: Trophy, description: '收藏数量(40%) + 成就进度(30%) + 交换信誉(30%)' },
  { key: 'collectionCount', label: '收藏数量', icon: Library, description: '按收藏卡带总数排名' },
  { key: 'achievementScore', label: '成就进度', icon: Star, description: '按成就解锁进度排名' },
  { key: 'exchangeReputation', label: '交换信誉', icon: Award, description: '按交换评价和完成次数排名' },
];

const getRankBadge = (rank: number) => {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
        <Crown className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg">
        <Medal className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center shadow-lg">
        <Award className="w-5 h-5 text-white" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-card-bg border-2 border-card-border flex items-center justify-center">
      <span className="font-pixel text-sm text-gray-400">#{rank}</span>
    </div>
  );
};

const getRankTrend = (rank: number, prevRank?: number) => {
  if (!prevRank || rank === prevRank) {
    return <Minus className="w-4 h-4 text-gray-500" />;
  }
  if (rank < prevRank) {
    return (
      <div className="flex items-center gap-0.5 text-neon-green">
        <TrendingUp className="w-4 h-4" />
        <span className="font-pixel text-xs">{prevRank - rank}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-0.5 text-neon-red">
      <TrendingDown className="w-4 h-4" />
      <span className="font-pixel text-xs">{rank - prevRank}</span>
    </div>
  );
};

const TopThreeCard = ({ entry, place }: { entry: CollectorLeaderboardEntry; place: 1 | 2 | 3 }) => {
  const placeColors = {
    1: 'from-yellow-500/30 to-yellow-600/10 border-yellow-500/50',
    2: 'from-gray-400/30 to-gray-600/10 border-gray-400/50',
    3: 'from-orange-500/30 to-orange-700/10 border-orange-500/50',
  };

  const achievementProgress = (entry.achievementsUnlocked / entry.achievementsTotal) * 100;

  return (
    <div
      className={`card-pixel p-6 rounded-lg bg-gradient-to-b ${placeColors[place]} relative overflow-hidden`}
    >
      {place === 1 && (
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl" />
      )}
      <div className="relative">
        <div className="flex flex-col items-center mb-4">
          {getRankBadge(place)}
          <div className="flex items-center gap-2 mt-3">
            {getRankTrend(entry.rank, entry.prevRank)}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h3 className="font-pixel text-sm text-white">{entry.userName}</h3>
            <UserRatingBadge
              rating={{
                userId: entry.userId,
                userName: entry.userName,
                averageRating: entry.exchangeReputation,
                totalReviews: entry.completedExchanges,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              }}
              size="sm"
            />
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="font-pixel text-3xl text-neon-amber neon-glow-amber">
            {entry.totalScore}
          </div>
          <p className="font-retro text-xs text-gray-400 mt-1">综合积分</p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-retro text-xs text-gray-400 flex items-center gap-1">
                <Library className="w-3 h-3 text-neon-purple" />
                收藏数量
              </span>
              <span className="font-pixel text-xs text-white">{entry.collectionCount} 张</span>
            </div>
            <div className="progress-bar h-2">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, (entry.collectionCount / 500) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-retro text-xs text-gray-400 flex items-center gap-1">
                <Star className="w-3 h-3 text-neon-pink" />
                成就进度
              </span>
              <span className="font-pixel text-xs text-white">
                {entry.achievementsUnlocked}/{entry.achievementsTotal}
              </span>
            </div>
            <div className="progress-bar h-2">
              <div className="progress-fill" style={{ width: `${achievementProgress}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-retro text-xs text-gray-400 flex items-center gap-1">
                <Award className="w-3 h-3 text-neon-cyan" />
                交换信誉
              </span>
              <span className="font-pixel text-xs text-white">
                {entry.exchangeReputation.toFixed(1)} ({entry.completedExchanges}次)
              </span>
            </div>
            <div className="progress-bar h-2">
              <div
                className="progress-fill"
                style={{ width: `${(entry.exchangeReputation / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardRow = ({ entry, isCurrentUser }: { entry: CollectorLeaderboardEntry; isCurrentUser: boolean }) => {
  const achievementProgress = (entry.achievementsUnlocked / entry.achievementsTotal) * 100;

  return (
    <div
      className={`card-pixel rounded-lg px-4 py-3 flex items-center gap-4 transition-all hover:border-neon-purple/50 ${
        isCurrentUser ? 'border-neon-purple bg-neon-purple/10' : ''
      }`}
    >
      <div className="flex items-center gap-2 w-24 flex-shrink-0">
        {getRankBadge(entry.rank)}
        {getRankTrend(entry.rank, entry.prevRank)}
      </div>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple/50 to-neon-cyan/50 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-pixel text-sm truncate ${isCurrentUser ? 'text-neon-purple' : 'text-white'}`}>
              {entry.userName}
            </span>
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 bg-neon-purple/20 text-neon-purple text-[10px] font-pixel rounded">
                我
              </span>
            )}
          </div>
          <UserRatingBadge
            rating={{
              userId: entry.userId,
              userName: entry.userName,
              averageRating: entry.exchangeReputation,
              totalReviews: entry.completedExchanges,
              ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            }}
            size="sm"
            showCount={false}
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 flex-1">
        <div className="flex items-center gap-2 w-28">
          <Library className="w-4 h-4 text-neon-purple" />
          <span className="font-pixel text-sm text-white">{entry.collectionCount}</span>
          <span className="font-retro text-xs text-gray-500">张</span>
        </div>
        <div className="flex items-center gap-2 w-28">
          <Star className="w-4 h-4 text-neon-pink" />
          <div className="flex-1">
            <div className="progress-bar h-2">
              <div className="progress-fill" style={{ width: `${achievementProgress}%` }} />
            </div>
          </div>
          <span className="font-pixel text-xs text-gray-400 w-10 text-right">
            {entry.achievementsUnlocked}/{entry.achievementsTotal}
          </span>
        </div>
        <div className="flex items-center gap-2 w-32">
          <Award className="w-4 h-4 text-neon-cyan" />
          <span className="font-pixel text-sm text-white">{entry.exchangeReputation.toFixed(1)}</span>
          <span className="font-retro text-xs text-gray-500">({entry.completedExchanges}次)</span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-24 flex-shrink-0 justify-end">
        <span className="font-pixel text-lg text-neon-amber">{entry.totalScore}</span>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const {
    leaderboard,
    myLeaderboardRank,
    leaderboardSortBy,
    currentUser,
    fetchLeaderboard,
    fetchMyLeaderboardRank,
    setLeaderboardSortBy,
  } = useStore();

  const [activeSort, setActiveSort] = useState<SortKey>(leaderboardSortBy);

  useEffect(() => {
    fetchLeaderboard(activeSort);
    fetchMyLeaderboardRank();
  }, [activeSort]);

  const topThree = leaderboard.slice(0, 3);
  const restList = leaderboard.slice(3);

  const handleSortChange = (sortKey: SortKey) => {
    setActiveSort(sortKey);
    setLeaderboardSortBy(sortKey);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-amber">收藏家排行榜</h1>
        <p className="font-retro text-gray-400 text-lg">
          综合收藏数量、成就解锁进度、交换信誉三个维度排名
        </p>
      </div>

      {myLeaderboardRank && (
        <div className="card-pixel p-5 rounded-lg mb-8 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 border-neon-purple/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-retro text-gray-400 text-sm">我的当前排名</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-pixel text-2xl text-neon-amber neon-glow-amber">
                    #{myLeaderboardRank.rank}
                  </span>
                  {getRankTrend(myLeaderboardRank.rank, myLeaderboardRank.prevRank)}
                  <span className="font-pixel text-sm text-white">
                    综合积分 {myLeaderboardRank.totalScore}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-retro text-xs text-gray-400">收藏</p>
                <p className="font-pixel text-sm text-neon-purple">{myLeaderboardRank.collectionCount} 张</p>
              </div>
              <div className="text-center">
                <p className="font-retro text-xs text-gray-400">成就</p>
                <p className="font-pixel text-sm text-neon-pink">
                  {myLeaderboardRank.achievementsUnlocked}/{myLeaderboardRank.achievementsTotal}
                </p>
              </div>
              <div className="text-center">
                <p className="font-retro text-xs text-gray-400">信誉</p>
                <p className="font-pixel text-sm text-neon-cyan">
                  {myLeaderboardRank.exchangeReputation.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {sortTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleSortChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs border-2 transition-all rounded ${
              activeSort === tab.key
                ? 'bg-neon-amber/20 border-neon-amber text-neon-amber'
                : 'border-card-border text-gray-400 hover:border-gray-600 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <ArrowUpDown className="w-3 h-3 opacity-60" />
          </button>
        ))}
      </div>

      <p className="font-retro text-sm text-gray-500 mb-6">
        {sortTabs.find((t) => t.key === activeSort)?.description}
      </p>

      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {topThree[1] && <TopThreeCard entry={topThree[1]} place={2} />}
          {topThree[0] && <TopThreeCard entry={topThree[0]} place={1} />}
          {topThree[2] && <TopThreeCard entry={topThree[2]} place={3} />}
        </div>
      )}

      <div className="mb-3 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="font-retro text-xs text-gray-500 w-24">排名</span>
          <span className="font-retro text-xs text-gray-500 flex-1">收藏家</span>
        </div>
        <div className="hidden md:flex items-center gap-6 flex-1">
          <span className="font-retro text-xs text-gray-500 w-28 flex items-center gap-1">
            <Library className="w-3 h-3" /> 收藏
          </span>
          <span className="font-retro text-xs text-gray-500 w-28 flex items-center gap-1">
            <Star className="w-3 h-3" /> 成就
          </span>
          <span className="font-retro text-xs text-gray-500 w-32 flex items-center gap-1">
            <Award className="w-3 h-3" /> 信誉
          </span>
        </div>
        <span className="font-retro text-xs text-gray-500 w-24 text-right flex items-center gap-1 justify-end">
          <Trophy className="w-3 h-3" /> 积分
        </span>
      </div>

      <div className="space-y-2">
        {restList.map((entry) => (
          <LeaderboardRow
            key={entry.userId}
            entry={entry}
            isCurrentUser={entry.userId === currentUser.id}
          />
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="font-retro text-gray-500 text-xl">排行榜数据加载中...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
