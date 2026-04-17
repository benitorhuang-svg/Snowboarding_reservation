import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LogOut,
  TrendingUp,
  Calendar as CalendarIcon,
  User as UserIcon,
  CreditCard,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab = 'overview',
  onLogout,
}) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'overview', icon: <TrendingUp size={18} />, label: 'Overview' },
    { id: 'orders', icon: <CalendarIcon size={18} />, label: 'My Bookings' },
    { id: 'profile', icon: <UserIcon size={18} />, label: 'Profile' },
    { id: 'payment', icon: <CreditCard size={18} />, label: 'Wallet' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-80 flex-col bg-[rgba(255,255,255,0.01)] border-r border-white/5 backdrop-blur-3xl p-10 pt-32">
        <div className="space-y-2 mb-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-xl text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 italic ${
                activeTab === item.id
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
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
