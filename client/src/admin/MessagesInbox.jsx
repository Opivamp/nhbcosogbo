import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Calendar, Phone, Search, Eye, X, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';

export default function MessagesInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await api.getMessages();
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to load contact messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        await api.markMessageRead(msg.id, true);
        loadMessages();
      } catch (err) {
        console.error('Failed to mark read', err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.deleteMessage(id);
      loadMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      alert(err.message || 'Failed to delete message.');
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
            Contact Messages Inbox
          </h1>
          <p className="text-navy-600 text-sm">
            Inquiries and communications received through the public Contact page.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-sand-200 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <span className="text-xs text-navy-500 font-medium">
          Total: <strong>{filtered.length}</strong>
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sand-50 border-b border-sand-200 text-navy-700 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Status</th>
                <th className="p-4">Sender</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Message Snippet</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 text-sm text-navy-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-navy-400">Loading messages...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-navy-500">No messages in inbox.</td>
                </tr>
              ) : (
                filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-sand-50/60 transition-colors cursor-pointer ${
                      !msg.read ? 'bg-gold-50/40 font-semibold' : ''
                    }`}
                    onClick={() => handleOpenMessage(msg)}
                  >
                    <td className="p-4">
                      {!msg.read ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-gold-500 block"></span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-sand-300 block"></span>
                      )}
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-bold text-navy-900">{msg.name}</div>
                      <div className="text-navy-500 text-[11px]">{msg.email}</div>
                    </td>
                    <td className="p-4 text-xs font-serif text-navy-900">
                      {msg.subject || 'General Inquiry'}
                    </td>
                    <td className="p-4 text-xs text-navy-600 max-w-xs truncate">
                      {msg.message}
                    </td>
                    <td className="p-4 text-xs text-navy-500 whitespace-nowrap">{msg.date}</td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-navy-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-serif font-bold text-navy-900 mb-1">
              {selectedMessage.subject || 'Church Contact Message'}
            </h3>
            <div className="text-xs text-navy-500 mb-6 flex items-center gap-3">
              <span>{selectedMessage.date}</span>
            </div>

            <div className="space-y-2 p-4 bg-sand-50 rounded-xl border border-sand-200 text-xs text-navy-700 mb-4">
              <div>
                <span className="font-bold text-navy-900">Sender: </span>
                <span>{selectedMessage.name}</span>
              </div>
              <div>
                <span className="font-bold text-navy-900">Email: </span>
                <a href={`mailto:${selectedMessage.email}`} className="text-gold-600 underline">
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div>
                  <span className="font-bold text-navy-900">Phone: </span>
                  <a href={`tel:${selectedMessage.phone}`} className="text-gold-600 underline">
                    {selectedMessage.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border border-sand-300 rounded-xl text-navy-800 text-sm leading-relaxed whitespace-pre-line mb-6">
              {selectedMessage.message}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
              >
                Delete Message
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2 rounded-lg bg-navy-900 text-gold-400 text-xs font-bold hover:bg-navy-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}