import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, Twitter } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
interface AuthProps {
  initialMode?: 'login' | 'register';
}
export function Auth({ initialMode = 'login' }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Sync state with prop when it changes (e.g. navigation)
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
  const toggleMode = (newMode: 'login' | 'register') => {
    if (mode === newMode) return;
    setIsAnimating(true);
    // Update URL without full reload
    const newPath = newMode === 'login' ? '/login' : '/register';
    window.history.pushState({}, '', newPath);
    setTimeout(() => {
      setMode(newMode);
      setIsAnimating(false);
    }, 300);
  };
  return (
    <div className="min-h-[calc(100vh-80px)] pt-10 pb-20 px-4 flex items-center justify-center">
      <GlassCard className="w-full max-w-md p-0 relative overflow-hidden flex flex-col">
        {/* Decorative Gradient Border Top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-cyan to-primary-purple z-20" />

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 relative z-10">
          <button
            onClick={() => toggleMode('login')}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${mode === 'login' ? 'text-white bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>

            Sign In
            {mode === 'login' &&
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-cyan shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
            }
          </button>
          <button
            onClick={() => toggleMode('register')}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${mode === 'register' ? 'text-white bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>

            Create Account
            {mode === 'register' &&
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
            }
          </button>
        </div>

        {/* Content Area */}
        <div
          className={`p-8 md:p-10 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join Bowl Striker'}
            </h1>
            <p className="text-white/60">
              {mode === 'login' ?
              'Sign in to access your striker profile' :
              'Create your account to start shopping'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {mode === 'register' &&
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-cyan/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                    placeholder="John" />

                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Last Name
                  </label>
                  <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-cyan/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                  placeholder="Doe" />

                </div>
              </div>
            }

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-cyan/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                  placeholder="you@example.com" />

              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-white/80">
                  Password
                </label>
                {mode === 'login' &&
                <Link
                  to="#"
                  className="text-xs text-primary-cyan hover:text-primary-purple transition-colors">

                    Forgot password?
                  </Link>
                }
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-cyan/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                  placeholder={
                  mode === 'login' ? '••••••••' : 'Create a password'
                  } />

              </div>
            </div>

            {mode === 'register' &&
            <div className="flex items-start gap-2 pt-2">
                <input
                type="checkbox"
                id="terms"
                className="mt-1 rounded border-white/20 bg-white/5 text-primary-cyan focus:ring-primary-cyan" />

                <label
                htmlFor="terms"
                className="text-sm text-white/60 leading-tight">

                  I agree to the{' '}
                  <Link to="#" className="text-primary-cyan hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-primary-cyan hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            }

            <GradientButton fullWidth size="lg" className="mt-2">
              {mode === 'login' ? 'Sign In' : 'Create Account'}{' '}
              <ArrowRight className="ml-2 w-5 h-5" />
            </GradientButton>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#151515] text-white/40 backdrop-blur-xl rounded-full">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/80 hover:text-white">
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/80 hover:text-white">
              <Twitter className="w-5 h-5 text-[#1DA1F2]" />
              <span className="text-sm font-medium">Twitter</span>
            </button>
          </div>
        </div>
      </GlassCard>
    </div>);

}