'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';

export default function BottomNav() {
  const pathname = usePathname();
  const { orders } = useApp();

  const items = [
    { label: 'Home', ico: '🏠', href: '/hni' },
    { label: 'Portfolio', ico: '📊', href: '/portfolio' },
    { label: 'Orders', ico: '📋', href: '/orders', badge: orders.length },
    { label: 'Insights', ico: '⚡', href: '/insights', badge: 4 },
    { label: 'Discover', ico: '🔍', href: '/discover' },
  ];

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-inner">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`bnav-item${pathname.startsWith(item.href) ? ' act' : ''}`}
          >
            <span className="bnav-ico">{item.ico}</span>
            {item.label}
            {item.badge ? (
              <div className="bnav-badge">{item.badge}</div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
