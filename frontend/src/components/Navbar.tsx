import React from 'react';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  onNavigate?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLng = i18n.language;

  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-[5%] py-6 glass z-1000 border-b border-white/5">
      <div className="flex-1">
        <div className="text-xl font-bold tracking-tighter text-white cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          SNOW<span className="text-accent-blue font-light">BOARDING</span>
        </div>
      </div>

      <nav className="hidden lg:block flex-2">
        <ul className="flex justify-center list-none gap-10">
          <li><a href="#home" className="text-xs uppercase tracking-[0.2em] font-bold text-white/50 hover:text-accent-blue transition-all duration-300 relative group">
            {t('nav.story')}
            <span className="absolute -bottom-2 left-0 w-0 h-px bg-accent-blue transition-all group-hover:w-full"></span>
          </a></li>
          <li><a href="#progression" className="text-xs uppercase tracking-[0.2em] font-bold text-white/50 hover:text-accent-blue transition-all duration-300 relative group">
            {t('nav.hero')}
            <span className="absolute -bottom-2 left-0 w-0 h-px bg-accent-blue transition-all group-hover:w-full"></span>
          </a></li>
          <li><a href="#explore" className="text-xs uppercase tracking-[0.2em] font-bold text-white/50 hover:text-accent-blue transition-all duration-300 relative group">
            {t('nav.explore')}
            <span className="absolute -bottom-2 left-0 w-0 h-px bg-accent-blue transition-all group-hover:w-full"></span>
          </a></li>
          <li><a href="#support" className="text-xs uppercase tracking-[0.2em] font-bold text-white/50 hover:text-accent-blue transition-all duration-300 relative group">
            {t('nav.support')}
            <span className="absolute -bottom-2 left-0 w-0 h-px bg-accent-blue transition-all group-hover:w-full"></span>
          </a></li>
        </ul>
      </nav>

      <div className="flex-1 flex items-center justify-end gap-x-8">
        <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-white/40">
          {[
            { id: 'en', label: 'EN' },
            { id: 'zh_TW', label: 'ZH' },
            { id: 'ja', label: 'JA' },
            { id: 'zh_HK', label: 'HK' }
          ].map((lang, index) => (
            <React.Fragment key={lang.id}>
              <button
                onClick={() => changeLanguage(lang.id)}
                className={`transition-colors duration-300 ${
                  (currentLng === lang.id || (lang.id === 'zh_TW' && currentLng === 'zh')) 
                  ? 'text-accent-blue' 
                  : 'hover:text-white'
                }`}
              >
                {lang.label}
              </button>
              {index < 3 && <span className="text-white/10">|</span>}
            </React.Fragment>
          ))}
        </div>
        
        <button 
          onClick={() => onNavigate?.()}
          className="relative group overflow-hidden bg-accent-blue text-black px-8 py-2.5 rounded-full text-[11px] font-bold tracking-widest hover:glow-blue transition-all duration-300 whitespace-nowrap"
        >
          <span className="relative z-10">{t('nav.booking')}</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
