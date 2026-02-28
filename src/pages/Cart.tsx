import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useCart } from '../context/CartContext';
export function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <GlassCard className="max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-white/30" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">
            Your cart is empty
          </h2>
          <p className="text-white/60 mb-8">
            Looks like you haven't added any gear yet.
          </p>
          <Link to="/catalog">
            <GradientButton>Start Shopping</GradientButton>
          </Link>
        </GlassCard>
      </div>);

  }
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) =>
              <GlassCard
                key={`${item.id}-${item.selectedSize}`}
                className="p-4 flex gap-4 items-center">

                <div className="w-24 h-24 bg-white/5 rounded-lg p-2 flex-shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-contain" />

                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg truncate pr-4">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/40 hover:text-red-400 transition-colors">

                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-white/50 mb-4">
                    {item.category} • {item.selectedSize}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10 h-8">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 hover:text-primary-cyan transition-colors">

                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 hover:text-primary-cyan transition-colors">

                        +
                      </button>
                    </div>
                    <span className="font-bold text-lg">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </GlassCard>
            )}

            <button
              onClick={clearCart}
              className="text-sm text-white/50 hover:text-white underline">

              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>₱{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tax (Estimated)</span>
                  <span>₱{(cartTotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-cyan">
                    ₱{(cartTotal * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <Link to="/checkout">
                <GradientButton fullWidth size="lg">
                  Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                </GradientButton>
              </Link>

              <p className="text-xs text-center text-white/40 mt-4">
                Secure checkout powered by Stripe
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>);

}