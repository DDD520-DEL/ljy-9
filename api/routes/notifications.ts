import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notificationService';
import { currentUserId } from '../data/mockData';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const notifications = notificationService.getNotifications(currentUserId);
  res.json(notifications);
});

router.get('/unread-count', (_req: Request, res: Response) => {
  const count = notificationService.getUnreadCount(currentUserId);
  res.json({ count });
});

router.put('/:id/read', (req: Request, res: Response) => {
  const { id } = req.params;
  const success = notificationService.markAsRead(id, currentUserId);
  res.json({ success });
});

router.put('/read-all', (_req: Request, res: Response) => {
  const count = notificationService.markAllAsRead(currentUserId);
  res.json({ count });
});

export default router;
