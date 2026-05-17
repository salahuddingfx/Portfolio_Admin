'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, X, Award } from 'lucide-react';

interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  year: string;
  category: string;
  image: string;
  credentialUrl: string;
  description: string;
  order: number;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    year: '',
    category: 'General',
    image: '',
    credentialUrl: '',
    description: '',
    order: 0
  });

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/admin/certificates');
      setCertificates(res.data);
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleOpenModal = (cert?: Certificate) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        title: cert.title,
        issuer: cert.issuer,
        year: cert.year || '',
        category: cert.category || 'General',
        image: cert.image,
        credentialUrl: cert.credentialUrl || '',
        description: cert.description || '',
        order: cert.order
      });
    } else {
      setEditingCert(null);
      setFormData({
        title: '',
        issuer: '',
        year: '',
        category: 'General',
        image: '',
        credentialUrl: '',
        description: '',
        order: certificates.length
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      issuer: formData.issuer,
      year: formData.year,
      category: formData.category,
      image: formData.image,
      credentialUrl: formData.credentialUrl,
      description: formData.description,
      order: formData.order
    };

    try {
      if (editingCert) {
        await api.put(`/admin/certificates/${editingCert._id}`, payload);
      } else {
        await api.post('/admin/certificates', payload);
      }
      setModalOpen(false);
      fetchCertificates();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      await api.delete(`/admin/certificates/${id}`);
      fetchCertificates();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Certificates.</h1>
            <p className="text-[var(--muted)] text-lg max-w-xl">Showcase your credentials and certifications. Displayed on your about page with category filtering.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-3 px-8 py-5 bg-[var(--accent)] text-black font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] rounded-2xl"
          >
            <Plus size={20} />
            Add Certificate
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Loading certificates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <div key={cert._id} className="group bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden hover:border-[var(--accent)]/50 transition-all duration-500 shadow-2xl">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[var(--accent)]/30">{cert.category}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-[var(--accent)] hover:text-black transition-all">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <h3 className="text-lg font-black tracking-tight uppercase leading-tight line-clamp-2">{cert.title}</h3>
                      <p className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest">{cert.issuer}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleOpenModal(cert)} className="p-2 bg-white/5 rounded-lg hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(cert._id)} className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[var(--muted)] uppercase tracking-widest">
                    <Award size={14} />
                    {cert.year}
                  </div>
                  {cert.description && (
                    <p className="text-[var(--muted)] text-xs leading-relaxed line-clamp-2">{cert.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--border)] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{editingCert ? 'Edit Certificate' : 'New Certificate'}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Credential Details</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Certificate Image</label>
                    <ImageUpload onUpload={(url) => setFormData({ ...formData, image: url })} defaultValue={formData.image} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Issuer</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Coursera, freeCodeCamp"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Year</label>
                      <input
                        type="text"
                        placeholder="2024"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all font-mono"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Order</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all font-mono"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Full Stack, DevOps"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meta Front-End Developer"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Credential URL</label>
                    <input
                      type="text"
                      placeholder="https://coursera.org/verify/..."
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.credentialUrl}
                      onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Description</label>
                    <textarea
                      rows={5}
                      placeholder="What skills did this certification cover?"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-10 flex gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-5 border border-[var(--border)] text-[var(--muted)] font-bold uppercase tracking-tighter hover:bg-white/5 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-3 py-5 bg-white text-black font-black uppercase tracking-tighter hover:bg-[var(--accent)] transition-all flex items-center justify-center gap-3 rounded-2xl disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : editingCert ? 'Update Certificate' : 'Create Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
