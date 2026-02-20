import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Truck,
  Shield,
  ChevronRight,
  Minus,
  Plus } from
'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getProductById } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('15lbs');
  const product = id ? getProductById(id) : undefined;
  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/catalog">
            <GradientButton>Back to Catalog</GradientButton>
          </Link>
        </div>
      </div>);

  }
  const weights = ['12lbs', '13lbs', '14lbs', '15lbs', '16lbs'];
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/catalog" className="hover:text-white transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary-cyan">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <GlassCard className="aspect-square flex items-center justify-center p-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-cyan/10 to-primary-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl animate-float" />

            </GlassCard>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) =>
              <GlassCard
                key={i}
                className="aspect-square p-2 cursor-pointer hover:border-primary-cyan/50 transition-colors">

                  <img
                  src={product.image_url}
                  alt="View"
                  className="w-full h-full object-contain" />

                </GlassCard>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-primary-cyan/10 text-primary-cyan text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center text-yellow-400 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 font-bold">{product.rating}</span>
                  <span className="text-white/40 ml-1">
                    ({product.reviews || 0} reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-purple">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-white/70 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Selection Controls */}
            <div className="space-y-6 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <label className="block text-sm font-bold text-white/80 mb-3">
                  Select Weight
                </label>
                <div className="flex flex-wrap gap-3">
                  {weights.map((weight) =>
                  <button
                    key={weight}
                    onClick={() => setSelectedWeight(weight)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedWeight === weight ? 'bg-primary-cyan text-black shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}>

                      {weight}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/80 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:text-primary-cyan transition-colors">

                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:text-primary-cyan transition-colors">

                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-white/50">
                    {quantity > 1 ?
                    `${quantity} items selected` :
                    '1 item selected'}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <GradientButton
                  fullWidth
                  size="lg"
                  onClick={() => addToCart(product, quantity, selectedWeight)}>

                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </GradientButton>
              </div>
            </div>

            {/* Features/Specs */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <Truck className="w-6 h-6 text-primary-cyan mt-1" />
                <div>
                  <h4 className="font-bold">Free Shipping</h4>
                  <p className="text-sm text-white/50">On orders over $150</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <Shield className="w-6 h-6 text-primary-purple mt-1" />
                <div>
                  <h4 className="font-bold">2 Year Warranty</h4>
                  <p className="text-sm text-white/50">
                    Full coverage protection
                  </p>
                </div>
              </div>
            </div>

            {/* Specs Table */}
            {product.specs &&
            <div className="mt-8">
                <h3 className="text-xl font-display font-bold mb-4">
                  Technical Specifications
                </h3>
                <div className="rounded-xl border border-white/10 overflow-hidden">
                  {Object.entries(product.specs).map(([key, value], index) =>
                <div
                  key={key}
                  className={`flex justify-between p-4 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}>

                      <span className="text-white/60">{key}</span>
                      <span className="font-medium text-white">{String(value)}</span>
                    </div>
                )}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}