import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';

export default function Lightbox({ isOpen, images = [], currentIndex = 0, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 transition-all"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gold-500"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gold-500"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}

      {images.length > 1 && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gold-500"
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}

      <div 
        className="max-w-5xl w-full flex flex-col items-center max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full flex justify-center items-center overflow-hidden rounded-lg bg-black/40">
          <img 
            src={current?.imageUrl || current?.url} 
            alt={current?.title || 'NHBC Osogbo Gallery'} 
            className="max-h-[75vh] w-auto max-w-full object-contain shadow-2xl transition-transform duration-300"
          />
        </div>

        <div className="mt-4 text-center text-white max-w-2xl px-4">
          <div className="flex items-center justify-center gap-3 text-xs text-gold-400 font-medium mb-1.5 uppercase tracking-wider">
            {current?.category && (
              <span className="flex items-center gap-1 bg-gold-500/20 px-2.5 py-0.5 rounded-full border border-gold-500/30">
                <Tag className="w-3 h-3" /> {current.category}
              </span>
            )}
            {current?.date && (
              <span className="flex items-center gap-1 text-slate-300">
                <Calendar className="w-3 h-3" /> {current.date}
              </span>
            )}
            <span className="text-slate-400">
              {currentIndex + 1} of {images.length}
            </span>
          </div>

          <h3 className="text-xl font-serif font-semibold text-white tracking-wide">
            {current?.title}
          </h3>
          {current?.caption && (
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              {current.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}