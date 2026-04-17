import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  ...props
}) => {
  const baseStyles =
    'rounded-xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed italic flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-[#00F0FF] text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]',
    secondary: 'bg-[#FF003C] text-white hover:shadow-[0_0_30px_rgba(255,0,60,0.3)]',
    outline: 'border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10',
    danger: 'bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20',
  };

  const sizes = {
    sm: 'px-6 py-3 text-[9px]',
    md: 'px-10 py-4 text-[10px]',
    lg: 'px-12 py-5 text-xs',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : (
        children
      )}
    </button>
  );
};
