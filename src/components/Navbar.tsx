import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Library,
  TrendingUp,
  Trophy,
  Share2,
  Repeat,
  Gamepad2,
} from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { path: '/', label: '仪表盘', icon: LayoutDashboard },
    { path: '/collection', label: '藏品库', icon: Library },
    { path: '/market', label: '行情中心', icon: TrendingUp },
    { path: '/achievements', label: '成就中心', icon: Trophy },
    { path: '/showcase', label: '我的展示', icon: Share2 },
    { path: '/exchange', label: '交换广场', icon: Repeat },
  ];

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
                `flex items-center gap-2 px-4 py-2 font-retro text-lg transition-all duration-200 border-2 ${
                  isActive
                    ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-neon-purple'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden md:inline">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center font-pixel text-xs text-white">
            PX
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
