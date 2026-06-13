import { Router, Request, Response } from 'express';
import { reviewService } from '../services/reviewService';

const router = Router();

router.get('/user/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const reviews = reviewService.getReviewsForUser(userId);
  res.json(reviews);
});

router.get('/user/:userId/rating', (req: Request, res: Response) => {
  const { userId } = req.params;
  const rating = reviewService.getUserRating(userId);
  res.json(rating);
});

router.get('/ratings', (_req: Request, res: Response) => {
  const ratings = reviewService.getAllUserRatings();
  res.json(ratings);
});

router.get('/exchange/:exchangeId', (req: Request, res: Response) => {
  const { exchangeId } = req.params;
  const { userId } = req.query;
  const review = reviewService.getReviewForExchange(exchangeId, userId as string);
  res.json(review || null);
});

router.post('/', (req: Request, res: Response) => {
  try {
    const newReview = reviewService.addReview(req.body);
    res.status(201).json(newReview);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/exchanges', (_req: Request, res: Response) => {
  const exchanges = reviewService.getMyExchanges();
  res.json(exchanges);
});

router.post('/exchanges', (req: Request, res: Response) => {
  const newExchange = reviewService.createExchange(req.body);
  res.status(201).json(newExchange);
});

router.put('/exchanges/:id/complete', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exchange = reviewService.completeExchange(id);
    res.json(exchange);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/exchanges/:id/cancel', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exchange = reviewService.cancelExchange(id);
    res.json(exchange);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/pending-reviews', (_req: Request, res: Response) => {
  const pending = reviewService.getPendingReviews();
  res.json(pending);
});

export default router;
