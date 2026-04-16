import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 transition-all duration-300 hover:border-[rgba(0,240,255,0.3)] ${className}`}
    >
      {children}
    </div>
  );
};
