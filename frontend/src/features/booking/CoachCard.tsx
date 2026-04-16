import React from 'react';
import { GlassCard } from '../../components/ui/GlassCard';

interface CoachCardProps {
  name: string;
  level: string;
  location: string;
  languages: string[];
  price: number;
  rating: number;
  imageUrl: string;
}

const CoachCard: React.FC<CoachCardProps> = ({
  name,
  level,
  location,
  languages,
  price,
  rating,
  imageUrl,
}) => {
  return (
    <GlassCard className="overflow-hidden group flex flex-col p-0 border-none">
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={imageUrl}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          alt={name}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] to-transparent opacity-60"></div>
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] backdrop-blur flex items-center justify-center text-white/40 hover:text-[#FF003C] transition-colors border border-white/10">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-black text-white tracking-tight">{name} 教練</h4>
          <div className="flex items-center gap-1 px-2 py-1 bg-[rgba(0,240,255,0.1)] rounded-md border border-[rgba(0,240,255,0.2)]">
            <span className="text-[#00F0FF] text-sm">★</span>
            <span className="font-black text-[#00F0FF] text-xs">{rating}</span>
          </div>
        </div>
        <p className="text-white/40 font-bold text-xs uppercase tracking-widest">
          {level}
        </p>
        <p className="text-white/30 text-[11px] flex items-center gap-2">
          <svg
            className="w-3.5 h-3.5 text-[#00F0FF]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
          </svg>
          {location} • {languages.join(' / ')}
        </p>
        <div className="pt-4 border-t border-white/5 flex justify-between items-end">
          <div>
            <span className="text-2xl font-black text-white tracking-tight italic">
              NT$ {price.toLocaleString()}
            </span>
            <span className="text-white/20 text-[10px] font-bold ml-1 uppercase">
              / Session
            </span>
          </div>
          <button className="text-[10px] font-black text-[#00F0FF] uppercase tracking-widest hover:underline">
            View Details →
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

export default CoachCard;
