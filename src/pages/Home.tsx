import React, { useState, useEffect } from 'react';
import { Play, Lock, Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [timeLeft, setTimeLeft] = useState(3600 * 24 * 2 + 3600 * 5); // Mock countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="mb-20 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black leading-none mb-6"
          >
            ACCELERATE <br />
            YOUR <span className="text-brand">FUTURE.</span>
          </motion.h1>
          <p className="text-zinc-400 text-xl mb-8 max-w-xl">
            The elite edtech platform for developers who want to go from 0 to 2X faster than the competition.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="btn-primary text-lg px-8 py-4" onClick={() => navigate('/courses')}>
              Explore Courses
            </button>
            <button className="btn-outline text-lg px-8 py-4" onClick={() => navigate('/dashboard')}>
              Join 1v1 Challenge
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="w-full aspect-square bg-brand/10 rounded-full blur-3xl absolute -z-10 animate-pulse"></div>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRncb1Gq2AnFQdlW_i5B5Se8DuXx0mq14pDQ&s" 
            alt="Hero" 
            className="rounded-2xl h-full w-full border-2 border-zinc-800 shadow-2xl shadow-brand/20 rotate-3 hover:rotate-0 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Free Live Session Section */}
      <section className="mb-20">
        <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-brand/30 bg-brand/5">
          <div>
            <div className="flex items-center gap-2 text-brand mb-2">
              <div className="w-2 h-2 bg-brand rounded-full animate-ping"></div>
              <span className="font-bold uppercase tracking-widest text-sm">Upcoming Free Session</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">System Design for Scale</h2>
            <p className="text-zinc-400">Join our weekly free session with industry experts.</p>
          </div>
          <div className="text-center md:text-right">
            <div className="text-4xl font-mono font-black text-white mb-4">
              {formatTime(timeLeft)}
            </div>
            <button className="btn-primary w-full md:w-auto">
              <Clock size={20} /> Remind Me
            </button>
          </div>
        </div>
      </section>

      {/* Alumni Section (Paid Only) */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black">ALUMNI <span className="text-brand">LIVE</span></h2>
          {!user?.isPaid && (
            <span className="flex items-center gap-2 text-zinc-500 text-sm font-bold uppercase">
              <Lock size={14} /> Paid Users Only
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {user?.isPaid ? (
            <>
              <div className="glass-card group cursor-pointer">
                <div className="aspect-video relative overflow-hidden">
                  <img src="https://picsum.photos/seed/alumni1/800/450" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play fill="white" size={48} />
                  </div>
                  <div className="absolute top-4 left-4 bg-brand text-white text-xs font-bold px-2 py-1 rounded">LIVE NOW</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Cracking FAANG Interviews</h3>
                  <p className="text-zinc-500 text-sm flex items-center gap-2">
                    <Users size={14} /> 450 Watching
                  </p>
                </div>
              </div>
              <div className="glass-card group cursor-pointer">
                <div className="aspect-video relative overflow-hidden">
                  <img src="https://picsum.photos/seed/alumni2/800/450" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play fill="white" size={48} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Life at Google: Q&A</h3>
                  <p className="text-zinc-500 text-sm flex items-center gap-2">
                    <Users size={14} /> 1.2k Watching
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-full glass-card p-12 text-center border-dashed border-zinc-700">
              <Lock size={48} className="mx-auto text-zinc-700 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Unlock Alumni Sessions</h3>
              <p className="text-zinc-500 mb-6 max-w-md mx-auto">Get exclusive access to live sessions with alumni from top tech companies.</p>
              <button className="btn-primary mx-auto">Upgrade to Pro</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
