import { useMemo, useState } from 'react';
import { useTournament } from '../lib/store';
import { champion, roundLabel } from '../lib/bracket';
import { Bracket } from '../components/Bracket';
import { RegisterForm } from '../components/RegisterForm';
import { MatchCard } from '../components/MatchCard';
import logo from '../assets/logo.png';
import badge from '../assets/badge.jpg';
import {
  IconCalendar,
  IconUser,
  IconStar,
  IconHeart,
  IconTarget,
  IconHistory,
  IconTrophy,
  IconRegister,
} from '../components/Icons';

type Tab = 'bracket' | 'join' | 'history';

function Skeleton() {
  return (
    <div className="px" style={{ display: 'grid', gap: 14, paddingTop: 20 }}>
      <div className="skeleton" style={{ height: 200, borderRadius: '50%', width: 140, margin: '0 auto' }} />
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
      <header
        style={{
          padding: 'calc(20px + env(safe-area-inset-top)) 18px 26px',
          textAlign: 'center',
        }}
      >
        <img className="hero-badge" src={badge} alt="Lalako" />
        <div>
          <img className="hero-wordmark" src={logo} alt="LALAKO" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginTop: 10 }}>{t.name || 'LALAKO TDM CUP'}</h1>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            letterSpacing: '0.22em',
            color: 'var(--pink-soft)',
            margin: '8px 0 14px',
            fontWeight: 700,
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
              <IconCalendar size={13} /> {t.date}
            </span>
          )}
          <span className="pill pill-pending" style={{ fontSize: 12 }}>
            <IconUser size={13} /> {filledSeeds}/{t.playerCount}
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
            <IconStar size={13} /> MVP: {t.mvp}
          </div>
        )}
        <div className="muted" style={{ fontSize: 13, marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Hosted by{' '}
          <b style={{ color: 'var(--pink-soft)', fontWeight: 800 }}>{t.owner || 'Lalako'}</b>
          <IconHeart size={14} style={{ color: 'var(--pink)' }} />
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
              <span className="icon">
                <IconTarget size={32} />
              </span>
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
              <span className="icon">
                <IconHistory size={32} />
              </span>
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
                  style={{
                    padding: 16,
                    textAlign: 'center',
                    color: 'var(--gold)',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <IconTrophy size={20} /> ჩემპიონი: {players.get(champId)!.name}
                </div>
              )}
            </div>
          ))}
      </main>

      <nav className="bottom-nav">
        <button className={tab === 'bracket' ? 'active' : ''} onClick={() => setTab('bracket')}>
          <span className="icon">
            <IconTrophy size={20} />
          </span>
          ბრეკეტი
        </button>
        <button className={tab === 'join' ? 'active' : ''} onClick={() => setTab('join')}>
          <span className="icon">
            <IconRegister size={20} />
          </span>
          რეგისტრაცია
        </button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>
          <span className="icon">
            <IconHistory size={20} />
          </span>
          ისტორია
        </button>
      </nav>
    </div>
  );
}
