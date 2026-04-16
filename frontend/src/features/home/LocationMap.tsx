import React from 'react';
import { useTranslation } from 'react-i18next';

const LocationMap: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="explore" className="py-16 px-[5%] bg-bg-dark scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-sm uppercase tracking-[0.3em] text-accent-blue font-bold mb-3">
            {t('location.label')}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold leading-tight">
            {t('location.title')}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative group animate-fade-in-up flex justify-center lg:justify-start">
            <div className="absolute -inset-2 bg-accent-blue/10 blur-2xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative z-10 w-full max-w-[500px] h-[450px] overflow-hidden rounded-3xl shadow-2xl border border-border-light">
              <img
                src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/images/japan_map.png`}
                alt="Japan Ski Map"
                className="w-full h-full object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg-dark/80 via-transparent to-transparent opacity-40"></div>
            </div>
          </div>

          <div className="space-y-10 animate-fade-in-up delay-200">
            <div className="glass p-8 rounded-2xl hover:border-accent-blue/30 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold text-xl">
                  01
                </div>
                <h4 className="text-2xl font-bold">{t('location.niseko_title')}</h4>
              </div>
              <p className="text-white/50 font-light leading-relaxed">
                {t('location.niseko_desc')}
              </p>
            </div>

            <div className="glass p-8 rounded-2xl hover:border-accent-blue/30 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold text-xl">
                  02
                </div>
                <h4 className="text-2xl font-bold">{t('location.hakuba_title')}</h4>
              </div>
              <p className="text-white/50 font-light leading-relaxed">
                {t('location.hakuba_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
