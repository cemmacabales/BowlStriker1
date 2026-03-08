import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck, Cpu } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
export function Landing() {
  const { products } = useProducts();
  // Get top 3 featured products
  const featuredProducts = products.slice(0, 3);
  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-primary-cyan">
              <span className="animate-pulse mr-2">●</span> Next Gen Bowling
              Tech
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight">
              Strike with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-purple">
                Precision
              </span>
            </h1>

            <p className="text-xl text-white/60 max-w-lg">
              Experience the future of bowling with our AI-designed cores and
              reactive coverstocks. Engineered for the perfect game.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/catalog">
                <GradientButton size="lg">
                  Shop Collection <ArrowRight className="ml-2 w-5 h-5" />
                </GradientButton>
              </Link>
              <Link to="/bowlbot">
                <GradientButton variant="outline" size="lg">
                  Ask AI Assistant
                </GradientButton>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative z-10 lg:h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-cyan/20 to-primary-purple/20 rounded-full blur-[100px]" />

            <GlassCard className="relative w-full max-w-md aspect-square flex items-center justify-center p-8 animate-float">
              <img
                src="/coming-soon.jpg"
                alt="Coming Soon"
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(0,212,255,0.3)]" />


              {/* Floating Stats Cards */}
              <GlassCard className="absolute -top-4 -right-4 p-4 !bg-black/60 backdrop-blur-xl animate-pulse-slow">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div>
                    <p className="text-xs text-white/50">Hook Potential</p>
                    <p className="font-bold text-primary-cyan">
                      High Performance
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="absolute -bottom-8 -left-4 p-4 !bg-black/60 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-primary-purple" />
                  <div>
                    <p className="text-xs text-white/50">Core Tech</p>
                    <p className="font-bold text-white">AI Optimized</p>
                  </div>
                </div>
              </GlassCard>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
            {
              icon: Zap,
              title: 'Reactive Technology',
              desc: 'Advanced coverstocks that respond to lane conditions instantly.'
            },
            {
              icon: Shield,
              title: 'Durability Guarantee',
              desc: 'Space-grade materials built to withstand thousands of impacts.'
            },
            {
              icon: Truck,
              title: 'Global Shipping',
              desc: 'Fast, secure delivery to any lane around the world.'
            }].
            map((feature, i) =>
            <GlassCard key={i} className="p-8" hoverEffect>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-cyan/20 to-primary-purple/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/60">{feature.desc}</p>
              </GlassCard>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Trending Gear
              </h2>
              <p className="text-white/60">
                Top rated equipment by professional strikers.
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-primary-cyan hover:text-primary-purple transition-colors">

              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) =>
            <ProductCard key={product.id} product={product} />
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="relative overflow-hidden p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-cyan/10 to-primary-purple/10" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Ready to Upgrade Your Game?
              </h2>
              <p className="text-white/60 mb-8 text-lg">
                Join thousands of bowlers who have elevated their scores with
                Bowl Striker technology.
              </p>
              <Link to="/register">
                <GradientButton size="lg">Create Account</GradientButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>);

}