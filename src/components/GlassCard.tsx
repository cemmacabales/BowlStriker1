import React from 'react';
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: 'default' | 'dark' | 'light';
  onClick?: () => void;
}
export function GlassCard({
  children,
  className = '',
  hoverEffect = false,
  variant = 'default',
  onClick
}: GlassCardProps) {
  const baseStyles =
  'backdrop-blur-xl border border-white/10 rounded-2xl transition-all duration-300';
  const variants = {
    default: 'bg-white/5',
    dark: 'bg-black/40',
    light: 'bg-white/10'
  };
  const hoverStyles = hoverEffect ?
  'hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)] hover:-translate-y-1' :
  '';
  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}>

      {children}
    </div>);

}