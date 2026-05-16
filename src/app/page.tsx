'use client';

import DashboardShell from '@/components/DashboardShell';
import { Briefcase, MessageSquare, Users, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Projects', value: '12', icon: Briefcase, color: 'text-blue-400' },
    { name: 'Client Reviews', value: '8', icon: MessageSquare, color: 'text-accent' },
    { name: 'Unique Visitors', value: '2.4k', icon: Users, color: 'text-purple-400' },
    { name: 'Project Views', value: '15.8k', icon: Eye, color: 'text-green-400' },
  ];

  return (
    <DashboardShell>
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-display font-black tracking-tighter">Admin <span className="text-accent">Dashboard.</span></h1>
          <p className="text-white/40 text-lg max-w-2xl">Manage your projects, reviews, and site content from one place.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl hover:bg-white/[0.05] transition-all duration-500 group">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.2em]">Active</span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-display font-black tracking-tight">{stat.value}</p>
                <p className="text-white/40 text-sm font-medium">{stat.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity placeholder */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-8 bg-white/[0.03] border border-white/10 rounded-3xl min-h-[400px]">
            <h3 className="text-xl font-bold mb-8">Site Statistics</h3>
            <div className="flex items-center justify-center h-64 border border-dashed border-white/10 rounded-2xl">
              <span className="text-white/20 font-mono text-xs uppercase tracking-widest">Analytics Data Pending</span>
            </div>
          </div>
          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl">
            <h3 className="text-xl font-bold mb-8">Recent Updates</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-start pb-6 border-b border-white/5 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Updated portfolio content</p>
                    <p className="text-[10px] font-mono text-white/20 uppercase">Recently</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
