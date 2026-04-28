export function fmt(v: number): string {
  if (v >= 10000000) return (v / 10000000).toFixed(2) + ' Cr';
  if (v >= 100000) return (v / 100000).toFixed(2) + ' L';
  return v.toLocaleString('en-IN');
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function formatTime(date: Date): string {
  return (
    date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) +
    ', ' +
    date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  );
}
