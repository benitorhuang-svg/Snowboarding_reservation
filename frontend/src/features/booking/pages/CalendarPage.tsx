import React from 'react';
import { useTranslation } from 'react-i18next';
import TappayPayment from '@features/booking/components/TappayPayment';
import CountdownTimer from '@features/booking/components/CountdownTimer';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@core/components/ui/GlassCard';
import { useNotification } from '@/core';
import { useBookingFlow } from '@features/booking/hooks/useBookingFlow';

interface CalendarProps {
  onNavigate?: () => void;
}

const CalendarPage: React.FC<CalendarProps> = ({ onNavigate }) => {
  const { i18n } = useTranslation();
  const { notify } = useNotification();
  const currentLang = i18n.language;

  const {
    currentStep,
    setCurrentStep,
    courses,
    selectedCourse,
    sessionsForSelectedDate,
    selectedSession,
    setSelectedSession,
    currentOrder,
    isLoading,
    selectedDate,
    setSelectedDate,
    uniqueDates,
    handleCourseSelect,
    handleBooking,
  } = useBookingFlow();

  const handlePaymentSuccess = () => {
    notify('Payment successful!', 'success');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-[5%] text-white">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-[#00F0FF]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-16 px-4 max-w-4xl mx-auto">
          <button
            onClick={() => onNavigate?.()}
            className="flex items-center gap-2 text-[10px] font-black tracking-widest text-[#00F0FF] border border-[#00F0FF]/30 px-4 py-2 rounded-full hover:bg-[#00F0FF]/10 transition-all"
          >
            ← HOME
          </button>
          <div className="flex flex-1 justify-around">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all duration-500 border ${
                      currentStep >= step
                        ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                        : 'bg-white/5 text-white/20 border-white/10'
                    }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`text-[10px] font-black tracking-[0.2em] uppercase ${currentStep >= step ? 'text-[#00F0FF]' : 'text-white/20'}`}
                  >
                    Step 0{step}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-px mt-6 mx-4 transition-colors duration-700 ${currentStep > step ? 'bg-[#00F0FF]/50' : 'bg-white/10'}`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-black tracking-tight text-white mb-8 italic uppercase">
                    SELECT COURSE{' '}
                    <span className="text-white/20 ml-2 font-light lowercase">
                      Select Path
                    </span>
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {courses.map((course) => (
                      <GlassCard
                        key={course.id}
                        onClick={() => handleCourseSelect(course)}
                        className={`cursor-pointer group relative overflow-hidden ${
                          selectedCourse?.id === course.id
                            ? 'border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.15)]'
                            : ''
                        }`}
                      >
                        <h4 className="text-xl font-black mb-4 text-white uppercase tracking-tight italic">
                          {(course.title as Record<string, string>)[currentLang] ||
                            (course.title as Record<string, string>)['zh-tw']}
                        </h4>
                        <p className="text-white/40 text-xs leading-relaxed mb-8 line-clamp-2">
                          {(course.description as Record<string, string>)[currentLang] ||
                            (course.description as Record<string, string>)['zh-tw']}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-white/20 text-[10px] font-bold block uppercase mb-1">
                              Price
                            </span>
                            <span className="text-[#00F0FF] font-black text-2xl italic">
                              NT$ {course.basePrice.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-white/40 group-hover:text-[#00F0FF] transition-colors tracking-[0.3em] uppercase">
                            Enter
                          </span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">
                      SCHEDULING{' '}
                      <span className="text-[#00F0FF]/40 ml-2 font-light lowercase">
                        Scheduling
                      </span>
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-5 gap-8">
                    <GlassCard className="md:col-span-2 p-8 border-none bg-white/2">
                      <div className="flex justify-between items-center mb-8">
                        <span className="text-sm font-black text-white italic uppercase tracking-widest">
                          {selectedDate
                            ? new Date(selectedDate).toLocaleDateString([], {
                                month: 'long',
                                year: 'numeric',
                              })
                            : 'Month Selection'}
                        </span>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-4">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                          <div
                            key={d}
                            className="text-center text-[10px] font-black text-white/20 uppercase"
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {uniqueDates.map((dateStr) => {
                          const d = new Date(dateStr);
                          const isSelected = selectedDate === dateStr;
                          return (
                            <button
                              key={dateStr}
                              onClick={() => setSelectedDate(dateStr)}
                              className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 border ${
                                isSelected
                                  ? 'bg-[#00F0FF] border-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                                  : 'bg-white/5 border-white/5 hover:border-[#00F0FF]/30 text-white/60'
                              }`}
                            >
                              <span className="text-xs font-black italic">
                                {d.getDate()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </GlassCard>

                    <div className="md:col-span-3 space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {sessionsForSelectedDate.length > 0 ? (
                          sessionsForSelectedDate.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => setSelectedSession(s)}
                              className={`p-6 rounded-2xl border transition-all duration-300 text-center group ${
                                selectedSession?.id === s.id
                                  ? 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.1)]'
                                  : 'bg-white/5 border-white/10 hover:border-[#00F0FF]/30'
                              }`}
                            >
                              <p
                                className={`text-2xl font-black italic tracking-tighter transition-colors ${
                                  selectedSession?.id === s.id
                                    ? 'text-[#00F0FF]'
                                    : 'text-white/40 group-hover:text-white'
                                }`}
                              >
                                {new Date(s.startTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false,
                                })}
                              </p>
                              <div className="mt-2 h-px w-8 mx-auto bg-white/10 group-hover:bg-[#00F0FF]/30 transition-colors"></div>
                              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2">
                                {s.capacity - s.bookedCount} Left
                              </p>
                            </button>
                          ))
                        ) : (
                          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                            <p className="text-white/20 font-black uppercase tracking-[0.4em] italic text-xs">
                              Offline - No Uplinks
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-white/5">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.4em] transition-colors flex items-center gap-2 group"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform">
                        ←
                      </span>{' '}
                      Return
                    </button>
                    <button
                      onClick={() => selectedSession && setCurrentStep(3)}
                      disabled={!selectedSession}
                      className="bg-[#00F0FF] text-black px-12 py-5 rounded-xl font-black text-xs uppercase tracking-[0.4em] italic shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Sync Interface
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-black text-white italic uppercase">
                    CONFIRMATION{' '}
                    <span className="text-white/20 ml-2 font-light lowercase">
                      Final Sync
                    </span>
                  </h2>
                  <GlassCard className="p-10 relative overflow-hidden border-l-4 border-l-[#00F0FF]">
                    <div className="flex gap-8 items-center mb-10">
                      <div className="w-20 h-20 rounded-full border-2 border-[#00F0FF]/30 p-1">
                        <div className="w-full h-full rounded-full bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] text-3xl font-black italic">
                          {selectedSession?.coach.user.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">
                          {selectedSession?.coach.user.name}
                        </h3>
                        <p className="text-[#00F0FF] text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                          Lead Instructor Expert Level
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/5 mb-10">
                      <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">
                          Target Peak
                        </p>
                        <p className="text-white font-black italic">NISEKO ANNUPURI</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">
                          Language Comms
                        </p>
                        <p className="text-white font-black italic text-xs uppercase">
                          EN / ZH / JA
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleBooking}
                      disabled={isLoading}
                      className="w-full bg-[#00F0FF] text-black py-6 rounded-xl font-black text-lg hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em]"
                    >
                      {isLoading ? 'Encrypting...' : 'Initialize Payment'}
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="w-full text-center text-white/20 text-[10px] font-black uppercase tracking-widest mt-6 hover:text-white transition-colors"
                    >
                      ← Back to Scheduling
                    </button>
                  </GlassCard>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <GlassCard className="p-10 border-[#00F0FF]/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                      <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        PAYMENT GATEWAY{' '}
                        <span className="text-white/20 ml-2 font-light lowercase">
                          Encrypted Payload
                        </span>
                      </h2>
                      <div className="px-6 py-3 bg-[#FF003C]/10 border border-[#FF003C]/30 rounded-full">
                        <CountdownTimer
                          initialMinutes={10}
                          onExpire={() => {
                            notify('Session Expired', 'error');
                            setCurrentStep(1);
                          }}
                        />
                      </div>
                    </div>
                    <TappayPayment
                      amount={currentOrder?.totalAmount || 0}
                      onSuccess={handlePaymentSuccess}
                    />
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-start-3">
            <div className="sticky top-32 space-y-6">
              <GlassCard className="relative overflow-hidden group">
                <h3 className="text-sm font-black text-white mb-10 tracking-[0.4em] uppercase flex items-center gap-3">
                  BOOKING SUMMARY
                </h3>

                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                      Selected Unit
                    </span>
                    <span className="text-right font-black text-white text-xs italic uppercase max-w-[150px]">
                      {selectedCourse
                        ? (selectedCourse.title as Record<string, string>)[currentLang] ||
                          (selectedCourse.title as Record<string, string>)['zh-tw']
                        : '---'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                      Instructor
                    </span>
                    <span className="font-black text-white text-xs italic uppercase">
                      {selectedSession?.coach.user.name || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                      Time Slot
                    </span>
                    <span className="font-black text-white text-xs italic uppercase">
                      {selectedSession
                        ? new Date(selectedSession.startTime).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })
                        : '---'}
                    </span>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-white/20 text-[10px] font-black uppercase tracking-widest block mb-1">
                        Final Credits
                      </span>
                      <span className="text-3xl font-black text-[#00F0FF] italic tracking-tighter">
                        {selectedCourse ? selectedCourse.basePrice.toLocaleString() : '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
