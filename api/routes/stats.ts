import { Router, Request, Response } from 'express';
import { statsService } from '../services/statsService';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const stats = statsService.getStats();
  res.json(stats);
});

router.get('/monthly-value', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string | undefined;
  const data = statsService.getMonthlyValue(userId);
  res.json(data);
});

export default router;
