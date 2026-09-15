import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Heart, ChevronRight, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800 mt-auto">
      {/* Upper CTA Banner */}
      <div className="bg-navy-900/60 border-b border-navy-800/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">We would Love to Welcome You to NHBC Osogbo</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Whether you are visiting for the first time or looking for a loving church family, there is a place of honor for you here.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/visit"
              className="px-6 py-3 rounded-full text-sm font-semibold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-md shadow-gold-500/20 transition-all active:scale-95"
            >
              Plan Your Visit
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full text-sm font-semibold text-white bg-navy-800 hover:bg-navy-700 border border-navy-700 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shadow-md ring-2 ring-gold-400/50 flex-shrink-0 flex items-center justify-center">
                <img 
                  src="./nhbc-logo.png" 
                  alt="New Heritage Baptist Church Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white block leading-tight">NEW HERITAGE</span>
                <span className="text-xs text-gold-400 font-medium tracking-wider">Baptist Church • Osogbo</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A Christ-centered community of faith, hope, love, and transformation—growing together in Christ and serving our community in Osogbo, Osun State, Nigeria.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-slate-300 flex items-center justify-center transition" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-slate-300 flex items-center justify-center transition" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-slate-300 flex items-center justify-center transition" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-slate-300 flex items-center justify-center transition" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400"></span> Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-gold-400 transition flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-gold-500" /> About Our Heritage</Link></li>
              <li><Link to="/ministries" className="hover:text-gold-400 transition flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-gold-500" /> Church Ministries</Link></li>
              <li><Link to="/sermons" className="hover:text-gold-400 transition flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-gold-500" /> Sermon Library</Link></li>
              <li><Link to="/events" className="hover:text-gold-400 transition flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-gold-500" /> Upcoming Events</Link></li>
              <li><Link to="/gallery" className="hover:text-gold-400 transition flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-gold-500" /> Church Photo Gallery</Link></li>
              <li><Link to="/give" className="hover:text-gold-400 transition flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-gold-500" /> Tithes & Giving</Link></li>
              <li><Link to="/prayer" className="hover:text-gold-400 transition flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-gold-500" /> Prayer Requests</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400"></span> Worship Schedule
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-navy-900/60 p-3 rounded-lg border border-navy-800">
                <span className="text-xs text-gold-400 font-semibold block uppercase">Sunday School</span>
                <span className="text-white font-medium">Sunday • 8:30 AM - 9:30 AM</span>
              </div>
              <div className="bg-navy-900/60 p-3 rounded-lg border border-navy-800">
                <span className="text-xs text-gold-400 font-semibold block uppercase">Worship Service</span>
                <span className="text-white font-medium">Sunday • 9:30 AM - 12:00 PM</span>
              </div>
              <div className="bg-navy-900/60 p-3 rounded-lg border border-navy-800">
                <span className="text-xs text-gold-400 font-semibold block uppercase">Midweek Prayer & Study</span>
                <span className="text-white font-medium">Wednesday • 5:30 PM - 7:00 PM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400"></span> Contact Details
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 mt-1 flex-shrink-0" />
                <span>[Church Address, Osogbo, Osun State, Nigeria]</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>[Official Church Phone Number]</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>info@nhbcosogbo.org</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold-400 mt-1 flex-shrink-0" />
                <span>Tuesdays - Fridays: 9:00 AM - 4:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} New Heritage Baptist Church, Osogbo (NHBC OSOGBO). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400 transition">What We Believe</Link>
            <span>•</span>
            <Link to="/prayer" className="hover:text-slate-400 transition">Confidential Prayer</Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-slate-400 transition">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}