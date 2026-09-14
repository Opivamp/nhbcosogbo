import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Tag, Search, ArrowRight, X, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await api.getNews();
      setNewsList(data || []);
    } catch (err) {
      console.error('Failed to load news', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = newsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-navy-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-gold-400/30">
            <Bell className="w-3.5 h-3.5" /> Official Church Bulletin
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            News & Announcements
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Stay informed with upcoming church activities, ministry milestones, pastoral notices, and testimonies of God's goodness at NHBC Osogbo.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              placeholder="Search announcements and updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-sand-300 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-sm text-sm"
            />
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-sand-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-sand-200 p-8">
            <Bell className="w-16 h-16 text-navy-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-navy-900 mb-2">No Announcements Found</h3>
            <p className="text-navy-600">Please check back soon for upcoming updates and bulletins.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-navy-500 mb-3">
                      <span className="flex items-center gap-1 font-medium text-gold-600">
                        <Tag className="w-3.5 h-3.5" /> {item.category || 'Announcement'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {item.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-navy-900 mb-2.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-navy-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {item.excerpt || item.content}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPost(item)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600 transition-colors pt-4 border-t border-sand-100"
                  >
                    Read Full Bulletin <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {selectedPost.image && (
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-56 object-cover rounded-xl mb-6 shadow-sm"
              />
            )}
            <div className="flex items-center gap-3 text-xs text-navy-500 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-700 font-semibold">
                {selectedPost.category || 'Announcement'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {selectedPost.date}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-900 mb-4">
              {selectedPost.title}
            </h2>
            <div className="prose prose-navy max-w-none text-navy-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {selectedPost.content}
            </div>
            <div className="mt-8 pt-4 border-t border-sand-200 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 rounded-lg bg-navy-900 text-gold-400 font-medium text-sm hover:bg-navy-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}