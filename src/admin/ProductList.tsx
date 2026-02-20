import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { Plus, Edit2, Trash2, AlertCircle, Loader } from 'lucide-react';

export function ProductList() {
  const { products, loading, error, deleteProduct } = useProducts();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteProduct(id);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link to="/admin/products/new">
            <GradientButton className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Product
            </GradientButton>
          </Link>
        </div>
        <GlassCard className="p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-white/60">Loading products...</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link to="/admin/products/new">
            <GradientButton className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Product
            </GradientButton>
          </Link>
        </div>
        <GlassCard className="p-6">
          <div className="flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Error loading products</p>
              <p className="text-sm text-red-400/80">{error}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-white/60 mt-1">
            Manage your product catalog ({products.length} items)
          </p>
        </div>
        <Link to="/admin/products/new">
          <GradientButton className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Product
          </GradientButton>
        </Link>
      </div>

      {products.length === 0 ? (
        <GlassCard className="p-12">
          <div className="text-center">
            <p className="text-white/60 mb-4">No products yet</p>
            <Link to="/admin/products/new">
              <GradientButton className="flex items-center gap-2 mx-auto">
                <Plus className="w-5 h-5" />
                Add Your First Product
              </GradientButton>
            </Link>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <GlassCard key={product.id} className="p-6">
              <div className="flex items-center gap-6">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/96?text=No+Image';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                  <p className="text-white/60 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300">
                      {product.category}
                    </span>
                    <span className="text-white/80">
                      ₱{product.price.toFixed(2)}
                    </span>
                    {product.stock !== undefined && (
                      <span className="text-white/60">
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/products/edit/${product.id}`}>
                    <button className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors disabled:opacity-50"
                  >
                    {deletingId === product.id ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}