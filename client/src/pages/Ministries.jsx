import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Users, Clock, Mail, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Ministries() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeMinistry, setActiveMinistry] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getMinistries();
        setMinistries(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ['All', ...Array.from(new Set(ministries.map(m => m.category || 'General')))];

  const filtered = selectedCategory === 'All' 
    ? ministries 
    : ministries.filter(m => m.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6]">
      <div className="bg-navy-950 text-white py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-400">Find Your Place to Serve & Grow</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-2">Church Ministries</h1>
          <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
            Discover vibrant arms of fellowship, service, and discipleship tailored for every season of life at NHBC Osogbo.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-gold-400 shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((min) => (
            <div
              key={min.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-gold-400/50 shadow-sm hover:shadow-xl transition flex flex-col group"
            >
              <div className="h-52 bg-navy-950 relative overflow-hidden">
                <img
                  src={min.imageUrl || '/uploads/hero-sanctuary.svg'}
                  alt={min.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-navy-900/80 backdrop-blur-sm text-gold-400 text-xs font-semibold px-3 py-1 rounded-full border border-navy-700">
                  {min.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-navy-950 mb-2 group-hover:text-gold-600 transition">
                    {min.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {min.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {min.meetingSchedule && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                      <span className="truncate">{min.meetingSchedule}</span>
                    </div>
                  )}

                  <button
                    onClick={() => setActiveMinistry(min)}
                    className="w-full py-2.5 rounded-xl font-semibold text-xs text-navy-950 bg-gold-400 hover:bg-gold-500 transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>View Ministry Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeMinistry && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setActiveMinistry(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-slideUp max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 bg-navy-950">
              <img 
                src={activeMinistry.imageUrl || '/uploads/hero-sanctuary.svg'} 
                alt={activeMinistry.name}
                className="w-full h-full object-cover opacity-60"
              />
              <button 
                onClick={() => setActiveMinistry(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 text-white">
                <span className="text-xs uppercase font-bold text-gold-400 tracking-wider block">{activeMinistry.category}</span>
                <h3 className="font-serif text-2xl font-bold">{activeMinistry.name}</h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div>
                <h4 className="font-serif text-base font-bold text-navy-950 mb-2">About this Ministry</h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {activeMinistry.fullDescription || activeMinistry.shortDescription}
                </p>
              </div>

              <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-gold-500" />
                  <span className="font-semibold text-navy-900">Meeting Schedule:</span> {activeMinistry.meetingSchedule || 'Contact ministry leader'}
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Users className="w-4 h-4 text-gold-500" />
                  <span className="font-semibold text-navy-900">Leader:</span> {activeMinistry.leader || '[Ministry Coordinator]'}
                </div>
                {activeMinistry.contactEmail && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-gold-500" />
                    <span className="font-semibold text-navy-900">Email:</span> {activeMinistry.contactEmail}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <Link
                  to="/contact"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-navy-900 text-white hover:bg-navy-800 transition"
                  onClick={() => setActiveMinistry(null)}
                >
                  Contact or Join Ministry
                </Link>
                <button
                  onClick={() => setActiveMinistry(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}