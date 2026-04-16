import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Plus } from 'lucide-react';

const PaymentMethods: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-dark px-[5%] py-24 overflow-hidden">
      <div className="max-w-2xl mx-auto glass p-10 rounded-4xl border border-white/5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/40 hover:text-accent-blue mb-8 text-sm font-bold tracking-widest uppercase transition-colors"
          >
            &larr; BACK TO DASHBOARD
          </button>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black tracking-tighter">PAYMENT METHODS</h1>
            <button className="flex items-center gap-2 text-accent-blue hover:text-white transition-colors text-xs font-bold tracking-widest uppercase">
              <Plus size={16} /> ADD NEW
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-accent-blue/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg">?ＴＴＴ??ＴＴＴ??ＴＴＴ?4242</p>
                  <p className="text-xs text-white/40 tracking-widest uppercase">
                    Expires 12/28
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full tracking-widest">
                DEFAULT
              </span>
            </div>

            <div className="p-6 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 hover:text-white hover:border-white transition-all cursor-pointer py-10">
              <CreditCard size={32} className="mb-4 opacity-50" />
              <p className="text-sm font-medium">No other payment methods found.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentMethods;
