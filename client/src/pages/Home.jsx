import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { 
  Calendar, Clock, MapPin, Play, ChevronRight, BookOpen, Heart, 
  Sparkles, ArrowRight, Quote 
} from 'lucide-react';
import AudioPlayer from '../components/ui/AudioPlayer';
import VideoModal from '../components/ui/VideoModal';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    async function fetchHome() {
      try {
        const res = await api.getHomepage();
        setData(res);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHome();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-navy-900 font-serif text-lg font-medium">Loading NHBC Osogbo...</p>
        </div>
      </div>
    );
  }

  const { siteSettings, serviceTimes, scripture, upcomingEvents, featuredSermon, previewGallery, ministries } = data || {};
  const hero = siteSettings?.hero || {};
  const welcome = siteSettings?.welcome || {};

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-navy-950 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${hero.bgImage || '/uploads/hero-sanctuary.svg'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/85 to-navy-900/80 backdrop-blur-[2px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Official Church Emblem */}
          <div className="mb-6 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1.5 shadow-2xl ring-4 ring-gold-400/40 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/nhbc-logo.png" 
                alt="New Heritage Baptist Church Osogbo Emblem" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs sm:text-sm font-medium tracking-wide uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to Our Spiritual Family
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.15] mb-6 drop-shadow-md">
            {hero.headline || 'Welcome to New Heritage Baptist Church, Osogbo'}
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-2xl font-light leading-relaxed mb-10">
            {hero.supportingText || 'A community of faith, hope, love, and transformationâ€”growing together in Christ and serving our community in Osogbo, Osun State.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to={hero.primaryCtaLink || '/visit'}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              <span>{hero.primaryCtaText || 'Plan Your Visit'}</span>
              <ChevronRight className="w-5 h-5" />
            </Link>

            <Link
              to={hero.secondaryCtaLink || '/about'}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-200 flex items-center justify-center gap-2 text-base"
            >
              <span>{hero.secondaryCtaText || 'Explore NHBC'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. QUICK INFO BAR */}
      <section className="bg-navy-900 border-b border-navy-800 text-white relative z-10 -mt-2 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-navy-800">
            <div className="flex items-center gap-4 py-2 md:py-0 md:px-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gold-400 uppercase tracking-wider font-semibold">Join Us In Worship</span>
                <p className="text-base font-semibold text-white">Sundays â€¢ 8:00 AM â€� 10:30 AM</p>
                <p className="text-xs text-slate-400">Sunday School begins at 7:00 AM</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 md:py-0 md:px-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 flex-shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gold-400 uppercase tracking-wider font-semibold">Midweek Service</span>
                <p className="text-base font-semibold text-white">Wednesdays â€¢ 5:30 PM</p>
                <p className="text-xs text-slate-400">Prayer & Bible Exposition</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 md:py-0 md:px-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gold-400 uppercase tracking-wider font-semibold">Our Location</span>
                <p className="text-base font-semibold text-white truncate max-w-xs">Osogbo, Osun State</p>
                <Link to="/visit" className="text-xs text-gold-400 hover:text-gold-300 font-medium underline">
                  Get directions & parking info â†’
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PASTORAL WELCOME SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-gold-400/40 rounded-2xl pointer-events-none" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-navy-950">
                  <img
                    src={welcome.pastorImage || '/uploads/pastoral-welcome.svg'}
                    alt={welcome.pastorName || 'Pastorate'}
                    className="w-full h-auto object-cover max-h-[480px] hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 to-transparent p-6 text-white">
                    <p className="font-serif text-lg font-bold">{welcome.pastorName}</p>
                    <p className="text-xs text-gold-400">{welcome.pastorTitle}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
                Welcome to NHBC Osogbo
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 leading-tight">
                {welcome.heading || 'A Warm Christian Welcome to You'}
              </h2>

              <p className="text-lg text-gold-700 font-serif italic">
                {welcome.leadText || 'Grace, peace, and love to you in the name of our Lord Jesus Christ.'}
              </p>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                {welcome.content}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  className="px-6 py-3 rounded-full font-semibold text-sm text-white bg-navy-900 hover:bg-navy-800 shadow-md transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                  <span>Learn More About Us</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/visit"
                  className="px-6 py-3 rounded-full font-semibold text-sm text-navy-900 bg-gold-100 hover:bg-gold-200 transition-all duration-200"
                >
                  What to Expect on Sunday
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICE SCHEDULE CARDS */}
      <section className="py-16 bg-[#FAF9F6] border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">Gatherings of Faith</span>
            <h2 className="font-serif text-3xl font-bold text-navy-950 mt-1">Our Weekly Worship Schedule</h2>
            <p className="text-sm text-slate-600 mt-2">Join hands and hearts with us in prayer, study, and joyful celebration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(serviceTimes || []).map((srv, idx) => (
              <div 
                key={srv.id || idx}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 hover:border-gold-400/50 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-navy-50 text-navy-800 border border-navy-100">
                      {srv.day}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 group-hover:scale-110 transition">
                      <Clock className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">{srv.name}</h3>
                  <p className="text-gold-600 font-semibold text-sm mb-3">{srv.time}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{srv.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-navy-700 font-medium">
                  <span>Main Church Auditorium</span>
                  <Link to="/visit" className="hover:text-gold-600 flex items-center gap-1 font-semibold">
                    Visit Us <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LATEST FEATURED SERMON */}
      {featuredSermon && (
        <section className="py-20 bg-navy-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-gold-400">Word of Life</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">Latest Message</h2>
              </div>
              <Link to="/sermons" className="text-sm font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1">
                View All Sermons <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-navy-900/90 rounded-3xl p-6 sm:p-10 border border-navy-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 relative group rounded-2xl overflow-hidden shadow-lg bg-navy-950">
                <img 
                  src={featuredSermon.thumbnailUrl || '/uploads/sermon-faith.svg'} 
                  alt={featuredSermon.title} 
                  className="w-full h-auto max-h-[320px] object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-navy-950/40 group-hover:bg-navy-950/20 transition flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedVideo(featuredSermon)}
                    className="w-16 h-16 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition"
                    aria-label="Play video sermon"
                  >
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3 text-xs text-gold-400 font-medium">
                  <span className="bg-gold-500/20 px-2.5 py-1 rounded-full border border-gold-500/30">
                    {featuredSermon.category || 'Message'}
                  </span>
                  <span>â€¢</span>
                  <span>{featuredSermon.date}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                  {featuredSermon.title}
                </h3>

                <p className="text-sm font-semibold text-gold-300">
                  Speaker: <span className="text-white">{featuredSermon.speaker}</span> | Scripture: <span className="text-white">{featuredSermon.scripture}</span>
                </p>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {featuredSermon.description}
                </p>

                {featuredSermon.audioUrl && (
                  <div className="pt-2">
                    <AudioPlayer 
                      audioUrl={featuredSermon.audioUrl} 
                      title={featuredSermon.title} 
                      speaker={featuredSermon.speaker} 
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                  {featuredSermon.videoUrl && (
                    <button
                      onClick={() => setSelectedVideo(featuredSermon)}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-2 transition"
                    >
                      <Play className="w-3.5 h-3.5" /> Watch Video Sermon
                    </button>
                  )}
                  <Link
                    to="/sermons"
                    className="text-xs font-semibold text-gold-400 hover:text-gold-300 underline"
                  >
                    Browse sermon series â†’
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. UPCOMING EVENTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">Mark Your Calendar</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 mt-1">Upcoming Church Events</h2>
            </div>
            <Link to="/events" className="text-sm font-semibold text-navy-900 hover:text-gold-600 flex items-center gap-1">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(upcomingEvents || []).map((evt) => (
              <div 
                key={evt.id} 
                className="bg-[#FAF9F6] rounded-2xl overflow-hidden border border-slate-200 hover:border-gold-400/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 bg-navy-950 overflow-hidden">
                  <img 
                    src={evt.imageUrl || '/uploads/annual-convention.svg'} 
                    alt={evt.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-navy-900/90 text-white px-3 py-1.5 rounded-lg border border-navy-700 shadow-md">
                    <span className="text-xs font-bold text-gold-400 block uppercase">{evt.category || 'Event'}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gold-700 font-semibold mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{evt.date} {evt.endDate && evt.endDate !== evt.date ? `â€� ${evt.endDate}` : ''}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-navy-950 mb-2 leading-snug group-hover:text-gold-600 transition">
                      {evt.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.time}</span>
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500 truncate max-w-[180px] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-500" /> {evt.location}
                    </span>
                    <Link
                      to="/events"
                      className="text-xs font-bold text-navy-900 hover:text-gold-600 flex items-center gap-0.5"
                    >
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MINISTRIES SHOWCASE */}
      <section className="py-20 bg-[#F4F6F9] border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">Connect & Grow</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 mt-1">Ministries for Everyone</h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              From children to seasoned adults, there is a vibrant ministry designed to help you flourish in your spiritual journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(ministries || []).map((min) => (
              <div 
                key={min.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col group"
              >
                <div className="h-44 bg-navy-950 relative overflow-hidden">
                  <img 
                    src={min.imageUrl || '/uploads/hero-sanctuary.svg'} 
                    alt={min.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent flex items-end p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 bg-navy-900/80 px-2.5 py-1 rounded">
                      {min.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-navy-950 mb-2">{min.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{min.shortDescription}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Active Ministry</span>
                    <Link
                      to="/ministries"
                      className="text-xs font-bold text-navy-900 hover:text-gold-600 flex items-center gap-1"
                    >
                      Learn More <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/ministries"
              className="px-8 py-3.5 rounded-full font-semibold text-sm text-white bg-navy-900 hover:bg-navy-800 shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>Explore All Church Ministries</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. LIFE AT NHBC (GALLERY PREVIEW) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">Church Family Moments</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950 mt-1">Life at NHBC Osogbo</h2>
            </div>
            <Link to="/gallery" className="text-sm font-semibold text-navy-900 hover:text-gold-600 flex items-center gap-1">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {(previewGallery || []).map((img, idx) => (
              <Link 
                to="/gallery" 
                key={img.id || idx}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-navy-950 shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                <img 
                  src={img.imageUrl} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] uppercase font-bold text-gold-400">{img.category}</span>
                  <p className="font-serif text-sm font-semibold line-clamp-1">{img.title}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="px-7 py-3 rounded-full font-semibold text-xs sm:text-sm text-navy-900 bg-gold-100 hover:bg-gold-200 transition inline-flex items-center gap-2"
            >
              <span>Browse All Church Photos</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. BIBLE VERSE SECTION */}
      <section className="py-16 bg-navy-900 text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 mx-auto flex items-center justify-center mb-6">
            <Quote className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-100 italic leading-relaxed mb-4">
            {scripture?.verse || 'â€œBut seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.â€'}
          </h3>

          <p className="text-gold-400 font-semibold text-base tracking-wider uppercase">
            â€” {scripture?.reference || 'Matthew 6:33 (KJV)'}
          </p>

          {scripture?.theme && (
            <p className="text-xs text-slate-400 mt-2 font-medium">
              {scripture.theme}
            </p>
          )}
        </div>
      </section>

      {/* 10. CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
            You Belong Here
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-navy-950">
            We'd Love to Welcome You
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you are visiting for the first time or looking for a church family to call home, there is a place of honor for you at New Heritage Baptist Church, Osogbo.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/visit"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-xl shadow-gold-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Plan Your Visit</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-navy-900 bg-white border border-slate-300 hover:bg-slate-50 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <VideoModal
        isOpen={!!selectedVideo}
        videoUrl={selectedVideo?.videoUrl}
        title={selectedVideo?.title}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}