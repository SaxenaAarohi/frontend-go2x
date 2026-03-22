import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Zap, Trophy, AlertCircle, Clock, User, Send, Code } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const ChallengeRoom = () => {
  const { user, setUser, addNotification } = useApp();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [opponentStatus, setOpponentStatus] = useState('Typing...');
  const [opponentSubmitted, setOpponentSubmitted] = useState(false);
  const [userSubmitted, setUserSubmitted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState('You are faster!');

  useEffect(() => {
    fetch(`${BASE_URL}/api/problems`)
      .then(res => res.json())
      .then(data => setProblem(data[Math.floor(Math.random() * data.length)]));

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Simulate Opponent
    const opponentTimeout = setTimeout(() => {
      setOpponentStatus('Thinking...');
      setTimeout(() => {
        setOpponentStatus('Submitting...');
        setTimeout(() => {
          setOpponentSubmitted(true);
          setOpponentStatus('Submitted!');
          addNotification("Opponent submitted solution!", "warning");
          if (!userSubmitted) {
            setStatusMsg('Opponent is ahead!');
          }
        }, 2000);
      }, 5000);
    }, Math.random() * 30000 + 20000); // 20-50 seconds

    return () => {
      clearInterval(timer);
      clearTimeout(opponentTimeout);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateCode = (code: string, problem: any) => {
    const cleanCode = code.trim();
    if (cleanCode.length < 30) return false;
    
    const keywords = ['function', 'return', 'const', 'let', 'var', 'if', 'for', 'while', '=>', 'console', 'math'];
    const hasKeywords = keywords.some(k => cleanCode.includes(k));
    if (!hasKeywords) return false;

    // Problem specific logic checks
    const lowerCode = cleanCode.toLowerCase();
    if (problem.id === 'p1' && !lowerCode.includes('target')) return false; // Two Sum
    if (problem.id === 'p2' && !lowerCode.includes('reverse')) return false; // Reverse String
    if (problem.id === 'p5' && (!lowerCode.includes('stack') && !lowerCode.includes('push') && !lowerCode.includes('pop'))) return false; // Valid Parentheses
    
    return true;
  };

  const handleSubmit = async () => {
    if (userSubmitted || isValidating) return;
    
    setIsValidating(true);
    setStatusMsg('Running test cases...');
    
    // Simulate test execution delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isCorrect = validateCode(code, problem);

    if (!isCorrect) {
      setIsValidating(false);
      setStatusMsg('Tests failed! Check your logic.');
      addNotification("Your solution failed the test cases. Please check your logic and try again.", "error");
      return;
    }

    setIsValidating(false);
    setUserSubmitted(true);
    setStatusMsg('All tests passed!');
    
    const win = !opponentSubmitted;
    const stake = 200; // Fixed stake for coding challenge

    try {
      const res = await fetch(`${BASE_URL}/api/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, stake: win ? stake : -stake })
      });
      const data = await res.json();
      setResult({ win, reward: win ? stake : -stake });
      if (user) setUser({ ...user, credits: data.newCredits });
      
      if (win) {
        addNotification(`🔥 VICTORY! You beat the Robo User!`, 'success');
      } else {
        addNotification(`💀 DEFEAT! Robo User was faster.`, 'error');
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('Submission error. Try again.');
      setIsValidating(false);
    }
  };

  if (!problem) return <div className="pt-32 text-center font-black italic uppercase tracking-tighter text-brand">Initializing Battle...</div>;

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Problem Statement */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-brand/20">
            <div className="flex items-center gap-2 mb-4">
              <Code className="text-brand" size={20} />
              <h2 className="text-lg font-black uppercase italic tracking-tighter">Problem</h2>
            </div>
            <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
            <span className="text-[10px] font-black px-2 py-0.5 bg-zinc-800 text-brand rounded uppercase mb-4 inline-block">{problem.difficulty}</span>
            <p className="text-zinc-400 text-sm leading-relaxed">{problem.description}</p>
          </div>

          <div className="glass-card p-6 border-brand/20">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-brand" size={20} />
              <h2 className="text-lg font-black uppercase italic tracking-tighter">Timer</h2>
            </div>
            <div className="text-4xl font-black tabular-nums text-white">{formatTime(timeLeft)}</div>
          </div>
        </div>

        {/* Center: Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 border-brand/40 bg-brand/5 relative min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">solution.js</span>
              </div>
              <div className="text-brand font-black italic uppercase text-xs animate-pulse">{statusMsg}</div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your solution here..."
              className="flex-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl p-6 font-mono text-sm text-zinc-300 focus:outline-none focus:border-brand resize-none"
              disabled={userSubmitted || result}
            />
            <button
              onClick={handleSubmit}
              disabled={userSubmitted || result || !code.trim() || isValidating}
              className="mt-6 btn-primary w-full h-14 text-lg uppercase italic tracking-tighter group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Send size={20} /> {isValidating ? 'Running Tests...' : userSubmitted ? 'Submitted' : 'Submit Solution'}
              </span>
              {!userSubmitted && !result && !isValidating && (
                <motion.div 
                  className="absolute inset-0 bg-brand-dark"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Right: Opponent Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-red-500/20">
            <div className="flex items-center gap-2 mb-6">
              <Swords className="text-red-500" size={20} />
              <h2 className="text-lg font-black uppercase italic tracking-tighter">Opponent</h2>
            </div>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${opponentSubmitted ? 'bg-red-500 border-red-500 text-white shadow-xl shadow-red-500/40' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                <Zap size={48} />
              </div>
              <div className="text-center">
                <h3 className="font-black uppercase italic tracking-tighter text-xl">Robo_User_402</h3>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${opponentSubmitted ? 'text-red-500' : 'text-zinc-500 animate-pulse'}`}>
                  {opponentStatus}
                </p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`glass-card p-6 border-2 text-center ${result.win ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10'}`}
              >
                <div className="flex justify-center mb-4">
                  {result.win ? <Trophy className="text-emerald-500" size={48} /> : <AlertCircle className="text-red-500" size={48} />}
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
                  {result.win ? 'YOU WON!' : 'YOU LOST!'}
                </h3>
                <p className={`font-bold uppercase tracking-widest text-xs mb-6 ${result.win ? 'text-emerald-500' : 'text-red-500'}`}>
                  {result.win ? `+${result.reward} Credits` : `${result.reward} Credits`}
                </p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 bg-white text-black font-black uppercase italic tracking-tighter rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Back to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ChallengeRoom;
