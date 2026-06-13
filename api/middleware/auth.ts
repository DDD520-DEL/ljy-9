import type { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: string;
        name: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  const userNameEncoded = req.headers['x-user-name'] as string;
  
  if (userId) {
    const userName = userNameEncoded ? decodeURIComponent(userNameEncoded) : 'Unknown User';
    req.currentUser = {
      id: userId,
      name: userName,
    };
  } else {
    req.currentUser = {
      id: 'user1',
      name: '像素收藏家',
    };
  }
  
  next();
};
