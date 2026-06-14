import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Collection from './pages/Collection';
import CartridgeDetail from './pages/CartridgeDetail';
import AddCartridge from './pages/AddCartridge';
import Market from './pages/Market';
import Achievements from './pages/Achievements';
import Showcase from './pages/Showcase';
import Exchange from './pages/Exchange';
import YearlyReview from './pages/YearlyReview';
import Wishlist from './pages/Wishlist';
import Leaderboard from './pages/Leaderboard';
import GameEncyclopedia from './pages/GameEncyclopedia';
import { useStore } from './stores/useStore';

function App() {
  const {
    fetchMetaData,
    fetchCartridges,
    fetchStats,
    fetchAchievements,
    fetchUnreadCount,
    fetchNotifications,
    fetchWishlist,
    theme,
  } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchMetaData();
    fetchCartridges();
    fetchStats();
    fetchAchievements();
    fetchUnreadCount();
    fetchNotifications();
    fetchWishlist();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-deep-navy">
      <Navbar />
      <main className="pb-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/add" element={<AddCartridge />} />
          <Route path="/collection/:id" element={<CartridgeDetail />} />
          <Route path="/encyclopedia" element={<GameEncyclopedia />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/market" element={<Market />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/yearly-review" element={<YearlyReview />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
