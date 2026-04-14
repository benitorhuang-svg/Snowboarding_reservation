import React from 'react';
import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="h-screen flex items-center justify-center text-center relative px-[5%] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-[-1]"
        style={{ 
          backgroundImage: `linear-gradient(rgba(10, 12, 16, 0.4), rgba(10, 12, 16, 0.9)), url('/images/hero.png')` 
        }}
      />
      <div className="max-w-5xl z-10 px-4">
        <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 animate-fade-in-up tracking-tight">
          {t('hero.title_line1')}<br />
          <span className="bg-linear-to-r from-white via-accent-blue to-accent-blue bg-clip-text text-transparent italic">
            {t('hero.title_highlight')}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 animate-fade-in-up delay-200 leading-relaxed font-light">
          {t('hero.subtitle_line1')}<br className="hidden md:block" />
          {t('hero.subtitle_line2')}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-400">
          <button className="bg-accent-blue text-black px-12 py-5 text-lg font-bold rounded-full hover:-translate-y-1 hover:glow-blue transition-all duration-300">
            {t('hero.btn_start')}
          </button>
          <button className="glass text-white px-12 py-5 text-lg font-bold rounded-full hover:bg-white/10 transition-all duration-300">
            {t('hero.btn_explore')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
