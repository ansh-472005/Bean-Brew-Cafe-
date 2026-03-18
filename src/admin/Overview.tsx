import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Order, Product, ContactMessage } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { 
  TrendingUp, 
  ShoppingBag, 
  Coffee, 
  MessageSquare,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const Overview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalMessages: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersSnap, productsSnap, messagesSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'messages'))
        ]);

        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.total : 0), 0);

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: productsSnap.size,
          totalMessages: messagesSnap.size
        });

        // Get 5 most recent orders
        const recentQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(recentQuery);
        setRecentOrders(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));

      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-4 gap-6"><div className="h-32 bg-white rounded-3xl"></div><div className="h-32 bg-white rounded-3xl"></div><div className="h-32 bg-white rounded-3xl"></div><div className="h-32 bg-white rounded-3xl"></div></div>
    <div className="h-96 bg-white rounded-3xl"></div>
  </div>;

  const statCards = [
    { name: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Products', value: stats.totalProducts, icon: Coffee, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Customer Messages', value: stats.totalMessages, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-serif font-bold mb-2">Dashboard Overview</h1>
        <p className="text-cafe-dark/40">Welcome back! Here's what's happening with Bean & Brew today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-cafe-brown/5"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.bg, stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-cafe-dark/40 uppercase tracking-widest mb-1">{stat.name}</p>
            <p className="text-3xl font-serif font-bold text-cafe-dark">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-cafe-brown/5">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-serif font-bold">Recent Orders</h2>
          <button className="text-cafe-gold font-bold text-sm flex items-center space-x-2 hover:underline">
            <span>View All Orders</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-cafe-brown/5">
                <th className="pb-6 text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Customer</th>
                <th className="pb-6 text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Status</th>
                <th className="pb-6 text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Total</th>
                <th className="pb-6 text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cafe-brown/5">
              {recentOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-cafe-cream/30 transition-colors">
                  <td className="py-6">
                    <div className="font-bold">{order.customerName}</div>
                    <div className="text-xs text-cafe-dark/40">{order.email}</div>
                  </td>
                  <td className="py-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      order.status === 'completed' ? "bg-green-100 text-green-600" :
                      order.status === 'cancelled' ? "bg-red-100 text-red-600" :
                      "bg-orange-100 text-orange-600"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-6 font-bold">{formatPrice(order.total)}</td>
                  <td className="py-6 text-sm text-cafe-dark/40 flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{order.createdAt?.toDate().toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <div className="text-center py-12 text-cafe-dark/40 italic">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
