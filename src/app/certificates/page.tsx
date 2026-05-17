'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, X } from 'lucide-react';

interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  year?: string;
  category: string;
  image: string;
  credentialUrl?: string;
  description?: string;
  order: number;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
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

  const handleOpenModal = (certificate?: Certificate) => {
    if (certificate) {
      setEditingCertificate(certificate);
      setFormData({
        title: certificate.title,
        issuer: certificate.issuer,
        year: certificate.year || '',
        category: certificate.category || 'General',
        image: certificate.image,
        credentialUrl: certificate.credentialUrl || '',
        description: certificate.description || '',
        order: certificate.order
      });
    } else {
      setEditingCertificate(null);
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
      if (editingCertificate) {
        await api.put(`/admin/certificates/${editingCertificate._id}`, payload);
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
    if (!confirm('Are you sure you want to delete this certificate?')) return;
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
            <p className="text-[var(--muted)] text-lg max-w-xl">Showcase your certifications and keep them organized by category.</p>
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
              <div key={cert._id} className="group bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden hover:border-[var(--accent)]/50 transition-all duration-500 shadow-2xl">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-xl hover:bg-[var(--accent)] hover:text-black transition-all">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-7 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)]">{cert.category}</span>
                    <h3 className="text-xl font-black tracking-tight leading-tight">{cert.title}</h3>
                    <p className="text-xs text-[var(--muted)]">{cert.issuer}{cert.year ? ` • ${cert.year}` : ''}</p>
                  </div>
                  {cert.description && (
                    <p className="text-[var(--muted)] text-sm leading-relaxed line-clamp-3">{cert.description}</p>
                  )}
                  <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(cert)} className="p-3 bg-white/5 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(cert._id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
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
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{editingCertificate ? 'Edit Certificate' : 'New Certificate'}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Certificate Details</p>
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
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Display Order</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all font-mono"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Certificate Title</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Issuer</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.issuer}
                        onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Year</label>
                      <input
                        type="text"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Category</label>
                      <input
                        type="text"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Credential URL</label>
                      <input
                        type="text"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.credentialUrl}
                        onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Short Description</label>
                    <textarea
                      rows={4}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-5 bg-[var(--accent)] text-black font-black uppercase tracking-tighter rounded-2xl disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
