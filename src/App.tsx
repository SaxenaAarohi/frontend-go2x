import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import NotificationToast from './components/NotificationToast';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import Contests from './pages/Contests';
import ChallengeRoom from './pages/ChallengeRoom';
import ContestRoom from './pages/ContestRoom';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          <NotificationToast />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/contests" element={<Contests />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/challenge-room" element={<ChallengeRoom />} />
              <Route path="/contest-room/:id" element={<ContestRoom />} />
            </Routes>
          </main>
          
          <footer className="border-t border-zinc-800 py-12 mt-20 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter text-white">GO<span className="text-brand">2X</span></span>
              </div>
              <p className="text-zinc-500 text-sm">© 2026 Go2X EdTech. Built for the next generation of builders.</p>
              <div className="flex gap-6 text-zinc-500 text-sm font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-brand transition-colors">Twitter</a>
                <a href="#" className="hover:text-brand transition-colors">Discord</a>
                <a href="#" className="hover:text-brand transition-colors">LinkedIn</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
