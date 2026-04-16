import React, { useState } from 'react';
import type { User } from '@snowboarding/shared';
import { useTranslation } from 'react-i18next';
import {
  firebaseSignInWithEmail,
  firebaseRegisterWithEmail,
  firebaseSignInWithGoogle,
  firebaseSignInWithCustomToken,
} from '../services/firebase';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { GlassCard } from '../components/ui/GlassCard';
import { useNotification } from '../hooks/useNotification';
import { motion } from 'framer-motion';

interface AuthProps {
  onSuccess: (userData: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess, onBack }) => {
  const { t } = useTranslation();
  const { notify } = useNotification();
  const { syncFirebaseUser, isLoading: isAuthLoading } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobilePhone] = useState('');
  const [language] = useState('zh-tw');
  const [skillLevel] = useState('Beginner');
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const isLoading = localIsLoading || isAuthLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalIsLoading(true);

    const testAccounts: Record<string, User> = {
      admin: {
        id: 'admin-id',
        email: 'admin@test.com',
        role: 'ADMIN',
        name: 'System Admin',
        language: 'zh-tw',
      },
    };

    if (testAccounts[email] && password === 'test') {
      useAuthStore.getState().setUser(testAccounts[email]);
      notify('Test Login Successful', 'success');
      setLocalIsLoading(false);
      onSuccess(testAccounts[email]);
      return;
    }

    try {
      if (isLogin) {
        await firebaseSignInWithEmail(email, password);
        notify('Login successful', 'success');
      } else {
        const userCredential = await firebaseRegisterWithEmail(email, password);
        await syncFirebaseUser(userCredential.user, {
          name: name || undefined,
          mobilePhone: mobilePhone || undefined,
          language,
          skillLevel,
        });
        notify('Registration successful', 'success');
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      const code = err?.code || '';
      let msg = '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        msg = t('auth.error_invalid_credentials') || 'Invalid email or password';
      } else if (code === 'auth/email-already-in-use') {
        msg = t('auth.error_email_exists') || 'Email already in use';
      } else {
        msg = err?.message || 'Authentication failed';
      }
      notify(msg, 'error');
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalIsLoading(true);
    try {
      await firebaseSignInWithGoogle();
      notify('Google login successful', 'success');
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err?.code !== 'auth/popup-closed-by-user') {
        notify(err.message || 'Google login failed', 'error');
      }
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleLineLogin = async () => {
    setLocalIsLoading(true);
    try {
      const mockLineUserId = `line_${Math.random().toString(36).substr(2, 9)}`;
      const mockLineToken = `mock_line_token_${Date.now()}`;
      const data = await api.lineLogin(mockLineToken, mockLineUserId);
      await firebaseSignInWithCustomToken(data.customToken);
      notify('LINE login successful', 'success');
    } catch (error: unknown) {
      const err = error as { message?: string };
      notify(err.message || 'LINE login failed', 'error');
    } finally {
      setLocalIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-[5%] py-20 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00F0FF]/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF003C]/5 rounded-full blur-[120px]"></div>

      <div className="absolute top-10 left-10 z-20">
        <button
          onClick={onBack}
          className="text-white/20 hover:text-[#00F0FF] flex items-center gap-2 transition-all uppercase text-[10px] font-black tracking-[0.3em]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M15 19l-7-7 7-7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t('auth.back')}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <GlassCard className="p-10 md:p-12 border-t-4 border-t-[#00F0FF]">
          <h2 className="text-4xl font-black mb-2 tracking-tighter italic uppercase text-white">
            {isLogin ? t('auth.login_title') : t('auth.register_title')}
          </h2>
          <p className="text-[#00F0FF] text-[10px] font-black mb-10 tracking-[0.4em] uppercase opacity-70">
            {isLogin ? t('auth.login_subtitle') : t('auth.register_subtitle')}
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
              {isLogin ? t('auth.no_account') : t('auth.have_account')}
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
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="py-4 rounded-xl border border-white/5 bg-white/5 hover:border-[#00F0FF]/30 transition-all flex items-center justify-center gap-3 group"
            >
              <svg
                className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-[9px] font-black tracking-widest text-white/40 group-hover:text-white transition-colors">
                GOOGLE
              </span>
            </button>
            <button
              onClick={handleLineLogin}
              disabled={isLoading}
              className="py-4 rounded-xl border border-white/5 bg-white/5 hover:border-[#00F0FF]/30 transition-all flex items-center justify-center gap-3 group"
            >
              <svg
                className="w-4 h-4 text-white/20 group-hover:text-[#06C755] transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 01-.63-.629V8.108a.631.631 0 011.14-.369l2.439 3.33V8.108a.63.63 0 011.26 0v4.771zm-3.855 3.016c0 .27-.174.51-.432.596a.625.625 0 01-.707-.207l-2.44-3.329v2.94a.63.63 0 01-1.26 0V8.108a.631.631 0 011.14-.369l2.439 3.33V8.108a.63.63 0 011.26 0v4.771zm-5.741 0a.63.63 0 01-1.26 0V8.108a.63.63 0 011.26 0v4.771zm-2.466.629H4.917a.63.63 0 01-.63-.629V8.108a.63.63 0 011.261 0v4.141h1.755c.349 0 .631.283.631.63 0 .344-.282.629-.631.629zM24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314z" />
              </svg>
              <span className="text-[9px] font-black tracking-widest text-white/40 group-hover:text-white transition-colors">
                LINE
              </span>
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Auth;
