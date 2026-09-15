import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Search, Play, Volume2, Calendar, BookOpen } from 'lucide-react';
import AudioPlayer from '../components/ui/AudioPlayer';
import VideoModal from '../components/ui/VideoModal';

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [activeAudio, setActiveAudio] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    async function fetchSermons() {
      try {
        const res = await api.getSermons({ search, category });
        setSermons(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(() => {
      fetchSermons();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  const categories = ['All', 'Spiritual Growth', 'Faith & Encouragement', 'Stewardship', 'Family & Youth'];

  return (
    <div className="w-full bg-[#FAF9F6] pb-24">
      <div className="bg-navy-950 text-white py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-400">The Living Word</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-2">Sermon Library</h1>
          <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
            Listen, watch, and be inspired by sound biblical expositions and spiritual revival messages from NHBC Osogbo.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-12 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search sermon, preacher, scripture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                  (cat === 'All' && !category) || category === cat
                    ? 'bg-navy-900 text-gold-400'
                    : 'bg-[#FAF9F6] text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : sermons.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <BookOpen className="w-12 h-12 text-gold-500/50 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-navy-950">No Sermons Found</h3>
            <p className="text-sm mt-1">Try adjusting your search criteria or selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sermons.map((sermon) => (
              <div
                key={sermon.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-gold-400/50 shadow-sm hover:shadow-xl transition flex flex-col group"
              >
                <div className="h-52 bg-navy-950 relative overflow-hidden">
                  <img 
                    src={sermon.thumbnailUrl || './uploads/sermon-faith.svg'} 
                    alt={sermon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-navy-950/40 flex items-center justify-center">
                    <button
                      onClick={() => setActiveVideo(sermon)}
                      className="w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 flex items-center justify-center shadow-lg transition transform hover:scale-110"
                      aria-label="Play sermon video"
                    >
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 bg-navy-900/90 text-gold-400 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-navy-700">
                    {sermon.category || 'Sermon'}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold-500" /> {sermon.date}</span>
                      {sermon.duration && <span>• {sermon.duration}</span>}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-navy-950 mb-2 group-hover:text-gold-600 transition leading-snug">
                      {sermon.title}
                    </h3>

                    <p className="text-xs text-gold-700 font-semibold mb-2">
                      Preacher: <span className="text-slate-800">{sermon.speaker}</span>
                    </p>

                    {sermon.scripture && (
                      <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                        <span className="font-medium text-navy-900">{sermon.scripture}</span>
                      </p>
                    )}

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {sermon.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    {sermon.audioUrl && (
                      <button
                        onClick={() => setActiveAudio(activeAudio?.id === sermon.id ? null : sermon)}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-xs text-white bg-navy-900 hover:bg-navy-800 transition flex items-center justify-center gap-1.5"
                      >
                        <Volume2 className="w-4 h-4 text-gold-400" />
                        <span>{activeAudio?.id === sermon.id ? 'Hide Player' : 'Listen'}</span>
                      </button>
                    )}

                    {sermon.videoUrl && (
                      <button
                        onClick={() => setActiveVideo(sermon)}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-xs text-navy-950 bg-gold-400 hover:bg-gold-500 transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch</span>
                      </button>
                    )}
                  </div>
                </div>

                {activeAudio?.id === sermon.id && (
                  <div className="p-4 bg-navy-950 border-t border-navy-800">
                    <AudioPlayer 
                      audioUrl={sermon.audioUrl}
                      title={sermon.title}
                      speaker={sermon.speaker}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <VideoModal
        isOpen={!!activeVideo}
        videoUrl={activeVideo?.videoUrl}
        title={activeVideo?.title}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
}