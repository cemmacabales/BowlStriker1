import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
export function OrderConfirmation() {
  // Simple particle effect simulation could go here
  return (
    <div className="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Particles (Static for now, could be animated) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) =>
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary-cyan rounded-full opacity-20 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }} />

        )}
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
          <div className="flex justify-between mb-2">
            <span className="text-white/60">Order Number</span>
            <span className="font-mono text-primary-cyan">#BS-8829-X</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-white/60">Date</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Email</span>
            <span>john.doe@example.com</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/order-history">
            <GradientButton variant="outline">View Order Status</GradientButton>
          </Link>
          <Link to="/">
            <GradientButton>
              Continue Shopping <ArrowRight className="ml-2 w-5 h-5" />
            </GradientButton>
          </Link>
        </div>
      </GlassCard>
    </div>);

}