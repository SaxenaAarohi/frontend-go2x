import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Trophy, LayoutDashboard, Zap, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { user } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-zinc-800 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Zap className="text-brand w-8 h-8 fill-brand" />
        <span className="text-2xl font-black tracking-tighter text-white">GO<span className="text-brand">2X</span></span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-brand' : 'text-zinc-400 hover:text-white'}`}>
          <Home size={18} /> Home
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-brand' : 'text-zinc-400 hover:text-white'}`}>
          <BookOpen size={18} /> Courses
        </NavLink>
        <NavLink to="/contests" className={({ isActive }) => `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-brand' : 'text-zinc-400 hover:text-white'}`}>
          <Trophy size={18} /> Contests
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-brand' : 'text-zinc-400 hover:text-white'}`}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Credits</span>
          <span className="text-brand font-black">{user?.credits || 0}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
          <User size={20} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
