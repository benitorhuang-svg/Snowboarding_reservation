import React, { useEffect } from 'react';
import { useNotification } from '@/core';

interface TPDirectResult {
  status: number;
  msg: string;
  card: {
    prime: string;
  };
}

declare global {
  interface Window {
    TPDirect: {
      setupSDK: (appId: number, appKey: string, env: string) => void;
      card: {
        setup: (config: object) => void;
        getPrime: (callback: (result: TPDirectResult) => void) => void;
      };
    };
  }
}

interface TappayPaymentProps {
  onSuccess: () => void;
  amount: number;
}

const TappayPayment: React.FC<TappayPaymentProps> = ({ onSuccess, amount }) => {
  const { notify } = useNotification();

  // These should be from environment variables in a real app
  const appId = 12345;
  const appKey = 'app_key_placeholder';

  useEffect(() => {
    if (window.TPDirect) {
      window.TPDirect.setupSDK(appId, appKey, 'sandbox');
      window.TPDirect.card.setup({
        fields: {
          number: {
            element: '#card-number',
            placeholder: '**** **** **** ****',
          },
          expirationDate: {
            element: '#card-expiration-date',
            placeholder: 'MM / YY',
          },
          ccv: {
            element: '#card-ccv',
            placeholder: 'CCV',
          },
        },
        styles: {
          input: {
            color: 'white',
            'font-size': '16px',
            'font-weight': 'bold',
          },
          'input.invalid': {
            color: '#FF003C',
          },
          'input.valid': {
            color: '#00F0FF',
          },
        },
      });
    }
  }, []);

  const handleGetPrime = () => {
    if (!window.TPDirect) {
      notify('Payment SDK not loaded', 'error');
      return;
    }

    window.TPDirect.card.getPrime((result: TPDirectResult) => {
      if (result.status !== 0) {
        notify('Authorization Failed: ' + result.msg, 'error');
        return;
      }
      // In a real app, you would send result.card.prime to your backend here
      console.log('Prime received:', result.card.prime);
      notify('Security Handshake Successful', 'success');
      onSuccess();
    });
  };

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#00F0FF]/50 transition-all">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 block italic">
            Encryption Key (Card Number)
          </label>
          <div id="card-number" className="h-10"></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#00F0FF]/50 transition-all">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 block italic">
              Expiry
            </label>
            <div id="card-expiration-date" className="h-10"></div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#00F0FF]/50 transition-all">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 block italic">
              CVV
            </label>
            <div id="card-ccv" className="h-10"></div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1 italic">
            Authorized Amount
          </p>
          <p className="text-3xl font-black text-white italic tracking-tighter">
            NT$ {amount.toLocaleString()}
          </p>
        </div>
        <button
          onClick={handleGetPrime}
          className="bg-[#00F0FF] text-black px-12 py-5 rounded-xl font-black text-xs tracking-[0.4em] uppercase italic shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] hover:-translate-y-1 active:scale-95 transition-all"
        >
          Confirm & Authorize
        </button>
      </div>
    </div>
  );
};

export default TappayPayment;
