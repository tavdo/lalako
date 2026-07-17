import { useMemo, useState } from 'react';
import type { Tournament } from '../lib/types';
import { roundLabel, sideRounds, champion } from '../lib/bracket';
import { MatchCard } from './MatchCard';
import { Avatar } from './Avatar';
import { Confetti } from './Confetti';
import { IconTrophy } from './Icons';

type Tab = 'left' | 'final' | 'right';

export function Bracket({ t }: { t: Tournament }) {
  const [tab, setTab] = useState<Tab>('left');
  const players = useMemo(() => new Map(t.players.map((p) => [p.id, p])), [t.players]);
  const rounds = sideRounds(t.playerCount);
  const champId = champion(t);
  const champ = champId ? players.get(champId) : null;
  const final = t.matches.find((m) => m.id === 'F');

  const sideMatches = (side: 'left' | 'right', round: number) =>
    t.matches
      .filter((m) => m.side === side && m.round === round)
      .sort((a, b) => a.position - b.position);

  return (
    <div>
      <div className="segmented" style={{ margin: '0 0 16px' }}>
        <button className={tab === 'left' ? 'active' : ''} onClick={() => setTab('left')}>
          მარცხენა
        </button>
        <button
          className={tab === 'final' ? 'active gold' : ''}
          onClick={() => setTab('final')}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <IconTrophy size={14} /> ფინალი
        </button>
        <button className={tab === 'right' ? 'active' : ''} onClick={() => setTab('right')}>
          მარჯვენა
        </button>
      </div>

      {tab !== 'final' ? (
        <div key={tab} className="fade-in" style={{ display: 'grid', gap: 20 }}>
          {Array.from({ length: rounds }, (_, i) => i + 1).map((r) => (
            <section key={r}>
              <h3
                style={{
                  fontSize: 12,
                  color: 'var(--cyan)',
                  margin: '0 2px 10px',
                  textTransform: 'uppercase',
                }}
              >
                {roundLabel(r, t.playerCount)}
              </h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {sideMatches(tab, r).map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    players={players}
                    label={`მატჩი ${m.position + 1}`}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div key="final" className="fade-in" style={{ position: 'relative' }}>
          {champ && <Confetti />}
          <div style={{ textAlign: 'center', margin: '6px 0 18px' }}>
            <div
              style={{
                color: 'var(--gold)',
                filter: 'drop-shadow(0 0 18px rgba(255,211,106,0.55))',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <IconTrophy size={48} />
            </div>
            {champ ? (
              <div className="fade-in" style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <Avatar src={champ.avatar} name={champ.name} size={64} />
                </div>
                <h2 style={{ fontSize: 22, color: 'var(--gold)' }}>{champ.name}</h2>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                  ტურნირის ჩემპიონი
                </div>
              </div>
            ) : (
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                გრანდ ფინალი
              </div>
            )}
          </div>
          {final && (
            <MatchCard match={final} players={players} label={roundLabel(final.round, t.playerCount)} />
          )}
        </div>
      )}
    </div>
  );
}
