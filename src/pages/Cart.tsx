import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Coffee } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-cafe-gold/20 mb-8">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4">Your cart is empty</h2>
        <p className="text-cafe-dark/60 mb-10 max-w-md">Looks like you haven't added anything to your cart yet. Explore our menu and find something delicious!</p>
        <Link to="/menu" className="bg-cafe-brown text-cafe-cream px-10 py-4 rounded-full font-bold hover:bg-cafe-gold hover:text-cafe-dark transition-all">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafe-cream py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-6 flex items-center shadow-sm border border-cafe-brown/5"
              >
                <img 
                  src={item.image || 'https://picsum.photos/seed/coffee/200/200'} 
                  alt={item.name}
                  className="w-24 h-24 rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="ml-6 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-serif font-bold">{item.name}</h3>
                      <p className="text-cafe-gold font-bold mt-1">{formatPrice(item.price)}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-cafe-dark/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-4 space-x-4">
                    <div className="flex items-center bg-cafe-cream rounded-full px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-cafe-gold transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="mx-4 font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-cafe-gold transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm font-medium text-cafe-dark/40">
                      Subtotal: {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-cafe-brown text-cafe-cream rounded-3xl p-8 sticky top-32 shadow-xl">
              <h2 className="text-xl font-serif font-bold mb-8 pb-4 border-b border-white/10">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/60">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax (Estimated)</span>
                  <span>{formatPrice(totalPrice * 0.08)}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-cafe-gold">{formatPrice(totalPrice * 1.08)}</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="w-full bg-cafe-gold text-cafe-dark py-4 rounded-full font-bold flex items-center justify-center space-x-2 hover:bg-cafe-beige transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <div className="mt-8 flex items-center justify-center space-x-2 text-xs text-white/40 uppercase tracking-widest">
                <Coffee className="h-3 w-3" />
                <span>Freshly Brewed for You</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
