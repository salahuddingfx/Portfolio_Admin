'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';

interface TimelineEntry {
  _id: string;
  year: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  order: number;
}

const ICON_OPTIONS = [
  { label: 'Graduation', value: 'graduation' },
  { label: 'Code', value: 'code' },
  { label: 'Laptop', value: 'laptop' },
  { label: 'Briefcase', value: 'briefcase' },
  { label: 'Book', value: 'book' },
  { label: 'Rocket', value: 'rocket' }
];

export default function TimelineAdminPage() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    year: '',
    title: '',
    subtitle: '',
    description: '',
    icon: 'graduation',
    order: 0
  });

  const fetchEntries = async () => {
    try {
      const res = await api.get('/admin/timeline');
      setEntries(res.data);
    } catch (err) {
      console.error('Failed to fetch timeline entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleOpenModal = (entry?: TimelineEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        year: entry.year,
        title: entry.title,
        subtitle: entry.subtitle || '',
        description: entry.description || '',
        icon: entry.icon || 'graduation',
        order: entry.order
      });
    } else {
      setEditingEntry(null);
      setFormData({
        year: '',
        title: '',
        subtitle: '',
        description: '',
        icon: 'graduation',
        order: entries.length
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      year: formData.year,
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      icon: formData.icon,
      order: formData.order
    };

    try {
      if (editingEntry) {
        await api.put(`/admin/timeline/${editingEntry._id}`, payload);
      } else {
        await api.post('/admin/timeline', payload);
      }
      setModalOpen(false);
      fetchEntries();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timeline entry?')) return;
    try {
      await api.delete(`/admin/timeline/${id}`);
      fetchEntries();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Timeline.</h1>
            <p className="text-[var(--muted)] text-lg max-w-xl">Manage education and journey milestones for the About page.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-3 px-8 py-5 bg-[var(--accent)] text-black font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] rounded-2xl"
          >
            <Plus size={20} />
            Add Entry
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Loading timeline...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry._id} className="bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">{entry.year}</p>
                  <h3 className="text-xl font-black tracking-tight">{entry.title}</h3>
                  {entry.subtitle && <p className="text-sm text-[var(--muted)]">{entry.subtitle}</p>}
                  {entry.description && <p className="text-sm text-[var(--muted)]">{entry.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">{entry.icon}</span>
                  <button onClick={() => handleOpenModal(entry)} className="p-3 bg-white/5 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(entry._id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                    <Trash2 size={18} />
                  </button>
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
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{editingEntry ? 'Edit Entry' : 'New Entry'}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Timeline Details</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Year / Period</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Title</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Subtitle</label>
                    <input
                      type="text"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Icon</label>
                    <select
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    >
                      {ICON_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Description</label>
                    <textarea
                      rows={6}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
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
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-5 bg-[var(--accent)] text-black font-black uppercase tracking-tighter rounded-2xl disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
