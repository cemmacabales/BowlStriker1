import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAdmin } = useAuth();
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'BowlBot AI', path: '/bowlbot' },
    { name: 'FAQ', path: '/faq' }
  ];

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0D0D0D]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-cyan to-primary-purple flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              B
            </div>
            <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Bowl Striker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary-cyan ${
                  isActive(link.path) ? 'text-primary-cyan' : 'text-white/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm font-medium"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            <Link
              to="/cart"
              className="relative p-2 text-white/70 hover:text-primary-cyan transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary-purple text-[10px] font-bold flex items-center justify-center rounded-full text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="hidden md:flex p-2 text-white/70 hover:text-primary-purple transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white/70 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-3 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-white/10 text-primary-cyan'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Shield className="w-4 h-4" />
                <span className="font-medium">Admin Dashboard</span>
              </Link>
            )}
            
            <Link
              to="/profile"
              className="block px-3 py-3 rounded-lg text-base font-medium text-white/70 hover:bg-white/5 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}