import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { supabase } from '../lib/supabase';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { ArrowLeft, Save, AlertCircle, Upload, X, Image as ImageIcon } from 'lucide-react';

export function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Bowling Balls',
    stock: '0',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const product = products.find((p) => p.id === id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          image_url: product.image_url,
          category: product.category,
          stock: product.stock?.toString() || '0',
        });
        setImagePreview(product.image_url);
      }
    }
  }, [id, isEditing, products]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        // Provide helpful error messages
        if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('not found')) {
          throw new Error('Storage bucket "product-images" not found. Please run supabase-storage-setup.sql in your Supabase SQL Editor.');
        }
        if (uploadError.message?.includes('security') || uploadError.message?.includes('policy') || uploadError.message?.includes('violates')) {
          throw new Error('Upload permission denied. Make sure your admin profile has is_admin=true and storage policies are set up.');
        }
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if file is selected
      if (imageFile) {
        setUploading(true);
        try {
          // Set a 30-second timeout for upload
          const uploadPromise = uploadImage(imageFile);
          const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error('Upload timeout - please try a smaller image or use URL instead')), 30000)
          );

          imageUrl = await Promise.race([uploadPromise, timeoutPromise]);
        } catch (uploadError) {
          setUploading(false);
          throw new Error(
            uploadError instanceof Error
              ? uploadError.message
              : 'Failed to upload image'
          );
        } finally {
          setUploading(false);
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: imageUrl,
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
      };

      if (isEditing) {
        await updateProduct(id, productData);
        setSuccess('Product updated successfully!');
      } else {
        await addProduct(productData);
        setSuccess('Product created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Update preview if image URL is changed
    if (e.target.name === 'image_url') {
      setImagePreview(e.target.value);
      setImageFile(null); // Clear file if URL is manually entered
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, image_url: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Product' : 'New Product'}
          </h1>
        </div>
      </div>

      <GlassCard className="p-6">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="e.g., Storm IQ Tour Emerald"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="Performance">Performance</option>
                <option value="Spare">Spare</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Shoes">Shoes</option>
                <option value="Bags">Bags</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Price (₱) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="0"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Product Image *
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File Upload */}
              <div>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-cyan-500/50 transition-colors bg-white/5">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-white/40 mb-2" />
                    <p className="text-sm text-white/60">
                      {imageFile ? imageFile.name : 'Click to upload image'}
                    </p>
                    <p className="text-xs text-white/40 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* URL Input */}
              <div className="flex flex-col justify-center">
                <p className="text-sm text-white/60 mb-2">Or enter image URL:</p>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative">
                <label className="block text-sm font-medium mb-2">
                  Preview
                </label>
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="24" text-anchor="middle" x="200" y="150"%3EInvalid Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {!imagePreview && !imageFile && !formData.image_url && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <p className="text-sm text-yellow-400">
                  Please upload an image or provide an image URL
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none"
              placeholder="Describe the product features, specifications, and benefits..."
            />
          </div>

          <div className="flex gap-4">
            <GradientButton
              type="submit"
              disabled={loading || uploading || (!imageFile && !formData.image_url)}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Upload className="w-5 h-5 animate-pulse" />
                  Uploading...
                </>
              ) : loading ? (
                <>
                  <Save className="w-5 h-5" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditing ? 'Update Product' : 'Create Product'}
                </>
              )}
            </GradientButton>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              disabled={loading || uploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}