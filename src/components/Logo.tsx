export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="logo-mark" style={{ width: size, height: size, borderRadius: size * 0.25, overflow: 'hidden', flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#C8A951" />
        <text x="20" y="26" fontFamily="Georgia,serif" fontWeight="900" fontSize="17" fill="#0C1228" textAnchor="middle" letterSpacing="-1">JM</text>
      </svg>
    </div>
  );
}
