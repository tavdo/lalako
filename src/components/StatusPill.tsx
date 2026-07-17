import type { MatchStatus } from '../lib/types';
import { IconCheck } from './Icons';

const LABELS: Record<MatchStatus, string> = {
  pending: 'მოლოდინში',
  live: 'მიმდინარე',
  done: 'დასრულებული',
};

export function StatusPill({ status }: { status: MatchStatus }) {
  return (
    <span className={`pill pill-${status}`}>
      {status === 'live' && <span className="dot dot-pulse" />}
      {status === 'done' && <IconCheck size={12} />}
      {LABELS[status]}
    </span>
  );
}
