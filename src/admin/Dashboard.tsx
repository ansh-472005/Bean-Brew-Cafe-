import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coffee, 
  ShoppingBag, 
  Settings, 
  MessageSquare, 
  Layers, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

// Admin Views
import Overview from './Overview';
import Products from './Products';
import Orders from './Orders';
import Categories from './Categories';
import SettingsView from './Settings';
import Messages from './Messages';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', path: '/admin/products', icon: Coffee },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cafe-cream flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-cafe-dark text-white p-8 flex flex-col">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 bg-cafe-gold rounded-xl flex items-center justify-center text-cafe-dark">
            <Coffee className="h-6 w-6" />
          </div>
          <span className="text-xl font-serif font-bold">Admin Panel</span>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl transition-all group",
                  isActive 
                    ? "bg-cafe-gold text-cafe-dark font-bold shadow-lg" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center space-x-3 p-4 text-white/40 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
