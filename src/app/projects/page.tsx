'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, X } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface Project {
  _id: string;
  title: string;
  desc: string;
  image: string;
  category: string;
  tags: string[];
  links: {
    live: string;
    source: string;
  };
  order: number;
  featured: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    image: '',
    category: '',
    tags: '',
    liveLink: '',
    sourceLink: '',
    order: 0,
    featured: false
  });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/admin/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        desc: project.desc,
        image: project.image,
        category: project.category || '',
        tags: project.tags.join(', '),
        liveLink: project.links.live,
        sourceLink: project.links.source,
        order: project.order,
        featured: project.featured || false
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        desc: '',
        image: '',
        category: '',
        tags: '',
        liveLink: '',
        sourceLink: '',
        order: projects.length,
        featured: false
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      desc: formData.desc,
      image: formData.image,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      links: {
        live: formData.liveLink,
        source: formData.sourceLink
      },
      order: formData.order,
      featured: formData.featured
    };

    try {
      if (editingProject) {
        await api.put(`/admin/projects/${editingProject._id}`, payload);
      } else {
        await api.post('/admin/projects', payload);
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Projects.</h1>
            <p className="text-[var(--muted)] text-lg max-w-xl">Showcase your best work. These will be displayed in the horizontal scroll section of your portfolio.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-3 px-8 py-5 bg-[var(--accent)] text-black font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] rounded-2xl"
          >
            <Plus size={20} />
            Add Project
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Loading your works...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project._id} className="group bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden hover:border-[var(--accent)]/50 transition-all duration-500 shadow-2xl">
                <div className="aspect-video relative overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <div className="flex gap-4">
                      <a href={project.links.live} target="_blank" className="p-3 bg-white/10 backdrop-blur-md rounded-xl hover:bg-[var(--accent)] hover:text-black transition-all">
                        <ExternalLink size={18} />
                      </a>
                      <a href={project.links.source} target="_blank" className="p-3 bg-white/10 backdrop-blur-md rounded-xl hover:bg-[var(--accent)] hover:text-black transition-all">
                        <GithubIcon className="w-[18px] h-[18px]" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {project.category && (
                          <span className="text-[10px] font-mono uppercase tracking-widest text-black bg-[var(--accent)] px-3 py-1 rounded-full">{project.category}</span>
                        )}
                        {project.featured && (
                          <span className="text-[10px] font-mono uppercase tracking-widest text-white bg-purple-600 px-3 py-1 rounded-full border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse">Featured</span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black tracking-tight uppercase leading-tight">{project.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleOpenModal(project)} className="p-3 bg-white/5 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(project._id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[var(--muted)] text-sm leading-relaxed line-clamp-3">{project.desc}</p>
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
          <div className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--border)] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{editingProject ? 'Edit Project' : 'New Project'}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Project Details</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Thumbnail Image</label>
                    <ImageUpload onUpload={(url) => setFormData({ ...formData, image: url })} defaultValue={formData.image} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Full Stack, AI/ML"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Project Order</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all font-mono"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-[var(--background)] border border-[var(--border)] rounded-2xl">
                    <div className="space-y-1">
                      <span className="text-xs font-mono uppercase tracking-widest text-white block">Featured Project</span>
                      <span className="text-[10px] font-mono text-[var(--muted)] block">Showcase this project on the homepage</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                      className={`w-14 h-8 rounded-full transition-all duration-300 p-1 flex items-center ${
                        formData.featured ? 'bg-[var(--accent)]' : 'bg-neutral-800 border border-[var(--border)]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
                          formData.featured ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Project Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vortex OS"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Tech Stack (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="Next.js, React, GSAP..."
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Description</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="What makes this project special?"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all resize-none"
                      value={formData.desc}
                      onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Live URL</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 text-xs focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.liveLink}
                        onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Source Code</label>
                      <input
                        type="text"
                        placeholder="https://github.com/..."
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 text-xs focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.sourceLink}
                        onChange={(e) => setFormData({ ...formData, sourceLink: e.target.value })}
                      />
                    </div>
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
                  {submitting ? <Loader2 className="animate-spin" /> : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
