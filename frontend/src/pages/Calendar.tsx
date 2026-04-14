import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Course {
  id: string;
  title: Record<string, string>;
  price: number;
}

interface Session {
  id: string;
  startTime: string;
  capacity: number;
  bookedCount: number;
}

const fetchCourses = (): Promise<Course[]> => Promise.resolve([
  { id: '1', title: { zh_TW: '初階單板體驗 (4H)', en_US: 'Beginner Snowboard (4H)' }, price: 55000 },
  { id: '2', title: { zh_TW: '進階單板特訓 (Full Day)', en_US: 'Advanced Ski (Full Day)' }, price: 98000 },
]);

const fetchSessions = (courseId: string): Promise<Session[]> => {
  console.log('Fetching sessions for course:', courseId);
  return Promise.resolve([
    { id: 's1', startTime: '2026-08-01T09:00:00Z', capacity: 4, bookedCount: 1 },
    { id: 's2', startTime: '2026-08-01T14:00:00Z', capacity: 4, bookedCount: 4 },
    { id: 's3', startTime: '2026-08-02T10:00:00Z', capacity: 4, bookedCount: 0 },
  ]);
};

interface CalendarProps {
  onNavigate: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<{ id: string; name: string } | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
  const currentLng = i18n.language;

  useEffect(() => {
    fetchCourses().then(setCourses);
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchSessions(selectedCourse.id).then(setSessions);
    }
  }, [selectedCourse]);

  const getPrice = (jpy: number) => {
    const twd = Math.round(jpy * 0.21);
    const usd = Math.round(jpy * 0.0066);
    if (currentLng === 'ja') return { val: `¥${jpy.toLocaleString()}`, ref: `$${usd}` };
    if (currentLng.startsWith('en')) return { val: `$${usd}`, ref: `¥${jpy.toLocaleString()}` };
    return { val: `TWD ${twd.toLocaleString()}`, ref: `$${usd}` };
  };

  const steps = [
    { num: 1, label: t('booking.step1') },
    { num: 2, label: t('booking.step2') },
    { num: 3, label: '選擇教練' },
    { num: 4, label: '確認付款' }
  ];

  const coaches = [
    { id: 'c1', name: 'Kenji', level: 'Level 3 SAJ', bio: '專精粉雪與進階刻蝕', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150' },
    { id: 'c2', name: 'Mika', level: 'CASI Level 2', bio: '新手親和，流暢溝通', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' }
  ];

  return (
    <div className="min-h-screen bg-bg-dark pb-32">
      {/* 1. Unified Dual-Layer Header */}
      <header className="fixed top-0 left-0 w-full z-110 bg-bg-dark/95 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        {/* Top Layer: Branding & Actions */}
        <div className="h-20 md:h-24 px-[5%] flex justify-between items-center border-b border-white/5">
          <div onClick={onNavigate} className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-1 cursor-pointer group">
            <span className="text-white group-hover:text-accent-blue transition-colors">SNOW</span>
            <span className="text-accent-blue group-hover:text-white transition-colors">BOARDING</span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-bold text-white/40">
              {['EN', 'ZH', 'JA', 'HK'].map((l, i) => (
                <React.Fragment key={l}>
                  <button 
                    onClick={() => changeLanguage(l.toLowerCase() === 'zh' ? 'zh_TW' : l.toLowerCase() === 'hk' ? 'zh_HK' : l.toLowerCase())}
                    className={`transition-colors duration-300 ${currentLng.toUpperCase().includes(l) ? 'text-accent-blue' : 'hover:text-white'}`}
                  >
                    {l}
                  </button>
                  {i < 3 && <span className="text-white/5 font-light">|</span>}
                </React.Fragment>
              ))}
            </div>
            <button onClick={onNavigate} className="text-white/50 transition-all text-[10px] md:text-[11px] font-bold tracking-widest border border-white/10 px-4 md:px-6 py-2 rounded-full hover:border-accent-blue hover:text-accent-blue">
              {t('booking.back_home')}
            </button>
          </div>
        </div>

        {/* Bottom Layer: Adaptive Stepper */}
        <div className="h-16 md:h-20 bg-white/2 flex items-center">
          <div className="max-w-6xl mx-auto w-full px-[5%] flex justify-between items-center gap-2 md:gap-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div 
                  className={`flex items-center gap-2 md:gap-4 transition-all duration-700 cursor-pointer group ${currentStep >= s.num ? 'opacity-100' : 'opacity-20'}`}
                  onClick={() => currentStep > s.num && setCurrentStep(s.num)}
                >
                  <div className={`relative w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold border transition-all duration-500 shrink-0 ${
                    currentStep === s.num ? 'bg-accent-blue border-accent-blue text-black glow-blue scale-110' : 
                    currentStep > s.num ? 'bg-white border-white text-black' : 'border-white/20 text-white group-hover:border-white/50'
                  }`}>
                    {currentStep > s.num ? '✓' : s.num}
                    {currentStep === s.num && <div className="absolute inset-0 rounded-full bg-accent-blue animate-ping opacity-20"></div>}
                  </div>
                  
                  <div className="hidden lg:flex flex-col">
                    <span className="text-[8px] font-medium tracking-[0.2em] text-white/40 uppercase">Phase 0{s.num}</span>
                    <span className="text-[9px] font-bold tracking-widest text-white uppercase whitespace-nowrap">{s.label}</span>
                  </div>
                  {/* Small Screen Labels */}
                  <div className="lg:hidden flex flex-col">
                    <span className="text-[7px] font-medium tracking-widest text-white/40">P0{s.num}</span>
                    {currentStep === s.num && <span className="text-[7px] font-extrabold text-accent-blue uppercase truncate max-w-[40px]">{s.label.split(' ')[0]}</span>}
                  </div>
                </div>
                
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px bg-white/5 min-w-[8px] relative">
                    <div className={`absolute inset-0 bg-accent-blue transition-all duration-1000 origin-left ${currentStep > s.num ? 'scale-x-100' : 'scale-x-0'}`}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto pt-48 px-[5%]">
        <div className="space-y-10">
          {/* Step 1: Course Selection Card */}
          <div className={`glass rounded-4xl border transition-all duration-700 overflow-hidden ${currentStep === 1 ? 'border-accent-blue shadow-2xl scale-[1.02]' : 'border-white/5 opacity-80'}`}>
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${currentStep === 1 ? 'bg-accent-blue text-black' : 'bg-white/10 text-white/40'}`}>01</span>
                  <h4 className="text-2xl font-bold">{t('booking.step1')}</h4>
                </div>
                {selectedCourse && currentStep > 1 && (
                  <button onClick={() => setCurrentStep(1)} className="text-accent-blue text-sm font-bold hover:underline">修改課程</button>
                )}
              </div>

              {currentStep === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {courses.map(course => {
                    const price = getPrice(course.price);
                    return (
                      <div key={course.id} onClick={() => { setSelectedCourse(course); setCurrentStep(2); }}
                           className="p-10 rounded-3xl border border-white/5 bg-white/5 hover:border-accent-blue/50 hover:bg-white/8 transition-all cursor-pointer group">
                        <h5 className="font-bold text-2xl mb-6 group-hover:text-accent-blue transition-colors">
                          {course.title[currentLng.startsWith('en') ? 'en_US' : 'zh_TW'] || course.title['zh_TW']}
                        </h5>
                        <div className="space-y-1">
                          <p className="text-3xl font-black">{price.val}</p>
                          <p className="text-[10px] text-white/30 uppercase tracking-widest">Approx. {price.ref}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5">
                  <div className="text-accent-blue text-3xl">✓</div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">已選擇課程</p>
                    <p className="text-xl font-bold">{selectedCourse?.title[currentLng.startsWith('en') ? 'en_US' : 'zh_TW'] || selectedCourse?.title['zh_TW']}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Date & Session */}
          {currentStep >= 2 && (
            <div className={`glass rounded-4xl border transition-all duration-700 overflow-hidden ${currentStep === 2 ? 'border-accent-blue shadow-2xl scale-[1.02]' : 'border-white/5 opacity-80'}`}>
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${currentStep === 2 ? 'bg-accent-blue text-black' : 'bg-white/10 text-white/40'}`}>02</span>
                    <h4 className="text-2xl font-bold">{t('booking.step2')}</h4>
                  </div>
                  {selectedSession && currentStep > 2 && (
                    <button onClick={() => setCurrentStep(2)} className="text-accent-blue text-sm font-bold hover:underline">修改時間</button>
                  )}
                </div>

                {currentStep === 2 ? (
                  <div className="space-y-12">
                     <div className="grid grid-cols-7 gap-4">
                      {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d} className="text-center text-[10px] font-bold text-white/30 tracking-widest">{d}</div>)}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                        <div key={date} className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${date <= 2 ? 'border-accent-blue/30 bg-accent-blue/5 hover:bg-accent-blue/20' : 'border-white/5 text-white/10'}`}>
                          <span className="text-lg font-bold">{date}</span>
                          {date <= 2 && <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1"></div>}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {sessions.map(s => (
                        <div key={s.id} onClick={() => { setSelectedSession(s); setCurrentStep(3); }}
                             className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:border-accent-blue/50 transition-all cursor-pointer text-center group">
                          <p className="text-2xl font-bold mb-2 group-hover:text-accent-blue transition-colors">{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-[10px] text-white/30 uppercase tracking-widest">餘位: {s.capacity - s.bookedCount}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5">
                    <div className="text-accent-blue text-3xl">✓</div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-widest mb-1">已選擇日期與時段</p>
                      <p className="text-xl font-bold">2026/08/01 - {new Date(selectedSession?.startTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Coach Selection */}
          {currentStep >= 3 && (
            <div className={`glass rounded-4xl border transition-all duration-700 overflow-hidden ${currentStep === 3 ? 'border-accent-blue shadow-2xl scale-[1.02]' : 'border-white/5 opacity-80'}`}>
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${currentStep === 3 ? 'bg-accent-blue text-black' : 'bg-white/10 text-white/40'}`}>03</span>
                    <h4 className="text-2xl font-bold">選擇教練</h4>
                  </div>
                </div>

                {currentStep === 3 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {coaches.map(coach => (
                      <div key={coach.id} onClick={() => { setSelectedCoach(coach); setCurrentStep(4); }}
                           className="flex gap-8 p-10 rounded-3xl border border-white/5 bg-white/5 hover:border-accent-blue/50 hover:bg-white/8 transition-all cursor-pointer group">
                        <img src={coach.avatar} className="w-24 h-24 rounded-full border-scale-110 object-cover" />
                        <div>
                          <h5 className="font-bold text-2xl group-hover:text-accent-blue transition-colors">{coach.name}</h5>
                          <p className="text-accent-blue text-xs font-bold mb-3 tracking-widest">{coach.level}</p>
                          <p className="text-white/40 text-sm leading-relaxed">{coach.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5">
                    <div className="text-accent-blue text-3xl">✓</div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-widest mb-1">已選擇教練</p>
                      <p className="text-xl font-bold">{selectedCoach?.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Checkout */}
          {currentStep === 4 && (
            <div className="glass rounded-4xl border border-accent-blue p-8 md:p-12 shadow-2xl animate-fade-in-up">
              <div className="flex items-center gap-4 mb-10">
                <span className="w-10 h-10 rounded-full bg-accent-blue text-black flex items-center justify-center font-bold text-lg">04</span>
                <h4 className="text-2xl font-bold">確認訂單與付款</h4>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-white/5 space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-4">
                      <span className="text-white/40">課程</span>
                      <span className="font-bold">{selectedCourse && (selectedCourse.title[currentLng.startsWith('en') ? 'en_US' : 'zh_TW'] || selectedCourse.title['zh_TW'])}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-4">
                      <span className="text-white/40">日期</span>
                      <span className="font-bold">2026/08/01</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-4">
                      <span className="text-white/40">教練</span>
                      <span className="font-bold">{selectedCoach?.name}</span>
                    </div>
                    <div className="flex justify-between pt-4">
                      <span className="text-xl font-bold">總計</span>
                      <span className="text-3xl font-black text-accent-blue">{selectedCourse && getPrice(selectedCourse.price).val}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">付款方式</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 rounded-2xl border border-accent-blue bg-accent-blue/10 flex flex-col items-center gap-2 cursor-pointer shadow-lg">
                        <div className="text-2xl">💳</div>
                        <p className="text-[10px] font-bold">信用卡 / APPLE PAY</p>
                      </div>
                      <div className="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center gap-2 grayscale opacity-50">
                        <div className="text-2xl">📱</div>
                        <p className="text-[10px] font-bold">LINE PAY</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-6 bg-accent-blue text-black font-black tracking-[0.2em] rounded-3xl hover:glow-blue hover:scale-[1.02] transition-all shadow-2xl active:scale-95">
                    立即支付並完成預約
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
