import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';
import { Save, Globe, Info, Phone, Mail, MapPin } from 'lucide-react';

const SettingsView = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    aboutText: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    googleMapsUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'global'));
        if (snap.exists()) {
          setSettings(snap.data() as SiteSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-white rounded-3xl"></div>;

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Site Settings</h1>
          <p className="text-cafe-dark/40">Manage global content and configuration for your website.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="bg-cafe-brown text-cafe-cream px-8 py-4 rounded-full font-bold flex items-center space-x-2 hover:bg-cafe-gold hover:text-cafe-dark transition-all shadow-lg disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-cafe-brown/5 space-y-8">
          <h2 className="text-xl font-serif font-bold flex items-center space-x-3">
            <Globe className="h-5 w-5 text-cafe-gold" />
            <span>Hero Section</span>
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Hero Title</label>
              <input type="text" value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Hero Subtitle</label>
              <textarea value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Hero Image URL</label>
              <input type="url" value={settings.heroImage} onChange={e => setSettings({...settings, heroImage: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-cafe-brown/5 space-y-8">
          <h2 className="text-xl font-serif font-bold flex items-center space-x-3">
            <Info className="h-5 w-5 text-cafe-gold" />
            <span>About Section</span>
          </h2>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">About Us Content</label>
            <textarea value={settings.aboutText} onChange={e => setSettings({...settings, aboutText: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold min-h-[300px]" />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-cafe-brown/5 space-y-8 lg:col-span-2">
          <h2 className="text-xl font-serif font-bold flex items-center space-x-3">
            <Mail className="h-5 w-5 text-cafe-gold" />
            <span>Contact Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Contact Email</label>
              <input type="email" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Contact Phone</label>
              <input type="text" value={settings.contactPhone} onChange={e => setSettings({...settings, contactPhone: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Google Maps URL</label>
              <input type="url" value={settings.googleMapsUrl} onChange={e => setSettings({...settings, googleMapsUrl: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Full Address</label>
              <input type="text" value={settings.contactAddress} onChange={e => setSettings({...settings, contactAddress: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;
