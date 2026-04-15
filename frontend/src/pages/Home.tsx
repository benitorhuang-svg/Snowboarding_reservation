import Navbar from '../components/Navbar';
import Story from '../components/Story';
import LocationMap from '../components/LocationMap';
import ProgressionPath from '../components/ProgressionPath';
import Features from '../components/Features';
import { useTranslation } from 'react-i18next';

interface HomeProps {
  onNavigate: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-0">
      <Navbar onNavigate={onNavigate} />
      <Story />
      
      {/* Full Width Panoramic Image Divider */}
      <div className="w-full h-[400px] md:h-[600px] overflow-hidden relative">
        <img 
          src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/images/hero.png`} 
          alt="Snowboarding Action" 
          className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-3000 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-b from-bg-dark via-transparent to-bg-dark opacity-60"></div>
      </div>

      <LocationMap />
      <ProgressionPath />
      <Features />
      
      {/* CTA Section */}
      <section className="py-32 px-[5%] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-accent-blue/5 blur-[120px] rounded-full z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 animate-fade-in-up">{t('home.cta_title')}</h2>
          <p className="text-white/60 text-lg mb-12 animate-fade-in-up delay-200">
            {t('home.cta_desc')}
          </p>
          <button 
            onClick={onNavigate}
            className="bg-accent-blue text-black px-16 py-5 rounded-full text-xl font-bold hover:glow-blue hover:-translate-y-1 transition-all duration-300 animate-fade-in-up delay-400"
          >
            {t('home.cta_button')}
          </button>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-10 text-center border-t border-white/5 text-white/30 text-sm pb-32">
        © 2026 SNOWBOARDING. All Rights Reserved.
      </footer>
    </main>
  );
};

export default Home;
