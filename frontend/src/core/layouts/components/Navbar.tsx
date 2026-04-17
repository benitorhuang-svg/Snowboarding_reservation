import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '@shared';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigate?: () => void;
  onAuth?: () => void;
  user?: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onAuth, user }) => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLng = i18n.language;

  const navLinks = [
    { href: '#home', label: t('nav.story') },
    { href: '#explore', label: t('nav.explore') },
    { href: '#support', label: t('nav.support') },
  ];

  return (
    <>
      <header className="fixed top-0 w-full flex justify-between items-center px-[5%] h-24 bg-[rgba(5,5,5,0.7)] backdrop-blur-2xl z-[1000] border-b border-white/5">
        <div
          className="flex items-center gap-4 group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-12 h-12 bg-[#00F0FF] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-110 transition-transform duration-500">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <span className="text-2xl font-black text-white tracking-tighter italic">
            SNOW<span className="text-[#00F0FF]">BOARDING</span>
          </span>
        </div>

        <nav className="hidden lg:block">
          <ul className="flex justify-center list-none gap-12">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40 hover:text-[#00F0FF] transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#00F0FF] group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-8">
          <div className="hidden xl:flex items-center gap-4 text-[9px] font-black tracking-[0.3em] text-white/20">
            {['en', 'zh-tw', 'ja'].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`transition-colors uppercase border-b ${
                  currentLng === lang
                    ? 'text-[#00F0FF] border-[#00F0FF]/50'
                    : 'hover:text-white border-transparent'
                }`}
              >
                {lang === 'zh-tw' ? 'TW' : lang}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>

          <button
            onClick={onAuth}
            className="hidden md:block text-[10px] font-black tracking-[0.3em] text-white/30 hover:text-white transition-colors uppercase italic"
          >
            {user ? user.name || user.email.split('@')[0].toUpperCase() : 'Connect'}
          </button>

          <button
            onClick={() => onNavigate?.()}
            className="bg-[#00F0FF] text-black px-8 py-3 rounded-lg text-[10px] font-black tracking-[0.3em] shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] hover:-translate-y-0.5 active:scale-95 whitespace-nowrap uppercase italic"
          >
            {user ? 'Dashboard' : 'Initialize'}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-[2px] bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`}
              ></span>
              <span
                className={`w-full h-[2px] bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}
              ></span>
              <span
                className={`w-full h-[2px] bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}
              ></span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#050505]/fb backdrop-blur-3xl z-[900] lg:hidden flex flex-col items-center justify-center gap-12"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-black tracking-tighter text-white italic uppercase hover:text-[#00F0FF] transition-all"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                onAuth?.();
                setIsMobileMenuOpen(false);
              }}
              className="text-[#00F0FF] text-xl font-black tracking-[0.4em] uppercase italic border-b-2 border-[#00F0FF]/20 pb-2"
            >
              {user ? 'Access Profile' : 'Access System'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
