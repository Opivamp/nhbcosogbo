import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Clock, UserCheck, X } from 'lucide-react';
import { api } from '../api/client';

export default function MinistriesManager() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    meetingTime: 'Sundays after service',
    leader: 'Ministry Coordinator',
    icon: 'Users',
  });

  useEffect(() => {
    loadMinistries();
  }, []);

  const loadMinistries = async () => {
    setLoading(true);
    try {
      const data = await api.getMinistries();
      setMinistries(data || []);
    } catch (err) {
      console.error('Failed to load ministries', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingMinistry(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      meetingTime: 'Sundays after service',
      leader: 'Ministry Coordinator',
      icon: 'Users',
    });
    setModalOpen(true);
  };

  const openEditModal = (min) => {
    setEditingMinistry(min);
    setFormData({
      name: min.name || '',
      slug: min.slug || '',
      description: min.description || '',
      meetingTime: min.meetingTime || '',
      leader: min.leader || '',
      icon: min.icon || 'Users',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const payload = { ...formData, slug };
      if (editingMinistry) {
        await api.updateMinistry(editingMinistry.id, payload);
      } else {
        await api.createMinistry(payload);
      }
      setModalOpen(false);
      loadMinistries();
    } catch (err) {
      alert(err.message || 'Failed to save ministry.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ministry?')) return;
    try {
      await api.deleteMinistry(id);
      loadMinistries();
    } catch (err) {
      alert(err.message || 'Failed to delete ministry.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
            Ministries & Fellowships Manager
          </h1>
          <p className="text-navy-600 text-sm">
            Manage church arms (Men, Women, Youth, Choir, Children, Missions, Ushers, Media).
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Add Ministry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-navy-400">Loading ministries...</div>
        ) : ministries.length === 0 ? (
          <div className="col-span-full p-8 text-center text-navy-500">No ministries found.</div>
        ) : (
          ministries.map((min) => (
            <div
              key={min.id}
              className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-navy-900 mb-1">{min.name}</h3>
                <div className="space-y-1 text-xs text-navy-500 mb-3">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-gold-600" /> Leader: {min.leader}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold-600" /> {min.meetingTime}
                  </div>
                </div>
                <p className="text-xs text-navy-600 line-clamp-3 mb-4">{min.description}</p>
              </div>

              <div className="pt-3 border-t border-sand-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(min)}
                  className="p-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-navy-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(min.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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
              {editingMinistry ? 'Edit Ministry' : 'Add New Ministry'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Ministry Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Men's Missionary Union (MMU)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Leader / Coordinator
                  </label>
                  <input
                    type="text"
                    value={formData.leader}
                    onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Meeting Schedule
                  </label>
                  <input
                    type="text"
                    value={formData.meetingTime}
                    onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Description & Vision
                </label>
                <textarea
                  rows={4}
                  required
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
                  {editingMinistry ? 'Update Ministry' : 'Save Ministry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}