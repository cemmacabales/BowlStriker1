import React from 'react';
import { Loader2 } from 'lucide-react';
interface GradientButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}
export function GradientButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: GradientButtonProps) {
  const baseStyles =
  'relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  const variants = {
    primary:
    'text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02]',
    outline:
    'bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40',
    ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/5'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}>

      {variant === 'primary' &&
      <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] opacity-90 group-hover:opacity-100 transition-opacity" />
      }

      <span className="relative z-10 flex items-center gap-2">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </button>);

}