import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface HeroProps {
  onNavigate?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-110"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL.replace(/\/$/, '')}/images/hero.png')`,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#050505]/60 via-transparent to-[#050505]"></div>

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 w-full px-8 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-9xl font-black text-white mb-20 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase italic">
            {t('hero.title_line1')}
            <br />
            <span className="text-[#00F0FF]">{t('hero.title_highlight')}</span>
          </h1>
        </motion.div>

        {/* Commercial Search Bar (Cyberpunk Glassmorphism) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-glass backdrop-blur-3xl p-[6px] rounded-3xl items-center shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 w-max mx-auto text-left relative z-10 hidden md:flex"
        >
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-6 flex items-start gap-5 border border-white/5 transition-all hover:border-[#00F0FF]/30 group cursor-pointer relative overflow-hidden">
              <div className="text-[#00F0FF] mt-1 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                </svg>
              </div>
              <div className="text-left relative z-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 italic">
                  Sector // Location
                </p>
                <p className="font-black text-white text-lg italic tracking-tight uppercase">
                  Niseko, Hokkaido{' '}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#00F0FF]/20 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 flex items-start gap-5 border border-white/5 transition-all hover:border-[#00F0FF]/30 group cursor-pointer relative overflow-hidden">
              <div className="text-[#00F0FF] mt-1 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div className="text-left relative z-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 italic">
                  Sync // Timeline
                </p>
                <p className="font-black text-white text-lg italic tracking-tight uppercase">
                  December 2026
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#00F0FF]/20 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 flex items-start gap-5 border border-white/5 transition-all hover:border-[#00F0FF]/30 group cursor-pointer relative overflow-hidden">
              <div className="text-[#00F0FF] mt-1 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div className="text-left relative z-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 italic">
                  Skill // Protocol
                </p>
                <p className="font-black text-white text-lg italic tracking-tight uppercase">
                  Combat Ready
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#00F0FF]/20 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          <button
            onClick={() => onNavigate?.()}
            className="bg-[#00F0FF] w-full xl:w-auto text-black px-16 py-7 rounded-xl font-black text-sm flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-[0.3em] italic whitespace-nowrap"
          >
            Initialize Search
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-pointer">
        <span className="text-[9px] font-black tracking-[0.5em] uppercase text-white italic">
          Scroll to Sync
        </span>
        <div className="w-[2px] h-12 bg-linear-to-b from-[#00F0FF] to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
