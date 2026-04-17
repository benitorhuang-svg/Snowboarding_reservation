import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@snowboarding/shared';
import { bookingService } from '@services/modules/booking.service';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Settings, CreditCard, Award } from 'lucide-react';
import { DashboardLayout } from '@core/layouts';
import EvolutionProgressCircle from '@features/profile/components/EvolutionProgressCircle';
import RecentBookings from '@features/booking/components/RecentBookings';
import StatsGrid from '@features/profile/components/StatsGrid';
import { GlassCard } from '@core/components/ui/GlassCard';
import { useUserStats } from '@features/profile/hooks/useUserStats';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: () => void;
}

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

const DashboardPage: React.FC<DashboardProps> = ({ user, onLogout, onNavigate }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: bookings = [], isLoading: loading } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: () => bookingService.getUserBookings(),
  });

  const stats = useUserStats(user, bookings);

  return (
    <DashboardLayout activeTab="overview" onLogout={onLogout}>
      <div className="space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl font-black tracking-tighter italic mb-4 uppercase text-white">
              {t('dashboard.hello')},{' '}
              <span className="text-[#00F0FF]">
                {user.name || user.email.split('@')[0].toUpperCase()}
              </span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded text-[9px] font-black tracking-[0.4em] uppercase text-[#00F0FF]">
                {stats.skillLevel} Rider
              </span>
              <span className="text-white/20 text-[9px] font-black tracking-[0.4em] uppercase italic">
                System Synchronized
              </span>
            </div>
          </motion.div>
          <button
            onClick={onNavigate}
            className="bg-[#FF003C] text-white px-10 py-4 rounded-xl text-[10px] font-black tracking-[0.4em] uppercase italic shadow-[0_0_30px_rgba(255,0,60,0.3)] hover:shadow-[0_0_45px_rgba(255,0,60,0.5)] hover:-translate-y-1 active:scale-95 transition-all"
          >
            {t('dashboard.book_new')}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Left Content Column */}
          <div className="xl:col-span-2 space-y-10">
            {/* Quick Stats Grid */}
            <StatsGrid
              totalLessons={stats.totalLessons}
              nextSession={stats.nextSession}
            />

            {/* Order Timeline */}
            <RecentBookings
              bookings={bookings}
              loading={loading}
              onNavigate={onNavigate}
            />
          </div>

          {/* Right Column: Profile & Progress */}
          <aside className="space-y-10">
            <EvolutionProgressCircle
              progress={stats.progress}
              userName={user.name || 'ANONYMOUS'}
              userId={user.id}
            />

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/edit-profile')}
                className="py-5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black tracking-[0.3em] uppercase hover:bg-[#00F0FF]/10 hover:border-[#00F0FF]/30 transition-all flex flex-col items-center gap-3 italic text-white/60"
              >
                <Settings size={16} className="text-white/20" />
                Protocol
              </button>
              <button
                onClick={() => navigate('/payment-methods')}
                className="py-5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black tracking-[0.3em] uppercase hover:bg-[#00F0FF]/10 hover:border-[#00F0FF]/30 transition-all flex flex-col items-center gap-3 italic text-white/60"
              >
                <CreditCard size={16} className="text-white/20" />
                Credits
              </button>
            </div>

            {/* Tips Card */}
            <GlassCard className="bg-[#FF003C] p-8 border-none group cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <Award size={20} className="text-black" />
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-black italic">
                  Training Tip
                </h5>
              </div>
              <p className="text-xs font-black leading-relaxed text-black/80 italic mb-6">
                摰????脤??餅?隤脩?嚗?????券??芸敶Ｙ?蝛拙??扯????漲??{' '}
              </p>
              <button className="text-[9px] font-black uppercase tracking-[0.3em] text-black border-b-2 border-black/20 hover:border-black transition-all italic">
                Deep Dive →
              </button>
            </GlassCard>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
