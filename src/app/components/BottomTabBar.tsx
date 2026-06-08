import { Home, MessageCircle, Search, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

export function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'analyze', label: 'Analyze', icon: Search, path: '/input' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/chat-tab' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/input') {
      return location.pathname === '/input' || location.pathname === '/result' || location.pathname === '/chat';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white border-t border-black/10 px-4 py-3">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              <div className={`p-2 rounded-full transition-colors ${active ? 'bg-[#FF6B4A]' : 'bg-transparent'}`}>
                <Icon size={20} className={active ? 'text-white' : 'text-black/40'} strokeWidth={2} />
              </div>
              <span className={`text-xs ${active ? 'text-black' : 'text-black/40'}`} style={{ fontWeight: active ? 600 : 400 }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
