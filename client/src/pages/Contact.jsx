import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { api } from '../api/client';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-navy-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-gold-400/30">
            <MessageSquare className="w-3.5 h-3.5" /> Reach Out To Us
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Contact NHBC Osogbo
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            We would love to hear from you. Whether you have inquiries, need pastoral counsel, or want to partner with us in ministry, reach out today.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Cards */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-navy-900 mb-1">Our Sanctuary</h3>
              <p className="text-navy-600 text-sm leading-relaxed">
                New Heritage Baptist Church<br />
                [Church Address, Osogbo, Osun State, Nigeria]
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-navy-900 mb-1">Phone & Inquiries</h3>
              <p className="text-navy-600 text-sm">
                [Official Church Phone Number]<br />
                <span className="text-xs text-navy-400">Lines open Mon – Sat, 9am – 5pm</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-navy-900 mb-1">Email</h3>
              <p className="text-navy-600 text-sm">
                info@nhbcosogbo.org<br />
                <span className="text-xs text-navy-400">Expect response within 24 hours</span>
              </p>
            </div>

            <div className="bg-navy-900 text-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-gold-400 mb-2">
                <Clock className="w-4 h-4" />
                <h4 className="font-serif font-bold text-sm text-gold-400">Regular Service Times</h4>
              </div>
              <p className="text-xs text-navy-200 leading-relaxed">
                Sundays: 8:30 AM (Sunday School) & 9:30 AM (Worship Service)<br />
                Wednesdays: 5:30 PM (Bible Study & Prayers)
              </p>
            </div>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-sand-200 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">
                Send Us a Direct Message
              </h2>
              <p className="text-navy-600 text-sm mb-6">
                Fill out the contact form below and our church secretariat will get in touch with you.
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span>
                    Thank you! Your message has been sent to our church office. God bless you.
                  </span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Adeleke"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-sand-300 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="samuel@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-sand-300 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="0800 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-sand-300 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. First-Time Visit, Pastoral Counseling"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-sand-300 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message or inquiry here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-sand-300 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    'Sending Message...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Interactive Map */}
            <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-navy-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <span>Sanctuary Location: Osogbo, Osun State, Nigeria</span>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Osogbo+Osun+State+Nigeria"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gold-300 hover:text-white underline"
                >
                  View Full Google Maps
                </a>
              </div>
              <div className="h-72 w-full relative">
                <iframe
                  title="NHBC Osogbo Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=4.5100%2C7.7500%2C4.5800%2C7.8100&amp;layer=mapnik&amp;marker=7.7800%2C4.5450"
                  className="w-full h-full border-0"
                ></iframe>
              </div>
              <div className="p-3 bg-sand-50 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between text-xs text-navy-700 gap-2">
                <span>📍 Located strategically in the heart of Osogbo, Osun State.</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Osogbo+Osun+State+Nigeria"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-full bg-navy-900 text-gold-400 font-semibold hover:bg-navy-800 transition"
                >
                  Get Driving Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}