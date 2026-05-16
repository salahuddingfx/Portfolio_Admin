'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import { Save, Loader2, Github, Linkedin, Twitter, Instagram, Facebook, User, Phone, Mail, MapPin, MessageCircle, FileText } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    bio: '',
    aboutTitle: '',
    aboutText: '',
    experienceYears: '',
    projectsCompleted: '',
    cvUrl: '',
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    socials: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: '',
    }
  });

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      setSettings(res.data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/admin/settings', settings);
      alert('Settings updated successfully!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save settings.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Loading settings...</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Site Settings.</h1>
            <p className="text-[var(--muted)] text-lg max-w-xl">Control your global site information, social links, and bio from here.</p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-tighter hover:bg-[var(--accent)] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] rounded-2xl disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* About / Bio Section */}
          <div className="space-y-8 p-10 bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem]">
            <div className="flex items-center gap-4 border-b border-[var(--border)] pb-6">
              <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl">
                <User size={24} />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight">About & Bio</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Short Bio (Hero Section)</label>
                <textarea
                  rows={2}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all resize-none"
                  value={settings.bio}
                  onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1">About Title</label>
                <input
                  type="text"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                  value={settings.aboutTitle}
                  onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1">About Description</label>
                <textarea
                  rows={4}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all resize-none"
                  value={settings.aboutText}
                  onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Experience Years</label>
                  <input
                    type="text"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                    value={settings.experienceYears}
                    onChange={(e) => setSettings({ ...settings, experienceYears: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1">Projects Done</label>
                  <input
                    type="text"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                    value={settings.projectsCompleted}
                    onChange={(e) => setSettings({ ...settings, projectsCompleted: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1 flex items-center gap-2">
                  <FileText size={12} /> CV / Resume URL
                </label>
                <input
                  type="text"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:border-[var(--accent)] outline-none transition-all"
                  value={settings.cvUrl}
                  onChange={(e) => setSettings({ ...settings, cvUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-12">
            {/* Contact Info */}
            <div className="space-y-8 p-10 bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem]">
              <div className="flex items-center gap-4 border-b border-[var(--border)] pb-6">
                <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl">
                  <Phone size={24} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1 flex items-center gap-2">
                    <Mail size={12} /> Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 text-xs focus:border-[var(--accent)] outline-none transition-all"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1 flex items-center gap-2">
                    <Phone size={12} /> Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 text-xs focus:border-[var(--accent)] outline-none transition-all"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1 flex items-center gap-2">
                    <MessageCircle size={12} /> WhatsApp Number
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 text-xs focus:border-[var(--accent)] outline-none transition-all"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1 flex items-center gap-2">
                    <MapPin size={12} /> Location
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 text-xs focus:border-[var(--accent)] outline-none transition-all"
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-8 p-10 bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem]">
              <div className="flex items-center gap-4 border-b border-[var(--border)] pb-6">
                <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl">
                  <Github size={24} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">Social Media Links</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'github', icon: Github, label: 'GitHub' },
                  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
                  { key: 'twitter', icon: Twitter, label: 'Twitter' },
                  { key: 'instagram', icon: Instagram, label: 'Instagram' },
                  { key: 'facebook', icon: Facebook, label: 'Facebook' },
                ].map((social) => (
                  <div key={social.key} className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] ml-1 flex items-center gap-2">
                      <social.icon size={12} /> {social.label}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4 text-xs focus:border-[var(--accent)] outline-none transition-all"
                      value={(settings.socials as any)[social.key]}
                      onChange={(e) => setSettings({
                        ...settings,
                        socials: { ...settings.socials, [social.key]: e.target.value }
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </DashboardShell>
  );
}
