import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { Clock, User, MapPin, Phone, Mail, Package, ChevronDown } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-white rounded-3xl"></div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-serif font-bold mb-2">Order Management</h1>
        <p className="text-cafe-dark/40">Track and manage customer orders in real-time.</p>
      </header>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-cafe-brown/5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8 pb-8 border-b border-cafe-brown/5">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-cafe-cream flex items-center justify-center text-cafe-gold">
                  <Package className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-serif font-bold">Order #{order.id.slice(-6).toUpperCase()}</h3>
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      order.status === 'completed' ? "bg-green-100 text-green-600" :
                      order.status === 'cancelled' ? "bg-red-100 text-red-600" :
                      "bg-orange-100 text-orange-600"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-cafe-dark/40 flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{order.createdAt?.toDate().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right mr-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40 mb-1">Total Amount</p>
                  <p className="text-2xl font-serif font-bold text-cafe-gold">{formatPrice(order.total)}</p>
                </div>
                <div className="relative group">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as any)}
                    className="appearance-none bg-cafe-brown text-cafe-cream px-8 py-4 rounded-full font-bold text-sm pr-12 focus:outline-none hover:bg-cafe-dark transition-all cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Customer Info */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-cafe-gold">Customer Details</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <User className="h-4 w-4 text-cafe-dark/40" />
                    <span className="font-bold">{order.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-4 w-4 text-cafe-dark/40" />
                    <span>{order.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="h-4 w-4 text-cafe-dark/40" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-start space-x-3 text-sm">
                    <MapPin className="h-4 w-4 text-cafe-dark/40 mt-1" />
                    <span className="leading-relaxed">{order.address}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="md:col-span-2 space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-cafe-gold">Order Items</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center space-x-4 bg-cafe-cream/30 p-4 rounded-2xl border border-cafe-brown/5">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt={item.name} referrerPolicy="no-referrer" />
                      <div className="flex-grow">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-cafe-dark/40">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-cafe-brown/20">
            <Package className="h-12 w-12 text-cafe-gold/20 mx-auto mb-4" />
            <p className="text-cafe-dark/40 font-serif text-xl">No orders found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
