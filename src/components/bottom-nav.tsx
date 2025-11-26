'use client';

import { Home, BookOpen, TrendingUp, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/diary', label: 'Diário', icon: BookOpen },
  { href: '/progress', label: 'Progresso', icon: TrendingUp },
  { href: '/profile', label: 'Perfil', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
