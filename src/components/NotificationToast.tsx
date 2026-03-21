import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, Zap, Trophy, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NotificationToast = () => {
  const { notifications, removeNotification } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="text-orange-500" size={18} />;
      case 'error': return <Zap className="text-red-500" size={18} />;
      case 'success': return <Trophy className="text-emerald-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 w-80 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((note) => (
          <motion.div
            key={note.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="pointer-events-auto glass-card p-4 flex items-start gap-3 shadow-2xl border-l-4 border-l-brand relative group overflow-hidden"
          >
            <div className="mt-0.5">{getIcon(note.type)}</div>
            <p className="text-sm font-medium text-zinc-200 pr-4">{note.message}</p>
            <button 
              onClick={() => removeNotification(note.id)}
              className="absolute top-2 right-2 text-zinc-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
            
            {/* Progress bar for auto-dismiss */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 bg-brand/30"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
