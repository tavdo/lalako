export function Avatar({
  src,
  name,
  size = 36,
}: {
  src?: string;
  name?: string;
  size?: number;
}) {
  const initial = name?.trim().charAt(0).toUpperCase() || '?';
  return (
    <span className="avatar" style={{ width: size, height: size }}>
      {src ? <img src={src} alt={name ?? ''} /> : initial}
    </span>
  );
}
