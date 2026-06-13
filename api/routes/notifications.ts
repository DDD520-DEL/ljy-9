import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notificationService';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const notifications = notificationService.getNotifications(req.currentUser.id);
  res.json(notifications);
});

router.get('/unread-count', (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const count = notificationService.getUnreadCount(req.currentUser.id);
  res.json({ count });
});

router.put('/:id/read', (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const { id } = req.params;
  const success = notificationService.markAsRead(id, req.currentUser.id);
  res.json({ success });
});

router.put('/read-all', (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const count = notificationService.markAllAsRead(req.currentUser.id);
  res.json({ count });
});

export default router;
