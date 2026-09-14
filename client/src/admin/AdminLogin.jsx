import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your login details.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gold-500/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Main Website
        </Link>
        <div className="w-20 h-20 rounded-full bg-white p-1 border-2 border-gold-400/50 flex items-center justify-center mx-auto mb-4 shadow-2xl ring-4 ring-navy-900">
          <img 
            src="/nhbc-logo.png" 
            alt="New Heritage Baptist Church Osogbo Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
          NHBC Osogbo
        </h2>
        <p className="mt-1 text-sm text-navy-300">
          Church Administrative Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-navy-900/90 backdrop-blur border border-navy-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 text-white">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-200 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@nhbcosogbo.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-navy-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white placeholder-navy-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-navy-950 bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-8 pt-6 border-t border-navy-800">
            <p className="text-xs text-navy-400 text-center uppercase tracking-wider font-semibold mb-3">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@nhbcosogbo.org', 'Admin@NHBC2026!')}
                className="px-2.5 py-2 text-[11px] font-medium rounded-lg bg-navy-800 hover:bg-navy-700 text-gold-300 border border-navy-700 text-center transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('editor@nhbcosogbo.org', 'Editor@NHBC2026!')}
                className="px-2.5 py-2 text-[11px] font-medium rounded-lg bg-navy-800 hover:bg-navy-700 text-gold-300 border border-navy-700 text-center transition-colors"
              >
                Content Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('prayer@nhbcosogbo.org', 'Prayer@NHBC2026!')}
                className="px-2.5 py-2 text-[11px] font-medium rounded-lg bg-navy-800 hover:bg-navy-700 text-gold-300 border border-navy-700 text-center transition-colors"
              >
                Prayer Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}