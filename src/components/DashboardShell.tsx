'use client';

import { LayoutDashboard, Briefcase, MessageSquare, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  if (!mounted) return null;
  if (pathname === '/login') return <>{children}</>;

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Reviews', href: '/reviews', icon: MessageSquare },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 flex flex-col p-8 space-y-10 bg-white/[0.02] backdrop-blur-3xl sticky top-0 h-screen">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]">
            <span className="font-bold text-black text-xl">S</span>
          </div>
          <span className="font-display font-black text-2xl tracking-tighter">Admin.</span>
        </div>

        <nav className="flex-grow space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group ${
                pathname === item.href
                  ? 'bg-white/10 text-white shadow-lg shadow-black/50'
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={22} className={`${pathname === item.href ? 'text-accent' : 'group-hover:text-accent'} transition-colors`} />
              <span className="font-semibold tracking-tight">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all duration-500 group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold tracking-tight">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
