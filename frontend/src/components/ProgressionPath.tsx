import React from 'react';
import { useTranslation } from 'react-i18next';

const Step = ({ level, title, desc, delay, img, position, bottom }: { level: string; title: string; desc: string; delay: string, img: string, position?: string, bottom: string }) => (
  <div className={`relative flex-1 group transition-all duration-700 ease-in-out hover:flex-[2.5] overflow-hidden min-h-[400px] md:min-h-[500px] first:rounded-l-3xl last:rounded-r-3xl animate-fade-in-up ${delay}`}>
    <img 
      src={img} 
      alt={title} 
      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-3000 group-hover:scale-110 ${position || 'object-top'}`}
    />
    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-500"></div>
    <div className="absolute inset-0 bg-linear-to-t from-bg-dark/95 via-bg-dark/20 to-transparent"></div>
    
    <div className={`absolute ${bottom} left-1/2 -translate-x-1/2 w-[90%] transition-all duration-500 group-hover:-translate-y-2`}>
      <div className="text-accent-blue text-[8px] font-bold tracking-[0.3em] mb-1 text-center opacity-60 group-hover:opacity-100">{level}</div>
      <h4 className="text-sm md:text-xl font-bold mb-3 text-center whitespace-nowrap leading-tight">{title}</h4>
      
      <div className="glass p-4 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
        <p className="text-white/70 text-[10px] leading-relaxed text-center font-light">{desc}</p>
      </div>
    </div>
  </div>
);

const ProgressionPath: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="progression" className="py-24 px-[5%] bg-bg-dark scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-sm uppercase tracking-[0.3em] text-accent-blue font-bold mb-4">
            {t('progression.label')}
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold leading-tight">
            從零到一，打造你的<span className="text-accent-blue italic">進化曲線</span>
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row w-full h-auto gap-1 lg:gap-0 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <Step 
            level="Level 01" 
            title={t('progression.level1_title')}
            desc={t('progression.level1_desc')}
            img="/images/prog_1.png"
            position="object-[center_10%]"
            bottom="bottom-0"
            delay="delay-0"
          />
          <Step 
            level="Level 02" 
            title={t('progression.level2_title')}
            desc={t('progression.level2_desc')}
            img="/images/prog_2.png"
            position="object-[25%_center]"
            bottom="bottom-10"
            delay="delay-200"
          />
          <Step 
            level="Level 03" 
            title={t('progression.level3_title')}
            desc={t('progression.level3_desc')}
            img="/images/prog_3.png"
            position="object-top"
            bottom="bottom-16"
            delay="delay-400"
          />
          <Step 
            level="Level 04" 
            title={t('progression.level4_title')}
            desc={t('progression.level4_desc')}
            img="/images/prog_4.png"
            position="object-[center_40%]"
            bottom="bottom-30"
            delay="delay-600"
          />
        </div>
      </div>
    </section>
  );
};

export default ProgressionPath;
