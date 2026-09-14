import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Image,
  BookOpen,
  Calendar,
  Users,
  HeartHandshake,
  Mail,
  ArrowRight,
  PlusCircle,
  Sparkles,
  Church,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Gallery Photos', count: stats?.galleryCount || 0, icon: Image, link: '/admin/gallery', color: 'text-blue-600 bg-blue-50' },
    { title: 'Sermons', count: stats?.sermonsCount || 0, icon: BookOpen, link: '/admin/sermons', color: 'text-amber-600 bg-amber-50' },
    { title: 'Events', count: stats?.eventsCount || 0, icon: Calendar, link: '/admin/events', color: 'text-purple-600 bg-purple-50' },
    { title: 'Ministries', count: stats?.ministriesCount || 0, icon: Users, link: '/admin/ministries', color: 'text-emerald-600 bg-emerald-50' },
    {
      title: 'Prayer Requests',
      count: stats?.pendingPrayers || stats?.prayersCount || 0,
      icon: HeartHandshake,
      link: '/admin/prayers',
      color: 'text-rose-600 bg-rose-50',
      badge: stats?.pendingPrayers ? `${stats.pendingPrayers} New` : null,
    },
    {
      title: 'Messages',
      count: stats?.unreadMessages || stats?.messagesCount || 0,
      icon: Mail,
      link: '/admin/messages',
      color: 'text-indigo-600 bg-indigo-50',
      badge: stats?.unreadMessages ? `${stats.unreadMessages} Unread` : null,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold mb-4 border border-gold-400/30">
            <Church className="w-3.5 h-3.5" /> Welcome to Church Administration
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
            Peace be with you, {user?.name || 'Pastor / Administrator'}!
          </h1>
          <p className="text-navy-200 text-sm md:text-base leading-relaxed mb-6">
            Manage your sermon archive, church gallery, announcements, events, and shepherd incoming confidential prayer requests.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/gallery"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs transition-colors shadow-md"
            >
              <PlusCircle className="w-4 h-4" /> Upload Photos
            </Link>
            <Link
              to="/admin/sermons"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-medium text-xs border border-navy-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-gold-400" /> Add Sermon
            </Link>
            <Link
              to="/admin/prayers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-medium text-xs border border-navy-700 transition-colors"
            >
              <HeartHandshake className="w-4 h-4 text-rose-400" /> Pastoral Prayer Inbox
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {card.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                    {card.badge}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-3xl font-serif font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                  {loading ? '...' : card.count}
                </h3>
                <p className="text-xs text-navy-500 font-medium uppercase tracking-wider mt-1">
                  {card.title}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between text-xs text-navy-400 group-hover:text-gold-600">
                <span>Manage</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Tips & System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h3 className="font-serif font-bold text-navy-900 text-base">
              Pastoral Data Integrity & Backups
            </h3>
          </div>
          <p className="text-navy-600 text-xs leading-relaxed mb-4">
            All church records, ministries, uploaded photos, and confidential prayer requests are saved atomically with automatic backups in the system database. Newly uploaded photos immediately appear on the public gallery.
          </p>
          <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-xs text-navy-700 flex items-center justify-between">
            <span>Storage: <strong>Local Disks (`public/uploads`)</strong></span>
            <span className="text-green-600 font-semibold">Healthy</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-gold-500" />
            <h3 className="font-serif font-bold text-navy-900 text-base">
              Content Publishing Checklist
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-navy-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
              Update <strong>Scripture of the Month</strong> in Site Settings
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
              Post Sunday sermon notes or YouTube/audio recording
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
              Review unhandled confidential prayer requests
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}