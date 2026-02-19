import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ArrowLeft,
  Store,
  LogOut } from
'lucide-react';
export function AdminLayout() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard
  },
  {
    name: 'Products',
    path: '/admin/products',
    icon: Package
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    icon: ShoppingCart
  }];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-cyan to-primary-purple flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              B
            </div>
            <span className="text-lg font-display font-bold">CMS Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) =>
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path) ? 'bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>

              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">

            <Store className="w-5 h-5" />
            <span className="font-medium">View Store</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">

            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen bg-[#0D0D0D]">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>);

}