import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Star } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useProducts } from '../context/ProductContext';
export function ProductList() {
  const { products, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const filteredProducts = products.filter(
    (p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Products</h1>
          <p className="text-white/60">Manage your inventory</p>
        </div>
        <Link to="/admin/products/new">
          <GradientButton>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </GradientButton>
        </Link>
      </div>

      <GlassCard className="p-6">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-primary-cyan/50 transition-all" />

        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-sm">
                <th className="pb-4 font-medium pl-4">Product</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">Price</th>
                <th className="pb-4 font-medium">Rating</th>
                <th className="pb-4 font-medium text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) =>
              <tr
                key={product.id}
                className="group hover:bg-white/5 transition-colors">

                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/5 p-1 border border-white/10">
                        <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain" />

                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {product.name}
                        </div>
                        <div className="text-xs text-white/40 line-clamp-1 max-w-[200px]">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/10">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-white">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <button className="p-2 text-white/40 hover:text-primary-cyan hover:bg-primary-cyan/10 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">

                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredProducts.length === 0 &&
          <div className="text-center py-12">
              <p className="text-white/40">
                No products found matching your search.
              </p>
            </div>
          }
        </div>
      </GlassCard>
    </div>);

}