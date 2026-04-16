import React from 'react';
import { useTranslation } from 'react-i18next';

const Story: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="pt-36 pb-12 px-[5%] relative overflow-hidden bg-bg-dark"
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-blue/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-5 animate-fade-in-up">
          <h2 className="text-xs uppercase tracking-[0.3em] text-accent-blue font-bold opacity-80">
            {t('story.label')}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold leading-tight">
            {t('story.title_line1')}
            <br />
            {t('story.title_suffix')}
            <span className="italic text-accent-blue">{t('story.title_highlight')}</span>
          </h3>
          <p className="text-white/50 text-sm leading-relaxed font-light max-w-lg">
            {t('story.description')}
          </p>
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div>
              <div className="text-2xl font-bold mb-0.5">5,000+</div>
              <div className="text-white/30 text-[9px] uppercase tracking-wider">
                {t('story.stat_learners')}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-0.5">150+</div>
              <div className="text-white/30 text-[9px] uppercase tracking-wider">
                {t('story.stat_coaches')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative group animate-fade-in-up delay-400">
          <div className="absolute -inset-4 border border-accent-blue/10 rounded-3xl -z-10 group-hover:scale-105 transition-transform duration-700"></div>
          <img
            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=1200"
            alt="Snowboarding story"
            className="w-full h-[380px] object-cover rounded-2xl transition-all duration-1000 shadow-2xl"
          />
          <div className="absolute bottom-4 left-4 right-4 p-5 glass rounded-xl shadow-2xl">
            <p className="text-sm italic font-bold leading-relaxed text-white">
              {t('story.quote')}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-[10px] text-accent-blue font-black italic">
                ??{' '}
              </div>
              <span className="text-[12px] font-bold uppercase tracking-widest text-white/70">
                {t('story.quote_author')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
