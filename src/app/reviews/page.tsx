'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Loader2, X, Star, Link as LinkIcon, Copy } from 'lucide-react';

interface Review {
  _id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar: string;
  rating: number;
  order: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteLabel, setInviteLabel] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteExpires, setInviteExpires] = useState(7);
  const [inviteMessage, setInviteMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    text: '',
    avatar: '',
    rating: 5,
    order: 0
  });

  const fetchReviews = async () => {
    try {
      const res = await api.get('/admin/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenModal = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        name: review.name,
        role: review.role,
        company: review.company || '',
        text: review.text,
        avatar: review.avatar || '',
        rating: review.rating,
        order: review.order
      });
    } else {
      setEditingReview(null);
      setFormData({
        name: '',
        role: '',
        company: '',
        text: '',
        avatar: '',
        rating: 5,
        order: reviews.length
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingReview) {
        await api.put(`/admin/reviews/${editingReview._id}`, formData);
      } else {
        await api.post('/admin/reviews', formData);
      }
      setModalOpen(false);
      fetchReviews();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleCreateInvite = async () => {
    setInviteLoading(true);
    setInviteMessage('');
    try {
      const res = await api.post('/admin/reviews/invite', {
        label: inviteLabel,
        email: inviteEmail,
        expiresInDays: inviteExpires
      });
      setInviteLink(res.data?.shareUrl || '');
      setInviteMessage('Review link generated.');
    } catch (err) {
      console.error('Invite failed:', err);
      setInviteMessage('Unable to generate invite.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCopyInvite = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setInviteMessage('Link copied to clipboard.');
    } catch {
      setInviteMessage('Copy failed.');
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Reviews.</h1>
            <p className="text-[var(--muted)] text-lg max-w-xl">What your clients say. These testimonials build trust and showcase your professionalism.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-3 px-8 py-5 bg-[var(--accent)] text-black font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] rounded-2xl"
          >
            <Plus size={20} />
            Add Review
          </button>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl">
              <LinkIcon size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight">Client Review Link</h2>
              <p className="text-sm text-[var(--muted)]">Generate a private link and send it to your client.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Client Name (optional)</label>
              <input
                type="text"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 text-xs focus:border-[var(--accent)] outline-none transition-all"
                value={inviteLabel}
                onChange={(e) => setInviteLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Client Email (optional)</label>
              <input
                type="email"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 text-xs focus:border-[var(--accent)] outline-none transition-all"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Expires (days)</label>
              <input
                type="number"
                min={1}
                max={30}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 text-xs focus:border-[var(--accent)] outline-none transition-all"
                value={inviteExpires}
                onChange={(e) => setInviteExpires(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <button
              onClick={handleCreateInvite}
              disabled={inviteLoading}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-tighter hover:bg-[var(--accent)] transition-all disabled:opacity-60"
            >
              {inviteLoading ? 'Generating...' : 'Generate Link'}
            </button>
            <div className="flex-1 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-xs text-[var(--muted)]">
              <span className="truncate">{inviteLink || 'Link will appear here after generation.'}</span>
              <button
                onClick={handleCopyInvite}
                className="ml-auto flex items-center gap-1 text-[var(--accent)] hover:text-white transition"
                disabled={!inviteLink}
              >
                <Copy size={14} />
                Copy
              </button>
            </div>
          </div>

          {inviteMessage && <p className="text-xs text-[var(--muted)]">{inviteMessage}</p>}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Fetching kind words...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review._id} className="group bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] p-8 space-y-8 hover:border-[var(--accent)]/50 transition-all duration-500 shadow-2xl relative">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--border)]">
                    <img src={review.avatar || 'https://i.pravatar.cc/150?u=placeholder'} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-black text-lg uppercase tracking-tight leading-tight">{review.name}</h3>
                    <p className="text-xs text-[var(--accent)] font-mono uppercase tracking-widest">{review.role} {review.company ? `@ ${review.company}` : ''}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--muted-soft)]'} />
                    ))}
                  </div>
                  <blockquote className="text-[var(--muted)] text-sm leading-relaxed italic line-clamp-4">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                </div>

                <div className="pt-6 border-t border-[var(--border)] flex justify-end gap-2">
                  <button onClick={() => handleOpenModal(review)} className="p-3 bg-white/5 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(review._id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                    <Trash2 size={18} />
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
          <div className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--border)] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{editingReview ? 'Edit Review' : 'New Review'}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Client Feedback</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Avatar / Client Photo</label>
                    <ImageUpload onUpload={(url) => setFormData({ ...formData, avatar: url })} defaultValue={formData.avatar} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Rating</label>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: num })}
                          className={`flex-1 py-4 rounded-xl border transition-all ${
                            formData.rating === num 
                              ? 'bg-[var(--accent)] border-[var(--accent)] text-black' 
                              : 'bg-white/5 border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Client Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Role / Position</label>
                      <input
                        type="text"
                        required
                        placeholder="CTO"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Company</label>
                      <input
                        type="text"
                        placeholder="TechFlow"
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Review Text</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="What did they say about your work?"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all resize-none"
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
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
                  {submitting ? <Loader2 className="animate-spin" /> : editingReview ? 'Update Review' : 'Create Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
