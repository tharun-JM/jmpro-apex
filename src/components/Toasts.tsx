'use client';

import { useApp } from '@/lib/store';

export default function Toasts() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast"
          style={t.isAlert ? { borderColor: 'rgba(245,158,11,0.35)' } : undefined}
        >
          <div className="t-ico">{t.ico}</div>
          <div className="t-body">
            <div className="t-title">{t.title}</div>
            <div className="t-msg">{t.msg}</div>
            <div className="t-time">{t.time}</div>
          </div>
          <button className="t-x" onClick={() => dismissToast(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
