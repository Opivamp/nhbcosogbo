import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.getEvents({ status: activeTab });
        setEvents(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [activeTab]);

  return (
    <div className="w-full bg-[#FAF9F6] pb-24">
      <div className="bg-navy-950 text-white py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-400">Spiritual Gatherings & Programs</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-2">Church Events</h1>
          <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
            Stay informed about upcoming conventions, revival nights, fellowships, and community outreaches at NHBC Osogbo.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm flex items-center">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                activeTab === 'upcoming'
                  ? 'bg-navy-900 text-gold-400 shadow-md'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                activeTab === 'past'
                  ? 'bg-navy-900 text-gold-400 shadow-md'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <Calendar className="w-12 h-12 text-gold-500/50 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-navy-950">No {activeTab} events</h3>
            <p className="text-sm mt-1">Please check back soon or review our weekly worship schedule.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-gold-400/50 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12"
              >
                <div className="md:col-span-5 h-64 md:h-auto bg-navy-950 relative overflow-hidden">
                  <img
                    src={evt.imageUrl || './uploads/annual-convention.svg'}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-navy-900/90 text-gold-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-navy-700">
                    {evt.category}
                  </div>
                </div>

                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-gold-700 font-bold mb-3 uppercase tracking-wider">
                      <Calendar className="w-4 h-4" />
                      <span>{evt.date} {evt.endDate && evt.endDate !== evt.date ? `– ${evt.endDate}` : ''}</span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-navy-950 mb-3 leading-snug">
                      {evt.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold-500" /> {evt.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gold-500" /> {evt.location}</span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                    {evt.registrationLink ? (
                      <a
                        href={evt.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-full text-xs font-semibold text-navy-950 bg-gold-400 hover:bg-gold-500 transition flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Register for Event</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium bg-slate-100 px-4 py-2 rounded-full">
                        Free & Open to All
                      </span>
                    )}

                    <button
                      onClick={() => {
                        const ics = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${evt.title}\nDESCRIPTION:${evt.description}\nLOCATION:${evt.location}\nEND:VEVENT\nEND:VCALENDAR`;
                        const link = document.createElement('a');
                        link.href = encodeURI(ics);
                        link.download = `${evt.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
                        link.click();
                      }}
                      className="text-xs font-semibold text-navy-900 hover:text-gold-600 transition"
                    >
                      Add to Calendar (.ics)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}