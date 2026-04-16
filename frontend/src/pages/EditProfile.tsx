import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EditProfile: React.FC = () => {
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
          <h1 className="text-3xl font-black mb-8 tracking-tighter">EDIT PROFILE</h1>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Profile updated!');
              navigate('/dashboard');
            }}
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-accent-blue tracking-[0.2em] uppercase">
                Name
              </label>
              <input type="text" className="input-field" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-accent-blue tracking-[0.2em] uppercase">
                Phone
              </label>
              <input type="tel" className="input-field" placeholder="0912345678" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-accent-blue tracking-[0.2em] uppercase">
                Language Preference
              </label>
              <select className="input-field bg-bg-dark">
                <option value="zh-tw">繁體中文</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full mt-8">
              SAVE CHANGES
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
