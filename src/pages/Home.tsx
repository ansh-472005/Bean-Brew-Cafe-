import React, { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, SiteSettings, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Coffee, Star, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsQuery = query(collection(db, 'products'), where('isFeatured', '==', true), limit(4));
        const productsSnap = await getDocs(productsQuery);
        setFeaturedProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));

        // Fetch categories
        const categoriesSnap = await getDocs(collection(db, 'categories'));
        setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));

        // Fetch settings
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as SiteSettings);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroTitle = settings?.heroTitle || "Experience the Art of Coffee";
  const heroSubtitle = settings?.heroSubtitle || "Handcrafted brews, artisanal snacks, and a cozy atmosphere. Your daily escape starts here.";
  const heroImage = settings?.heroImage || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1920";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafe-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cafe-gold"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            className="w-full h-full object-cover" 
            alt="Café Hero"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              {heroTitle}
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/menu" 
                className="bg-cafe-gold text-cafe-dark px-8 py-4 rounded-full font-bold text-center hover:bg-cafe-beige transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore Menu</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/about" 
                className="border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-center hover:bg-white/10 transition-all"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Coffee, title: "Premium Beans", desc: "Sourced from the finest high-altitude farms globally." },
              { icon: Star, title: "Expert Baristas", desc: "Trained professionals dedicated to the perfect pour." },
              { icon: Clock, title: "Cozy Ambiance", desc: "The perfect space for work, meetings, or relaxation." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cafe-cream text-cafe-gold mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif font-bold">{feature.title}</h3>
                <p className="text-cafe-dark/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-cafe-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-xs font-bold text-cafe-gold uppercase tracking-[0.3em] mb-4">Chef's Choice</h2>
              <h3 className="text-4xl font-serif font-bold">Featured Delights</h3>
            </div>
            <Link to="/menu" className="hidden md:flex items-center space-x-2 text-cafe-gold font-bold hover:text-cafe-brown transition-colors">
              <span>View Full Menu</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-cafe-dark/40 italic">
                No featured products yet. Visit the admin panel to add some!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold mb-6">Browse by Category</h2>
            <p className="text-cafe-dark/60">From rich espressos to flaky pastries, find exactly what you're craving.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <Link 
                key={cat.id} 
                to={`/menu?category=${cat.id}`}
                className="relative h-64 rounded-3xl overflow-hidden group shadow-lg"
              >
                <img 
                  src={cat.image || 'https://picsum.photos/seed/cat/600/400'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2">{cat.name}</h3>
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-cafe-brown text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cafe-gold/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cafe-gold/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Ready for a Coffee Break?</h2>
          <p className="text-xl text-white/70 mb-12 leading-relaxed">
            Order online for quick pickup or visit us to experience the perfect atmosphere. We're waiting for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/menu" className="bg-cafe-gold text-cafe-dark px-10 py-4 rounded-full font-bold hover:bg-cafe-beige transition-all">
              Order Online Now
            </Link>
            <Link to="/contact" className="border border-white/30 px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
              Find Our Location
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
