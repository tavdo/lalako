import { useMemo, useState } from 'react';
import { useTournament } from '../lib/store';
import { champion, roundLabel } from '../lib/bracket';
import { Bracket } from '../components/Bracket';
import { RegisterForm } from '../components/RegisterForm';
import { MatchCard } from '../components/MatchCard';
import logo from '../assets/logo.png';

type Tab = 'bracket' | 'join' | 'history';

function Skeleton() {
  return (
    <div className="px" style={{ display: 'grid', gap: 14, paddingTop: 20 }}>
      <div className="skeleton" style={{ height: 180 }} />
      <div className="skeleton" style={{ height: 48, borderRadius: 999 }} />
      <div className="skeleton" style={{ height: 120 }} />
      <div className="skeleton" style={{ height: 120 }} />
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
        <div className="spinner" />
      </div>
    </div>
  );
}

export function PublicPage() {
  const { tournament: t, loading, live, remote, error, refresh } = useTournament();
  const [tab, setTab] = useState<Tab>('bracket');

  const players = useMemo(
    () => new Map((t?.players ?? []).map((p) => [p.id, p])),
    [t],
  );
  const doneMatches = useMemo(
    () =>
      (t?.matches ?? []).filter(
        (m) => m.status === 'done' && m.player1Id && m.player2Id,
      ),
    [t],
  );
  const champId = t ? champion(t) : null;

  if (loading || !t) {
    return (
      <div className="phone">
        <Skeleton />
      </div>
    );
  }

  const filledSeeds = t.seeds.filter(Boolean).length;

  return (
    <div className="phone">
      {/* hero */}
      <header
        style={{
          padding: 'calc(18px + env(safe-area-inset-top)) 18px 22px',
          textAlign: 'center',
          background:
            'linear-gradient(180deg, rgba(34,211,238,0.07), transparent 80%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <img
            src={logo}
            alt="LALAKO"
            style={{ width: 210, filter: 'drop-shadow(0 10px 28px rgba(255,120,20,0.25))' }}
          />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>{t.name || 'LALAKO TDM CUP'}</h1>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 11,
            letterSpacing: '0.35em',
            color: 'var(--cyan)',
            margin: '8px 0 12px',
          }}
        >
          TOURNAMENT BRACKET
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span className="pill pill-pending" style={{ fontSize: 12 }}>
            {t.format || 'TDM · 1v1'}
          </span>
          {t.date && (
            <span className="pill pill-pending" style={{ fontSize: 12 }}>
              📅 {t.date}
            </span>
          )}
          <span className="pill pill-pending" style={{ fontSize: 12 }}>
            👤 {filledSeeds}/{t.playerCount}
          </span>
          {remote && (
            <span className="pill pill-live" style={{ fontSize: 12 }}>
              <span className={`dot${live ? ' dot-pulse' : ''}`} /> Live
            </span>
          )}
        </div>
        {t.mvp && (
          <div
            className="pill"
            style={{
              marginTop: 12,
              background: 'var(--gold-dim)',
              color: 'var(--gold)',
              fontSize: 12,
            }}
          >
            ⭐ MVP: {t.mvp}
          </div>
        )}
        <div className="muted" style={{ fontSize: 12, marginTop: 12 }}>
          Hosted by <b style={{ color: 'var(--gold)' }}>{t.owner || 'Lalako'}</b>
        </div>
      </header>

      {error && (
        <div className="px" style={{ marginBottom: 12 }}>
          <div
            className="card"
            style={{ padding: 14, color: 'var(--red)', fontSize: 13, textAlign: 'center' }}
          >
            {error}{' '}
            <button
              className="btn-ghost"
              style={{ marginTop: 8, width: '100%' }}
              onClick={() => void refresh()}
            >
              თავიდან ცდა
            </button>
          </div>
        </div>
      )}

      <main className="px fade-in" key={tab}>
        {tab === 'bracket' &&
          (filledSeeds === 0 ? (
            <div className="card empty-state">
              <span className="icon">🎯</span>
              ბრეკეტი ჯერ ცარიელია — ადმინი მალე განათავსებს მოთამაშეებს.
            </div>
          ) : (
            <Bracket t={t} />
          ))}

        {tab === 'join' && (
          <div style={{ display: 'grid', gap: 14 }}>
            <RegisterForm tournament={t} onDone={() => void refresh()} />
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 13, marginBottom: 10 }}>
                რეგისტრირებულები ({t.registrations.length})
              </h3>
              {t.registrations.length === 0 ? (
                <div className="muted" style={{ fontSize: 13 }}>
                  ჯერ არავინ დარეგისტრირდა — იყავი პირველი!
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 8 }}>
                  {t.registrations.map((r) => (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="avatar" style={{ width: 30, height: 30, fontSize: 12 }}>
                        {r.avatar ? <img src={r.avatar} alt={r.name} /> : r.name.charAt(0).toUpperCase()}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</span>
                      {r.tag && (
                        <span className="muted" style={{ fontSize: 12 }}>
                          #{r.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'history' &&
          (doneMatches.length === 0 ? (
            <div className="card empty-state">
              <span className="icon">📜</span>
              დასრულებული მატჩები ჯერ არ არის.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {doneMatches.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  players={players}
                  label={roundLabel(m.round, t.playerCount)}
                />
              ))}
              {champId && players.get(champId) && (
                <div
                  className="card winner-glow"
                  style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 800 }}
                >
                  🏆 ჩემპიონი: {players.get(champId)!.name}
                </div>
              )}
            </div>
          ))}
      </main>

      <nav className="bottom-nav">
        <button className={tab === 'bracket' ? 'active' : ''} onClick={() => setTab('bracket')}>
          <span className="icon">🏆</span>
          ბრეკეტი
        </button>
        <button className={tab === 'join' ? 'active' : ''} onClick={() => setTab('join')}>
          <span className="icon">📝</span>
          რეგისტრაცია
        </button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>
          <span className="icon">📜</span>
          ისტორია
        </button>
      </nav>
    </div>
  );
}
