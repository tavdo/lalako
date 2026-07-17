import { useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { saveTournament, useTournament } from '../lib/store';
import { defaultTournament, uid, type Match, type Player, type PlayerCount, type Tournament } from '../lib/types';
import { roundLabel, sideRounds, syncBracket } from '../lib/bracket';
import { resizeAvatar } from '../lib/avatar';
import { Avatar } from '../components/Avatar';
import { StatusPill } from '../components/StatusPill';
import {
  IconSettings,
  IconInbox,
  IconUser,
  IconTarget,
  IconSwords,
  IconCheck,
  IconClose,
  IconEdit,
  IconTrash,
  IconDice,
  IconTrophy,
  IconChevronUp,
  IconChevronDown,
  IconSite,
} from '../components/Icons';
import logo from '../assets/logo.png';

const DEFAULT_PASSWORD = 'lalako2026!!';
const ADMIN_PASSWORD = import.meta.env.NEXT_PUBLIC_ADMIN_PASSWORD || DEFAULT_PASSWORD;
const SESSION_KEY = 'lalako-admin-session';

type Tab = 'settings' | 'registrations' | 'players' | 'seeding' | 'matches';

const TABS: { id: Tab; label: string; Icon: typeof IconSettings }[] = [
  { id: 'settings', label: 'პარამეტრები', Icon: IconSettings },
  { id: 'registrations', label: 'რეგისტრაციები', Icon: IconInbox },
  { id: 'players', label: 'მოთამაშეები', Icon: IconUser },
  { id: 'seeding', label: 'განაწილება', Icon: IconTarget },
  { id: 'matches', label: 'მატჩები', Icon: IconSwords },
];

function Login({ onAuth }: { onAuth: () => void }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, pass);
      onAuth();
    } else {
      setError(true);
    }
  };

  return (
    <div className="phone" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form
        className="card"
        style={{ margin: 18, padding: 24, width: '100%', display: 'grid', gap: 14, textAlign: 'center' }}
        onSubmit={submit}
      >
        <img src={logo} alt="LALAKO" style={{ width: 170, margin: '0 auto' }} />
        <h2 style={{ fontSize: 18 }}>ადმინ პანელი</h2>
        <div style={{ textAlign: 'left' }}>
          <label htmlFor="admin-pass">პაროლი</label>
          <input
            id="admin-pass"
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setError(false);
            }}
            placeholder="••••••••"
            autoFocus
          />
        </div>
        {error && (
          <div style={{ color: 'var(--red)', fontSize: 13, fontWeight: 600 }}>
            პაროლი არასწორია
          </div>
        )}
        <button className="btn-primary" type="submit">
          შესვლა
        </button>
        <Link to="/" className="muted" style={{ fontSize: 13, textDecoration: 'none' }}>
          ← საჯარო გვერდზე დაბრუნება
        </Link>
      </form>
    </div>
  );
}

