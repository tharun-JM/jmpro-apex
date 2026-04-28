'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import { useApp } from '@/lib/store';

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleAI } = useApp();

  const navItems = [
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Discover', href: '/discover' },
    { label: 'Insights', href: '/insights' },
    { label: 'Markets', href: '/markets' },
    { label: 'Orders', href: '/orders' },
  ];

  return (
    <div className="topbar">
      <div className="tl">
        <Logo size={28} />
        <div className="logo-text" style={{ fontSize: 16, fontWeight: 700 }}>
          JM<span>Pro</span>
        </div>
      </div>
      <nav className="tnav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname.startsWith(item.href) ? 'act' : ''}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="tr">
        <div className="nb" onClick={() => router.push('/insights')}>
          🔔<div className="nb-dot" />
        </div>
        <div className="av">MT</div>
      </div>
    </div>
  );
}
