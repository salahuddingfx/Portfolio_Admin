'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, X, Calendar } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  category: string;
  readTime: string;
  publishedAt: string;
  order: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    tags: '',
    category: 'General',
    readTime: '',
    publishedAt: '',
    order: 0
  });

  const fetchPosts = async () => {
    try {
      const res = await api.get('/admin/blog-posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        tags: post.tags.join(', '),
        category: post.category,
        readTime: post.readTime || '',
        publishedAt: post.publishedAt || '',
        order: post.order
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        tags: '',
        category: 'General',
        readTime: '',
        publishedAt: '',
        order: posts.length
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt,
      content: formData.content,
      image: formData.image,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      category: formData.category,
      readTime: formData.readTime,
      publishedAt: formData.publishedAt,
      order: formData.order
    };

    try {
      if (editingPost) {
        await api.put(`/admin/blog-posts/${editingPost._id}`, payload);
      } else {
        await api.post('/admin/blog-posts', payload);
      }
      setModalOpen(false);
      fetchPosts();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/admin/blog-posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Blog.</h1>
            <p className="text-[var(--muted)] text-lg max-w-xl">Write and manage your blog posts. Share insights, tutorials, and updates with your audience.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-3 px-8 py-5 bg-[var(--accent)] text-black font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] rounded-2xl"
          >
            <Plus size={20} />
            New Post
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Loading articles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <div key={post._id} className="group bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden hover:border-[var(--accent)]/50 transition-all duration-500 shadow-2xl">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[var(--accent)]/30">{post.category}</span>
                    {post.readTime && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">{post.readTime} min read</span>
                    )}
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded-full border border-[var(--accent)]/20">{tag}</span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-black tracking-tight uppercase leading-tight line-clamp-2">{post.title}</h3>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleOpenModal(post)} className="p-3 bg-white/5 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(post._id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[var(--muted)] text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] pt-2 border-t border-[var(--border)]">
                    <Calendar size={12} />
                    {post.publishedAt || 'Not published'}
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
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{editingPost ? 'Edit Post' : 'New Post'}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Blog Article</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Cover Image</label>
                    <ImageUpload onUpload={(url) => setFormData({ ...formData, image: url })} defaultValue={formData.image} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Slug</label>
                    <input
                      type="text"
                      required
                      placeholder="my-awesome-post"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all font-mono"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                    <p className="text-[10px] font-mono text-[var(--muted)] mt-1 ml-1">Auto-generated from title if empty</p>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Read Time (min)</label>
                      <input
                        type="text"
                        placeholder="5"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all font-mono"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Published Date</label>
                      <input
                        type="text"
                        placeholder="Mar 15, 2026"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.publishedAt}
                        onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                      />
                    </div>
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
                      placeholder="e.g. Building a Real-Time Chat App"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          title: e.target.value,
                          slug: editingPost ? formData.slug : generateSlug(e.target.value)
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Excerpt</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Short summary for cards and previews..."
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all resize-none"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Content (Markdown / HTML)</label>
                    <textarea
                      rows={10}
                      required
                      placeholder="Write your full article content here..."
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all resize-none font-mono leading-relaxed"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Tags (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, WebSockets, Node.js..."
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
                  {submitting ? <Loader2 className="animate-spin" /> : editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
