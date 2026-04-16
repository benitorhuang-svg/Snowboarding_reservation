import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useNotification } from '../hooks/useNotification';
import { motion } from 'framer-motion';
import { Save, Globe, Settings, Search, Filter } from 'lucide-react';

const AdminTranslations: React.FC = () => {
  const { notify } = useNotification();
  const [translations] = useState<Record<string, Record<string, string>>>({
    welcome_msg: {
      en: 'Welcome to Snowboarding',
      'zh-TW': '歡迎來到滑雪學校',
      ja: 'スノーボードへようこそ',
      'zh-HK': '歡迎來到滑雪學校',
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call placeholder
      await new Promise((resolve) => setTimeout(resolve, 1500));
      notify('Translations synced globally', 'success');
    } catch {
      notify('Failed to sync translations', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-[5%] text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2 flex items-center gap-3">
              <Settings className="text-accent-blue" />
              TRANSLATION MANAGEMENT
            </h1>
            <p className="text-white/40 tracking-[0.2em] uppercase text-xs">
              Admin Control Panel
            </p>
          </div>
          <div className="flex gap-4">
            <button className="glass px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-all flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-accent-blue text-black px-8 py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Syncing...' : 'Deploy Changes'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-blue transition-colors" />
              <input
                type="text"
                placeholder="Search keys..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-sm outline-none focus:border-accent-blue/50 transition-all font-bold"
              />
            </div>
            <GlassCard className="p-6 space-y-4">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20 flex items-center gap-2">
                <Filter className="w-3 h-3" />
                Filter by Module
              </h4>
              <div className="space-y-2">
                {['All Modules', 'Auth', 'Booking', 'Dashboard', 'Landing'].map((mod) => (
                  <button
                    key={mod}
                    className="w-full text-left px-4 py-3 rounded-lg text-xs font-bold hover:bg-white/5 transition-all text-white/40 hover:text-white"
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </GlassCard>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            {Object.entries(translations).map(([key, langs]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <GlassCard className="p-8 border-none group-hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-center mb-6">
                    <code className="text-accent-blue font-bold text-sm tracking-tight">
                      {key}
                    </code>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                      Last Updated: 2m ago
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(langs).map(([lang, value]) => (
                      <div key={lang} className="space-y-2">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                          {lang}
                        </label>
                        <textarea
                          defaultValue={value}
                          className="w-full bg-white/2 border border-white/5 rounded-xl p-4 text-sm text-white/80 outline-none focus:border-accent-blue/30 transition-all min-h-[80px]"
                        />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminTranslations;
