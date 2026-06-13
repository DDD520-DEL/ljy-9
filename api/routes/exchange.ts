import { Router, Request, Response } from 'express';
import { exchangeService } from '../services/exchangeService';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { type, platform } = req.query;
  const requests = exchangeService.getExchangeRequests({
    type: type as string,
    platform: platform as string,
  });
  res.json(requests);
});

router.post('/', (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const newRequest = exchangeService.addExchangeRequest(req.body, req.currentUser);
  res.status(201).json(newRequest);
});

router.get('/matches', (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const matches = exchangeService.getMatches(req.currentUser.id);
  res.json(matches);
});

export default router;
