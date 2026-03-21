import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Clock, AlertCircle, Send, Code, Users, Star, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

const ContestRoom = () => {
  const { user, setUser, addNotification } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [problems, setProblems] = useState<any[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/problems')
      .then(res => res.json())
      .then(data => setProblems(data.slice(0, 4)));

    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(setLeaderboard);

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (val: string) => {
    setAnswers(prev => ({ ...prev, [problems[currentProblemIndex].id]: val }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const score = Object.keys(answers).length * 100; // Mock score
    const timeTaken = formatTime(1800 - timeLeft);

    try {
      const res = await fetch('/api/contest/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, score, time: timeTaken })
      });
      const data = await res.json();
      setResult({ score, time: timeTaken, rank: data.rank });
      if (user) setUser({ ...user, credits: data.newCredits });
      addNotification(`🚀 Contest submitted! Score: ${score}`, 'success');
    } catch (err) {
      console.error(err);
    }
  };

  if (problems.length === 0) return <div className="pt-32 text-center font-black italic uppercase tracking-tighter text-brand">Preparing Contest...</div>;

  const currentProblem = problems[currentProblemIndex];

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Problem List & Timer */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-brand/20">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-brand" size={20} />
              <h2 className="text-lg font-black uppercase italic tracking-tighter">Time Left</h2>
            </div>
            <div className="text-4xl font-black tabular-nums text-white text-center">{formatTime(timeLeft)}</div>
          </div>

          <div className="glass-card p-6 border-brand/20">
            <div className="flex items-center gap-2 mb-6">
              <Code className="text-brand" size={20} />
              <h2 className="text-lg font-black uppercase italic tracking-tighter">Problems</h2>
            </div>
            <div className="space-y-3">
              {problems.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentProblemIndex(i)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${currentProblemIndex === i ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-brand/50'}`}
                >
                  <span className="font-black italic uppercase text-xs">Problem {i + 1}</span>
                  {answers[p.id] && <CheckCircle size={14} />}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitted || result}
            className="btn-primary w-full h-14 text-lg uppercase italic tracking-tighter shadow-xl shadow-brand/20"
          >
            {submitted ? 'Submitted' : 'Finish Contest'}
          </button>
        </div>

        {/* Center: Problem & Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 border-brand/20 bg-brand/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">{currentProblem.title}</h2>
              <span className="text-[10px] font-black px-2 py-1 bg-zinc-800 text-brand rounded uppercase">{currentProblem.difficulty}</span>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-8">{currentProblem.description}</p>
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-brand" size={14} />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Your Solution</span>
              </div>
              <textarea
                value={answers[currentProblem.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="// Write your code here..."
                className="w-full h-[400px] bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-sm text-zinc-300 focus:outline-none focus:border-brand resize-none"
                disabled={submitted || result}
              />
            </div>
          </div>
        </div>

        {/* Right: Leaderboard & Result */}
        <div className="lg:col-span-1 space-y-6">
          <AnimatePresence>
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 border-2 border-emerald-500 bg-emerald-500/10 text-center"
              >
                <Trophy className="text-emerald-500 mx-auto mb-4" size={48} />
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Contest Over!</h3>
                <div className="space-y-2 mb-8">
                  <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Your Rank: <span className="text-white">#{result.rank}</span></p>
                  <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Score: <span className="text-white">{result.score}</span></p>
                  <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Time: <span className="text-white">{result.time}</span></p>
                </div>
                <button 
                  onClick={() => navigate('/contests')}
                  className="w-full py-3 bg-white text-black font-black uppercase italic tracking-tighter rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Back to Contests
                </button>
              </motion.div>
            ) : (
              <div className="glass-card p-6 border-brand/20">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="text-brand" size={20} />
                  <h2 className="text-lg font-black uppercase italic tracking-tighter">Leaderboard</h2>
                </div>
                <div className="space-y-4">
                  {leaderboard.map((item) => (
                    <div key={item.rank} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-900">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-brand italic">#{item.rank}</span>
                        <span className="text-sm font-bold text-zinc-300">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-white block">{item.score} pts</span>
                        <span className="text-[10px] text-zinc-500">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ContestRoom;
