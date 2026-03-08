import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GridBackground } from '../components/GridBackground';
import { GlassCard } from '../components/GlassCard';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ArrowLeft,
  Shield,
  Loader,
  MessageSquare
} from 'lucide-react';

export function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <GridBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black text-white">
      <GridBackground />

      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Store
              </Link>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-400" />
                <h1 className="text-xl font-bold">Admin Panel</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-3">
                <p className="text-sm text-white/60">Logged in as</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <Link to="/profile">
                <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                  Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="fixed left-0 top-20 bottom-0 w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl p-4">
          <nav className="space-y-2">
            <Link to="/admin">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin')
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </Link>

            <Link to="/admin/products">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/products') || location.pathname.startsWith('/admin/products')
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
              >
                <Package className="w-5 h-5" />
                <span>Products</span>
              </button>
            </Link>

            <Link to="/admin/orders">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/orders')
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Orders</span>
              </button>
            </Link>

            <Link to="/admin/users">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users')
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
              >
                <Shield className="w-5 h-5" />
                <span>Users</span>
              </button>
            </Link>

            <Link to="/admin/messages">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/messages')
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Messages</span>
              </button>
            </Link>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">Admin Mode</span>
              </div>
              <p className="text-xs text-white/60">
                You have full access to manage the store
              </p>
            </GlassCard>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}