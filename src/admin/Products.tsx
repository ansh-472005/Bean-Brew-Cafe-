import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Category } from '../types';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Check } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: '',
    isFeatured: false,
    status: 'available' as 'available' | 'out_of_stock'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodSnap, catSnap] = await Promise.all([
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'categories'))
      ]);
      setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), data);
      } else {
        await addDoc(collection(db, 'products'), data);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', categoryId: '', image: '', isFeatured: false, status: 'available' });
      fetchData();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      categoryId: product.categoryId,
      image: product.image,
      isFeatured: product.isFeatured,
      status: product.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, 'products', id));
      fetchData();
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-white rounded-3xl"></div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Product Management</h1>
          <p className="text-cafe-dark/40">Add, edit, or remove items from your café menu.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', categoryId: '', image: '', isFeatured: false, status: 'available' });
            setIsModalOpen(true);
          }}
          className="bg-cafe-gold text-cafe-dark px-8 py-4 rounded-full font-bold flex items-center space-x-2 hover:bg-cafe-beige transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-cafe-brown/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-cafe-cream/30">
            <tr className="text-left">
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Product</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Category</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Price</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Status</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cafe-brown/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-cafe-cream/20 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} className="w-12 h-12 rounded-xl object-cover" alt={product.name} referrerPolicy="no-referrer" />
                    <div>
                      <div className="font-bold flex items-center space-x-2">
                        <span>{product.name}</span>
                        {product.isFeatured && <span className="bg-cafe-gold/20 text-cafe-gold text-[8px] px-2 py-0.5 rounded-full uppercase">Featured</span>}
                      </div>
                      <div className="text-xs text-cafe-dark/40 truncate max-w-[200px]">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-medium">
                  {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                </td>
                <td className="px-8 py-6 font-bold text-cafe-gold">{formatPrice(product.price)}</td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    product.status === 'available' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {product.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(product)} className="p-2 text-cafe-dark/40 hover:text-cafe-gold transition-colors"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-cafe-dark/40 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-cafe-cream rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
            
            <h2 className="text-3xl font-serif font-bold mb-8">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Product Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Price ($)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Category</label>
                  <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold">
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold">
                    <option value="available">Available</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Image URL</label>
                  <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold" placeholder="https://..." />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-cafe-dark/40">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-cafe-cream border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cafe-gold min-h-[100px]" />
                </div>
                <div className="md:col-span-2 flex items-center space-x-3">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                    className={cn(
                      "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                      formData.isFeatured ? "bg-cafe-gold border-cafe-gold text-cafe-dark" : "border-cafe-brown/20"
                    )}
                  >
                    {formData.isFeatured && <Check className="h-4 w-4" />}
                  </button>
                  <span className="text-sm font-bold text-cafe-dark/60">Featured Product (Show on Homepage)</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-cafe-brown text-cafe-cream py-5 rounded-full font-bold text-lg hover:bg-cafe-gold hover:text-cafe-dark transition-all shadow-xl mt-8">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
