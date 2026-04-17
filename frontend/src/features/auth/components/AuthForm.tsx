import React, { useState } from 'react';
import { GlassCard } from '@core/components/ui/GlassCard';
import type { User } from '@shared';
import { useAuthActions } from '@features/auth/hooks/useAuthActions';

interface AuthFormProps {
  onSuccess: (userData: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const { handleEmailAuth, handleSocialLogin, isLoading, t } = useAuthActions(onSuccess);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleEmailAuth(isLogin, email, password, name);
  };

  return (
    <GlassCard className="p-10 md:p-12 border-t-4 border-t-[#00F0FF]">
      <h2 className="text-4xl font-black mb-2 tracking-tighter italic uppercase text-white">
        {isLogin ? t('auth.login_title') : t('auth.register_title')}
      </h2>
      <p className="text-[#00F0FF] text-[10px] font-black mb-10 tracking-[0.4em] uppercase opacity-70">
        {isLogin ? 'AUTHENTICATION REQUIRED' : 'INITIALIZE NEW ACCOUNT'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">
              {t('auth.name')}
            </label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-[#00F0FF]/50 transition-all outline-none italic font-bold"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">
            {t('auth.email')}
          </label>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-[#00F0FF]/50 transition-all outline-none italic font-bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">
            {t('auth.password')}
          </label>
          <input
            type="password"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-[#00F0FF]/50 transition-all outline-none italic font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#00F0FF] text-black py-5 rounded-xl font-black text-sm hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.3em] mt-4"
        >
          {isLoading ? 'Processing...' : isLogin ? 'Authorize' : 'Initialize'}
        </button>
      </form>

      <div className="mt-10 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-white/20 hover:text-white text-[10px] font-black tracking-[0.2em] transition-colors uppercase border-b border-white/5 pb-1"
        >
          {isLogin ? 'No account? Register' : 'Have account? Login'}
        </button>
      </div>

      <div className="relative my-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-[8px] uppercase tracking-[0.5em]">
          <span className="px-6 bg-[#0c0c0c] text-white/20">Secure Protocols</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          className="py-4 rounded-xl border border-white/5 bg-white/5 hover:border-[#00F0FF]/30 transition-all flex items-center justify-center gap-3 group"
        >
          <span className="text-[9px] font-black tracking-widest text-white/40 group-hover:text-white transition-colors">
            GOOGLE
          </span>
        </button>
        <button
          onClick={() => handleSocialLogin('line')}
          disabled={isLoading}
          className="py-4 rounded-xl border border-white/5 bg-white/5 hover:border-[#00F0FF]/30 transition-all flex items-center justify-center gap-3 group"
        >
          <span className="text-[9px] font-black tracking-widest text-white/40 group-hover:text-white transition-colors">
            LINE
          </span>
        </button>
      </div>
    </GlassCard>
  );
};

export default AuthForm;
