import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';

export function OrderConfirmation() {
  const location = useLocation();
  const { user } = useAuth();
  const order = location.state?.order;
  const orderId = location.state?.orderId || order?.id;

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary-cyan rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <GlassCard className="max-w-2xl w-full p-8 md:p-12 text-center relative z-10">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-cyan to-primary-purple rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,212,255,0.4)]">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-display font-bold mb-4">
          Order Confirmed!
        </h1>
        <p className="text-xl text-white/60 mb-8">
          Thank you for your purchase. Your gear is being prepared for shipment.
        </p>

        <div className="bg-white/5 rounded-xl p-6 mb-8 text-left max-w-md mx-auto border border-white/10">
          <div className="flex justify-between mb-3">
            <span className="text-white/60">Order Number</span>
            <span className="font-mono text-primary-cyan text-sm">
              #{orderId ? orderId.slice(0, 8).toUpperCase() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-white/60">Date</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-white/60">Email</span>
            <span className="text-sm">{order?.customer_email || user?.email || 'N/A'}</span>
          </div>
          {order?.total && (
            <div className="flex justify-between mb-3">
              <span className="text-white/60">Total</span>
              <span className="font-bold text-primary-cyan">₱{order.total.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-white/60">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              Pending
            </span>
          </div>
        </div>

        {/* Order Items */}
        {order?.items && order.items.length > 0 && (
          <div className="bg-white/5 rounded-xl p-6 mb-8 text-left max-w-md mx-auto border border-white/10">
            <h3 className="font-bold mb-3">Items Ordered</h3>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-white/80">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-white/60">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/order-history">
            <GradientButton variant="outline">View Order History</GradientButton>
          </Link>
          <Link to="/catalog">
            <GradientButton>
              Continue Shopping <ArrowRight className="ml-2 w-5 h-5" />
            </GradientButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}