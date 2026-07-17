import type { MatchStatus } from '../lib/types';

const LABELS: Record<MatchStatus, string> = {
  pending: 'მოლოდინში',
  live: 'მიმდინარე',
  done: 'დასრულებული',
};

export function StatusPill({ status }: { status: MatchStatus }) {
  return (
    <span className={`pill pill-${status}`}>
      {status === 'live' && <span className="dot dot-pulse" />}
      {status === 'done' ? '✓ ' : ''}
      {LABELS[status]}
    </span>
  );
}
