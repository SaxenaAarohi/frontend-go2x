import React, { useState } from 'react';
import { Swords, Zap, AlertCircle, Trophy, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'motion/react';

const Dashboard = () => {
  const { user, setUser, notifications, addNotification, loading } = useApp();
  const navigate = useNavigate();
  const [stake, setStake] = useState(100);
  const [challenging, setChallenging] = useState(false);
  const [matchmaking, setMatchmaking] = useState(false);
  const [result, setResult] = useState<{ win: boolean; newCredits: number } | null>(null);

  if (loading) {
    return (
      <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-brand rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-zinc-500 mb-6">We couldn't load your profile. Please try refreshing the page.</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Refresh Page</button>
      </div>
    );
  }

  const handleChallenge = async () => {
    console.log("Challenge initiated", { user, stake });
    if (!user) {
      addNotification("User not loaded!", "error");
      return;
    }
    
    if (user.credits < stake) {
      addNotification("Insufficient credits to stake!", "error");
      return;
    }
    
    setMatchmaking(true);
    setResult(null);

    // Simulate matchmaking
    setTimeout(() => {
      console.log("Matchmaking complete, navigating to challenge room");
      setMatchmaking(false);
      navigate('/challenge-room');
    }, 2500);
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile & Credits */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 flex items-center gap-6 border-l-8 border-l-brand relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-brand flex items-center justify-center text-brand shadow-lg shadow-brand/20">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">{user?.name}</h1>
              <p className="text-zinc-500 font-medium">Member since March 2026</p>
              <div className="mt-2 flex gap-2">
                <span className={`text-[10px] font-black tracking-widest px-2 py-1 rounded uppercase ${user?.isPaid ? 'bg-brand text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  {user?.isPaid ? 'PRO MEMBER' : 'FREE ACCOUNT'}
                </span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest block mb-1">Available Credits</span>
              <span className="text-5xl font-black text-brand tabular-nums">{user?.credits}</span>
            </div>
          </div>

          {/* 1v1 Challenge System */}
          <div className="glass-card p-8 border-brand/20 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-brand/10 rounded-lg">
                <Swords className="text-brand" size={32} />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">1v1 SPRINT <span className="text-brand">CHALLENGE</span></h2>
            </div>
            
            <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 mb-8 relative">
              <p className="text-zinc-400 mb-6 font-medium">Stake your credits and challenge a random opponent. High stakes, high rewards. <span className="text-brand font-bold">Winner takes all!</span></p>
              
              <div className="flex flex-col md:flex-row items-end gap-6">
                <div className="flex-1 w-full">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Stake Amount (Min 100)</label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-brand" size={18} />
                    <input 
                      type="number" 
                      value={stake} 
                      onChange={(e) => setStake(Math.max(100, Number(e.target.value)))}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-white font-black text-xl focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleChallenge}
                  disabled={challenging || matchmaking || (user?.credits || 0) < stake}
                  className="btn-primary h-[64px] w-full md:w-auto px-12 text-lg uppercase italic tracking-tighter disabled:opacity-50 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {matchmaking ? 'Finding Opponent...' : challenging ? 'Sprinting...' : 'Join Challenge'}
                  </span>
                  {(matchmaking || challenging) && (
                    <motion.div 
                      className="absolute inset-0 bg-brand-dark"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {matchmaking && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-24 h-24 border-4 border-zinc-800 border-t-brand rounded-full animate-spin mb-6"></div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Finding Opponent...</h3>
                  <p className="text-zinc-500 font-medium">Matching you with a worthy rival based on your skill level.</p>
                </motion.div>
              )}

              {challenging && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="flex items-center gap-12 mb-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-brand flex items-center justify-center text-brand">
                        <User size={40} />
                      </div>
                      <span className="font-black italic uppercase text-sm">YOU</span>
                    </div>
                    <div className="text-5xl font-black text-brand italic animate-pulse">VS</div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-red-500 flex items-center justify-center text-red-500">
                        <Zap size={40} />
                      </div>
                      <span className="font-black italic uppercase text-sm">RIVAL_402</span>
                    </div>
                  </div>
                  <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-brand"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3 }}
                    />
                  </div>
                  <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Sprint in progress...</p>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-8 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${result.win ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${result.win ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'bg-red-500 text-white shadow-lg shadow-red-500/40'}`}>
                      {result.win ? <Trophy size={32} /> : <AlertCircle size={32} />}
                    </div>
                    <div>
                      <h3 className="font-black text-4xl italic uppercase tracking-tighter">{result.win ? 'VICTORY!' : 'DEFEAT'}</h3>
                      <p className="font-bold uppercase tracking-widest text-xs opacity-80">{result.win ? `You dominated the sprint and won ${stake} credits!` : `You were outpaced. Lost ${stake} credits.`}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setResult(null)}
                    className={`px-8 py-3 rounded-xl font-black uppercase italic tracking-tighter border-2 transition-colors ${result.win ? 'border-emerald-500 hover:bg-emerald-500 hover:text-white' : 'border-red-500 hover:bg-red-500 hover:text-white'}`}
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Notifications Sidebar */}
        <div className="space-y-8">
          <div className="glass-card p-6 border-t-4 border-t-brand">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-brand" size={20} />
              <h2 className="text-lg font-black uppercase italic tracking-tighter">LIVE ACTIVITY</h2>
            </div>
            <div className="space-y-4">
              {notifications.slice(0, 5).map((note) => (
                <div key={note.id} className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 text-sm text-zinc-300 animate-in fade-in slide-in-from-right-4">
                  {note.message}
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-zinc-600 text-center py-8 font-bold uppercase tracking-widest text-xs">Waiting for activity...</p>
              )}
            </div>
          </div>
          
          <div className="glass-card p-6 bg-brand/5 border-brand/20">
            <h3 className="font-black italic uppercase tracking-tighter text-brand mb-2">Pro Tip</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">Students who participate in at least 3 challenges a day are 2.5x more likely to land a high-paying job. <span className="text-white font-bold">Keep sprinting!</span></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
