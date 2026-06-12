import { Router, Request, Response } from 'express';
import { achievementService } from '../services/achievementService';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const achievements = achievementService.getAchievements();
  res.json(achievements);
});

router.post('/check', (_req: Request, res: Response) => {
  const result = achievementService.checkAchievements();
  res.json(result);
});

export default router;
