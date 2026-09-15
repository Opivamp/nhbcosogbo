import React, { useState, useEffect } from 'react';
import { Heart, Copy, Check, ShieldCheck, CreditCard, Sparkles, Building, Info, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

export default function Give() {
  const [givingData, setGivingData] = useState(null);
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Transfer notification state
  const [notifyData, setNotifyData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    purpose: 'Tithes',
    bank: 'First Bank of Nigeria',
    reference: '',
  });
  const [notifying, setNotifying] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState('');
  const [notifyError, setNotifyError] = useState('');

  useEffect(() => {
    loadGiving();
  }, []);

  const loadGiving = async () => {
    try {
      const data = await api.getGiving();
      setGivingData(data);
    } catch (err) {
      console.error('Failed to load giving details', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (accNumber, id) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (!notifyData.name || !notifyData.amount) {
      setNotifyError('Please enter your name and transfer amount.');
      return;
    }

    setNotifying(true);
    setNotifyError('');
    setNotifySuccess('');

    try {
      const res = await api.notifyGiving(notifyData);
      setNotifySuccess(res.message || 'Thank you! Your giving notification has been recorded.');
      setNotifyData({
        name: '',
        email: '',
        phone: '',
        amount: '',
        purpose: 'Tithes',
        bank: 'First Bank of Nigeria',
        reference: '',
      });
    } catch (err) {
      setNotifyError(err.message || 'Failed to submit notification. Please try again.');
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-navy-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-gold-400/30">
            <Heart className="w-3.5 h-3.5" /> Worship Through Giving
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Give & Support the Kingdom
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
          </p>
          <span className="block mt-2 text-gold-400 font-serif italic text-sm">2 Corinthians 9:7</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Biblical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-navy-900 mb-1">Tithes & Offerings</h3>
            <p className="text-navy-600 text-xs leading-relaxed">
              Honoring God with our firstfruits and sustaining pastoral care, worship ministrations, and local church missions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-3">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-navy-900 mb-1">Building & Sanctuary</h3>
            <p className="text-navy-600 text-xs leading-relaxed">
              Expanding our Osogbo sanctuary, audio-visual broadcasting systems, and children classroom facilities.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-navy-900 mb-1">Welfare & Benevolence</h3>
            <p className="text-navy-600 text-xs leading-relaxed">
              Caring for widows, orphans, students in need, and taking the Gospel into unreached communities around Osun State.
            </p>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
              Direct Bank Transfer Details
            </h2>
            <p className="text-navy-600 text-sm mt-1">
              Make your direct transfers via any Nigerian mobile banking app or USSD into our dedicated accounts:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {givingData?.accounts?.map((acc) => (
              <div
                key={acc.id}
                className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-navy-100 text-navy-800 text-xs font-bold uppercase tracking-wider">
                    {acc.purpose}
                  </span>
                  <ShieldCheck className="w-5 h-5 text-gold-500" />
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-navy-400 block font-medium">Bank Name</span>
                    <span className="text-base font-bold text-navy-900">{acc.bank}</span>
                  </div>

                  <div>
                    <span className="text-xs text-navy-400 block font-medium">Account Name</span>
                    <span className="text-sm font-semibold text-navy-800">{acc.accountName}</span>
                  </div>

                  <div className="bg-sand-50 p-3 rounded-xl border border-sand-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-navy-500 block uppercase font-bold tracking-wider">
                        Account Number
                      </span>
                      <span className="text-xl font-mono font-bold text-navy-900 tracking-wider">
                        {acc.accountNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(acc.accountNumber, acc.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                        copiedAccount === acc.id
                          ? 'bg-green-600 text-white'
                          : 'bg-navy-900 text-gold-400 hover:bg-navy-800'
                      }`}
                    >
                      {copiedAccount === acc.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gold-50 border border-gold-200 rounded-xl p-4 flex items-start gap-3 text-xs md:text-sm text-gold-900">
            <Info className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
            <p>
              <strong>Giving Note:</strong> When making online transfers, please use your name and purpose (e.g., <em>"Tithes"</em>, <em>"Offering"</em>, or <em>"Missions"</em>) as the payment description or remarks for church auditing records.
            </p>
          </div>
        </div>

        {/* Transfer Confirmation Form */}
        <div className="bg-white rounded-2xl border border-sand-200 p-6 md:p-8 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-sand-200">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-navy-900">
                Notify Church Finance of Bank Transfer
              </h3>
              <p className="text-xs text-navy-500">
                Optional: Let our church finance team know about your transfer for receipting and pastoral thanksgiving.
              </p>
            </div>
          </div>

          {notifySuccess && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="font-bold">{notifySuccess}</p>
                <p className="text-xs italic text-green-700 mt-0.5">
                  "The Lord bless you and keep you; the Lord make His face shine upon you." — Numbers 6:24-25
                </p>
              </div>
            </div>
          )}

          {notifyError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{notifyError}</span>
            </div>
          )}

          <form onSubmit={handleNotifySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deacon Olumide Ajayi"
                  value={notifyData.name}
                  onChange={(e) => setNotifyData({ ...notifyData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Amount Transferred (â‚¦) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10,000"
                  value={notifyData.amount}
                  onChange={(e) => setNotifyData({ ...notifyData, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Giving Purpose
                </label>
                <select
                  value={notifyData.purpose}
                  onChange={(e) => setNotifyData({ ...notifyData, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 bg-white"
                >
                  <option value="Tithes">Tithes</option>
                  <option value="Sunday Offering">Sunday Offering</option>
                  <option value="Building Project">Building Project</option>
                  <option value="Missions & Evangelism">Missions & Evangelism</option>
                  <option value="Welfare / Benevolence">Welfare / Benevolence</option>
                  <option value="Thanksgiving">Thanksgiving</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="0803 000 0000"
                  value={notifyData.phone}
                  onChange={(e) => setNotifyData({ ...notifyData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="olumide@example.com"
                  value={notifyData.email}
                  onChange={(e) => setNotifyData({ ...notifyData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Transfer Reference / Bank
                </label>
                <input
                  type="text"
                  placeholder="e.g. GTBank App / Ref #12345"
                  value={notifyData.reference}
                  onChange={(e) => setNotifyData({ ...notifyData, reference: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={notifying}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {notifying ? 'Submitting...' : 'Send Giving Acknowledgment'}
              </button>
            </div>
          </form>
        </div>

        {/* Online Gateway Stub */}
        <div className="bg-white rounded-2xl border border-sand-200 p-8 shadow-sm text-center max-w-2xl mx-auto">
          <CreditCard className="w-12 h-12 text-navy-600 mx-auto mb-3" />
          <h3 className="text-xl font-serif font-bold text-navy-900 mb-2">Card & Online Giving Portal</h3>
          <p className="text-navy-600 text-sm mb-6 leading-relaxed">
            Instant debit/credit card and USSD processing is ready to be connected with official payment providers (e.g. Paystack / Flutterwave) upon church council verification.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sand-100 text-navy-700 text-xs font-medium border border-sand-200">
            <ShieldCheck className="w-4 h-4 text-green-600" /> Secure 256-Bit SSL Encrypted
          </div>
        </div>
      </div>
    </div>
  );
}