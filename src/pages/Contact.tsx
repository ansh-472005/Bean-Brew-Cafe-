import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const snap = await getDoc(doc(db, 'settings', 'global'));
      if (snap.exists()) setSettings(snap.data() as SiteSettings);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cafe-cream min-h-screen">
      <div className="bg-cafe-brown text-white py-24 px-4 text-center">
        <h1 className="text-5xl font-serif font-bold mb-6">Get in Touch</h1>
        <p className="text-white/60 max-w-xl mx-auto">Have a question or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you shortly.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl p-10 shadow-xl space-y-8">
              <h2 className="text-2xl font-serif font-bold mb-8">Contact Info</h2>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-cafe-cream flex items-center justify-center text-cafe-gold shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40 mb-1">Our Location</p>
                  <p className="font-medium">{settings?.contactAddress || "123 Coffee Lane, Brew City"}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-cafe-cream flex items-center justify-center text-cafe-gold shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40 mb-1">Phone Number</p>
                  <p className="font-medium">{settings?.contactPhone || "+1 (555) 123-4567"}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-cafe-cream flex items-center justify-center text-cafe-gold shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40 mb-1">Email Address</p>
                  <p className="font-medium">{settings?.contactEmail || "hello@beanandbrew.com"}</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-cafe-beige/20 rounded-3xl h-64 overflow-hidden shadow-inner flex items-center justify-center border-2 border-dashed border-cafe-brown/10">
              <div className="text-center p-8">
                <MapPin className="h-8 w-8 text-cafe-gold mx-auto mb-4" />
                <p className="text-sm font-medium text-cafe-dark/40">Interactive Map Integration</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl h-full">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold mb-4">Message Sent!</h2>
                  <p className="text-cafe-dark/60 mb-10 max-w-sm">Thank you for reaching out. We've received your message and will respond as soon as possible.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-cafe-gold font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <h2 className="text-3xl font-serif font-bold mb-10">Send us a Message</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Your Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold transition-all"
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
                        className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Subject</label>
                      <input
                        required
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold transition-all"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Message</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold transition-all min-h-[160px]"
                        placeholder="Tell us more..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-cafe-brown text-cafe-cream px-12 py-5 rounded-full font-bold flex items-center justify-center space-x-3 hover:bg-cafe-gold hover:text-cafe-dark transition-all disabled:opacity-50 shadow-lg"
                  >
                    <span>{loading ? "Sending..." : "Send Message"}</span>
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
