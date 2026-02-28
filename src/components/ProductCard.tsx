import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GradientButton } from './GradientButton';
import { Product, useCart } from '../context/CartContext';
interface ProductCardProps {
  product: Product;
}
export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  return (
    <GlassCard
      className="group relative overflow-hidden flex flex-col h-full"
      hoverEffect>

      {/* Image Container */}
      <div className="relative h-64 p-6 flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent">
        <div className="absolute inset-0 bg-primary-cyan/5 rounded-full blur-3xl scale-0 group-hover:scale-100 transition-transform duration-700" />
        <img
          src={product.image_url}
          alt={product.name}
          className="relative z-10 w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500" />


        {/* Quick Add Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <GradientButton
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            size="sm">

            <ShoppingBag className="w-4 h-4 mr-2" />
            Quick Add
          </GradientButton>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="text-xs font-medium text-primary-cyan uppercase tracking-wider">
            {product.category}
          </div>
          <div className="flex items-center text-yellow-400 text-xs">
            <Star className="w-3 h-3 fill-current" />
            <span className="ml-1">{product.rating}</span>
          </div>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="block group-hover:text-primary-cyan transition-colors">

          <h3 className="text-lg font-display font-bold text-white mb-1 truncate">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-white/60 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-white">
            ₱{product.price.toFixed(2)}
          </span>
          <Link to={`/product/${product.id}`}>
            <span className="text-sm text-white/50 hover:text-white transition-colors">
              View Details →
            </span>
          </Link>
        </div>
      </div>
    </GlassCard>);

}