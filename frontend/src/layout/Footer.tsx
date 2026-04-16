import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] text-white pt-32 pb-16 border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#00F0FF]/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
          <div className="space-y-8">
            <h4 className="text-2xl font-black tracking-tighter italic uppercase">
              SNOW<span className="text-[#00F0FF]">BOARDING</span>
            </h4>
            <p className="text-white/30 text-xs leading-relaxed font-black uppercase italic tracking-widest">
              Seek the protocol. Master the edge. Conquer the silver horizon.
            </p>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00F0FF] italic">
              Navigation // Sync
            </h5>
            <ul className="space-y-4 text-white/30 text-[10px] font-black uppercase tracking-widest italic">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Instructor Directory
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sector Maps
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Combat Intel
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00F0FF] italic">
              Support // Uplink
            </h5>
            <ul className="space-y-4 text-white/30 text-[10px] font-black uppercase tracking-widest italic">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Direct Comms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  System FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Refund Protocols
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00F0FF] italic">
              Security // Layers
            </h5>
            <div className="flex flex-wrap gap-4">
              <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-md text-[9px] font-black tracking-[0.3em] text-white/20 uppercase italic">
                TAPPAY_SECURED
              </span>
              <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-md text-[9px] font-black tracking-[0.3em] text-white/20 uppercase italic">
                ECPAY_ENCRYPTED
              </span>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black text-white/10 tracking-[0.6em] uppercase italic">
            穢 2026 SNOWBOARDING V2.0 // NEURAL_LINK_ACTIVE
          </p>
          <div className="flex gap-10 text-[9px] font-black text-white/10 tracking-[0.4em] uppercase italic">
            <a href="#" className="hover:text-[#00F0FF] transition-colors">
              Privacy_Shield
            </a>
            <a href="#" className="hover:text-[#00F0FF] transition-colors">
              Terms_Of_Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
