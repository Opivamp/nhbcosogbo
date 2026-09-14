import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Calendar,
  Phone,
  Mail,
  User,
  Search,
  Check,
  X,
  Printer,
} from 'lucide-react';
import { api } from '../api/client';

export default function PrayerInbox() {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [pastoralNote, setPastoralNote] = useState('');

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    setLoading(true);
    try {
      const data = await api.getPrayerRequests();
      setPrayers(data || []);
    } catch (err) {
      console.error('Failed to load prayer requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.handlePrayerRequest(id, { status, pastoralNote });
      setSelectedPrayer(null);
      setPastoralNote('');
      loadPrayers();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prayer request record?')) return;
    try {
      await api.deletePrayerRequest(id);
      loadPrayers();
    } catch (err) {
      alert(err.message || 'Failed to delete prayer request');
    }
  };

  const filtered = prayers.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.request?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-navy-900 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-400/30">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-serif font-bold">
                Confidential Prayer Inbox
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-bold uppercase tracking-wider border border-gold-400/30">
                Restricted Access
              </span>
            </div>
            <p className="text-navy-300 text-xs mt-1">
              Petitions and intercessory needs submitted by members and guests. Kept strictly confidential.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs transition shadow-sm self-start sm:self-center"
        >
          <Printer className="w-4 h-4" /> Print Prayer Sheet
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-sand-200 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            placeholder="Search prayer requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <span className="text-xs text-navy-500 font-medium">
          Total Requests: <strong>{filtered.length}</strong>
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sand-50 border-b border-sand-200 text-navy-700 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">Submitted By</th>
                <th className="p-4">Category</th>
                <th className="p-4">Petition Summary</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 text-sm text-navy-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-navy-400">Loading requests...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-navy-500">No prayer requests.</td>
                </tr>
              ) : (
                filtered.map((prayer) => (
                  <tr key={prayer.id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="p-4 text-xs text-navy-500 whitespace-nowrap">{prayer.date}</td>
                    <td className="p-4 font-medium text-navy-900 text-xs">
                      {prayer.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-navy-500 italic">
                          <User className="w-3.5 h-3.5" /> Anonymous
                        </span>
                      ) : (
                        <span>{prayer.name || 'Anonymous'}</span>
                      )}
                    </td>
                    <td className="p-4 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-800 font-medium">
                        {prayer.category}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-navy-600 max-w-xs truncate">
                      {prayer.request}
                    </td>
                    <td className="p-4 text-xs">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-semibold ${
                          prayer.status === 'Prayed Over'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {prayer.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPrayer(prayer);
                            setPastoralNote(prayer.pastoralNote || '');
                          }}
                          className="px-3 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold"
                        >
                          Review & Pray
                        </button>
                        <button
                          onClick={() => handleDelete(prayer.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedPrayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedPrayer(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-navy-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-gold-600 font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Confidential Pastoral Record
            </div>

            <h3 className="text-xl font-serif font-bold text-navy-900 mb-4">
              Prayer Request: {selectedPrayer.category}
            </h3>

            <div className="space-y-3 p-4 bg-sand-50 rounded-xl border border-sand-200 text-xs text-navy-700 mb-4">
              <div className="flex justify-between">
                <span className="font-semibold text-navy-500">Submitted By:</span>
                <span className="font-bold text-navy-900">
                  {selectedPrayer.isAnonymous ? 'Anonymous' : selectedPrayer.name || 'Anonymous'}
                </span>
              </div>
              {selectedPrayer.phone && (
                <div className="flex justify-between">
                  <span className="font-semibold text-navy-500">Phone:</span>
                  <span>{selectedPrayer.phone}</span>
                </div>
              )}
              {selectedPrayer.email && (
                <div className="flex justify-between">
                  <span className="font-semibold text-navy-500">Email:</span>
                  <span>{selectedPrayer.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-semibold text-navy-500">Date Received:</span>
                <span>{selectedPrayer.date}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                Petition Details
              </label>
              <div className="p-4 bg-white border border-sand-300 rounded-xl text-navy-800 text-sm leading-relaxed whitespace-pre-line">
                {selectedPrayer.request}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                Pastoral Intercession Notes
              </label>
              <textarea
                rows={3}
                placeholder="Optional notes regarding pastoral follow-up or prayer answered..."
                value={pastoralNote}
                onChange={(e) => setPastoralNote(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-sand-300 text-xs text-navy-900"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => handleStatusChange(selectedPrayer.id, 'Prayed Over')}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" /> Mark as Prayed Over
              </button>
              <button
                onClick={() => handleStatusChange(selectedPrayer.id, 'Pending')}
                className="px-4 py-2 rounded-lg bg-sand-200 hover:bg-sand-300 text-navy-800 text-xs font-semibold"
              >
                Keep as Pending
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}