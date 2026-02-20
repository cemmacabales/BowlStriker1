import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink, Loader2 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

export function OrderHistory() {
  const { orders, loading } = useOrders();
  const { user } = useAuth();

  // Filter to only show the current user's orders (non-admin view)
  const userOrders = orders.filter((o) => o.user_id === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-white/10 text-white/60 border-white/10';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <GlassCard className="max-w-md w-full p-12 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Please Log In</h2>
          <p className="text-white/60 mb-8">Log in to view your order history.</p>
          <Link to="/login">
            <GradientButton>Log In</GradientButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/60">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold">Order History</h1>
          <Link to="/catalog" className="text-primary-cyan hover:underline">
            Start new order
          </Link>
        </div>

        {userOrders.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-white/30" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-4">No Orders Yet</h2>
            <p className="text-white/60 mb-8">
              You haven't placed any orders yet. Start shopping!
            </p>
            <Link to="/catalog">
              <GradientButton>Browse Catalog</GradientButton>
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <GlassCard key={order.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-primary-cyan text-sm">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-white/50">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      ₱{order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-white/50">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                {order.items.length > 0 && (
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm py-1"
                      >
                        <span className="text-white/80">
                          {item.name || `Product ${item.product_id.slice(0, 8)}`} × {item.quantity}
                        </span>
                        <span className="text-white/60">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {order.shipping_address && (
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <p className="text-xs text-white/40">
                      Shipping to: {order.shipping_address}
                    </p>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}