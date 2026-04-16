import React from 'react';
import Hero from '../features/home/Hero';
import Features from '../features/home/Features';
import ProgressionPath from '../features/home/ProgressionPath';
import LocationMap from '../features/home/LocationMap';
import Story from '../features/home/Story';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import CoachCard from '../features/booking/CoachCard';
import type { User } from '@snowboarding/shared';

interface HomeProps {
  onNavigate: () => void;
  onAuth: () => void;
  user: User | null;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onAuth, user }) => {
  const featuredCoaches = [
    {
      name: 'Ken',
      level: 'CASI Level 3 Coach',
      location: 'Niseko, Hokkaido',
      languages: ['ZH', 'EN', 'JP'],
      price: 12000,
      rating: 5,
      imageUrl:
        'https://images.unsplash.com/photo-1520627911851-3ad274789ee5?q=80&w=2070',
    },
    {
      name: 'Tun',
      level: 'SB Professional Instructor',
      location: 'Hakuba, Nagano',
      languages: ['ZH', 'EN'],
      price: 15000,
      rating: 4.9,
      imageUrl:
        'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=2070',
    },
  ];

  return (
    <div className="bg-bg-dark">
      <Navbar onAuth={onAuth} user={user} />
      <Hero onNavigate={onNavigate} />

      <Features />

      <section className="px-[5%] py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter italic uppercase text-white">
                Featured <span className="text-accent-blue">Instructors</span>
              </h2>
              <p className="text-white/40 max-w-xl font-light leading-relaxed">
                Connect with world-class coaches who specialize in your preferred terrain.
              </p>
            </div>
            <button
              onClick={onNavigate}
              className="px-10 py-4 glass rounded-2xl text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white/5 transition-all text-white/60 hover:text-white"
            >
              Explore All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {featuredCoaches.map((coach, index) => (
              <CoachCard key={index} {...coach} />
            ))}
          </div>
        </div>
      </section>

      <ProgressionPath />
      <LocationMap />
      <Story />
      <Footer />
    </div>
  );
};

export default Home;
