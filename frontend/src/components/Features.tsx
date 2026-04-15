import React from 'react';
import { useTranslation } from 'react-i18next';

const FeatureCard = ({ title, desc, delay, img, icon }: { title: string; desc: string; delay: string; img: string; icon: React.ReactNode }) => (
  <div className={`relative overflow-hidden rounded-[2.5rem] group animate-fade-in-up ${delay} h-[450px]`}>
    <img 
      src={img.startsWith('/') ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${img}` : img} 
      alt={title} 
      className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
    />
    <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-bg-dark/40 to-transparent"></div>
    
    <div className="absolute bottom-0 left-0 p-10 w-full">
      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-3xl mb-6 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
        {icon}
      </div>
      <h3 className="text-3xl font-bold mb-4 tracking-tight text-white">{title}</h3>
      <p className="text-white/70 font-light leading-relaxed max-w-md">{desc}</p>
    </div>
  </div>
);

const Features: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="support" className="relative z-10 px-[5%] py-32 scroll-mt-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <FeatureCard 
          icon="🛡️" 
          img="/images/feature_cert.png"
          title={t('features.card1_title')}
          desc={t('features.card1_desc')}
          delay="delay-0"
        />
        <FeatureCard 
          icon="💬" 
          img="/images/feature_comm.png"
          title={t('features.card2_title')}
          desc={t('features.card2_desc')}
          delay="delay-200"
        />
      </div>
    </section>
  );
};

export default Features;
