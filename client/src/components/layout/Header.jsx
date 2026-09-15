import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Clock, MapPin, Heart } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News', path: '/news' },
    { name: 'Give', path: '/give' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcements Bar */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 border-b border-navy-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-gold-400 font-medium">
              <Clock className="w-3.5 h-3.5" /> Sunday Service: 8:30 AM - 12:00 PM
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-gold-400" /> Osogbo, Osun State
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/prayer" className="text-gold-400 hover:text-gold-300 flex items-center gap-1 font-medium transition">
              <Heart className="w-3.5 h-3.5 fill-gold-400/20" /> Submit Prayer Request
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="text-slate-400 hover:text-white transition">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy-900/95 backdrop-blur-md shadow-xl py-3 border-b border-navy-800' 
          : 'bg-navy-900 py-3.5 shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white p-0.5 shadow-md ring-2 ring-gold-400/50 group-hover:scale-105 transition-transform duration-300 flex-shrink-0 flex items-center justify-center">
              <img 
                src="./nhbc-logo.png" 
                alt="New Heritage Baptist Church Osogbo Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg font-bold text-white tracking-wide leading-tight group-hover:text-gold-300 transition">
                NEW HERITAGE
              </span>
              <span className="text-[10px] sm:text-xs text-gold-400 font-medium tracking-widest uppercase">
                Baptist Church • Osogbo
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-gold-400 ${
                    active 
                      ? 'text-gold-400 font-semibold border-b-2 border-gold-400 pb-1' 
                      : 'text-slate-200'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/visit"
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-md shadow-gold-500/20 hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-1.5"
            >
              <span>Plan Your Visit</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/visit"
              className="sm:hidden px-3 py-1.5 rounded-full text-xs font-semibold text-navy-950 bg-gold-400"
            >
              Visit
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 transition focus:outline-none focus:ring-2 focus:ring-gold-500"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-navy-950/98 backdrop-blur-xl border-b border-navy-800">
            <div className="px-4 pt-3 pb-6 space-y-1 sm:px-6">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`block px-3 py-2.5 rounded-lg text-base font-medium transition ${
                      active 
                        ? 'bg-navy-800 text-gold-400 font-semibold' 
                        : 'text-slate-200 hover:bg-navy-900 hover:text-gold-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-navy-800 space-y-2">
                <Link
                  to="/visit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-center font-semibold text-navy-950 bg-gold-400 hover:bg-gold-500 transition shadow-md"
                >
                  Plan Your Visit
                </Link>
                <Link
                  to="/prayer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-center font-medium text-gold-400 bg-navy-900 border border-gold-500/30 hover:bg-navy-800 transition"
                >
                  <Heart className="w-4 h-4" /> Submit Confidential Prayer Request
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}