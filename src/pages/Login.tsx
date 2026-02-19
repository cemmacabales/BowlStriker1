import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
export function Login() {
  return (
    <div className="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center">
      <GlassCard className="w-full max-w-md p-8 md:p-10 relative overflow-hidden">
        {/* Decorative Gradient Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-cyan to-primary-purple" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome Back</h1>
          <p className="text-white/60">
            Sign in to access your striker profile
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-cyan/50 focus:bg-white/10 transition-all"
                placeholder="you@example.com" />

            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-white/80">
                Password
              </label>
              <Link
                to="#"
                className="text-xs text-primary-cyan hover:text-primary-purple transition-colors">

                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-cyan/50 focus:bg-white/10 transition-all"
                placeholder="••••••••" />

            </div>
          </div>

          <GradientButton fullWidth size="lg">
            Sign In <ArrowRight className="ml-2 w-5 h-5" />
          </GradientButton>
        </form>

        <div className="mt-8 text-center text-sm text-white/60">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary-cyan font-bold hover:underline">

            Create Account
          </Link>
        </div>
      </GlassCard>
    </div>);

}