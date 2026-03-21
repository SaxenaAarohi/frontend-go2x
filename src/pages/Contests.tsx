import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Contest {
  id: string;
  title: string;
  date: string;
  prize: string;
  participants: number;
}

const Contests = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/contests')
      .then(res => res.json())
      .then(setContests);
  }, []);

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black mb-4">COLLEGE <span className="text-brand">CONTESTS</span></h1>
          <p className="text-zinc-500 max-w-xl">Compete with students from across the country and win massive credit rewards and internships.</p>
        </div>
        <div className="bg-brand/10 border border-brand/20 rounded-xl px-6 py-4">
          <span className="text-xs font-bold text-brand uppercase block mb-1">Total Prize Pool</span>
          <span className="text-3xl font-black text-white">500,000+ Credits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {contests.map(contest => (
          <div key={contest.id} className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                <Trophy size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{contest.title}</h3>
                <div className="flex flex-wrap gap-4 text-zinc-500 text-sm font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} /> {contest.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={16} /> {contest.participants} Joined
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 w-full md:w-auto">
              <div className="text-center md:text-right flex-1 md:flex-none">
                <span className="text-xs font-bold text-zinc-500 uppercase block mb-1">Grand Prize</span>
                <span className="text-xl font-black text-brand">{contest.prize}</span>
              </div>
              <button 
                onClick={() => navigate(`/contest-room/${contest.id}`)}
                className="btn-primary px-8 whitespace-nowrap"
              >
                Join Now <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Contest Banner */}
      <div className="mt-16 relative rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[3/1]">
        <img src="https://picsum.photos/seed/contest/1200/400" className="w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent flex items-center px-12">
          <div className="max-w-lg">
            <span className="bg-brand text-white text-xs font-black px-3 py-1 rounded-full mb-4 inline-block">FEATURED EVENT</span>
            <h2 className="text-4xl font-black mb-4">GO2X GLOBAL HACKATHON</h2>
            <p className="text-zinc-300 mb-8">The biggest coding event of the year. Build the future of EdTech and win $10,000 in prizes.</p>
            <button className="btn-primary text-lg px-10">Register Interest</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contests;
