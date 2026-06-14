import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Library,
  TrendingUp,
  Trophy,
  Share2,
  Repeat,
  Gamepad2,
  Bell,
  X,
  CheckCheck,
  ArrowRight,
  User,
  Sparkles,
  Heart,
  Award,
  BookOpen,
  Sun,
  Moon,
  Clock,
  Layers,
} from 'lucide-react';
import { useStore } from '../stores/useStore';
import { formatRelativeTime } from '../utils/format';
import UserSwitcher from './UserSwitcher';

const Navbar = () => {
  const navigate = useNavigate();
  const {
    unreadCount,
    notifications,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    wishlist,
    theme,
    toggleTheme,
  } = useStore();

  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', label: '仪表盘', icon: LayoutDashboard },
    { path: '/collection', label: '藏品库', icon: Library },
    { path: '/collection/timeline', label: '时间轴', icon: Clock },
    { path: '/encyclopedia', label: '游戏百科', icon: BookOpen },
    { path: '/platforms', label: '平台专区', icon: Layers },
    { path: '/wishlist', label: '愿望单', icon: Heart, badge: wishlist.length },
    { path: '/yearly-review', label: '年度回顾', icon: Sparkles },
    { path: '/market', label: '行情中心', icon: TrendingUp },
    { path: '/achievements', label: '成就中心', icon: Trophy },
    { path: '/leaderboard', label: '排行榜', icon: Award },
    { path: '/showcase', label: '我的展示', icon: Share2 },
    { path: '/exchange', label: '交换广场', icon: Repeat },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel]);

  const handleTogglePanel = () => {
    if (!showPanel) {
      fetchNotifications();
      fetchUnreadCount();
    }
    setShowPanel(!showPanel);
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
    }
    setShowPanel(false);
    navigate('/exchange');
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
  };

  return (
    <nav className="bg-darker-navy border-b-4 border-neon-purple/50 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-cyan rounded flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-pixel text-lg text-white neon-glow-purple group-hover:text-neon-purple transition-colors">
            RetroVault
          </span>
        </NavLink>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-4 py-2 font-retro text-lg transition-all duration-200 border-2 ${
                  isActive
                    ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-neon-purple'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden md:inline">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-neon-pink text-white text-[10px] font-pixel rounded-full flex items-center justify-center border-2 border-darker-navy">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-lg bg-card-bg border-2 border-card-border flex items-center justify-center text-gray-400 hover:text-white hover:border-neon-purple transition-all group"
            title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 group-hover:text-neon-amber transition-colors" />
            ) : (
              <Moon className="w-5 h-5 group-hover:text-neon-purple transition-colors" />
            )}
          </button>

          <div className="relative" ref={panelRef}>
            <button
              onClick={handleTogglePanel}
              className="relative w-10 h-10 rounded-lg bg-card-bg border-2 border-card-border flex items-center justify-center text-gray-400 hover:text-white hover:border-neon-purple transition-all group"
            >
              <Bell className="w-5 h-5 group-hover:text-neon-purple transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-neon-pink text-white text-[10px] font-pixel rounded-full flex items-center justify-center border-2 border-darker-navy animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showPanel && (
              <div className="absolute right-0 top-12 w-96 card-pixel rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b-2 border-card-border flex items-center justify-between bg-darker-navy">
                  <h3 className="font-pixel text-sm text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-neon-purple" />
                    交换匹配通知
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-neon-pink/20 text-neon-pink text-[10px] font-pixel rounded">
                        {unreadCount} 条未读
                      </span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 text-xs font-retro text-neon-cyan hover:text-neon-purple transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      全部已读
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="font-retro text-gray-500">暂无通知</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`px-4 py-3 border-b border-card-border/50 cursor-pointer transition-all hover:bg-white/5 ${
                          !notification.isRead ? 'bg-neon-purple/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                notification.matchType === 'HAVE'
                                  ? 'bg-neon-cyan/20'
                                  : 'bg-neon-pink/20'
                              }`}
                            >
                              <User
                                className={`w-5 h-5 ${
                                  notification.matchType === 'HAVE'
                                    ? 'text-neon-cyan'
                                    : 'text-neon-pink'
                                }`}
                              />
                            </div>
                            {!notification.isRead && (
                              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-neon-pink rounded-full border-2 border-darker-navy" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-retro text-white text-sm">
                                {notification.matchUserName}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 text-[10px] font-pixel rounded ${
                                  notification.matchType === 'HAVE'
                                    ? 'bg-neon-cyan/20 text-neon-cyan'
                                    : 'bg-neon-pink/20 text-neon-pink'
                                }`}
                              >
                                {notification.matchType === 'HAVE' ? '出让' : '求购'}
                              </span>
                              <span className="px-1.5 py-0.5 bg-neon-green/20 text-neon-green text-[10px] font-pixel rounded">
                                {notification.score}%匹配
                              </span>
                            </div>
                            <p className="font-pixel text-xs text-white mb-1">
                              {notification.matchCartridgeTitle}
                            </p>
                            <p className="font-retro text-xs text-gray-400 mb-1">
                              {notification.details}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-retro text-xs text-gray-500">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                              <span className="font-retro text-xs text-neon-purple flex items-center gap-1">
                                查看详情
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div
                  className="px-4 py-3 border-t-2 border-card-border bg-darker-navy cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => {
                    setShowPanel(false);
                    navigate('/exchange');
                  }}
                >
                  <p className="font-retro text-sm text-neon-cyan text-center flex items-center justify-center gap-2">
                    前往交换广场
                    <ArrowRight className="w-4 h-4" />
                  </p>
                </div>
              </div>
            )}
          </div>

          <UserSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
