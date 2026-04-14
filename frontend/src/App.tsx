import { useState } from 'react';
import './App.css';
import './i18n';
import Home from './pages/Home';
import Calendar from './pages/Calendar';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'calendar'>('home');

  return (
    <div className="bg-bg-dark min-h-screen text-white selection:bg-accent-blue/30 overflow-x-hidden scroll-smooth">
      {currentPage === 'home' && <Home onNavigate={() => setCurrentPage('calendar')} />}
      {currentPage === 'calendar' && <Calendar onNavigate={() => setCurrentPage('home')} />}
      
      {/* Redesigned Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed right-10 bottom-12 w-14 h-14 glass rounded-full flex items-center justify-center group hover:glow-blue transition-all z-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5 active:scale-90"
        title="回到頂部"
      >
        <div className="relative flex flex-col items-center">
          <svg className="w-6 h-6 text-accent-blue group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path>
          </svg>
          <div className="absolute -top-14 bg-accent-blue text-black text-[9px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0 shadow-lg">
            TOP
          </div>
        </div>
      </button>
    </div>
  );
}

export default App;
