import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, Calendar, Tag, Search, X } from 'lucide-react';
import { api } from '../api/client';

export default function NewsManager() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Announcement',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: '',
    image: '',
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await api.getNews();
      setNews(data || []);
    } catch (err) {
      console.error('Failed to load news', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Announcement',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: '',
      image: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Announcement',
      date: item.date || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      image: item.image || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateNews(editingItem.id, formData);
      } else {
        await api.createNews(formData);
      }
      setModalOpen(false);
      loadNews();
    } catch (err) {
      alert(err.message || 'Failed to save news.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bulletin/announcement?')) return;
    try {
      await api.deleteNews(id);
      loadNews();
    } catch (err) {
      alert(err.message || 'Failed to delete news.');
    }
  };

  const filtered = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
            News & Bulletins Manager
          </h1>
          <p className="text-navy-600 text-sm">
            Publish weekly announcements, pastoral letters, and church community updates.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Publish Announcement
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-sand-200 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            placeholder="Search news and announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <span className="text-xs text-navy-500 font-medium">
          Total Bulletins: <strong>{filtered.length}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-navy-400">Loading bulletins...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full p-8 text-center text-navy-500">No announcements found.</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-navy-500 mb-2">
                  <span className="font-semibold text-gold-600">{item.category}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-navy-900 mb-2">{item.title}</h3>
                <p className="text-xs text-navy-600 line-clamp-3 mb-4">
                  {item.excerpt || item.content}
                </p>
              </div>
              <div className="pt-3 border-t border-sand-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-navy-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-navy-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-serif font-bold text-navy-900 mb-4">
              {editingItem ? 'Edit Announcement' : 'Publish Announcement'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Church Business Meeting"
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
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                    Date
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
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Short Summary / Excerpt
                </label>
                <input
                  type="text"
                  placeholder="One or two sentences summarizing the bulletin..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Full Announcement Content *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Complete text of the announcement..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                  {editingItem ? 'Update Bulletin' : 'Publish Bulletin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}