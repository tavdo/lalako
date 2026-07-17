import type { Match, Player } from '../lib/types';
import { Avatar } from './Avatar';
import { StatusPill } from './StatusPill';

function Row({
  player,
  score,
  kills,
  winner,
  done,
}: {
  player: Player | null;
  score: number;
  kills: number;
  winner: boolean;
  done: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 12,
        background: winner ? 'var(--gold-dim)' : 'transparent',
        opacity: done && !winner && player ? 0.55 : 1,
      }}
    >
      <Avatar src={player?.avatar} name={player?.name} size={34} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: winner ? 'var(--gold)' : player ? 'var(--text)' : 'var(--muted)',
          }}
        >
          {player ? player.name : 'TBD'}
          {winner && ' 👑'}
        </div>
        {player?.tag && (
          <div className="muted" style={{ fontSize: 11 }}>
            #{player.tag}
          </div>
        )}
      </div>
      {player && (
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              color: winner ? 'var(--gold)' : 'var(--text)',
            }}
          >
            {score}
          </div>
          <div className="muted" style={{ fontSize: 10 }}>
            {kills} kill
          </div>
        </div>
      )}
    </div>
  );
}

export function MatchCard({
  match,
  players,
  label,
}: {
  match: Match;
  players: Map<string, Player>;
  label?: string;
}) {
  const p1 = match.player1Id ? players.get(match.player1Id) ?? null : null;
  const p2 = match.player2Id ? players.get(match.player2Id) ?? null : null;
  const done = match.status === 'done';
  return (
    <div
      className={`card${done && match.winnerId ? ' winner-glow' : ''}`}
      style={{ padding: '10px 6px 8px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 12px 8px',
        }}
      >
        <span className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>
          {label}
        </span>
        <StatusPill status={match.status} />
      </div>
      <Row
        player={p1}
        score={match.score1}
        kills={match.kills1}
        winner={!!match.winnerId && match.winnerId === match.player1Id}
        done={done}
      />
      <div style={{ height: 1, background: 'var(--border)', margin: '2px 12px' }} />
      <Row
        player={p2}
        score={match.score2}
        kills={match.kills2}
        winner={!!match.winnerId && match.winnerId === match.player2Id}
        done={done}
      />
      {match.breakdown && done && (
        <div
          className="muted"
          style={{ fontSize: 12, padding: '8px 12px 4px', borderTop: '1px solid var(--border)', marginTop: 6 }}
        >
          {match.breakdown}
        </div>
      )}
    </div>
  );
}
