import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  BookOpen,
  Calendar,
  Bell,
  Users,
  UserCheck,
  HeartHandshake,
  Mail,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Gallery & Media', path: '/admin/gallery', icon: Image },
    { label: 'Sermons', path: '/admin/sermons', icon: BookOpen },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'News & Bulletins', path: '/admin/news', icon: Bell },
    { label: 'Ministries', path: '/admin/ministries', icon: Users },
    { label: 'Leadership', path: '/admin/leadership', icon: UserCheck },
    { label: 'Prayer Requests', path: '/admin/prayers', icon: HeartHandshake, roles: ['superadmin', 'prayeradmin'] },
    { label: 'Contact Messages', path: '/admin/messages', icon: Mail, roles: ['superadmin', 'contentadmin'] },
    { label: 'Staff Accounts', path: '/admin/staff', icon: Shield, roles: ['superadmin'] },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings, roles: ['superadmin'] },
  ];

  const allowedNavItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <div className="min-h-screen bg-sand-100 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-navy-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 ring-1 ring-gold-400/50 flex-shrink-0 flex items-center justify-center">
            <img src="/nhbc-logo.png" alt="NHBC Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-serif font-bold text-sm">NHBC Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-navy-800 text-navy-200 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-navy-900 text-white flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-navy-800 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white p-0.5 border border-gold-400/50 flex items-center justify-center shadow-md flex-shrink-0">
              <img src="/nhbc-logo.png" alt="NHBC Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-white tracking-wide leading-tight">
                NHBC Osogbo
              </h1>
              <span className="text-[11px] text-gold-400 block font-medium">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gold-500 text-navy-950 font-bold shadow-md'
                      : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-navy-950' : 'text-gold-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-navy-800 bg-navy-950/40">
          <div className="mb-3 px-2">
            <div className="text-xs font-semibold text-white truncate">
              {user?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-gold-400 uppercase tracking-wider font-semibold">
              {user?.role || 'Admin'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white text-xs font-medium transition-colors"
              title="View Public Site"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Site
            </a>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-medium border border-red-800/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="hidden md:flex bg-white border-b border-sand-200 px-8 py-4 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div>
            <h2 className="text-xl font-serif font-bold text-navy-900 capitalize">
              {location.pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
            </h2>
            <p className="text-xs text-navy-500">
              New Heritage Baptist Church Content & Operations Center
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-navy-800 text-xs font-semibold border border-sand-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold-600" /> View Live Website
            </a>
            <div className="flex items-center gap-2 pl-4 border-l border-sand-200">
              <div className="w-8 h-8 rounded-full bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-navy-900">{user?.name}</span>
                <span className="block text-[10px] text-navy-500 capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="p-4 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}