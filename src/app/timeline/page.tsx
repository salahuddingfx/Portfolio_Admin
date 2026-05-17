'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Loader2, X, GraduationCap, Briefcase, Code, Award, Heart, Star } from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'graduation', label: 'Graduation', icon: GraduationCap },
  { value: 'briefcase', label: 'Briefcase', icon: Briefcase },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'award', label: 'Award', icon: Award },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'star', label: 'Star', icon: Star },
];

interface TimelineEntry {
  _id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  order: number;
}

export default function TimelinePage() {
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
      console.error('Failed to fetch timeline:', err);
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

    try {
      if (editingEntry) {
        await api.put(`/admin/timeline/${editingEntry._id}`, formData);
      } else {
        await api.post('/admin/timeline', formData);
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
    if (!confirm('Delete this timeline entry?')) return;
    try {
      await api.delete(`/admin/timeline/${id}`);
      fetchEntries();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const getIconComponent = (iconName: string) => {
    const found = ICON_OPTIONS.find(o => o.value === iconName);
    if (found) {
      const Icon = found.icon;
      return <Icon size={22} />;
    }
    return <GraduationCap size={22} />;
  };

  return (
    <DashboardShell>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Timeline.</h1>
            <p className="text-[var(--muted)] text-lg max-w-xl">Chart your journey. Each entry becomes a milestone on your about page timeline.</p>
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
            {entries.map((entry, i) => (
              <div key={entry._id} className="group bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] p-8 hover:border-[var(--accent)]/50 transition-all duration-500 shadow-2xl">
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20">
                      {getIconComponent(entry.icon)}
                    </div>
                    {i < entries.length - 1 && <div className="w-px h-full min-h-[4rem] bg-gradient-to-b from-[var(--accent)]/30 to-transparent" />}
                  </div>
                  <div className="flex-grow space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-widest bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20">{entry.year}</span>
                          {entry.subtitle && <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest">{entry.subtitle}</span>}
                        </div>
                        <h3 className="text-2xl font-black tracking-tight uppercase leading-tight">{entry.title}</h3>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleOpenModal(entry)} className="p-3 bg-white/5 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(entry._id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {entry.description && (
                      <p className="text-[var(--muted)] text-sm leading-relaxed">{entry.description}</p>
                    )}
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
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{editingEntry ? 'Edit Entry' : 'New Entry'}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Timeline Milestone</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Icon</label>
                    <div className="grid grid-cols-3 gap-3">
                      {ICON_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: opt.value })}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                              formData.icon === opt.value
                                ? 'bg-[var(--accent)] border-[var(--accent)] text-black'
                                : 'bg-white/5 border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50'
                            }`}
                          >
                            <Icon size={20} />
                            <span className="text-[10px] font-mono uppercase tracking-widest">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Year</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2024"
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

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Started at TechFlow"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Junior Full Stack Developer"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Description</label>
                    <textarea
                      rows={6}
                      placeholder="What happened? What did you learn?"
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
                  {submitting ? <Loader2 className="animate-spin" /> : editingEntry ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
