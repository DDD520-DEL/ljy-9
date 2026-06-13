import { Router, Request, Response } from 'express';
import { priceAlertService } from '../services/priceAlertService';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const alerts = priceAlertService.getAlerts();
  res.json(alerts);
});

router.get('/settings', (_req: Request, res: Response) => {
  const settings = priceAlertService.getSettings();
  res.json(settings);
});

router.put('/settings', (req: Request, res: Response) => {
  const settings = priceAlertService.updateSettings(req.body);
  res.json(settings);
});

export default router;
