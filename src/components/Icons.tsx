import type { CSSProperties, ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

function Base({ size = 18, children, className, style, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconTrophy({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path
        d="M8 4h8v2.2c0 2.4-1.5 4.5-3.6 5.3L12 12l-.4-.5C9.5 10.7 8 8.6 8 6.2V4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M8 5.5H5.8A2.8 2.8 0 0 0 8.6 8.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16 5.5h2.2A2.8 2.8 0 0 1 15.4 8.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10 14.5h4v1.8c0 1.1-.9 2-2 2s-2-.9-2-2v-1.8z" fill="currentColor" />
      <path d="M8.5 20.5h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 18.3v2.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Base>
  );
}

export function IconRegister({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path
        d="M7 3.5h7.2L17.5 7v13.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M14 3.5V7h3.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 11h6M9 14.5h6M9 18h3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Base>
  );
}

export function IconHistory({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path
        d="M8 4h9.5a1 1 0 0 1 1 1v14.5l-2.2-1.4-2.2 1.4-2.2-1.4L10 20.5 7.8 19.1 5.5 20.5V5a1 1 0 0 1 1-1H8z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M10 9h6M10 12.5h6M10 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Base>
  );
}

export function IconTarget({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </Base>
  );
}

export function IconUser({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 19c1.2-3.2 3.4-4.8 6.5-4.8S17.3 15.8 18.5 19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Base>
  );
}

export function IconCalendar({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Base>
  );
}

export function IconStar({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path
        d="M12 3.5l2.2 4.6 5 .7-3.6 3.5.9 5.1L12 15l-4.5 2.4.9-5.1L4.8 8.8l5-.7L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.25"
      />
    </Base>
  );
}

export function IconHeart({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path
        d="M12 20s-6.5-4.1-8.6-7.4C1.6 9.8 3 6.5 6.1 6c1.7-.3 3.2.5 3.9 1.7C10.7 6.5 12.2 5.7 13.9 6c3.1.5 4.5 3.8 2.7 6.6C18.5 15.9 12 20 12 20z"
        fill="currentColor"
      />
    </Base>
  );
}

export function IconCrown({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path
        d="M4.5 16.5h15l-1.2-8.2-3.8 3.4L12 6.5l-2.5 5.2-3.8-3.4L4.5 16.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M5 18.5h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Base>
  );
}

export function IconCheck({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconCheckCircle({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 12.2l2.8 2.8L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconClose({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Base>
  );
}

export function IconEdit({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path
        d="M14.5 5.5l4 4L9 19H5v-4L14.5 5.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12.8 7.2l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Base>
  );
}

export function IconTrash({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path d="M5 8h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9.5 8V5.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M7 8l.8 11.2a1 1 0 0 0 1 .8h6.4a1 1 0 0 0 1-.8L17 8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </Base>
  );
}

export function IconDice({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" />
      <circle cx="15" cy="9" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      <circle cx="9" cy="15" r="1.2" fill="currentColor" />
      <circle cx="15" cy="15" r="1.2" fill="currentColor" />
    </Base>
  );
}

export function IconSettings({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M5.8 18.2l1.6-1.6M16.6 7.4l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Base>
  );
}

export function IconInbox({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path
        d="M4 13l2.2-7.2A2 2 0 0 1 8.1 4.5h7.8a2 2 0 0 1 1.9 1.3L20 13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M4 13h4.2l1.3 2h5l1.3-2H20v5.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V13z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </Base>
  );
}

export function IconSwords({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path d="M5 4.5l7 7M4.5 10.5l6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9.5 13.5L7 16l-1.5-.5L4.5 17 7 19.5l1.5-1.5-.5-1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M19 4.5l-7 7M19.5 10.5l-6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14.5 13.5L17 16l1.5-.5L19.5 17 17 19.5l-1.5-1.5.5-1.5-2.5-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </Base>
  );
}

export function IconChevronUp({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path d="M6 14.5l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconChevronDown({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <path d="M6 9.5l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

export function IconSite({ size = 18, ...p }: IconProps) {
  return (
    <Base size={size} {...p}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 12h15M12 4.5c2.2 2.4 3.3 4.9 3.3 7.5S14.2 17.1 12 19.5c-2.2-2.4-3.3-4.9-3.3-7.5S9.8 6.9 12 4.5z" stroke="currentColor" strokeWidth="1.6" />
    </Base>
  );
}
