import React, { useState, useEffect } from 'react';
import { Play, Lock, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number;
  youtubeId: string;
  thumbnail: string;
  isPaid: boolean;
}

const Courses = () => {
  const { user } = useApp();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(setCourses);
  }, []);

  const handleCourseClick = (course: Course) => {
    if (course.isPaid && !user?.isPaid) {
      alert("This is a paid course. Please upgrade your account to watch.");
      return;
    }
    setSelectedCourse(course);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <h1 className="text-5xl font-black mb-12 uppercase italic tracking-tighter">
        MASTER <span className="text-brand">THE STACK</span>
      </h1>

      {selectedCourse && (
        <div className="mb-12 glass-card p-4 border-brand/40 bg-brand/5 animate-in fade-in zoom-in-95 duration-500">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-2xl shadow-brand/20">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedCourse.youtubeId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="mt-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">Now Playing</span>
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Course ID: {selectedCourse.id}</span>
              </div>
              <h2 className="text-3xl font-bold mb-1">{selectedCourse.title}</h2>
              <p className="text-zinc-500">Instructor: {selectedCourse.instructor}</p>
            </div>
            <button 
              onClick={() => setSelectedCourse(null)} 
              className="btn-outline py-2 px-4 text-sm"
            >
              Close Player
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div 
            key={course.id} 
            className="glass-card group cursor-pointer border-zinc-800 hover:border-brand/50"
            onClick={() => handleCourseClick(course)}
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-xl shadow-brand/40 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Play fill="white" size={32} />
                </div>
              </div>
              {course.isPaid && (
                <div className="absolute top-4 left-4 bg-brand text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                  PRO COURSE
                </div>
              )}
              {course.isPaid && !user?.isPaid && (
                <div className="absolute top-4 right-4 bg-black/80 p-2 rounded-full text-brand border border-brand/30">
                  <Lock size={14} />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold leading-tight group-hover:text-brand transition-colors mb-4 line-clamp-2">{course.title}</h3>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                    {course.instructor[0]}
                  </div>
                  <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{course.instructor}</span>
                </div>
                <span className="text-brand font-black text-lg">
                  {course.price === 0 ? 'FREE' : `$${course.price}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
