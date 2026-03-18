import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { formatPrice } from '../lib/utils';
import { CheckCircle2, ArrowLeft, CreditCard, Truck } from 'lucide-react';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: cart,
        total: totalPrice * 1.08,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h2 className="text-4xl font-serif font-bold mb-4">Order Placed Successfully!</h2>
        <p className="text-cafe-dark/60 mb-10 max-w-md">Thank you for choosing Bean & Brew. We've received your order and our baristas are getting ready to prepare it.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-cafe-brown text-cafe-cream px-10 py-4 rounded-full font-bold hover:bg-cafe-gold hover:text-cafe-dark transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafe-cream py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center space-x-2 text-cafe-dark/60 hover:text-cafe-gold transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cart</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <h1 className="text-4xl font-serif font-bold mb-10">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-bold flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-cafe-gold" />
                  <span>Delivery Information</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-cafe-brown/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-cafe-gold transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-cafe-brown/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-cafe-gold transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-cafe-brown/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-cafe-gold transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Delivery Address</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white border border-cafe-brown/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-cafe-gold transition-all min-h-[120px]"
                      placeholder="Street address, City, State, Zip"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-cafe-brown/10">
                <h2 className="text-xl font-serif font-bold flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-cafe-gold" />
                  <span>Payment Method</span>
                </h2>
                <div className="p-6 bg-white border-2 border-cafe-gold rounded-3xl flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-cafe-dark rounded-md flex items-center justify-center text-white font-bold text-[10px]">VISA</div>
                    <div>
                      <p className="font-bold">Pay on Delivery</p>
                      <p className="text-xs text-cafe-dark/40">Secure payment at your doorstep</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-4 border-cafe-gold bg-cafe-gold" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-cafe-brown text-cafe-cream py-5 rounded-full font-bold text-lg hover:bg-cafe-gold hover:text-cafe-dark transition-all disabled:opacity-50 shadow-xl"
              >
                {loading ? "Processing..." : `Place Order • ${formatPrice(totalPrice * 1.08)}`}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-cafe-brown/5 sticky top-32">
              <h2 className="text-xl font-serif font-bold mb-8">Order Summary</h2>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-grow">
                      <h3 className="font-bold text-sm">{item.name}</h3>
                      <p className="text-xs text-cafe-dark/40">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-cafe-brown/10 space-y-4">
                <div className="flex justify-between text-sm text-cafe-dark/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-cafe-dark/60">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(totalPrice * 0.08)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4">
                  <span>Total</span>
                  <span className="text-cafe-gold">{formatPrice(totalPrice * 1.08)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
