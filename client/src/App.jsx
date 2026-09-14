import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import News from './pages/News';
import Give from './pages/Give';
import PrayerRequest from './pages/PrayerRequest';
import PlanVisit from './pages/PlanVisit';
import Contact from './pages/Contact';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import GalleryManager from './admin/GalleryManager';
import SermonsManager from './admin/SermonsManager';
import EventsManager from './admin/EventsManager';
import NewsManager from './admin/NewsManager';
import MinistriesManager from './admin/MinistriesManager';
import LeadershipManager from './admin/LeadershipManager';
import PrayerInbox from './admin/PrayerInbox';
import MessagesInbox from './admin/MessagesInbox';
import SiteSettings from './admin/SiteSettings';
import StaffManager from './admin/StaffManager';

import { useAuth } from './context/AuthContext';

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, role } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950 text-gold-400 font-serif text-lg">
        Verifying authorization...
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  if (allowedRoles && role !== 'superadmin' && !allowedRoles.includes(role)) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

export default function App() {
  return (
    <>
      <ScrollToTopOnNavigate />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="gallery" element={<GalleryManager />} />
                  <Route path="sermons" element={<SermonsManager />} />
                  <Route path="events" element={<EventsManager />} />
                  <Route path="news" element={<NewsManager />} />
                  <Route path="ministries" element={<MinistriesManager />} />
                  <Route path="leadership" element={<LeadershipManager />} />
                  <Route path="prayers" element={<PrayerInbox />} />
                  <Route path="messages" element={<MessagesInbox />} />
                  <Route path="staff" element={<StaffManager />} />
                  <Route path="settings" element={<SiteSettings />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/ministries" element={<Ministries />} />
                  <Route path="/sermons" element={<Sermons />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/give" element={<Give />} />
                  <Route path="/prayer" element={<PrayerRequest />} />
                  <Route path="/visit" element={<PlanVisit />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </>
  );
}