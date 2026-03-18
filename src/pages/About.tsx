import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';
import { motion } from 'framer-motion';
import { Coffee, Heart, Users, Leaf } from 'lucide-react';

const About = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const snap = await getDoc(doc(db, 'settings', 'global'));
      if (snap.exists()) setSettings(snap.data() as SiteSettings);
    };
    fetchSettings();
  }, []);

  const aboutText = settings?.aboutText || "Founded in 2010, Bean & Brew started with a simple mission: to serve the best coffee in the city while creating a community space where everyone feels welcome. We believe that coffee is more than just a drink—it's an experience, a ritual, and a way to connect.";

  return (
    <div className="bg-cafe-cream">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1920" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="About Hero"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-cafe-dark/60" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
          >
            Our Story
          </motion.h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">Crafting moments of joy, one cup at a time.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl -mt-40 relative z-20">
            <div className="flex justify-center mb-10">
              <Coffee className="h-12 w-12 text-cafe-gold" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-center mb-10">The Heart of Bean & Brew</h2>
            <div className="prose prose-lg max-w-none text-cafe-dark/70 leading-relaxed space-y-6">
              {aboutText.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: Heart, title: "Passion", desc: "We love what we do, and it shows in every cup we serve." },
              { icon: Users, title: "Community", desc: "Building a space where everyone belongs and connects." },
              { icon: Leaf, title: "Sustainability", desc: "Ethically sourced beans and eco-friendly practices." }
            ].map((value, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cafe-cream text-cafe-gold mb-4 rotate-3">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif font-bold">{value.title}</h3>
                <p className="text-cafe-dark/60 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
