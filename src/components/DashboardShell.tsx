'use client';

import { LayoutDashboard, Briefcase, MessageSquare, FileText, Wrench, Clock, Award, Building2, LogOut, ChevronRight, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  if (!mounted) return null;
  if (pathname === '/login') return <>{children}</>;

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Services', href: '/services', icon: Wrench },
    { name: 'Timeline', href: '/timeline', icon: Clock },
    { name: 'Certificates', href: '/certificates', icon: Award },
    { name: 'Partners', href: '/partners', icon: Building2 },
    { name: 'Reviews', href: '/reviews', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Sidebar */}
      <aside className="w-80 border-r border-[var(--border)] flex flex-col p-10 space-y-12 bg-[var(--surface)] sticky top-0 h-screen overflow-y-auto overscroll-contain">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(147,51,234,0.3)]">
            <span className="font-bold text-black text-2xl tracking-tighter italic">S</span>
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter uppercase leading-none">Salah</h1>
            <p className="text-[10px] font-mono text-[var(--muted)] tracking-widest uppercase mt-1">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto pr-2 min-h-0">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-500 group border ${
                pathname === item.href
                  ? 'bg-[var(--surface-2)] border-[var(--accent)]/50 text-white shadow-[0_8px_30px_rgb(0,0,0,0.3)]'
                  : 'text-[var(--muted)] border-transparent hover:bg-[var(--surface-2)] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-5">
                <item.icon size={22} className={`${pathname === item.href ? 'text-[var(--accent)]' : 'group-hover:text-[var(--accent)]'} transition-colors`} />
                <span className="font-bold tracking-tight text-sm uppercase">{item.name}</span>
              </div>
              {pathname === item.href && <ChevronRight size={16} className="text-[var(--accent)]" />}
            </Link>
          ))}
        </nav>

        <div className="pt-10 border-t border-[var(--border)]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all duration-500 group border border-transparent hover:border-red-500/20"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold tracking-tight text-sm uppercase">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-16 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
