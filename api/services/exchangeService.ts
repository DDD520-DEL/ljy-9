import type { ExchangeRequest, MatchResult } from '../types';
import { exchangeRequests, currentUserId, currentUserName } from '../data/mockData';
import { notificationService } from './notificationService';

let exchangeStore = [...exchangeRequests];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const exchangeService = {
  getExchangeRequests: (params: { type?: string; platform?: string } = {}): ExchangeRequest[] => {
    let result = [...exchangeStore];

    if (params.type) {
      result = result.filter((r) => r.type === params.type);
    }
    if (params.platform) {
      result = result.filter((r) => r.platform === params.platform);
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  },

  addExchangeRequest: (
    data: Omit<ExchangeRequest, 'id' | 'userId' | 'userName' | 'createdAt'>
  ): ExchangeRequest => {
    const newRequest: ExchangeRequest = {
      ...data,
      id: generateId(),
      userId: currentUserId,
      userName: currentUserName,
      createdAt: new Date().toISOString(),
    };
    exchangeStore.push(newRequest);
    notificationService.generateNotificationsForNewRequest(newRequest, exchangeStore);
    return newRequest;
  },

  getMatches: (): MatchResult[] => {
    const myRequests = exchangeStore.filter((r) => r.userId === currentUserId);
    const otherRequests = exchangeStore.filter((r) => r.userId !== currentUserId);

    const matches: MatchResult[] = [];

    myRequests.forEach((myReq) => {
      otherRequests.forEach((otherReq) => {
        if (myReq.type === otherReq.type) return;

        let score = 0;
        const details: string[] = [];

        if (myReq.platform === otherReq.platform) {
          score += 30;
          details.push('平台匹配');
        }

        const myTitleLower = myReq.cartridgeTitle.toLowerCase();
        const otherTitleLower = otherReq.cartridgeTitle.toLowerCase();

        if (myTitleLower.includes(otherTitleLower) || otherTitleLower.includes(myTitleLower)) {
          score += 50;
          details.push('标题高度相关');
        } else {
          const myWords = myTitleLower.split(/\s+/);
          const otherWords = otherTitleLower.split(/\s+/);
          const commonWords = myWords.filter((w) => otherWords.includes(w));
          if (commonWords.length > 0) {
            score += commonWords.length * 10;
            details.push(`关键词匹配: ${commonWords.join(', ')}`);
          }
        }

        if (myReq.condition === otherReq.condition) {
          score += 20;
          details.push('品相匹配');
        }

        if (score >= 40) {
          matches.push({
            requestId: myReq.id,
            matchRequestId: otherReq.id,
            matchUserId: otherReq.userId,
            matchUserName: otherReq.userName,
            score: Math.min(score, 100),
            details: details.join('、'),
          });
        }
      });
    });

    return matches.sort((a, b) => b.score - a.score);
  },
};
