'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, X, Building2 } from 'lucide-react';

interface Partner {
  _id: string;
  name: string;
  logo: string;
  website: string;
  order: number;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    order: 0,
  });

  const fetchPartners = async () => {
    try {
      const res = await api.get('/admin/partners');
      setPartners(res.data);
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleOpenModal = (partner?: Partner) => {
    if (partner) {
      setEditing(partner);
      setFormData({ name: partner.name, logo: partner.logo, website: partner.website || '', order: partner.order });
    } else {
      setEditing(null);
      setFormData({ name: '', logo: '', website: '', order: partners.length });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/admin/partners/${editing._id}`, formData);
      } else {
        await api.post('/admin/partners', formData);
      }
      setModalOpen(false);
      fetchPartners();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    try {
      await api.delete(`/admin/partners/${id}`);
      fetchPartners();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Partners.</h1>
            <p className="text-[var(--muted)] text-lg max-w-xl">
              Companies and clients you've worked with. Their logos will display as a scrolling marquee on your About page.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-3 px-8 py-5 bg-[var(--accent)] text-black font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] rounded-2xl"
          >
            <Plus size={20} />
            Add Partner
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Loading partners...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] rounded-3xl p-20 text-center">
            <Building2 size={40} className="mx-auto mb-4 text-[var(--muted)]" />
            <p className="text-[var(--muted)] text-sm font-mono uppercase tracking-widest">No partners yet. Add your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <div
                key={partner._id}
                className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 flex flex-col items-center gap-4 hover:border-[var(--accent)]/50 transition-all duration-500 shadow-xl"
              >
                {/* Logo */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center border border-[var(--border)]">
                  <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain p-2" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight text-center">{partner.name}</span>
                <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest">Order: {partner.order}</span>

                {/* Actions */}
                <div className="flex gap-2">
                  {partner.website && (
                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-xl hover:bg-[var(--accent)] hover:text-black transition-all">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button onClick={() => handleOpenModal(partner)} className="p-2 bg-white/5 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(partner._id)} className="p-2 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-10 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{editing ? 'Edit Partner' : 'New Partner'}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Company / Client Logo</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-8 custom-scrollbar">
              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Logo Image</label>
                <ImageUpload onUpload={(url) => setFormData({ ...formData, logo: url })} defaultValue={formData.logo} />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Website + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Website (optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
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

              {/* Actions */}
              <div className="pt-4 flex gap-4">
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
                  className="flex-[3] py-5 bg-white text-black font-black uppercase tracking-tighter hover:bg-[var(--accent)] transition-all flex items-center justify-center gap-3 rounded-2xl disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : editing ? 'Update Partner' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
