import type { ExchangeNotification, ExchangeRequest } from '../types';

let notificationsStore: ExchangeNotification[] = [];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const notificationService = {
  getNotifications: (userId: string): ExchangeNotification[] => {
    return notificationsStore
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUnreadCount: (userId: string): number => {
    return notificationsStore.filter((n) => n.userId === userId && !n.isRead).length;
  },

  markAsRead: (notificationId: string, userId: string): boolean => {
    const notification = notificationsStore.find(
      (n) => n.id === notificationId && n.userId === userId
    );
    if (notification) {
      notification.isRead = true;
      return true;
    }
    return false;
  },

  markAllAsRead: (userId: string): number => {
    let count = 0;
    notificationsStore.forEach((n) => {
      if (n.userId === userId && !n.isRead) {
        n.isRead = true;
        count++;
      }
    });
    return count;
  },

  createMatchNotification: (
    userId: string,
    myRequest: ExchangeRequest,
    matchRequest: ExchangeRequest,
    score: number,
    details: string
  ): ExchangeNotification | null => {
    const exists = notificationsStore.some(
      (n) =>
        n.userId === userId &&
        n.myRequestId === myRequest.id &&
        n.matchRequestId === matchRequest.id
    );
    if (exists) return null;

    const notification: ExchangeNotification = {
      id: generateId(),
      userId,
      type: 'MATCH_FOUND',
      matchRequestId: matchRequest.id,
      matchUserName: matchRequest.userName,
      matchCartridgeTitle: matchRequest.cartridgeTitle,
      matchPlatform: matchRequest.platform,
      matchType: matchRequest.type,
      myRequestId: myRequest.id,
      myCartridgeTitle: myRequest.cartridgeTitle,
      score: Math.min(score, 100),
      details,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notificationsStore.push(notification);
    return notification;
  },

  generateNotificationsForNewRequest: (
    newRequest: ExchangeRequest,
    allRequests: ExchangeRequest[],
    currentUserId: string
  ): ExchangeNotification[] => {
    const createdNotifications: ExchangeNotification[] = [];
    const otherRequests = allRequests.filter((r) => r.userId !== newRequest.userId);

    otherRequests.forEach((otherReq) => {
      if (newRequest.type === otherReq.type) return;

      let score = 0;
      const details: string[] = [];

      if (newRequest.platform === otherReq.platform) {
        score += 30;
        details.push('平台匹配');
      }

      const newTitleLower = newRequest.cartridgeTitle.toLowerCase();
      const otherTitleLower = otherReq.cartridgeTitle.toLowerCase();

      if (newTitleLower.includes(otherTitleLower) || otherTitleLower.includes(newTitleLower)) {
        score += 50;
        details.push('标题高度相关');
      } else {
        const newWords = newTitleLower.split(/\s+/);
        const otherWords = otherTitleLower.split(/\s+/);
        const commonWords = newWords.filter((w) => otherWords.includes(w));
        if (commonWords.length > 0) {
          score += commonWords.length * 10;
          details.push(`关键词匹配: ${commonWords.join(', ')}`);
        }
      }

      if (newRequest.condition === otherReq.condition) {
        score += 20;
        details.push('品相匹配');
      }

      if (score >= 40) {
        const notification = notificationService.createMatchNotification(
          otherReq.userId,
          otherReq,
          newRequest,
          score,
          details.join('、')
        );
        if (notification) {
          createdNotifications.push(notification);
        }
      }
    });

    return createdNotifications;
  },

  seedInitialNotifications: () => {
    if (notificationsStore.length > 0) return;

    notificationsStore = [
      {
        id: 'notif1',
        userId: 'user1',
        type: 'MATCH_FOUND',
        matchRequestId: 'ex1',
        matchUserName: '复古玩家小王',
        matchCartridgeTitle: '超级马里奥兄弟3',
        matchPlatform: 'FC',
        matchType: 'HAVE',
        myRequestId: 'mywant1',
        myCartridgeTitle: '超级马里奥兄弟',
        score: 80,
        details: '平台匹配、标题高度相关',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'notif2',
        userId: 'user1',
        type: 'MATCH_FOUND',
        matchRequestId: 'ex3',
        matchUserName: 'GB爱好者',
        matchCartridgeTitle: '口袋妖怪 黄',
        matchPlatform: 'GB',
        matchType: 'HAVE',
        myRequestId: 'mywant2',
        myCartridgeTitle: '口袋妖怪',
        score: 60,
        details: '平台匹配、关键词匹配: 口袋妖怪',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: 'notif3',
        userId: 'user2',
        type: 'MATCH_FOUND',
        matchRequestId: 'mywant1',
        matchUserName: '像素收藏家',
        matchCartridgeTitle: '超级马里奥兄弟',
        matchPlatform: 'FC',
        matchType: 'WANT',
        myRequestId: 'ex1',
        myCartridgeTitle: '超级马里奥兄弟3',
        score: 80,
        details: '平台匹配、标题高度相关',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'notif4',
        userId: 'user4',
        type: 'MATCH_FOUND',
        matchRequestId: 'mywant2',
        matchUserName: '像素收藏家',
        matchCartridgeTitle: '口袋妖怪',
        matchPlatform: 'GB',
        matchType: 'WANT',
        myRequestId: 'ex3',
        myCartridgeTitle: '口袋妖怪 黄',
        score: 60,
        details: '平台匹配、关键词匹配: 口袋妖怪',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ];
  },

  createNotification: (
    data: Omit<ExchangeNotification, 'id' | 'userId' | 'isRead' | 'createdAt'>,
    userId: string
  ): ExchangeNotification => {
    const newNotification: ExchangeNotification = {
      ...data,
      id: generateId(),
      userId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notificationsStore.push(newNotification);
    return newNotification;
  },
};
