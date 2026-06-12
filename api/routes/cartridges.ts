import { Router, Request, Response } from 'express';
import { cartridgeService } from '../services/cartridgeService';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { platform, series, publisher, condition, sort, search } = req.query;
  const result = cartridgeService.getCartridges({
    platform: platform as string,
    series: series as string,
    publisher: publisher as string,
    condition: condition as string,
    sort: sort as string,
    search: search as string,
  });
  res.json(result);
});

router.get('/platforms', (_req: Request, res: Response) => {
  const platforms = cartridgeService.getPlatforms();
  res.json(platforms);
});

router.get('/series', (_req: Request, res: Response) => {
  const series = cartridgeService.getSeries();
  res.json(series);
});

router.get('/publishers', (_req: Request, res: Response) => {
  const publishers = cartridgeService.getPublishers();
  res.json(publishers);
});

router.get('/:id', (req: Request, res: Response) => {
  const cartridge = cartridgeService.getCartridge(req.params.id);
  if (!cartridge) {
    return res.status(404).json({ error: 'Cartridge not found' });
  }
  res.json(cartridge);
});

router.post('/', (req: Request, res: Response) => {
  const newCartridge = cartridgeService.addCartridge(req.body);
  res.status(201).json(newCartridge);
});

router.put('/:id', (req: Request, res: Response) => {
  const updated = cartridgeService.updateCartridge(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Cartridge not found' });
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const success = cartridgeService.deleteCartridge(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Cartridge not found' });
  }
  res.json({ success: true });
});

router.get('/:id/prices', (req: Request, res: Response) => {
  const prices = cartridgeService.getPriceHistory(req.params.id);
  res.json(prices);
});

export default router;
