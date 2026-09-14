import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Compass, Eye, Sparkles } from 'lucide-react';

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await api.getAbout();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { about, leadership } = data || {};

  return (
    <div className="w-full bg-[#FAF9F6]">
      <div className="bg-navy-950 text-white py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-1 shadow-2xl ring-4 ring-gold-400/40 flex items-center justify-center mb-6">
            <img 
              src="/nhbc-logo.png" 
              alt="New Heritage Baptist Church Osogbo Emblem" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-400">Our Spiritual Heritage</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-2">About New Heritage Baptist Church</h1>
          <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
            Discover our history, divine vision, foundational doctrines, and the leadership God has placed to shepherd our flock in Osogbo.
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">The Journey of Faith</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 mt-1">Our Story</h2>
          </div>
          <div className="prose prose-lg text-slate-700 mx-auto leading-relaxed text-base sm:text-lg space-y-4">
            <p>{about?.story}</p>
            <p>
              Under the guidance of the Holy Spirit, NHBC Osogbo has continually emphasized deep spiritual discipleship, fervent prayer altars, vibrant youth mobilization, and generous community outreach. Our desire remains singular: that every soul who walks through our doors experiences Christ's unconditional love and attains the full stature of spiritual maturity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-gold-600 tracking-wider uppercase">Our Vision</span>
                <h3 className="font-serif text-2xl font-bold text-navy-950 mt-1 mb-4">A Beacon of Divine Transformation</h3>
                <p className="text-slate-600 text-base leading-relaxed">{about?.vision}</p>
              </div>
            </div>

            <div className="bg-navy-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-navy-800 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center mb-6">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-gold-400 tracking-wider uppercase">Our Mission</span>
                <h3 className="font-serif text-2xl font-bold text-white mt-1 mb-4">The Mandate to Discipleship</h3>
                <p className="text-slate-300 text-base leading-relaxed">{about?.mission}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">Sound Doctrine</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 mt-1">What We Believe</h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Our faith rests upon the unshakeable foundation of the Holy Scriptures and classic Christian Baptist heritage.
            </p>
          </div>

          <div className="space-y-6">
            {(about?.beliefs || []).map((b, idx) => (
              <div 
                key={idx} 
                className="bg-[#FAF9F6] p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-gold-400/50 transition duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-navy-900 text-gold-400 font-serif font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-navy-950 mb-2">{b.title}</h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{b.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F4F6F9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">Guiding Principles</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 mt-1">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(about?.values || []).map((v, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600 mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">{v.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">Under-Shepherds in Christ</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 mt-1">Church Leadership</h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Meet the pastors, officers, and department heads dedicated to serving the congregation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(leadership || []).map((lead) => (
              <div 
                key={lead.id}
                className="bg-[#FAF9F6] rounded-2xl overflow-hidden border border-slate-200 hover:border-gold-400/50 shadow-sm hover:shadow-lg transition flex flex-col"
              >
                <div className="h-64 bg-navy-950 overflow-hidden relative">
                  <img 
                    src={lead.imageUrl || '/uploads/pastoral-welcome.svg'} 
                    alt={lead.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 to-transparent p-4 text-white">
                    <span className="text-xs text-gold-400 font-semibold block">{lead.role}</span>
                    <h3 className="font-serif text-lg font-bold truncate">{lead.name}</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-slate-600 text-sm leading-relaxed">{lead.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}