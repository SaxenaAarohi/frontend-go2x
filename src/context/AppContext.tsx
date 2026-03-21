import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  credits: number;
  isPaid: boolean;
  joinedCourses: string[];
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User) => void;
  notifications: Notification[];
  addNotification: (msg: string, type?: Notification['type']) => void;
  removeNotification: (id: string) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/1')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });

    // Simulated real-time notifications
    const interval = setInterval(() => {
      const msgs = [
        { text: "🔥 Someone just beat your score in DSA!", type: 'warning' },
        { text: "😈 Your rival is ahead of you in React Mastery!", type: 'error' },
        { text: "⚡ You are falling behind! 12 students just joined the challenge.", type: 'info' },
        { text: "💰 500 Credits awarded to 'TopCoder' for winning 1v1!", type: 'success' },
        { text: "🚀 New Alumni session: 'How I got into Google' starting now!", type: 'info' },
        { text: "💀 Your daily streak is at risk! Complete a lesson now.", type: 'error' }
      ];
      const random = msgs[Math.floor(Math.random() * msgs.length)];
      addNotification(random.text, random.type as Notification['type']);
    }, 600000); // Every 10 minutes

    return () => clearInterval(interval);
  }, []);

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [{ id, message, type }, ...prev].slice(0, 5));
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AppContext.Provider value={{ user, setUser, notifications, addNotification, removeNotification, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
