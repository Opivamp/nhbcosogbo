import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Building,
  Clock,
  Heart,
  BookOpen,
  Share2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Download,
} from 'lucide-react';
import { api } from '../api/client';

export default function SiteSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getSiteSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.updateSettings(section, settings[section]);
      setSuccess(`Successfully saved ${section} settings!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const downloadBackup = () => {
    const jsonStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nhbc-osogbo-database-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-navy-400">Loading site settings...</div>;
  }

  const tabs = [
    { id: 'general', label: 'General & Identity', icon: Building },
    { id: 'serviceTimes', label: 'Service Times', icon: Clock },
    { id: 'giving', label: 'Giving & Bank Details', icon: Heart },
    { id: 'scripture', label: 'Scripture of Month', icon: BookOpen },
    { id: 'social', label: 'Social & Media Links', icon: Share2 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
            Site Configuration & Content Settings
          </h1>
          <p className="text-navy-600 text-sm">
            Update core church info, service schedules, banking details, and theme scriptures.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadBackup}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 text-gold-400 hover:bg-navy-800 text-xs font-semibold shadow-sm transition self-start"
        >
          <Download className="w-4 h-4" /> Download JSON Backup
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-sand-200 gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-gold-500 text-navy-950 font-bold bg-white rounded-t-xl'
                  : 'border-transparent text-navy-600 hover:text-navy-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gold-600' : 'text-navy-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Form Container */}
      <div className="bg-white rounded-2xl border border-sand-200 p-6 md:p-8 shadow-sm">
        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h3 className="font-serif font-bold text-lg text-navy-900 mb-4">
              Church Name & Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Church Full Name
                </label>
                <input
                  type="text"
                  value={settings.general?.churchName || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, churchName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  value={settings.general?.tagline || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, tagline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Church Physical Address
                </label>
                <input
                  type="text"
                  value={settings.general?.address || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, address: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Official Phone
                </label>
                <input
                  type="text"
                  value={settings.general?.phone || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={settings.general?.email || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                Church Vision Statement
              </label>
              <textarea
                rows={2}
                value={settings.general?.vision || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, vision: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                Church Mission Statement
              </label>
              <textarea
                rows={2}
                value={settings.general?.mission || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, mission: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave('general')}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save General Settings
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Service Times */}
        {activeTab === 'serviceTimes' && (
          <div className="space-y-5">
            <h3 className="font-serif font-bold text-lg text-navy-900 mb-4">
              Weekly Service Schedules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Sunday School Time
                </label>
                <input
                  type="text"
                  value={settings.serviceTimes?.sundaySchool || 'Sundays: 8:30 AM â€“ 9:30 AM'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      serviceTimes: { ...settings.serviceTimes, sundaySchool: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Sunday Main Worship Service Time
                </label>
                <input
                  type="text"
                  value={settings.serviceTimes?.sundayWorship || 'Sundays: 9:30 AM â€“ 12:00 PM'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      serviceTimes: { ...settings.serviceTimes, sundayWorship: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Wednesday Prayer & Bible Study
                </label>
                <input
                  type="text"
                  value={settings.serviceTimes?.wednesdayStudy || 'Wednesdays: 5:30 PM â€“ 7:00 PM'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      serviceTimes: { ...settings.serviceTimes, wednesdayStudy: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  House Fellowship / Cell Groups
                </label>
                <input
                  type="text"
                  value={settings.serviceTimes?.houseFellowship || 'Sundays: 5:00 PM (Various Centres)'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      serviceTimes: { ...settings.serviceTimes, houseFellowship: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave('serviceTimes')}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Service Times
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Giving */}
        {activeTab === 'giving' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif font-bold text-lg text-navy-900">
                Church Bank Accounts for Tithes & Offerings
              </h3>
              <button
                type="button"
                onClick={() => {
                  const newAccs = [
                    ...(settings.giving?.accounts || []),
                    {
                      id: 'acc_' + Date.now(),
                      purpose: 'Ministry Offering',
                      bank: 'First Bank of Nigeria',
                      accountName: 'New Heritage Baptist Church Osogbo',
                      accountNumber: '[Account Number]',
                    },
                  ];
                  setSettings({
                    ...settings,
                    giving: { ...settings.giving, accounts: newAccs },
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-navy-800 text-gold-400 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Account
              </button>
            </div>

            {settings.giving?.accounts?.map((acc, index) => (
              <div
                key={acc.id || index}
                className="p-4 rounded-xl border border-sand-300 bg-sand-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy-800 uppercase">
                    Account #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = settings.giving.accounts.filter((_, i) => i !== index);
                      setSettings({
                        ...settings,
                        giving: { ...settings.giving, accounts: updated },
                      });
                    }}
                    className="text-red-600 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-navy-600 uppercase mb-1">
                      Purpose
                    </label>
                    <input
                      type="text"
                      value={acc.purpose}
                      onChange={(e) => {
                        const updated = [...settings.giving.accounts];
                        updated[index].purpose = e.target.value;
                        setSettings({
                          ...settings,
                          giving: { ...settings.giving, accounts: updated },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-sand-300 text-xs text-navy-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-navy-600 uppercase mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={acc.bank}
                      onChange={(e) => {
                        const updated = [...settings.giving.accounts];
                        updated[index].bank = e.target.value;
                        setSettings({
                          ...settings,
                          giving: { ...settings.giving, accounts: updated },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-sand-300 text-xs text-navy-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-navy-600 uppercase mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={acc.accountName}
                      onChange={(e) => {
                        const updated = [...settings.giving.accounts];
                        updated[index].accountName = e.target.value;
                        setSettings({
                          ...settings,
                          giving: { ...settings.giving, accounts: updated },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-sand-300 text-xs text-navy-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-navy-600 uppercase mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={acc.accountNumber}
                      onChange={(e) => {
                        const updated = [...settings.giving.accounts];
                        updated[index].accountNumber = e.target.value;
                        setSettings({
                          ...settings,
                          giving: { ...settings.giving, accounts: updated },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-sand-300 text-xs text-navy-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave('giving')}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Bank Accounts
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Scripture */}
        {activeTab === 'scripture' && (
          <div className="space-y-5">
            <h3 className="font-serif font-bold text-lg text-navy-900 mb-4">
              Scripture of the Month / Annual Theme
            </h3>
            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                Spiritual Theme Title
              </label>
              <input
                type="text"
                value={settings.scriptureOfTheMonth?.theme || 'Walking in Divine All-Sufficiency'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    scriptureOfTheMonth: {
                      ...settings.scriptureOfTheMonth,
                      theme: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                Scripture Passage Reference
              </label>
              <input
                type="text"
                value={settings.scriptureOfTheMonth?.reference || '2 Corinthians 9:8'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    scriptureOfTheMonth: {
                      ...settings.scriptureOfTheMonth,
                      reference: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                Scripture Verse Text
              </label>
              <textarea
                rows={3}
                value={settings.scriptureOfTheMonth?.verse || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    scriptureOfTheMonth: {
                      ...settings.scriptureOfTheMonth,
                      verse: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave('scriptureOfTheMonth')}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Scripture
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Social */}
        {activeTab === 'social' && (
          <div className="space-y-5">
            <h3 className="font-serif font-bold text-lg text-navy-900 mb-4">
              Social Media & Broadcast Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Facebook Page
                </label>
                <input
                  type="text"
                  placeholder="https://facebook.com/nhbcosogbo"
                  value={settings.social?.facebook || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social: { ...settings.social, facebook: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  YouTube Channel (Live Broadcasts)
                </label>
                <input
                  type="text"
                  placeholder="https://youtube.com/@nhbcosogbo"
                  value={settings.social?.youtube || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social: { ...settings.social, youtube: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  placeholder="https://instagram.com/nhbcosogbo"
                  value={settings.social?.instagram || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social: { ...settings.social, instagram: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  WhatsApp Community / Helpline
                </label>
                <input
                  type="text"
                  placeholder="https://wa.me/234..."
                  value={settings.social?.whatsapp || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social: { ...settings.social, whatsapp: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave('social')}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Social Links
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}