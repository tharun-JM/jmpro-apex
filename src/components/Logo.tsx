export default function Logo({ size = 40 }: { size?: number }) {
  const width = Math.round(size * (2000 / 925));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/jmpro_logo.svg"
      alt="JM Pro"
      width={width}
      height={size}
      style={{ display: 'block', flexShrink: 0 }}
    />
  );
}
