import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Image,
  Trash2,
  Edit2,
  Plus,
  Calendar,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { api } from '../api/client';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'Sunday Services',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Edit image state
  const [editingImage, setEditingImage] = useState(null);

  useEffect(() => {
    loadGallery();
  }, [selectedCategory]);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await api.getGallery(selectedCategory);
      setImages(data.images || []);
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to load gallery', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Generate previews
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(filePreviews);

    if (files.length > 0 && !uploadData.title) {
      // Pre-fill title from filename
      const cleanName = files[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setUploadData((prev) => ({ ...prev, title: cleanName }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one photo to upload.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
      formData.append('title', uploadData.title);
      formData.append('category', uploadData.category);
      formData.append('description', uploadData.description);
      formData.append('date', uploadData.date);

      await api.uploadGallery(formData);

      setUploadSuccess(`Successfully uploaded ${selectedFiles.length} photo(s)!`);
      setSelectedFiles([]);
      setPreviews([]);
      setUploadData({
        title: '',
        category: 'Sunday Services',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      if (fileInputRef.current) fileInputRef.current.value = '';

      loadGallery();
    } catch (err) {
      setUploadError(err.message || 'Failed to upload photo(s).');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      await api.deleteGalleryImage(id);
      loadGallery();
    } catch (err) {
      alert(err.message || 'Failed to delete photo.');
    }
  };

  const handleUpdateImage = async (e) => {
    e.preventDefault();
    try {
      await api.updateGalleryImage(editingImage.id, editingImage);
      setEditingImage(null);
      loadGallery();
    } catch (err) {
      alert(err.message || 'Failed to update photo details.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.addGalleryCategory(newCategoryName.trim());
      setCategories([...categories, newCategoryName.trim()]);
      setUploadData((prev) => ({ ...prev, category: newCategoryName.trim() }));
      setNewCategoryName('');
    } catch (err) {
      alert(err.message || 'Failed to add category');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
            Gallery & Media Manager
          </h1>
          <p className="text-navy-600 text-sm">
            Upload and organize church photos. Uploaded images instantly appear on the public gallery.
          </p>
        </div>
        <Link to="/gallery" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-900 text-gold-400 hover:bg-navy-800 text-xs font-semibold shadow-sm transition-colors self-start"
        >
          <ExternalLink className="w-4 h-4" /> View Public Gallery
        </Link>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl border border-sand-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sand-200">
          <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-navy-900">Upload New Church Photos</h2>
            <p className="text-xs text-navy-500">
              Drag and drop or select photos (JPEG, PNG, WebP) up to 10MB each
            </p>
          </div>
        </div>

        {uploadSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-6">
          {/* Drag & Drop File Selector */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-sand-300 hover:border-gold-500 rounded-2xl p-8 text-center cursor-pointer bg-sand-50/50 hover:bg-sand-50 transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <Image className="w-12 h-12 text-navy-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-navy-800">
              Click to browse or drop photos here
            </p>
            <p className="text-xs text-navy-500 mt-1">
              Supports multiple files at once. Files will be saved into local storage.
            </p>
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-700">
                  Selected Photos ({previews.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFiles([]);
                    setPreviews([]);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear Selection
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-sand-300 relative shadow-sm">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                Photo Title / Event Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sunday Thanksgiving Praise"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <select
                value={uploadData.category}
                onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                Date Taken
              </label>
              <input
                type="date"
                value={uploadData.date}
                onChange={(e) => setUploadData({ ...uploadData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wide mb-1.5">
                Caption / Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Brief description of this moment..."
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || selectedFiles.length === 0}
              className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                'Uploading & Processing...'
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Upload To Public Gallery
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Category Manager Bar */}
      <div className="bg-white p-4 rounded-xl border border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-navy-700 uppercase tracking-wider">Filter:</span>
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-gold-400'
                  : 'bg-sand-100 text-navy-700 hover:bg-sand-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <form onSubmit={handleAddCategory} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="New Category..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-gold-400" /> Add
          </button>
        </form>
      </div>

      {/* Image Grid */}
      <div className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm">
        <h3 className="font-serif font-bold text-navy-900 text-lg mb-4">
          Current Gallery Items ({images.length})
        </h3>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-sand-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-navy-500 text-sm">
            No images in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group rounded-xl border border-sand-200 overflow-hidden bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="aspect-video relative overflow-hidden bg-sand-100">
                  <img
                    src={img.url || img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-navy-950/80 text-gold-400">
                    {img.category}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-serif font-bold text-navy-900 text-xs line-clamp-1">
                    {img.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-navy-400 mt-1">
                    <Calendar className="w-3 h-3" /> {img.date}
                  </div>
                  <div className="mt-3 pt-2 border-t border-sand-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingImage(img)}
                      className="p-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-navy-700 transition-colors"
                      title="Edit Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-navy-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-serif font-bold text-navy-900 mb-4">Edit Photo Details</h3>
            <form onSubmit={handleUpdateImage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingImage.title}
                  onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={editingImage.category}
                  onChange={(e) => setEditingImage({ ...editingImage, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={editingImage.date}
                  onChange={(e) => setEditingImage({ ...editingImage, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingImage.description || ''}
                  onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm text-navy-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 rounded-lg bg-sand-100 text-navy-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-navy-900 text-gold-400 text-xs font-bold hover:bg-navy-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}