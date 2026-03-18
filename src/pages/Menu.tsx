import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Coffee } from 'lucide-react';
import { cn } from '../lib/utils';

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsSnap, categoriesSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'categories'))
        ]);

        setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafe-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cafe-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafe-cream pb-24">
      {/* Header */}
      <div className="bg-cafe-brown text-white py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-serif font-bold mb-4">Our Menu</h1>
          <p className="text-white/60 max-w-xl mx-auto">Explore our curated selection of artisanal coffees, handmade pastries, and savory delights.</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Filters & Search */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            <button
              onClick={() => setSearchParams({})}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                activeCategory === 'all' ? "bg-cafe-gold text-cafe-dark" : "bg-cafe-cream text-cafe-dark/60 hover:bg-cafe-beige"
              )}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.id })}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                  activeCategory === cat.id ? "bg-cafe-gold text-cafe-dark" : "bg-cafe-cream text-cafe-dark/60 hover:bg-cafe-beige"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cafe-dark/40" />
            <input
              type="text"
              placeholder="Search our menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-cafe-cream rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cafe-gold transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-24"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white text-cafe-gold/20 mb-6">
                  <Coffee className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-cafe-dark/40">No items found</h3>
                <p className="text-cafe-dark/40 mt-2">Try adjusting your filters or search query.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Menu;
