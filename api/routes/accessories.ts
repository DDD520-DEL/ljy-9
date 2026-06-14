import { Router, Request, Response } from 'express';
import { accessoryService } from '../services/accessoryService';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { category, platform, condition, sort, search } = req.query;
  const result = accessoryService.getAccessories({
    category: category as string,
    platform: platform as string,
    condition: condition as string,
    sort: sort as string,
    search: search as string,
  });
  res.json(result);
});

router.get('/categories', (_req: Request, res: Response) => {
  const categories = accessoryService.getCategories();
  res.json(categories);
});

router.get('/platforms', (_req: Request, res: Response) => {
  const platforms = accessoryService.getPlatforms();
  res.json(platforms);
});

router.get('/tags', (_req: Request, res: Response) => {
  const tags = accessoryService.getTags();
  res.json(tags);
});

router.get('/stats', (_req: Request, res: Response) => {
  const stats = accessoryService.getStats();
  res.json(stats);
});

router.get('/:id', (req: Request, res: Response) => {
  const accessory = accessoryService.getAccessory(req.params.id);
  if (!accessory) {
    return res.status(404).json({ error: 'Accessory not found' });
  }
  res.json(accessory);
});

router.post('/', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.category) {
    return res.status(400).json({ error: 'Missing required fields: name and category' });
  }
  if (!accessoryService.isValidCategory(data.category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  if (data.condition && !accessoryService.isValidCondition(data.condition)) {
    return res.status(400).json({ error: 'Invalid condition' });
  }
  const newAccessory = accessoryService.addAccessory({
    name: data.name,
    category: data.category,
    platform: data.platform || '',
    series: data.series || '',
    manufacturer: data.manufacturer || '',
    condition: data.condition || 'VERY_GOOD',
    isOfficial: data.isOfficial ?? true,
    isLimitedEdition: data.isLimitedEdition ?? false,
    editionNumber: data.editionNumber,
    purchasePrice: data.purchasePrice || 0,
    purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
    releaseYear: data.releaseYear,
    quantity: data.quantity || 1,
    coverImage: data.coverImage || '',
    notes: data.notes || '',
    tags: data.tags || [],
  });
  res.status(201).json(newAccessory);
});

router.put('/:id', (req: Request, res: Response) => {
  if (req.body.condition && !accessoryService.isValidCondition(req.body.condition)) {
    return res.status(400).json({ error: 'Invalid condition' });
  }
  if (req.body.category && !accessoryService.isValidCategory(req.body.category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  const updated = accessoryService.updateAccessory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Accessory not found' });
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const success = accessoryService.deleteAccessory(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Accessory not found' });
  }
  res.json({ success: true });
});

export default router;
