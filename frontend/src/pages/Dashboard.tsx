import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@snowboarding/shared';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import {
  LogOut,
  Calendar as CalendarIcon,
  Settings,
  CreditCard,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  User as UserIcon,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: () => void;
}

const getSkillProgress = (level: string) => {
  switch (level?.toUpperCase()) {
    case 'BEGINNER':
      return 25;
    case 'INTERMEDIATE':
      return 50;
    case 'ADVANCED':
      return 75;
    case 'EXPERT':
      return 100;
    default:
      return 25;
  }
};

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

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();

  const { data: bookings = [], isLoading: loading } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: () => api.getUserBookings(),
  });

  const stats = useMemo(() => {
    const paidBookings = bookings.filter(
      (b) => b.status === 'PAID' || b.status === 'COMPLETED',
    );
    const upcoming = bookings
      .filter(
        (b) =>
          b.status === 'PAID' && new Date(b.items[0]?.session?.startTime) > new Date(),
      )
      .sort(
        (a, b) =>
          new Date(a.items[0]?.session?.startTime).getTime() -
          new Date(b.items[0]?.session?.startTime).getTime(),
      )[0];

    return {
      totalLessons: paidBookings.length,
      nextSession: upcoming
        ? new Date(upcoming.items[0]?.session?.startTime).toLocaleDateString()
        : 'NONE',
      skillLevel: user.skillLevel || 'BEGINNER',
    };
  }, [bookings, user.skillLevel]);

  const progress = getSkillProgress(stats.skillLevel);
  const strokeDashoffset = 283 - (283 * progress) / 100;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-80 flex-col bg-[rgba(255,255,255,0.01)] border-r border-white/5 backdrop-blur-3xl p-10 pt-32">
        <div className="space-y-2 mb-auto">
          {[
            {
              id: 'overview',
              icon: <TrendingUp size={18} />,
              label: 'Overview',
              active: true,
            },
            {
              id: 'orders',
              icon: <CalendarIcon size={18} />,
              label: 'My Bookings',
            },
            { id: 'profile', icon: <UserIcon size={18} />, label: 'Profile' },
            { id: 'payment', icon: <CreditCard size={18} />, label: 'Wallet' },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-xl text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 italic ${
                item.active
                  ? 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                  : 'text-white/20 hover:text-[#00F0FF] hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-6 py-5 rounded-xl text-[10px] font-black tracking-[0.3em] text-[#FF003C]/40 hover:text-[#FF003C] hover:bg-[#FF003C]/5 transition-all uppercase italic"
        >
          <LogOut size={16} />
          {t('dashboard.logout')}
        </button>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 overflow-y-auto pt-32 pb-20 px-8 md:px-16 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00F0FF]/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-6xl font-black tracking-tighter italic mb-4 uppercase">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: 'Total Units',
                    value: stats.totalLessons,
                    icon: <Zap size={20} />,
                  },
                  {
                    label: 'Next Sync',
                    value: stats.nextSession,
                    icon: <Clock size={20} />,
                  },
                  {
                    label: 'Status',
                    value: 'ENCRYPTED',
                    icon: <ShieldCheck size={20} />,
                  },
                ].map((stat, i) => (
                  <GlassCard
                    key={i}
                    className="p-8 border-none relative overflow-hidden group"
                  >
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

              {/* Order Timeline */}
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
                            {order.items[0]?.session?.course?.title['zh-tw']?.charAt(0) ||
                              'S'}
                          </div>
                          <div>
                            <p className="font-black text-lg text-white group-hover:text-[#00F0FF] transition-colors italic uppercase tracking-tight">
                              {order.items[0]?.session?.course?.title[currentLang] ||
                                order.items[0]?.session?.course?.title['zh-tw']}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                              <span className="flex items-center gap-2 italic">
                                <CalendarIcon size={12} />{' '}
                                {new Date(
                                  order.items[0]?.session?.startTime,
                                ).toLocaleDateString()}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-white/10"></span>
                              <span className="italic">
                                Instructor:{' '}
                                {order.items[0]?.session?.coach?.user?.name ||
                                  order.items[0]?.session?.coach?.user?.email.split(
                                    '@',
                                  )[0]}
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
            </div>

            {/* Right Column: Profile & Progress */}
            <aside className="space-y-10">
              <GlassCard className="p-10 text-center relative overflow-hidden border-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#00F0FF]/30 animate-pulse"></div>

                {/* Evolution Progress Circle */}
                <div className="relative w-44 h-44 mx-auto mb-10">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
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
                  {user.name || 'ANONYMOUS'}
                </h4>
                <p className="text-[9px] text-[#00F0FF] font-black tracking-[0.4em] mb-12 uppercase opacity-60">
                  ID://{user.id.slice(-8).toUpperCase()}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/edit-profile')}
                    className="py-5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black tracking-[0.3em] uppercase hover:bg-[#00F0FF]/10 hover:border-[#00F0FF]/30 transition-all flex flex-col items-center gap-3 italic"
                  >
                    <Settings size={16} className="text-white/20" />
                    Protocol
                  </button>
                  <button
                    onClick={() => navigate('/payment-methods')}
                    className="py-5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black tracking-[0.3em] uppercase hover:bg-[#00F0FF]/10 hover:border-[#00F0FF]/30 transition-all flex flex-col items-center gap-3 italic"
                  >
                    <CreditCard size={16} className="text-white/20" />
                    Credits
                  </button>
                </div>
              </GlassCard>

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
                  Deep Dive ??{' '}
                </button>
              </GlassCard>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
