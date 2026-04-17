import React from 'react';
import { Zap, Clock, ShieldCheck } from 'lucide-react';
import { GlassCard } from '@core/components/ui/GlassCard';

interface StatsGridProps {
  totalLessons: number;
  nextSession: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({ totalLessons, nextSession }) => {
  const statsItems = [
    {
      label: 'Total Units',
      value: totalLessons,
      icon: <Zap size={20} />,
    },
    {
      label: 'Next Sync',
      value: nextSession,
      icon: <Clock size={20} />,
    },
    {
      label: 'Status',
      value: 'ENCRYPTED',
      icon: <ShieldCheck size={20} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsItems.map((stat, i) => (
        <GlassCard key={i} className="p-8 border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-[#00F0FF]/10 transition-colors">
            {stat.icon}
          </div>
          <p className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase mb-2 italic">
            {stat.label}
          </p>
          <p className="text-2xl font-black text-white italic">{stat.value}</p>
        </GlassCard>
      ))}
    </div>
  );
};

export default StatsGrid;
