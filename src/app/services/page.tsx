'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';

interface Service {
  _id: string;
  title: string;
  description: string;
  price?: string;
  icon?: string;
  tags: string[];
  order: number;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    icon: '',
    tags: '',
    order: 0
  });

  const fetchServices = async () => {
    try {
      const res = await api.get('/admin/services');
      setServices(res.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        price: service.price || '',
        icon: service.icon || '',
        tags: service.tags.join(', '),
        order: service.order
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        icon: '',
        tags: '',
        order: services.length
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      icon: formData.icon,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      order: formData.order
    };

    try {
      if (editingService) {
        await api.put(`/admin/services/${editingService._id}`, payload);
      } else {
        await api.post('/admin/services', payload);
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Services.</h1>
            <p className="text-[var(--muted)] text-lg max-w-xl">Manage your services list and pricing.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-3 px-8 py-5 bg-[var(--accent)] text-black font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] rounded-2xl"
          >
            <Plus size={20} />
            Add Service
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Loading services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service._id} className="group bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden hover:border-[var(--accent)]/50 transition-all duration-500 shadow-2xl">
                <div className="p-8 space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tight uppercase leading-tight">{service.title}</h3>
                      {service.price && <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">{service.price}</p>}
                      <p className="text-[var(--muted)] text-sm leading-relaxed">{service.description}</p>
                    </div>
                    {service.icon && (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] shrink-0">
                        <img src={service.icon} alt={service.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20">{tag}</span>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(service)} className="p-3 bg-white/5 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(service._id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all">
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
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{editingService ? 'Edit Service' : 'New Service'}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Service Details</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Icon (optional)</label>
                    <ImageUpload onUpload={(url) => setFormData({ ...formData, icon: url })} defaultValue={formData.icon} />
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
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Title</label>
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
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Price</label>
                      <input
                        type="text"
                        placeholder="Starting at $499"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Description</label>
                    <textarea
                      rows={5}
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
                  {submitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
