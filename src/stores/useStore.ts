import { create } from 'zustand';
import type {
  Cartridge,
  Achievement,
  ExchangeRequest,
  MatchResult,
  Stats,
  Filters,
  PriceHistory,
  ExchangeNotification,
} from '../types';

interface AppState {
  cartridges: Cartridge[];
  selectedCartridge: Cartridge | null;
  priceHistory: PriceHistory[];
  filters: Filters;
  sortBy: string;
  achievements: Achievement[];
  exchangeRequests: ExchangeRequest[];
  matches: MatchResult[];
  notifications: ExchangeNotification[];
  unreadCount: number;
  stats: Stats | null;
  platforms: string[];
  seriesList: string[];
  publishers: string[];
  isLoading: boolean;
  currentView: 'grid' | 'list';

  fetchCartridges: () => Promise<void>;
  fetchCartridge: (id: string) => Promise<void>;
  addCartridge: (data: Omit<Cartridge, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCartridge: (id: string, data: Partial<Cartridge>) => Promise<void>;
  deleteCartridge: (id: string) => Promise<boolean>;
  fetchPriceHistory: (cartridgeId: string) => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
  setSortBy: (sort: string) => void;
  setCurrentView: (view: 'grid' | 'list') => void;
  fetchAchievements: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchExchangeRequests: () => Promise<void>;
  addExchangeRequest: (
    data: Omit<ExchangeRequest, 'id' | 'userId' | 'userName' | 'createdAt'>
  ) => Promise<void>;
  fetchMatches: () => Promise<void>;
  fetchMetaData: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

const API_BASE = '/api';

export const useStore = create<AppState>((set, get) => ({
  cartridges: [],
  selectedCartridge: null,
  priceHistory: [],
  filters: {
    platform: [],
    series: [],
    publisher: [],
    condition: [],
    search: '',
  },
  sortBy: 'date_desc',
  achievements: [],
  exchangeRequests: [],
  matches: [],
  notifications: [],
  unreadCount: 0,
  stats: null,
  platforms: [],
  seriesList: [],
  publishers: [],
  isLoading: false,
  currentView: 'grid',

  fetchCartridges: async () => {
    set({ isLoading: true });
    try {
      const { filters, sortBy } = get();
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (sortBy) params.set('sort', sortBy);
      if (filters.platform.length === 1) params.set('platform', filters.platform[0]);
      if (filters.series.length === 1) params.set('series', filters.series[0]);
      if (filters.publisher.length === 1) params.set('publisher', filters.publisher[0]);
      if (filters.condition.length === 1) params.set('condition', filters.condition[0]);

      const res = await fetch(`${API_BASE}/cartridges?${params}`);
      const result = await res.json();
      let data = result.data || [];

      if (filters.platform.length > 1) {
        data = data.filter((c: Cartridge) => filters.platform.includes(c.platform));
      }
      if (filters.series.length > 1) {
        data = data.filter((c: Cartridge) => filters.series.includes(c.series));
      }
      if (filters.publisher.length > 1) {
        data = data.filter((c: Cartridge) => filters.publisher.includes(c.publisher));
      }
      if (filters.condition.length > 1) {
        data = data.filter((c: Cartridge) => filters.condition.includes(c.condition));
      }

      set({ cartridges: data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cartridges:', error);
      set({ isLoading: false });
    }
  },

  fetchCartridge: async (id: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/cartridges/${id}`);
      const data = await res.json();
      set({ selectedCartridge: data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cartridge:', error);
      set({ isLoading: false });
    }
  },

  addCartridge: async (data) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/cartridges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const newCartridge = await res.json();
      set((state) => ({
        cartridges: [newCartridge, ...state.cartridges],
        isLoading: false,
      }));
      get().fetchStats();
      get().fetchAchievements();
    } catch (error) {
      console.error('Failed to add cartridge:', error);
      set({ isLoading: false });
    }
  },

  updateCartridge: async (id, data) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/cartridges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      set((state) => ({
        cartridges: state.cartridges.map((c) => (c.id === id ? updated : c)),
        selectedCartridge: state.selectedCartridge?.id === id ? updated : state.selectedCartridge,
        isLoading: false,
      }));
      get().fetchStats();
    } catch (error) {
      console.error('Failed to update cartridge:', error);
      set({ isLoading: false });
    }
  },

  deleteCartridge: async (id) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/cartridges/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        set((state) => ({
          cartridges: state.cartridges.filter((c) => c.id !== id),
          isLoading: false,
        }));
        get().fetchStats();
        get().fetchAchievements();
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Failed to delete cartridge:', error);
      set({ isLoading: false });
      return false;
    }
  },

  fetchPriceHistory: async (cartridgeId) => {
    try {
      const res = await fetch(`${API_BASE}/cartridges/${cartridgeId}/prices`);
      const data = await res.json();
      set({ priceHistory: data });
    } catch (error) {
      console.error('Failed to fetch price history:', error);
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  setSortBy: (sort) => {
    set({ sortBy: sort });
  },

  setCurrentView: (view) => {
    set({ currentView: view });
  },

  fetchAchievements: async () => {
    try {
      const res = await fetch(`${API_BASE}/achievements`);
      const data = await res.json();
      set({ achievements: data });
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  },

  fetchStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      set({ stats: data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  fetchExchangeRequests: async () => {
    try {
      const res = await fetch(`${API_BASE}/exchange`);
      const data = await res.json();
      set({ exchangeRequests: data });
    } catch (error) {
      console.error('Failed to fetch exchange requests:', error);
    }
  },

  addExchangeRequest: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const newRequest = await res.json();
      set((state) => ({
        exchangeRequests: [newRequest, ...state.exchangeRequests],
      }));
      get().fetchMatches();
    } catch (error) {
      console.error('Failed to add exchange request:', error);
    }
  },

  fetchMatches: async () => {
    try {
      const res = await fetch(`${API_BASE}/exchange/matches`);
      const data = await res.json();
      set({ matches: data });
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    }
  },

  fetchMetaData: async () => {
    try {
      const [platformsRes, seriesRes, publishersRes] = await Promise.all([
        fetch(`${API_BASE}/cartridges/platforms`),
        fetch(`${API_BASE}/cartridges/series`),
        fetch(`${API_BASE}/cartridges/publishers`),
      ]);
      const [platforms, seriesList, publishers] = await Promise.all([
        platformsRes.json(),
        seriesRes.json(),
        publishersRes.json(),
      ]);
      set({ platforms, seriesList, publishers });
    } catch (error) {
      console.error('Failed to fetch meta data:', error);
    }
  },

  fetchNotifications: async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      const data = await res.json();
      set({ notifications: data });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications/unread-count`);
      const data = await res.json();
      set({ unreadCount: data.count });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  markNotificationAsRead: async (id: string) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
      });
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
      });
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },
}));
