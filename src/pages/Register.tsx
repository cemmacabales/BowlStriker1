import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
export function Register() {
  return (
    <div className="min-h-screen pt-20 pb-20 px-4 flex items-center justify-center">
      <GlassCard className="w-full max-w-md p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-cyan to-primary-purple" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Join Bowl Striker
          </h1>
          <p className="text-white/60">Create your account to start shopping</p>
        </div>

        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-cyan/50 focus:bg-white/10 transition-all"
                  placeholder="John" />

              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Last Name
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-cyan/50 focus:bg-white/10 transition-all"
                placeholder="Doe" />

            </div>
          </div>

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
            <label className="text-sm font-medium text-white/80">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-cyan/50 focus:bg-white/10 transition-all"
                placeholder="Create a password" />

            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              className="rounded border-white/20 bg-white/5 text-primary-cyan focus:ring-primary-cyan" />

            <label htmlFor="terms" className="text-sm text-white/60">
              I agree to the{' '}
              <Link to="#" className="text-primary-cyan hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-primary-cyan hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <GradientButton fullWidth size="lg">
            Create Account <ArrowRight className="ml-2 w-5 h-5" />
          </GradientButton>
        </form>

        <div className="mt-8 text-center text-sm text-white/60">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-cyan font-bold hover:underline">

            Sign In
          </Link>
        </div>
      </GlassCard>
    </div>);

}