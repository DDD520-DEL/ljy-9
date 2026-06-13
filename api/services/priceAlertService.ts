import type { PriceAlert, PriceAlertSettings } from '../types';
import { cartridges, priceHistories } from '../data/mockData';

const generateId = () => Math.random().toString(36).substr(2, 9);

let alertSettings: PriceAlertSettings = {
  threshold: 20,
  enabled: true,
};

const calculateAveragePrice = (prices: { price: number }[]): number => {
  if (prices.length === 0) return 0;
  return prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
};

const getDateDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const priceAlertService = {
  getAlerts: (): PriceAlert[] => {
    if (!alertSettings.enabled) {
      return [];
    }

    const alerts: PriceAlert[] = [];
    const threshold = alertSettings.threshold;
    const daysToCheck = 30;

    const now = new Date();
    const thirtyDaysAgo = getDateDaysAgo(daysToCheck);
    const sixtyDaysAgo = getDateDaysAgo(daysToCheck * 2);

    cartridges.forEach((cartridge) => {
      const cartridgePrices = priceHistories.filter(
        (p) => p.cartridgeId === cartridge.id
      );

      if (cartridgePrices.length < 2) return;

      const recentPeriod = cartridgePrices.filter(
        (p) => new Date(p.date) >= thirtyDaysAgo && new Date(p.date) <= now
      );

      const previousPeriod = cartridgePrices.filter(
        (p) => new Date(p.date) >= sixtyDaysAgo && new Date(p.date) < thirtyDaysAgo
      );

      if (recentPeriod.length === 0 || previousPeriod.length === 0) return;

      const recentAvg = calculateAveragePrice(recentPeriod);
      const previousAvg = calculateAveragePrice(previousPeriod);

      if (previousAvg === 0) return;

      const priceChangePercent =
        ((recentAvg - previousAvg) / previousAvg) * 100;

      if (Math.abs(priceChangePercent) >= threshold) {
        const direction = priceChangePercent > 0 ? 'UP' : 'DOWN';
        const sortedRecent = [...recentPeriod].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const currentPrice = Math.round(
          sortedRecent[sortedRecent.length - 1].price
        );

        alerts.push({
          id: generateId(),
          cartridgeId: cartridge.id,
          cartridgeTitle: cartridge.title,
          cartridgePlatform: cartridge.platform,
          coverImage: cartridge.coverImage,
          threshold,
          currentPrice,
          priceChangePercent: Math.round(priceChangePercent * 100) / 100,
          direction,
          days: daysToCheck,
          createdAt: new Date().toISOString(),
        });
      }
    });

    return alerts.sort(
      (a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent)
    );
  },

  getSettings: (): PriceAlertSettings => {
    return { ...alertSettings };
  },

  updateSettings: (settings: Partial<PriceAlertSettings>): PriceAlertSettings => {
    alertSettings = { ...alertSettings, ...settings };
    if (alertSettings.threshold < 1) alertSettings.threshold = 1;
    if (alertSettings.threshold > 100) alertSettings.threshold = 100;
    return { ...alertSettings };
  },
};
