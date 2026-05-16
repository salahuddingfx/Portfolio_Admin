'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Upload, X, Check } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultValue?: string;
}

export default function ImageUpload({ onUpload, defaultValue }: ImageUploadProps) {
  const [image, setImage] = useState(defaultValue || '');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(res.data.url);
      onUpload(res.data.url);
      setStatus('success');
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center group">
        {image ? (
          <>
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => setImage('')}
              className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors">
            <Upload size={32} />
            <span className="text-sm font-medium">Click to upload image</span>
            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
          </label>
        )}
        
        {loading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-400 text-xs">
          <Check size={14} />
          <span>Image uploaded successfully</span>
        </div>
      )}
    </div>
  );
}
