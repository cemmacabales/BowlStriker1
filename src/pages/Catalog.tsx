import React, { useState } from 'react';
import { Filter, Search, ChevronDown } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
const categories = ['All', 'Performance', 'Spare', 'Hybrid', 'Accessories'];
const priceRanges = ['All', 'Under $100', '$100 - $150', 'Over $150'];
export function Catalog() {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
    selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.
    toLowerCase().
    includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">
            Product Catalog
          </h1>
          <p className="text-white/60">
            Explore our collection of futuristic bowling equipment.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <GlassCard className="p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-primary-cyan">
                <Filter className="w-5 h-5" />
                <span className="font-bold">Filters</span>
              </div>

              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary-cyan/50 transition-colors" />

                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-white/80 mb-4 uppercase tracking-wider">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) =>
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category ? 'bg-primary-cyan/10 text-primary-cyan' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>

                      {category}
                    </button>
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-bold text-white/80 mb-4 uppercase tracking-wider">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range) =>
                  <label
                    key={range}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer group">

                      <div className="relative w-4 h-4 rounded-full border border-white/30 group-hover:border-primary-cyan transition-colors">
                        {range === 'All' &&
                      <div className="absolute inset-1 rounded-full bg-primary-cyan" />
                      }
                      </div>
                      <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                        {range}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </GlassCard>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/60">
                Showing {filteredProducts.length} results
              </p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                Sort by:
                <button className="flex items-center gap-1 font-medium hover:text-primary-cyan transition-colors">
                  Featured <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) =>
              <ProductCard key={product.id} product={product} />
              )}
            </div>

            {filteredProducts.length === 0 &&
            <div className="text-center py-20">
                <p className="text-xl text-white/40">
                  No products found matching your criteria.
                </p>
                <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 text-primary-cyan hover:underline">

                  Clear filters
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}