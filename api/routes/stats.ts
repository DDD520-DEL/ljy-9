import { Router, Request, Response } from 'express';
import { statsService } from '../services/statsService';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const stats = statsService.getStats();
  res.json(stats);
});

export default router;
