'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import { Users, Eye, Globe, Navigation, Clock, Search, MapPin, Monitor, ExternalLink, Loader2 } from 'lucide-react';
import WorldMap from '@/components/WorldMap';

interface Analytics {
  totalVisits: number;
  uniqueVisitors: number;
  topCountries: { _id: string; count: number }[];
  visitsByDay: { _id: string; count: number }[];
}

interface Visitor {
  _id: string;
  ip: string;
  country: string;
  city: string;
  path: string;
  referrer: string;
  userAgent: string;
  createdAt: string;
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const [analyticsRes, visitorsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/visitors')
      ]);
      setAnalytics(analyticsRes.data);
      setVisitors(visitorsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">Syncing Analytics...</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Control Center.</h1>
          <p className="text-[var(--muted)] text-lg max-w-xl">Real-time insights into your digital presence. Monitor traffic, origins, and leads.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Visits', value: analytics?.totalVisits || 0, icon: Eye, color: 'text-purple-400' },
            { label: 'Unique Visitors', value: analytics?.uniqueVisitors || 0, icon: Users, color: 'text-blue-400' },
            { label: 'Live Connections', value: visitors.filter(v => new Date(v.createdAt).getTime() > Date.now() - 300000).length, icon: Navigation, color: 'text-emerald-400' },
            { label: 'Conversion Leads', value: 'Dynamic', icon: Search, color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="p-8 bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] space-y-4 hover:border-[var(--accent)]/50 transition-all group">
              <div className={`p-4 bg-white/5 rounded-2xl w-fit ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)]">{stat.label}</p>
                <p className="text-3xl font-black tracking-tight mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* World Map */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[3rem] overflow-hidden">
          <div className="p-10 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Visitor Map</h2>
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Geographical Distribution</p>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-[var(--accent)]" />
              <span className="text-xs font-mono text-[var(--muted)]">{analytics?.topCountries.length || 0} Countries</span>
            </div>
          </div>
          <div className="p-6 md:p-10">
            {analytics?.topCountries && analytics.topCountries.length > 0 ? (
              <WorldMap countries={analytics.topCountries} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <Globe size={40} className="text-[var(--muted)] opacity-50" />
                <p className="text-sm text-[var(--muted)]">No visitor data yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Visitors */}
          <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-[3rem] overflow-hidden flex flex-col">
            <div className="p-10 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Recent Visitors</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Live Feed</p>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Live</span>
              </div>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar">
              {/* Desktop Table */}
              <table className="w-full text-left border-collapse hidden md:table">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-white/2">
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">IP Address</th>
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Location</th>
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Path</th>
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Referrer</th>
                    <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {visitors.map((v) => (
                    <tr key={v._id} className="hover:bg-white/2 transition-colors group">
                      <td className="p-6">
                        <span className="text-sm font-mono text-[var(--accent)]">{v.ip.replace('::ffff:', '')}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <MapPin size={14} className="text-[var(--muted)]" />
                          <div>
                            <p className="text-sm font-bold text-white leading-tight">{v.country}</p>
                            <p className="text-[10px] text-[var(--muted)]">{v.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10">{v.path}</span>
                      </td>
                      <td className="p-6">
                        <p className="text-xs text-[var(--muted)] truncate max-w-[150px]">{v.referrer}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] font-mono">
                          <Clock size={12} />
                          {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-6">
                {visitors.map((v) => (
                  <div key={v._id} className="p-5 bg-white/3 border border-[var(--border)] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-[var(--accent)]">{v.ip.replace('::ffff:', '')}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] font-mono">
                        <Clock size={10} />
                        {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-[var(--muted)]" />
                      <span className="text-sm font-bold">{v.country}</span>
                      <span className="text-[10px] text-[var(--muted)]">{v.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10">{v.path}</span>
                      <p className="text-[10px] text-[var(--muted)] truncate max-w-[100px]">{v.referrer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-8">
            {/* Top Origins */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[3rem] p-10 space-y-8">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Top Origins</h2>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mt-1">Ranked by Visits</p>
              </div>
              <div className="space-y-6">
                {analytics?.topCountries.map((country, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center font-mono text-[10px]">{i + 1}</div>
                        <span className="text-sm font-bold">{country._id}</span>
                      </div>
                      <span className="text-xs font-mono text-[var(--muted)]">{country.count} Visits</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--accent)] transition-all duration-1000" 
                        style={{ width: `${(country.count / (analytics?.totalVisits || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[var(--accent)] text-black rounded-[3rem] p-10 space-y-6 shadow-[0_0_50px_rgba(147,51,234,0.3)]">
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Growth Pro Tips.</h2>
              <p className="text-sm font-medium leading-relaxed">Most visitors come from <span className="font-black underline">{analytics?.topCountries[0]?._id || 'Direct'}</span>. Focus your marketing efforts there to maximize ROI.</p>
              <button className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 hover:scale-105 transition-all">
                Generate Report
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
