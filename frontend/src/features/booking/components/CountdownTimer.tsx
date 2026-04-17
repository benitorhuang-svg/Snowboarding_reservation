import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialMinutes: number;
  onExpire: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialMinutes, onExpire }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onExpire]);

  const minutesLeft = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  const isUrgent = seconds < 120; // 2 minutes left

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${isUrgent ? 'border-red-500 bg-red-500/10 animate-pulse' : 'border-accent-blue/30 bg-accent-blue/5'}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-red-500' : 'bg-accent-blue'}`}
        ></div>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
          ??靽?銝?/ SLOT RESERVED
        </span>
      </div>
      <div className="text-xl font-black tabular-nums">
        {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
      </div>
    </div>
  );
};

export default CountdownTimer;
