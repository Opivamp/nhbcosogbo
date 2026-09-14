import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-900/90 border-emerald-500 text-emerald-100',
    error: 'bg-red-900/90 border-red-500 text-red-100',
    info: 'bg-navy-900/95 border-gold-500 text-gold-100',
  }[type] || 'bg-navy-900/95 border-gold-500 text-gold-100';

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-gold-400 flex-shrink-0" />,
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md">
      <div className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md ${bgStyles}`}>
        {icons}
        <div className="flex-1 text-sm font-medium leading-snug">
          {message}
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-1 hover:opacity-75 transition-opacity"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}