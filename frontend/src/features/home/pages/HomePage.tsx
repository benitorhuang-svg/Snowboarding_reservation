import React from 'react';
import Hero from '@features/home/components/Hero';
import Features from '@features/home/components/Features';
import ProgressionPath from '@features/home/components/ProgressionPath';
import LocationMap from '@features/home/components/LocationMap';
import Story from '@features/home/components/Story';
import { Navbar, Footer } from '@core/layouts';
import CoachCard from '@features/booking/components/CoachCard';
import type { User } from '@shared';

interface HomeProps {
  onNavigate: () => void;
  onAuth: () => void;
  user: User | null;
}

const HomePage: React.FC<HomeProps> = ({ onNavigate, onAuth, user }) => {
  const coaches = [
    {
      name: 'ALEX',
      level: 'Lead Instructor',
      location: 'NISEKO ANNUPURI',
      imageUrl: '/apps/demo/example1/alex.jpg',
      languages: ['ZH', 'EN'],
      price: 1500,
      rating: 4.9,
    },
    {
      name: 'KEN',
      level: 'Senior Coach',
      location: 'NISEKO VILLAGE',
      imageUrl: '/apps/demo/example1/ken.jpg',
      languages: ['JA', 'EN'],
      price: 1400,
      rating: 4.8,
    },
    {
      name: 'YUKI',
      level: 'Expert Trainer',
      location: 'HIRAFU PEAK',
      imageUrl: '/apps/demo/example1/yuki.png',
      languages: ['ZH', 'JA'],
      price: 1600,
      rating: 5.0,
    },
    {
      name: 'TUN',
      level: 'Freestyle Pro',
      location: 'HANAZONO',
      imageUrl: '/apps/demo/example1/tun.jpg',
      languages: ['EN'],
      price: 1300,
      rating: 4.7,
    },
  ];

  return (
    <div className="bg-[#050505]">
      <Navbar onNavigate={onNavigate} onAuth={onAuth} user={user} />
      <Hero onNavigate={onNavigate} />
      <Features />

      <section className="py-32 px-[5%] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-6xl font-black tracking-tighter italic leading-none mb-6">
                ELITE <span className="text-[#00F0FF]">SQUAD</span>
              </h2>
              <p className="text-white/40 font-bold tracking-[0.2em] uppercase text-xs">
                Learn from the masters of the mountain. Our instructors are world-class
                professionals.
              </p>
            </div>
            <button
              onClick={onNavigate}
              className="px-10 py-5 bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-[#00F0FF] hover:text-black transition-all italic"
            >
              View All Instructors →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coaches.map((coach, index) => (
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

export default HomePage;
