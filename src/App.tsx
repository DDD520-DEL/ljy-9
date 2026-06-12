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
import { useStore } from './stores/useStore';

function App() {
  const { fetchMetaData, fetchCartridges, fetchStats, fetchAchievements } = useStore();

  useEffect(() => {
    fetchMetaData();
    fetchCartridges();
    fetchStats();
    fetchAchievements();
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
          <Route path="/market" element={<Market />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/exchange" element={<Exchange />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
