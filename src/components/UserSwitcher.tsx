import { useState } from 'react';
import { useStore } from '../stores/useStore';
import { User, ChevronDown, Users } from 'lucide-react';
import type { User as UserType } from '../types';

const UserSwitcher = () => {
  const { currentUser, availableUsers, switchUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitchUser = (user: UserType) => {
    switchUser(user);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-darker-navy/50 rounded-lg border border-card-border hover:border-neon-purple transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="font-pixel text-xs text-neon-purple">当前身份</p>
          <p className="font-retro text-sm text-white">{currentUser.name}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-card-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="px-3 py-2 bg-darker-navy/50 border-b border-card-border">
              <p className="font-pixel text-xs text-neon-purple flex items-center gap-2">
                <Users className="w-4 h-4" />
                切换身份
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {availableUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSwitchUser(user)}
                  className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-darker-navy/50 transition-colors ${
                    currentUser.id === user.id ? 'bg-neon-purple/10' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
                    <span className="font-pixel text-xs text-white">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-retro text-sm ${currentUser.id === user.id ? 'text-neon-purple' : 'text-white'}`}>
                      {user.name}
                    </p>
                    <p className="font-retro text-xs text-gray-500">
                      ID: {user.id}
                    </p>
                  </div>
                  {currentUser.id === user.id && (
                    <div className="w-2 h-2 rounded-full bg-neon-green" />
                  )}
                </button>
              ))}
            </div>
            <div className="px-3 py-2 bg-darker-navy/30 border-t border-card-border">
              <p className="font-retro text-xs text-gray-500 text-center">
                用于测试双方评价功能
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserSwitcher;
