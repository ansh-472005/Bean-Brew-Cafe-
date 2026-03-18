import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Category } from '../types';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'categories'));
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), formData);
      } else {
        await addDoc(collection(db, 'categories'), formData);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', image: '' });
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, slug: cat.slug, image: cat.image || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure? This will not delete products in this category, but they will become uncategorized.")) {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-white rounded-3xl"></div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Categories</h1>
          <p className="text-cafe-dark/40">Organize your menu items into logical groups.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', image: '' });
            setIsModalOpen(true);
          }}
          className="bg-cafe-gold text-cafe-dark px-8 py-4 rounded-full font-bold flex items-center space-x-2 hover:bg-cafe-beige transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-cafe-brown/5 group">
            <div className="h-48 relative">
              <img src={cat.image || 'https://picsum.photos/seed/cat/600/400'} className="w-full h-full object-cover" alt={cat.name} referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(cat)} className="p-2 bg-white text-cafe-dark rounded-full shadow-lg hover:text-cafe-gold"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 bg-white text-cafe-dark rounded-full shadow-lg hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-serif font-bold mb-1">{cat.name}</h3>
              <p className="text-xs text-cafe-dark/40 font-mono uppercase tracking-widest">/{cat.slug}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-cafe-cream rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-3xl font-serif font-bold mb-8">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Category Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Slug (URL Path)</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Image URL</label>
                <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
              </div>
              <button type="submit" className="w-full bg-cafe-brown text-cafe-cream py-5 rounded-full font-bold text-lg hover:bg-cafe-gold hover:text-cafe-dark transition-all shadow-xl mt-4">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
