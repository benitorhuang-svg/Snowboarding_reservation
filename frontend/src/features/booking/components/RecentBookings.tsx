import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { GlassCard } from '@core/components/ui/GlassCard';

interface Booking {
  id: string;
  status: string;
  totalAmount: number;
  items: Array<{
    id: string;
    session: {
      startTime: string;
      course: {
        title: Record<string, string>;
      };
      coach: {
        user: {
          name: string;
          email: string;
        };
      };
    };
  }>;
}

interface RecentBookingsProps {
  bookings: Booking[];
  loading: boolean;
  onNavigate: () => void;
}

const RecentBookings: React.FC<RecentBookingsProps> = ({
  bookings,
  loading,
  onNavigate,
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <GlassCard className="p-10 border-none">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-xl font-black tracking-widest italic uppercase">
          Recent Sessions{' '}
          <span className="text-white/10 not-italic ml-4 text-[9px] font-light tracking-[0.5em] lowercase">
            Activity Log
          </span>
        </h3>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="py-24 text-center text-white/10 animate-pulse font-black uppercase tracking-[0.8em] italic">
            Decrypting Data...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-white/5 rounded-3xl">
            <p className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase mb-8">
              No Active Uplinks Found
            </p>
            <button
              onClick={onNavigate}
              className="text-[#00F0FF] text-[9px] font-black border border-[#00F0FF]/30 px-8 py-3 rounded-lg hover:bg-[#00F0FF] hover:text-black transition-all uppercase tracking-[0.3em] italic"
            >
              Initialize Session
            </button>
          </div>
        ) : (
          bookings.map((order: Booking) => (
            <div
              key={order.id}
              className="group flex items-center justify-between p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-[#00F0FF]/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-8">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black italic ${
                    order.status === 'PAID'
                      ? 'bg-[#00F0FF]/10 text-[#00F0FF]'
                      : 'bg-white/5 text-white/20'
                  }`}
                >
                  {order.items[0]?.session?.course?.title['zh-tw']?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="font-black text-lg text-white group-hover:text-[#00F0FF] transition-colors italic uppercase tracking-tight">
                    {order.items[0]?.session?.course?.title[currentLang] ||
                      order.items[0]?.session?.course?.title['zh-tw']}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                    <span className="flex items-center gap-2 italic">
                      <CalendarIcon size={12} />{' '}
                      {new Date(order.items[0]?.session?.startTime).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/10"></span>
                    <span className="italic">
                      Instructor:{' '}
                      {order.items[0]?.session?.coach?.user?.name ||
                        order.items[0]?.session?.coach?.user?.email.split('@')[0]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-white italic tracking-tighter">
                    NT$ {order.totalAmount}
                  </p>
                  <p className="text-[8px] font-black text-[#00F0FF]/60 uppercase tracking-[0.3em] mt-1">
                    {order.status}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-white/10 group-hover:text-[#00F0FF] transition-colors"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
};

export default RecentBookings;
