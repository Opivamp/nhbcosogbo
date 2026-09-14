import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Mail, User, Lock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function StaffManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'contentadmin',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.createUser(formData);
      setSuccess(`Account for ${formData.name} created successfully!`);
      setModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'contentadmin' });
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create staff account.');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from admin access?`)) return;
    try {
      await api.deleteUser(id);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete staff user.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
            Staff & Role-Based Access Control
          </h1>
          <p className="text-navy-600 text-sm">
            Manage authorized ministerial accounts, pastoral privileges, and content administrative logins.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition self-start"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sand-50 border-b border-sand-200 text-navy-700 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Date Added</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 text-sm text-navy-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-navy-400">Loading staff accounts...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="p-4 font-serif font-bold text-navy-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-xs">
                        {u.name ? u.name[0].toUpperCase() : 'U'}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 text-xs text-navy-600">{u.email}</td>
                    <td className="p-4 text-xs">
                      <span
                        className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider ${
                          u.role === 'superadmin'
                            ? 'bg-gold-100 text-gold-800 border border-gold-300'
                            : u.role === 'prayeradmin'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {u.role === 'superadmin'
                          ? 'Super Admin'
                          : u.role === 'prayeradmin'
                          ? 'Prayer Admin'
                          : 'Content Admin'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-navy-500">{u.createdAt ? u.createdAt.split('T')[0] : 'Permanent'}</td>
                    <td className="p-4 text-right">
                      {u.id !== currentUser?.id && u.role !== 'superadmin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                          title="Revoke Staff Access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-navy-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-serif font-bold text-navy-900 mb-1">Add Church Staff Member</h3>
            <p className="text-xs text-navy-500 mb-4">Assign role privileges to ministers, deacons, or secretariat staff.</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deaconess Mary Adeleke"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="staff@nhbcosogbo.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Assigned Administrative Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 bg-white"
                >
                  <option value="contentadmin">Content Admin (Media, Sermons, News, Events)</option>
                  <option value="prayeradmin">Prayer Admin (Pastoral Confidential Prayer Inbox)</option>
                  <option value="superadmin">Super Admin (Full System Access & Settings)</option>
                </select>
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
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}