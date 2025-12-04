import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, DollarSign, Settings, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/my-ebooks', icon: BookOpen, label: 'My E-books' },
    { path: '/marketplace', icon: TrendingUp, label: 'E-books' },
    { path: '/withdraw', icon: DollarSign, label: 'Withdraw Money' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/subscriptions', icon: CreditCard, label: 'Subscriptions' }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          EbookHub
        </h1>
        <p className="text-xs text-slate-400 mt-1">Digital Publishing Platform</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:bg-red-950 hover:text-red-300 transition-all"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;