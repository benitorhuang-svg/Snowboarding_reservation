import React from 'react';
import type { User } from '@shared';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import AuthForm from '@features/auth/components/AuthForm';

interface AuthProps {
  onSuccess: (userData: User) => void;
  onBack: () => void;
}

const AuthPage: React.FC<AuthProps> = ({ onSuccess, onBack }) => {
  const { t } = useTranslation();

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
          {t('common.back')}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <AuthForm onSuccess={onSuccess} />
      </motion.div>
    </div>
  );
};

export default AuthPage;
