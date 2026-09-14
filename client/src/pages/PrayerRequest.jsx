import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, CheckCircle2, Send, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../api/client';

export default function PrayerRequest() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Spiritual Growth',
    request: '',
    isAnonymous: false,
    shareWithIntercessors: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Spiritual Growth',
    'Healing & Health',
    'Family & Marriage',
    'Academic & Career',
    'Financial Breakthrough',
    'Deliverance & Protection',
    'Thanksgiving & Praise',
    'Other Needs',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.request.trim()) {
      setError('Please write your prayer request.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.submitPrayerRequest({
        name: formData.isAnonymous ? 'Anonymous' : formData.name || 'Anonymous',
        phone: formData.phone,
        email: formData.email,
        category: formData.category,
        request: formData.request,
        isAnonymous: formData.isAnonymous,
        shareWithIntercessors: formData.shareWithIntercessors,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to submit prayer request. Please try again.');
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
            <HeartHandshake className="w-3.5 h-3.5" /> Intercessory Ministry
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Submit a Prayer Request
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
          </p>
          <span className="block mt-2 text-gold-400 font-serif italic text-sm">Philippians 4:6</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {submitted ? (
          <div className="bg-white rounded-2xl border border-sand-200 p-8 md:p-12 shadow-md text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-900 mb-3">
              We Stand in Prayer With You
            </h2>
            <p className="text-navy-600 text-base leading-relaxed mb-6">
              Your prayer request has been received with pastoral love and confidence. Our ministerial team and intercessory prayer warriors will bring your petitions before the Throne of Grace.
            </p>
            <div className="bg-sand-50 p-4 rounded-xl border border-sand-200 text-sm text-navy-800 italic mb-8 max-w-md mx-auto">
              "The prayer of a righteous person is powerful and effective." â€” James 5:16
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  phone: '',
                  email: '',
                  category: 'Spiritual Growth',
                  request: '',
                  isAnonymous: false,
                  shareWithIntercessors: true,
                });
              }}
              className="px-6 py-2.5 rounded-full bg-navy-900 text-gold-400 font-semibold text-sm hover:bg-navy-800 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-sand-200 p-6 md:p-10 shadow-md">
            {/* Pastoral Confidentiality Notice */}
            <div className="mb-8 p-4 bg-navy-900 text-white rounded-xl flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-gold-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-sm text-gold-300 mb-1">
                  Pastoral Confidentiality Guaranteed
                </h4>
                <p className="text-xs text-navy-200 leading-relaxed">
                  Prayer requests submitted here are treated with utmost spiritual sanctity. They are stored securely and accessed only by the Pastor and authorized Church Intercessory leadership. They will never be shared publicly without your explicit consent.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Anonymous Toggle */}
              <div className="flex items-center gap-3 p-3.5 bg-sand-50 rounded-xl border border-sand-200">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) =>
                    setFormData({ ...formData, isAnonymous: e.target.checked })
                  }
                  className="w-4 h-4 text-gold-500 rounded border-sand-300 focus:ring-gold-400"
                />
                <label htmlFor="isAnonymous" className="text-sm font-medium text-navy-800 cursor-pointer">
                  Submit this request anonymously (Do not attach my personal identity)
                </label>
              </div>

              {!formData.isAnonymous && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Brother Emmanuel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-sand-300 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0803 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-sand-300 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-sand-300 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                  Prayer Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-sand-300 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Request Description */}
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                  Your Prayer Petition / Thanksgiving *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Share what is on your heart. No matter is too big for our God, and none is too small..."
                  value={formData.request}
                  onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-sand-300 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                ></textarea>
              </div>

              {/* Sharing Preference */}
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-navy-700">
                  <input
                    type="checkbox"
                    checked={formData.shareWithIntercessors}
                    onChange={(e) =>
                      setFormData({ ...formData, shareWithIntercessors: e.target.checked })
                    }
                    className="w-4 h-4 text-gold-500 rounded border-sand-300 focus:ring-gold-400"
                  />
                  <span>
                    Share with church intercessors (Uncheck to restrict strictly to the Pastor only)
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  'Submitting Prayer Petition...'
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Prayer Request
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}