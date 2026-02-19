import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useProducts, Product } from '../context/ProductContext';
export function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProductById } = useProducts();
  const isEditing = !!id;
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Performance',
    description: '',
    image:
    'https://images.unsplash.com/photo-1610050730990-25e9c0b02000?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    specs: {
      Coverstock: '',
      Core: '',
      Finish: ''
    }
  });
  useEffect(() => {
    if (isEditing && id) {
      const product = getProductById(id);
      if (product) {
        setFormData(product);
      } else {
        navigate('/admin/products');
      }
    }
  }, [id, isEditing, getProductById, navigate]);
  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>

  {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? parseFloat(value) : value
    }));
  };
  const handleSpecChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [key]: value
      }
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && id) {
      updateProduct(id, formData);
    } else {
      addProduct(formData as Omit<Product, 'id'>);
    }
    navigate('/admin/products');
  };
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">

          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold">
            {isEditing ? 'Edit Product' : 'New Product'}
          </h1>
          <p className="text-white/60">
            {isEditing ?
            `Editing ${formData.name}` :
            'Add a new item to your catalog'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6 space-y-6">
              <h3 className="text-lg font-bold border-b border-white/10 pb-4">
                Basic Information
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none transition-colors"
                  placeholder="e.g. Cyber Strike X1" />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none transition-colors" />

                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none transition-colors appearance-none">

                    <option value="Performance">Performance</option>
                    <option value="Spare">Spare</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none transition-colors resize-none"
                  placeholder="Product description..." />

              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-6">
              <h3 className="text-lg font-bold border-b border-white/10 pb-4">
                Technical Specs
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Coverstock
                  </label>
                  <input
                    type="text"
                    value={formData.specs?.Coverstock || ''}
                    onChange={(e) =>
                    handleSpecChange('Coverstock', e.target.value)
                    }
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none transition-colors" />

                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Core Type
                  </label>
                  <input
                    type="text"
                    value={formData.specs?.Core || ''}
                    onChange={(e) => handleSpecChange('Core', e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none transition-colors" />

                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Finish
                  </label>
                  <input
                    type="text"
                    value={formData.specs?.Finish || ''}
                    onChange={(e) => handleSpecChange('Finish', e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none transition-colors" />

                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Initial Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    max="5"
                    min="0"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none transition-colors" />

                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar / Image */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-6 space-y-6">
              <h3 className="text-lg font-bold border-b border-white/10 pb-4">
                Product Image
              </h3>

              <div className="aspect-square rounded-xl bg-black/40 border border-white/10 overflow-hidden relative group">
                {formData.image ?
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-contain p-4" /> :


                <div className="flex items-center justify-center h-full text-white/20">
                    <Upload className="w-12 h-12" />
                  </div>
                }
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none transition-colors text-sm"
                  placeholder="https://..." />

              </div>
            </GlassCard>

            <div className="pt-4">
              <GradientButton fullWidth size="lg" type="submit">
                <Save className="w-5 h-5 mr-2" />
                {isEditing ? 'Save Changes' : 'Create Product'}
              </GradientButton>
            </div>
          </div>
        </div>
      </form>
    </div>);

}