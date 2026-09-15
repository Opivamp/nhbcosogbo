import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit2, Trash2, Mail, Phone, X } from 'lucide-react';
import { api } from '../api/client';
import FileUploadInput from '../components/ui/FileUploadInput';

export default function LeadershipManager() {
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Revd. [Pastor Name]',
    role: 'Pastor / Minister',
    bio: '',
    image: '',
    contact: '',
  });

  useEffect(() => {
    loadLeadership();
  }, []);

  const loadLeadership = async () => {
    setLoading(true);
    try {
      const data = await api.getAbout();
      setLeadership(data.leadership || []);
    } catch (err) {
      console.error('Failed to load leadership', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingLeader(null);
    setFormData({
      name: '',
      role: 'Associate Pastor / Deacon',
      bio: '',
      image: '',
      contact: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (ldr) => {
    setEditingLeader(ldr);
    setFormData({
      name: ldr.name || '',
      role: ldr.role || '',
      bio: ldr.bio || '',
      image: ldr.image || ldr.imageUrl || '',
      contact: ldr.contact || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        image: formData.image,
        imageUrl: formData.image,
      };
      if (editingLeader) {
        await api.updateLeader(editingLeader.id, payload);
      } else {
        await api.createLeader(payload);
      }
      setModalOpen(false);
      loadLeadership();
    } catch (err) {
      alert(err.message || 'Failed to save leadership profile.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leader profile?')) return;
    try {
      await api.deleteLeader(id);
      loadLeadership();
    } catch (err) {
      alert(err.message || 'Failed to delete leader.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
            Church Leadership Manager
          </h1>
          <p className="text-navy-600 text-sm">
            Manage pastoral team, board of deacons, and church ministry directors.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Add Church Officer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-navy-400">Loading leadership...</div>
        ) : leadership.length === 0 ? (
          <div className="col-span-full p-8 text-center text-navy-500">No leaders found.</div>
        ) : (
          leadership.map((ldr) => (
            <div
              key={ldr.id}
              className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-full bg-sand-200 border-2 border-gold-400 overflow-hidden mb-4 mx-auto flex items-center justify-center text-xl font-bold text-navy-900">
                  {ldr.image ? (
                    <img src={ldr.image} alt={ldr.name} className="w-full h-full object-cover" />
                  ) : (
                    ldr.name.replace(/Revd\.|Pastor|Deacon/gi, '').trim()[0] || 'L'
                  )}
                </div>
                <div className="text-center mb-3">
                  <h3 className="font-serif font-bold text-lg text-navy-900">{ldr.name}</h3>
                  <span className="text-xs text-gold-600 font-semibold block">{ldr.role}</span>
                </div>
                <p className="text-xs text-navy-600 text-center line-clamp-3 mb-4">{ldr.bio}</p>
              </div>

              <div className="pt-3 border-t border-sand-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(ldr)}
                  className="p-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-navy-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(ldr.id)}
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
              {editingLeader ? 'Edit Leader Profile' : 'Add New Church Officer'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Full Name & Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Revd. [Pastor Name]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Office / Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Under-Shepherd / Church Secretary"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>

              <FileUploadInput
                label="Leader Profile Photo"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val, imageUrl: val })}
                helperText="Upload official leader photo from device or paste image URL."
              />

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Brief Pastoral Biography
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
                  {editingLeader ? 'Update Profile' : 'Save Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}