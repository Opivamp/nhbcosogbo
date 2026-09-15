import React, { useState, useEffect } from 'react';
import { Camera, Tag, Calendar, Eye, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import Lightbox from '../components/ui/Lightbox';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    loadGallery(selectedCategory);
  }, [selectedCategory]);

  const loadGallery = async (cat) => {
    setLoading(true);
    try {
      const data = await api.getGallery(cat);
      setImages(data.images || []);
      if (data.categories && data.categories.length > 0) {
        setCategories(['All', ...data.categories]);
      }
    } catch (err) {
      console.error('Failed to load gallery', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-navy-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-gold-400/30">
            <Camera className="w-3.5 h-3.5" /> Moments of Fellowship & Praise
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Church Photo Gallery
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Witness God’s work, joy, and spiritual communion across worship services, youth fellowships, outreach missions, and church celebrations in NHBC Osogbo.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-gold-400 shadow-navy-900/30 ring-2 ring-gold-400'
                  : 'bg-white text-navy-800 hover:bg-gold-50 border border-sand-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-sand-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-sand-200 p-8 shadow-sm">
            <Camera className="w-16 h-16 text-navy-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-navy-900 mb-2">No Photos Found</h3>
            <p className="text-navy-600">No photos are available under the "{selectedCategory}" category yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => setLightboxIndex(idx)}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden shadow-md bg-white border border-sand-200 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={img.url || img.imageUrl}
                  alt={img.title || 'NHBC Osogbo Gallery'}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span className="inline-block self-start px-2 py-0.5 rounded text-[11px] font-semibold bg-gold-500 text-navy-950 mb-1">
                    {img.category || 'General'}
                  </span>
                  <h4 className="font-serif font-bold text-sm line-clamp-1">{img.title}</h4>
                  {img.description && (
                    <p className="text-xs text-navy-200 line-clamp-2 mt-0.5">{img.description}</p>
                  )}
                  {img.date && (
                    <div className="flex items-center gap-1 text-[10px] text-gold-300 mt-2">
                      <Calendar className="w-3 h-3" /> {img.date}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gold-600 uppercase tracking-wide">
                      {img.category || 'General'}
                    </span>
                    {img.date && <span className="text-[11px] text-navy-400">{img.date}</span>}
                  </div>
                  <h4 className="font-serif font-bold text-navy-900 text-sm mt-1 line-clamp-1">
                    {img.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Community Note */}
        <div className="mt-16 bg-navy-900 text-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto">
            <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-3" />
            <h3 className="text-2xl font-serif font-bold mb-3">Be Part of the Story</h3>
            <p className="text-navy-200 text-sm md:text-base leading-relaxed mb-6">
              Every Sunday and weekly fellowship is an encounter with the divine and a celebration of Christian brotherhood. We invite you to worship with us and make everlasting memories in His presence.
            </p>
            <a
              href="/visit"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold text-sm transition-colors shadow-md"
            >
              Plan Your Visit This Sunday
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
}