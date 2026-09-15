import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function VideoModal({ isOpen, videoUrl, title, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let embedUrl = videoUrl;
  const isDirectVideo = videoUrl?.startsWith('data:video/') || 
    videoUrl?.endsWith('.mp4') || 
    videoUrl?.endsWith('.webm') || 
    videoUrl?.endsWith('.ogg') ||
    videoUrl?.includes('/uploads/');

  if (videoUrl?.includes('youtube.com/watch?v=')) {
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
  } else if (videoUrl?.includes('youtu.be/')) {
    const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
    embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-navy-950 rounded-2xl overflow-hidden shadow-2xl border border-navy-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-900">
          <h3 className="text-lg font-serif font-semibold text-white truncate pr-4">{title || 'Watch Sermon'}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-navy-800 hover:bg-navy-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative pt-[56.25%] bg-black">
          {isDirectVideo ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : embedUrl ? (
            <iframe 
              src={embedUrl}
              title={title || 'Sermon Video'}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <p>No video link provided for this message.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}