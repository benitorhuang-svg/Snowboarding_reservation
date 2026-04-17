import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase block">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-[#00F0FF]/50 transition-all outline-none italic font-bold placeholder:text-white/10 ${
          error ? 'border-red-500/50 focus:border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[9px] font-black text-[#FF003C] tracking-widest uppercase italic">
          {error}
        </p>
      )}
    </div>
  );
};
