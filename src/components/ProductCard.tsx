import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-cafe-brown/5"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image || 'https://picsum.photos/seed/coffee/400/400'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {product.status === 'out_of_stock' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-cafe-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-serif font-bold text-cafe-dark group-hover:text-cafe-gold transition-colors">{product.name}</h3>
          <span className="text-cafe-gold font-bold">{formatPrice(product.price)}</span>
        </div>
        <p className="text-cafe-dark/60 text-sm line-clamp-2 mb-6 leading-relaxed">
          {product.description}
        </p>
        
        <button
          onClick={() => addToCart(product)}
          disabled={product.status === 'out_of_stock'}
          className="w-full flex items-center justify-center space-x-2 bg-cafe-brown text-cafe-cream py-3 rounded-xl font-bold hover:bg-cafe-gold hover:text-cafe-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
        >
          <Plus className="h-4 w-4 transition-transform group-hover/btn:rotate-90" />
          <span>Add to Cart</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
