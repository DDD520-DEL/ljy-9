import type { Review, Exchange, UserRating } from '../types';
import { reviews, exchanges, userRatings } from '../data/mockData';

let reviewStore = [...reviews];
let exchangeStore = [...exchanges];
let userRatingStore = [...userRatings];

const generateId = () => Math.random().toString(36).substr(2, 9);

const calculateUserRating = (userId: string, userName: string): UserRating => {
  const userReviews = reviewStore.filter((r) => r.toUserId === userId);
  const totalReviews = userReviews.length;
  
  if (totalReviews === 0) {
    return {
      userId,
      userName,
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const totalRating = userReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = Math.round((totalRating / totalReviews) * 10) / 10;
  
  const ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number } = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  };
  
  userReviews.forEach((r) => {
    ratingDistribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
  });

  return {
    userId,
    userName,
    averageRating,
    totalReviews,
    ratingDistribution,
  };
};

export const reviewService = {
  getReviewsForUser: (userId: string): Review[] => {
    return reviewStore
      .filter((r) => r.toUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getReviewsByUser: (userId: string): Review[] => {
    return reviewStore
      .filter((r) => r.fromUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getReviewForExchange: (exchangeId: string, userId: string): Review | undefined => {
    return reviewStore.find(
      (r) => r.exchangeId === exchangeId && r.fromUserId === userId
    );
  },

  addReview: (
    data: {
      exchangeId: string;
      toUserId: string;
      toUserName: string;
      rating: number;
      comment: string;
      cartridgeTitle: string;
    },
    currentUser: { id: string; name: string }
  ): Review => {
    const exchange = exchangeStore.find((e) => e.id === data.exchangeId);
    if (!exchange) {
      throw new Error('Exchange not found');
    }

    if (exchange.status !== 'COMPLETED') {
      throw new Error('Exchange is not completed');
    }

    const existingReview = reviewStore.find(
      (r) => r.exchangeId === data.exchangeId && r.fromUserId === currentUser.id
    );
    if (existingReview) {
      throw new Error('You have already reviewed this exchange');
    }

    const newReview: Review = {
      ...data,
      id: generateId(),
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    reviewStore.push(newReview);

    if (exchange.initiatorUserId === currentUser.id) {
      exchange.initiatorReviewed = true;
    } else {
      exchange.targetReviewed = true;
    }

    const updatedRating = calculateUserRating(data.toUserId, data.toUserName);
    const existingRatingIndex = userRatingStore.findIndex((r) => r.userId === data.toUserId);
    if (existingRatingIndex >= 0) {
      userRatingStore[existingRatingIndex] = updatedRating;
    } else {
      userRatingStore.push(updatedRating);
    }

    return newReview;
  },

  getUserRating: (userId: string): UserRating => {
    const rating = userRatingStore.find((r) => r.userId === userId);
    if (rating) return rating;
    
    const exchange = exchangeStore.find((e) => e.initiatorUserId === userId || e.targetUserId === userId);
    const userName = exchange 
      ? (exchange.initiatorUserId === userId ? exchange.initiatorUserName : exchange.targetUserName)
      : 'Unknown User';
    
    return calculateUserRating(userId, userName);
  },

  getAllUserRatings: (): UserRating[] => {
    return userRatingStore;
  },

  getMyExchanges: (currentUserId: string): Exchange[] => {
    return exchangeStore
      .filter((e) => e.initiatorUserId === currentUserId || e.targetUserId === currentUserId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createExchange: (
    data: {
      requestId: string;
      matchRequestId: string;
      targetUserId: string;
      targetUserName: string;
      cartridgeTitle: string;
      platform: string;
    },
    currentUser: { id: string; name: string }
  ): Exchange => {
    const newExchange: Exchange = {
      ...data,
      id: generateId(),
      initiatorUserId: currentUser.id,
      initiatorUserName: currentUser.name,
      status: 'PENDING',
      initiatorReviewed: false,
      targetReviewed: false,
      createdAt: new Date().toISOString(),
    };
    exchangeStore.push(newExchange);
    return newExchange;
  },

  completeExchange: (exchangeId: string): Exchange => {
    const exchange = exchangeStore.find((e) => e.id === exchangeId);
    if (!exchange) {
      throw new Error('Exchange not found');
    }
    exchange.status = 'COMPLETED';
    exchange.completedAt = new Date().toISOString();
    return exchange;
  },

  cancelExchange: (exchangeId: string): Exchange => {
    const exchange = exchangeStore.find((e) => e.id === exchangeId);
    if (!exchange) {
      throw new Error('Exchange not found');
    }
    exchange.status = 'CANCELLED';
    return exchange;
  },

  getPendingReviews: (currentUserId: string): Exchange[] => {
    return exchangeStore.filter((e) => {
      if (e.status !== 'COMPLETED') return false;
      if (e.initiatorUserId === currentUserId && !e.initiatorReviewed) return true;
      if (e.targetUserId === currentUserId && !e.targetReviewed) return true;
      return false;
    });
  },
};
