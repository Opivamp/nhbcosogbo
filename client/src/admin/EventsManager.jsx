import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Clock, MapPin, Search, X } from 'lucide-react';
import { api } from '../api/client';

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Spiritual Revival',
    date: new Date().toISOString().split('T')[0],
    time: '9:00 AM',
    location: 'Church Sanctuary, Osogbo',
    description: '',
    featured: false,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getEvents();
      setEvents(data || []);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      category: 'Spiritual Revival',
      date: new Date().toISOString().split('T')[0],
      time: '9:00 AM',
      location: 'Church Sanctuary, Osogbo',
      description: '',
      featured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title || '',
      category: ev.category || 'Spiritual Revival',
      date: ev.date || '',
      time: ev.time || '',
      location: ev.location || '',
      description: ev.description || '',
      featured: !!ev.featured,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.updateEvent(editingEvent.id, formData);
      } else {
        await api.createEvent(formData);
      }
      setModalOpen(false);
      loadEvents();
    } catch (err) {
      alert(err.message || 'Failed to save event.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.deleteEvent(id);
      loadEvents();
    } catch (err) {
      alert(err.message || 'Failed to delete event.');
    }
  };

  const filtered = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
            Events & Calendar Manager
          </h1>
          <p className="text-navy-600 text-sm">
            Schedule upcoming revivals, conferences, vigils, and youth fellowships.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Create New Event
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-sand-200 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <span className="text-xs text-navy-500 font-medium">
          Events: <strong>{filtered.length}</strong>
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-navy-400">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full p-8 text-center text-navy-500">No events found.</div>
        ) : (
          filtered.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gold-100 text-gold-800">
                    {ev.category}
                  </span>
                  {ev.featured && (
                    <span className="px-2 py-0.5 rounded bg-navy-900 text-gold-400 text-[10px] font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-lg text-navy-900 mb-2">{ev.title}</h3>
                <div className="space-y-1.5 text-xs text-navy-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gold-600" /> {ev.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gold-600" /> {ev.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-600" /> {ev.location}
                  </div>
                </div>
                <p className="text-xs text-navy-500 line-clamp-3 mb-4">{ev.description}</p>
              </div>

              <div className="pt-3 border-t border-sand-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(ev)}
                  className="p-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-navy-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-navy-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-serif font-bold text-navy-900 mb-4">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Holy Ghost Revival"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 bg-white"
                  >
                    <option value="Spiritual Revival">Spiritual Revival</option>
                    <option value="Conference">Conference</option>
                    <option value="Worship Vigil">Worship Vigil</option>
                    <option value="Youth Fellowship">Youth Fellowship</option>
                    <option value="Community Outreach">Community Outreach</option>
                    <option value="Anniversary">Anniversary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5:30 PM - 8:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details about this gathering..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-gold-500 rounded border-sand-300"
                />
                <label htmlFor="featured" className="text-xs font-medium text-navy-800">
                  Feature this event on Homepage banner
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-sand-100 text-navy-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-navy-900 text-gold-400 text-xs font-bold hover:bg-navy-800"
                >
                  {editingEvent ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}