export function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === ADMIN_PASSWORD,
  );
  if (!authed) return <Login onAuth={() => setAuthed(true)} />;
  return <AdminPanel onLogout={() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }} />;
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { tournament, loading, refresh } = useTournament();
  const [tab, setTab] = useState<Tab>('settings');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const toastTimer = useRef<number>();

  const showToast = (text: string, ok = true) => {
    setToast({ text, ok });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const mutate = async (fn: (t: Tournament) => Tournament, message = 'შენახულია') => {
    if (!tournament) return;
    setSaving(true);
    try {
      const next = syncBracket(fn(structuredClone(tournament)));
      await saveTournament(next, sessionStorage.getItem(SESSION_KEY) ?? '');
      await refresh();
      showToast(message);
    } catch {
      showToast('შენახვა ვერ მოხერხდა', false);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !tournament) {
    return (
      <div className="phone" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  const t = tournament;

  return (
    <div className="phone">
      <header
        className="px"
        style={{
          paddingTop: 'calc(14px + env(safe-area-inset-top))',
          paddingBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <img src={logo} alt="LALAKO" style={{ width: 88 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 14 }}>ადმინ პანელი</h2>
          <div className="muted" style={{ fontSize: 11 }}>
            {saving ? 'ინახება…' : 'მზადაა'}
          </div>
        </div>
        <Link to="/" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 14px', textDecoration: 'none', fontSize: 13 }}>
          <IconSite size={14} /> საიტი
        </Link>
        <button className="btn-ghost" style={{ padding: '0 14px', fontSize: 13 }} onClick={onLogout}>
          გასვლა
        </button>
      </header>

      <div className="px" style={{ marginBottom: 14 }}>
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 4,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {TABS.map((x) => (
            <button
              key={x.id}
              className={`btn-ghost${tab === x.id ? '' : ''}`}
              onClick={() => setTab(x.id)}
              style={{
                whiteSpace: 'nowrap',
                fontSize: 13,
                padding: '0 14px',
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: tab === x.id ? 'var(--cyan-dim)' : 'var(--card-strong)',
                color: tab === x.id ? 'var(--cyan)' : 'var(--text)',
                border: `1px solid ${tab === x.id ? 'rgba(255,77,166,0.4)' : 'var(--border-strong)'}`,
              }}
            >
              <x.Icon size={14} /> {x.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px fade-in" key={tab} style={{ display: 'grid', gap: 14 }}>
        {tab === 'settings' && <SettingsTab t={t} mutate={mutate} />}
        {tab === 'registrations' && <RegistrationsTab t={t} mutate={mutate} />}
        {tab === 'players' && <PlayersTab t={t} mutate={mutate} />}
        {tab === 'seeding' && <SeedingTab t={t} mutate={mutate} />}
        {tab === 'matches' && <MatchesTab t={t} mutate={mutate} />}
      </main>

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(24px + env(safe-area-inset-bottom))',
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.ok ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
            border: `1px solid ${toast.ok ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)'}`,
            color: toast.ok ? 'var(--green)' : 'var(--red)',
            padding: '10px 20px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            whiteSpace: 'nowrap',
          }}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

type MutateFn = (fn: (t: Tournament) => Tournament, message?: string) => Promise<void>;

/* ---------------- settings ---------------- */

function SettingsTab({ t, mutate }: { t: Tournament; mutate: MutateFn }) {
  const [form, setForm] = useState({
    name: t.name,
    date: t.date,
    format: t.format,
    owner: t.owner,
    mvp: t.mvp,
    playerCount: t.playerCount,
  });
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
      <div className="card" style={{ padding: 18, display: 'grid', gap: 12 }}>
        <div>
          <label>ტურნირის სახელი</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field-grid">
          <div>
            <label>თარიღი</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label>ფორმატი</label>
            <input value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} />
          </div>
        </div>
        <div className="field-grid">
          <div>
            <label>მფლობელი</label>
            <input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          </div>
          <div>
            <label>MVP</label>
            <input
              value={form.mvp}
              placeholder="ცარიელი = არ ჩანს"
              onChange={(e) => setForm({ ...form, mvp: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label>მოთამაშეების რაოდენობა</label>
          <select
            value={form.playerCount}
            onChange={(e) => setForm({ ...form, playerCount: Number(e.target.value) as PlayerCount })}
          >
            <option value={8}>8 მოთამაშე</option>
            <option value={16}>16 მოთამაშე</option>
            <option value={32}>32 მოთამაშე</option>
          </select>
        </div>
        <button
          className="btn-primary"
          onClick={() =>
            void mutate((cur) => ({
              ...cur,
              ...form,
              owner: form.owner.trim() || 'Lalako',
            }))
          }
        >
          შენახვა
        </button>
      </div>

      <div className="card" style={{ padding: 18, display: 'grid', gap: 10 }}>
        <h3 style={{ fontSize: 14, color: 'var(--red)' }}>საშიში ზონა</h3>
        <p className="muted" style={{ fontSize: 13, margin: 0 }}>
          განულება წაშლის ყველა მოთამაშეს, რეგისტრაციას, განაწილებას და მატჩის შედეგს.
        </p>
        {confirmReset ? (
          <div className="field-grid">
            <button
              className="btn-danger"
              onClick={() => {
                setConfirmReset(false);
                void mutate(() => defaultTournament(), 'ტურნირი განულდა');
              }}
            >
              დიახ, განულება
            </button>
            <button className="btn-ghost" onClick={() => setConfirmReset(false)}>
              გაუქმება
            </button>
          </div>
        ) : (
          <button className="btn-danger" onClick={() => setConfirmReset(true)}>
            ტურნირის განულება
          </button>
        )}
      </div>
    </>
  );
}

/* ---------------- registrations ---------------- */

function RegistrationsTab({ t, mutate }: { t: Tournament; mutate: MutateFn }) {
  if (t.registrations.length === 0) {
    return (
      <div className="card empty-state">
        <span className="icon">
          <IconInbox size={32} />
        </span>
        ჯერ არავინ დარეგისტრირდა.
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {t.registrations.map((r) => (
        <div key={r.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={r.avatar} name={r.name} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {r.name}
              {r.tag && (
                <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>
                  {' '}
                  #{r.tag}
                </span>
              )}
            </div>
            <div className="muted" style={{ fontSize: 11 }}>
              {new Date(r.registeredAt).toLocaleString('ka-GE')}
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ padding: '0 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center' }}
            onClick={() =>
              void mutate(
                (cur) => ({
                  ...cur,
                  players: [
                    ...cur.players,
                    { id: uid(), name: r.name, tag: r.tag, avatar: r.avatar },
                  ],
                  registrations: cur.registrations.filter((x) => x.id !== r.id),
                }),
                'დამტკიცდა',
              )
            }
          >
            <IconCheck size={16} />
          </button>
          <button
            className="btn-danger"
            style={{ padding: '0 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center' }}
            onClick={() =>
              void mutate(
                (cur) => ({
                  ...cur,
                  registrations: cur.registrations.filter((x) => x.id !== r.id),
                }),
                'უარყოფილია',
              )
            }
          >
            <IconClose size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- players ---------------- */

function PlayersTab({ t, mutate }: { t: Tournament; mutate: MutateFn }) {
  const [editing, setEditing] = useState<Player | null>(null);
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = (p: Player | null) => {
    setEditing(p ?? { id: '', name: '', tag: '', avatar: undefined });
    setName(p?.name ?? '');
    setTag(p?.tag ?? '');
    setAvatar(p?.avatar);
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    void mutate((cur) => {
      if (editing?.id) {
        return {
          ...cur,
          players: cur.players.map((p) =>
            p.id === editing.id ? { ...p, name: trimmed, tag: tag.trim() || undefined, avatar } : p,
          ),
        };
      }
      return {
        ...cur,
        players: [...cur.players, { id: uid(), name: trimmed, tag: tag.trim() || undefined, avatar }],
      };
    });
    setEditing(null);
  };

  return (
    <>
      {editing !== null ? (
        <div className="card" style={{ padding: 18, display: 'grid', gap: 12 }}>
          <h3 style={{ fontSize: 14 }}>{editing.id ? 'რედაქტირება' : 'ახალი მოთამაშე'}</h3>
          <div className="field-grid">
            <div>
              <label>ნიკნეიმი *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} />
            </div>
            <div>
              <label>ტეგი</label>
              <input value={tag} onChange={(e) => setTag(e.target.value)} maxLength={12} />
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void resizeAvatar(f).then(setAvatar);
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar src={avatar} name={name} size={44} />
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => fileRef.current?.click()}>
              ავატარი
            </button>
          </div>
          <div className="field-grid">
            <button className="btn-primary" onClick={save} disabled={name.trim().length < 2}>
              შენახვა
            </button>
            <button className="btn-ghost" onClick={() => setEditing(null)}>
              გაუქმება
            </button>
          </div>
        </div>
      ) : (
        <button className="btn-primary" onClick={() => startEdit(null)}>
          + მოთამაშის დამატება
        </button>
      )}

      {t.players.length === 0 ? (
        <div className="card empty-state">
          <span className="icon">
            <IconUser size={32} />
          </span>
          მოთამაშეები ჯერ არ არიან დამატებული.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {t.players.map((p) => (
            <div key={p.id} className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar src={p.avatar} name={p.name} size={38} />
              <div style={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: 14 }}>
                {p.name}
                {p.tag && (
                  <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>
                    {' '}
                    #{p.tag}
                  </span>
                )}
              </div>
              <button
                className="btn-ghost"
                style={{ padding: '0 12px', display: 'inline-flex', alignItems: 'center' }}
                onClick={() => startEdit(p)}
              >
                <IconEdit size={16} />
              </button>
              <button
                className="btn-danger"
                style={{ padding: '0 12px', display: 'inline-flex', alignItems: 'center' }}
                onClick={() =>
                  void mutate(
                    (cur) => ({
                      ...cur,
                      players: cur.players.filter((x) => x.id !== p.id),
                      seeds: cur.seeds.map((s) => (s === p.id ? null : s)),
                    }),
                    'წაიშალა',
                  )
                }
              >
                <IconTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ---------------- seeding ---------------- */

function SeedingTab({ t, mutate }: { t: Tournament; mutate: MutateFn }) {
  const [seeds, setSeeds] = useState<(string | null)[]>(() => [...t.seeds]);
  const half = t.playerCount / 2;

  const used = new Set(seeds.filter(Boolean));

  const setSeed = (i: number, v: string) => {
    const next = [...seeds];
    next[i] = v || null;
    setSeeds(next);
  };

  const renderSlot = (i: number) => (
    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        className="muted"
        style={{ width: 26, fontSize: 12, fontWeight: 700, textAlign: 'right', flexShrink: 0 }}
      >
        {i + 1}.
      </span>
      <select value={seeds[i] ?? ''} onChange={(e) => setSeed(i, e.target.value)}>
        <option value="">— ცარიელი (bye) —</option>
        {t.players.map((p) => (
          <option key={p.id} value={p.id} disabled={used.has(p.id) && seeds[i] !== p.id}>
            {p.name}
            {p.tag ? ` #${p.tag}` : ''}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      {t.players.length === 0 && (
        <div className="card empty-state">
          <span className="icon">
            <IconTarget size={32} />
          </span>
          ჯერ დაამატეთ მოთამაშეები „მოთამაშეების“ ტაბში.
        </div>
      )}
      <div className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
        <h3 style={{ fontSize: 13, color: 'var(--cyan)' }}>მარცხენა მხარე</h3>
        {Array.from({ length: half }, (_, i) => renderSlot(i))}
      </div>
      <div className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
        <h3 style={{ fontSize: 13, color: 'var(--cyan)' }}>მარჯვენა მხარე</h3>
        {Array.from({ length: half }, (_, i) => renderSlot(half + i))}
      </div>
      <div className="field-grid">
        <button
          className="btn-primary"
          onClick={() => void mutate((cur) => ({ ...cur, seeds }), 'განაწილება შენახულია')}
        >
          შენახვა
        </button>
        <button
          className="btn-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          onClick={() => {
            const shuffled = [...t.players].sort(() => Math.random() - 0.5);
            const next: (string | null)[] = Array(t.playerCount).fill(null);
            shuffled.slice(0, t.playerCount).forEach((p, i) => (next[i] = p.id));
            setSeeds(next);
          }}
        >
          <IconDice size={16} /> შემთხვევით
        </button>
      </div>
    </>
  );
}

/* ---------------- matches ---------------- */

function MatchesTab({ t, mutate }: { t: Tournament; mutate: MutateFn }) {
  const players = useMemo(() => new Map(t.players.map((p) => [p.id, p])), [t.players]);
  const rounds = sideRounds(t.playerCount);
  const [open, setOpen] = useState<string | null>(null);

  const sections: { title: ReactNode; key: string; matches: Match[] }[] = [];
  for (let r = 1; r <= rounds; r++) {
    sections.push({
      key: `L-${r}`,
      title: `${roundLabel(r, t.playerCount)} · მარცხენა`,
      matches: t.matches.filter((m) => m.side === 'left' && m.round === r),
    });
    sections.push({
      key: `R-${r}`,
      title: `${roundLabel(r, t.playerCount)} · მარჯვენა`,
      matches: t.matches.filter((m) => m.side === 'right' && m.round === r),
    });
  }
  sections.push({
    key: 'F',
    title: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <IconTrophy size={13} /> ფინალი
      </span>
    ),
    matches: t.matches.filter((m) => m.side === 'final'),
  });

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {sections.map((s) => (
        <section key={s.key}>
          <h3 style={{ fontSize: 12, color: 'var(--cyan)', margin: '0 2px 8px', textTransform: 'uppercase' }}>
            {s.title}
          </h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {s.matches
              .sort((a, b) => a.position - b.position)
              .map((m) => (
                <MatchEditor
                  key={m.id}
                  match={m}
                  players={players}
                  open={open === m.id}
                  onToggle={() => setOpen(open === m.id ? null : m.id)}
                  mutate={mutate}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function MatchEditor({
  match,
  players,
  open,
  onToggle,
  mutate,
}: {
  match: Match;
  players: Map<string, Player>;
  open: boolean;
  onToggle: () => void;
  mutate: MutateFn;
}) {
  const p1 = match.player1Id ? players.get(match.player1Id) : null;
  const p2 = match.player2Id ? players.get(match.player2Id) : null;
  const [form, setForm] = useState({
    score1: match.score1,
    score2: match.score2,
    kills1: match.kills1,
    kills2: match.kills2,
    status: match.status,
    winnerId: match.winnerId ?? '',
    breakdown: match.breakdown ?? '',
  });

  const save = () =>
    void mutate((cur) => ({
      ...cur,
      matches: cur.matches.map((m) =>
        m.id === match.id
          ? {
              ...m,
              score1: form.score1,
              score2: form.score2,
              kills1: form.kills1,
              kills2: form.kills2,
              status: form.status,
              winnerId: form.winnerId || null,
              breakdown: form.breakdown.trim() || undefined,
            }
          : m,
      ),
    }));

  const num = (v: string) => Math.max(0, Number(v) || 0);

  return (
    <div className="card" style={{ padding: 12 }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'transparent',
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 700,
          minHeight: 44,
          textAlign: 'left',
        }}
      >
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {p1?.name ?? 'TBD'} <span className="muted">vs</span> {p2?.name ?? 'TBD'}
        </span>
        <StatusPill status={match.status} />
        <span className="muted" style={{ display: 'inline-flex' }}>
          {open ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </span>
      </button>

      {open && (
        <div className="fade-in" style={{ display: 'grid', gap: 10, paddingTop: 10 }}>
          <div className="field-grid">
            <div>
              <label>{p1?.name ?? 'მოთამაშე 1'} — ქულა</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={form.score1}
                onChange={(e) => setForm({ ...form, score1: num(e.target.value) })}
              />
            </div>
            <div>
              <label>{p2?.name ?? 'მოთამაშე 2'} — ქულა</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={form.score2}
                onChange={(e) => setForm({ ...form, score2: num(e.target.value) })}
              />
            </div>
          </div>
          <div className="field-grid">
            <div>
              <label>კილები 1</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={form.kills1}
                onChange={(e) => setForm({ ...form, kills1: num(e.target.value) })}
              />
            </div>
            <div>
              <label>კილები 2</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={form.kills2}
                onChange={(e) => setForm({ ...form, kills2: num(e.target.value) })}
              />
            </div>
          </div>
          <div className="field-grid">
            <div>
              <label>სტატუსი</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Match['status'] })}
              >
                <option value="pending">მოლოდინში</option>
                <option value="live">მიმდინარე</option>
                <option value="done">დასრულებული</option>
              </select>
            </div>
            <div>
              <label>გამარჯვებული</label>
              <select
                value={form.winnerId}
                onChange={(e) => setForm({ ...form, winnerId: e.target.value })}
              >
                <option value="">—</option>
                {p1 && <option value={p1.id}>{p1.name}</option>}
                {p2 && <option value={p2.id}>{p2.name}</option>}
              </select>
            </div>
          </div>
          <div>
            <label>შენიშვნები / score breakdown</label>
            <textarea
              rows={2}
              value={form.breakdown}
              onChange={(e) => setForm({ ...form, breakdown: e.target.value })}
              placeholder="მაგ. რაუნდები: 2-1, საუკეთესო კილი…"
            />
          </div>
          <button className="btn-primary" onClick={save}>
            შენახვა
          </button>
        </div>
      )}
    </div>
  );
}
