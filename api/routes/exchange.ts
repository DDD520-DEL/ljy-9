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
  const newRequest = exchangeService.addExchangeRequest(req.body);
  res.status(201).json(newRequest);
});

router.get('/matches', (_req: Request, res: Response) => {
  const matches = exchangeService.getMatches();
  res.json(matches);
});

export default router;
