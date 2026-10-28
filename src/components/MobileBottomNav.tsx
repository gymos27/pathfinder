'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Map, Sparkles, UserCheck } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/domains', label: 'Domains', icon: BookOpen },
    { href: '/my-path', label: 'My Path', icon: Map },
    { href: '/ai-tools', label: 'AI Suite', icon: Sparkles },
    { href: '/onboarding', label: 'Profile', icon: UserCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-2xl px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-white/15 text-white scale-110 border border-white/20' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-mono">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
