import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Video, Music, Calendar, Search, X } from 'lucide-react';
import { api } from '../api/client';

export default function SermonsManager() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    preacher: 'Revd. [Pastor Name]',
    scripture: '',
    date: new Date().toISOString().split('T')[0],
    series: 'Sunday Worship Service',
    description: '',
    videoUrl: '',
    audioUrl: '',
  });

  useEffect(() => {
    loadSermons();
  }, []);

  const loadSermons = async () => {
    setLoading(true);
    try {
      const data = await api.getSermons();
      setSermons(data || []);
    } catch (err) {
      console.error('Failed to load sermons', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSermon(null);
    setFormData({
      title: '',
      preacher: 'Revd. [Pastor Name]',
      scripture: '',
      date: new Date().toISOString().split('T')[0],
      series: 'Sunday Worship Service',
      description: '',
      videoUrl: '',
      audioUrl: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (sermon) => {
    setEditingSermon(sermon);
    setFormData({
      title: sermon.title || '',
      preacher: sermon.preacher || '',
      scripture: sermon.scripture || '',
      date: sermon.date || '',
      series: sermon.series || '',
      description: sermon.description || '',
      videoUrl: sermon.videoUrl || '',
      audioUrl: sermon.audioUrl || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSermon) {
        await api.updateSermon(editingSermon.id, formData);
      } else {
        await api.createSermon(formData);
      }
      setModalOpen(false);
      loadSermons();
    } catch (err) {
      alert(err.message || 'Failed to save sermon.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sermon?')) return;
    try {
      await api.deleteSermon(id);
      loadSermons();
    } catch (err) {
      alert(err.message || 'Failed to delete sermon.');
    }
  };

  const filtered = sermons.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.preacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.scripture?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
            Sermons Archive Manager
          </h1>
          <p className="text-navy-600 text-sm">
            Publish, edit, and link audio & video recordings for NHBC Osogbo pulpit messages.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Add New Sermon
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-sand-200 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            placeholder="Search by title, preacher, or scripture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <span className="text-xs text-navy-500 font-medium">
          Total Sermons: <strong>{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sand-50 border-b border-sand-200 text-navy-700 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">Sermon Title</th>
                <th className="p-4">Preacher</th>
                <th className="p-4">Scripture</th>
                <th className="p-4">Media</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 text-sm text-navy-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-navy-400">Loading sermons...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-navy-500">No sermons found.</td>
                </tr>
              ) : (
                filtered.map((sermon) => (
                  <tr key={sermon.id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="p-4 text-xs text-navy-500 whitespace-nowrap">{sermon.date}</td>
                    <td className="p-4 font-serif font-bold text-navy-900">
                      <div>{sermon.title}</div>
                      <div className="text-[11px] text-navy-400 font-sans font-normal">{sermon.series}</div>
                    </td>
                    <td className="p-4 text-xs font-medium text-navy-700">{sermon.preacher}</td>
                    <td className="p-4 text-xs text-gold-700 font-medium">{sermon.scripture}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {sermon.videoUrl && (
                          <span className="p-1 rounded bg-red-100 text-red-600" title="Video Available">
                            <Video className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {sermon.audioUrl && (
                          <span className="p-1 rounded bg-amber-100 text-amber-700" title="Audio Available">
                            <Music className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(sermon)}
                          className="p-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-navy-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sermon.id)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-navy-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-serif font-bold text-navy-900 mb-4">
              {editingSermon ? 'Edit Sermon' : 'Add New Sermon'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Sermon Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking in Divine Favor"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Preacher / Minister *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.preacher}
                    onChange={(e) => setFormData({ ...formData, preacher: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Scripture Passage *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Psalm 23:1-6"
                    value={formData.scripture}
                    onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Date Preached
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Series / Occasion
                  </label>
                  <input
                    type="text"
                    value={formData.series}
                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Video URL (YouTube / Stream)
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Audio URL (MP3 Link)
                </label>
                <input
                  type="text"
                  placeholder="https://.../sermon.mp3"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Sermon Outline / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
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
                  {editingSermon ? 'Update Sermon' : 'Create Sermon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}