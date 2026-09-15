import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Music, Video, X, CheckCircle2, Link as LinkIcon } from 'lucide-react';

export default function FileUploadInput({
  label = 'Media Asset',
  value = '',
  onChange,
  accept = 'image/*',
  mediaType = 'image', // 'image' | 'audio' | 'video'
  placeholder = 'Or paste external URL (e.g. https://...)',
  required = false,
  helperText = 'Upload directly from your phone or computer, or enter an online URL.',
}) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      if (mediaType === 'image') {
        const dataUrl = await compressImage(file);
        onChange(dataUrl);
      } else {
        // Audio or Video: read as Base64 Data URL
        const reader = new FileReader();
        reader.onload = () => {
          onChange(reader.result);
          setLoading(false);
        };
        reader.onerror = () => {
          alert('Failed to read file from device.');
          setLoading(false);
        };
        reader.readAsDataURL(file);
        return;
      }
    } catch (err) {
      console.error('File read error:', err);
      alert('Could not load selected file.');
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          try {
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          } catch (e) {
            resolve(event.target.result);
          }
        };
        img.onerror = () => resolve(event.target.result);
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-navy-800 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              mode === 'upload' ? 'bg-navy-900 text-gold-400' : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            Upload File
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              mode === 'url' ? 'bg-navy-900 text-gold-400' : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            Paste Link
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />

          {!value ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-sand-300 hover:border-gold-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-sand-50/50 hover:bg-gold-50/20 group"
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-sand-200 flex items-center justify-center text-navy-700 group-hover:text-gold-600 transition-colors">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                  ) : mediaType === 'audio' ? (
                    <Music className="w-5 h-5" />
                  ) : mediaType === 'video' ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <p className="text-xs font-semibold text-navy-900">
                  {loading ? 'Processing File...' : 'Click to browse device or drag file here'}
                </p>
                <p className="text-[11px] text-slate-500">{helperText}</p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl border border-sand-300 bg-white p-3 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 overflow-hidden">
                {mediaType === 'image' && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-navy-950 flex-shrink-0 border border-sand-200">
                    <img src={value} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                {mediaType === 'audio' && (
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                )}
                {mediaType === 'video' && (
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                )}

                <div className="overflow-hidden">
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Media Loaded
                  </div>
                  <p className="text-[11px] text-slate-500 truncate max-w-xs">
                    {value.startsWith('data:') ? 'Stored from Device Upload' : value}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-sand-100 hover:bg-sand-200 text-navy-800 transition"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {value && mediaType === 'image' && (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-navy-950 border border-sand-200">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
