import React from 'react';
import { motion } from 'framer-motion';

interface EvolutionProgressCircleProps {
  progress: number;
  userName: string;
  userId: string;
}

const EvolutionProgressCircle: React.FC<EvolutionProgressCircleProps> = ({
  progress,
  userName,
  userId,
}) => {
  const strokeDashoffset = 283 - (283 * progress) / 100;

  return (
    <div className="p-10 text-center relative overflow-hidden border-none glass rounded-3xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#00F0FF]/30 animate-pulse"></div>

      {/* Evolution Progress Circle */}
      <div className="relative w-44 h-44 mx-auto mb-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="8"
          />
          <motion.circle
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 2.5,
              ease: 'circOut',
              delay: 0.5,
            }}
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-[#00F0FF] drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]"
            style={{ strokeDasharray: 283 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black italic tracking-tighter text-white">
            {progress}
            <span className="text-[#00F0FF] text-xl">%</span>
          </span>
          <span className="text-[8px] font-black text-white/20 tracking-[0.5em] uppercase mt-1">
            Evo-Status
          </span>
        </div>
      </div>

      <h4 className="text-2xl font-black mb-1 tracking-tighter uppercase italic text-white">
        {userName}
      </h4>
      <p className="text-[9px] text-[#00F0FF] font-black tracking-[0.4em] mb-12 uppercase opacity-60">
        ID://{userId.slice(-8).toUpperCase()}
      </p>
    </div>
  );
};

export default EvolutionProgressCircle;
