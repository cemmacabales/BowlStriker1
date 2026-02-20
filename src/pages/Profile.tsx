import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Package, LogOut, ChevronRight } from 'lucide-react';

export function Profile() {
  const { user, profile, isAdmin, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force reload anyway
      window.location.href = '/';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <GlassCard className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Not Logged In</h2>
            <p className="text-white/60 mb-6">
              Please log in to view your profile
            </p>
            <Link to="/login">
              <GradientButton>Log In</GradientButton>
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Profile Header */}
        <GlassCard className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {profile?.email || user.email}
                </h1>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm">
                      <Shield className="w-4 h-4" />
                      Admin
                    </span>
                  )}
                  <span className="text-white/60 text-sm">
                    Member since {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </GlassCard>

        {/* Admin Access */}
        {isAdmin && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Admin Dashboard</h2>
                  <p className="text-white/60 text-sm">
                    Manage products, orders, and site content
                  </p>
                </div>
              </div>
              <Link to="/admin">
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all">
                  <span className="font-semibold">Switch to Admin Mode</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </GlassCard>
        )}

        {/* Quick Actions */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/order-history">
              <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-cyan-400" />
                  <span className="font-medium">Order History</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </button>
            </Link>
            
            <Link to="/catalog">
              <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-cyan-400" />
                  <span className="font-medium">Browse Catalog</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </button>
            </Link>
          </div>
        </GlassCard>

        {/* Debug Info */}
        <GlassCard className="p-6 bg-yellow-500/5 border-yellow-500/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Debug Info</h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors text-sm"
            >
              {refreshing ? 'Refreshing...' : 'Refresh Profile'}
            </button>
          </div>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-white/60">Has Profile:</span>
              <span className={profile ? 'text-green-400' : 'text-red-400'}>
                {profile ? 'YES' : 'NO'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">is_admin value:</span>
              <span className={profile?.is_admin ? 'text-green-400' : 'text-red-400'}>
                {String(profile?.is_admin)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">isAdmin computed:</span>
              <span className={isAdmin ? 'text-green-400' : 'text-red-400'}>
                {String(isAdmin)}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Account Details */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-4">Account Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-white/60 text-sm">Email</label>
              <p className="text-lg">{profile?.email || user.email}</p>
            </div>
            <div>
              <label className="text-white/60 text-sm">User ID</label>
              <p className="text-sm font-mono text-white/80">{user.id}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}