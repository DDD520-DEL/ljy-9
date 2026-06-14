import { Router, Request, Response } from 'express';
import { leaderboardService, LeaderboardSortKey } from '../services/leaderboardService';

const router = Router();

const VALID_SORT_KEYS: LeaderboardSortKey[] = [
  'totalScore',
  'collectionCount',
  'achievementScore',
  'exchangeReputation',
];

router.get('/', (req: Request, res: Response) => {
  const sortBy = (req.query.sortBy as string) || 'totalScore';
  const limit = parseInt(req.query.limit as string) || 50;

  const validSortBy = VALID_SORT_KEYS.includes(sortBy as LeaderboardSortKey)
    ? (sortBy as LeaderboardSortKey)
    : 'totalScore';

  const leaderboard = leaderboardService.getLeaderboard(validSortBy, Math.min(limit, 50));
  res.json(leaderboard);
});

router.get('/my-rank', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string | undefined;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  const myRank = leaderboardService.getMyRank(userId);
  if (!myRank) {
    return res.status(404).json({ error: 'User not found in leaderboard' });
  }
  res.json(myRank);
});

export default router;
