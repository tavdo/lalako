import { useRef, useState, type FormEvent } from 'react';
import { registerPlayer } from '../lib/store';
import { resizeAvatar } from '../lib/avatar';
import type { Tournament } from '../lib/types';
import { Avatar } from './Avatar';
import { IconCheckCircle } from './Icons';

export function RegisterForm({
  tournament,
  onDone,
}: {
  tournament: Tournament;
  onDone: () => void;
}) {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    try {
      setAvatar(await resizeAvatar(file));
    } catch {
      setError('სურათის დამუშავება ვერ მოხერხდა');
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 24) {
      setError('ნიკნეიმი უნდა იყოს 2–24 სიმბოლო');
      return;
    }
    const taken = [...tournament.players, ...tournament.registrations].some(
      (p) => p.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (taken) {
      setError('ეს ნიკნეიმი უკვე დაკავებულია');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await registerPlayer(trimmed, tag, avatar);
      setSuccess(true);
      onDone();
    } catch (err) {
      setError(
        err instanceof Error && err.message === 'duplicate'
          ? 'ეს ნიკნეიმი უკვე დაკავებულია'
          : 'რეგისტრაცია ვერ მოხერხდა, სცადეთ თავიდან',
      );
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <div className="card fade-in" style={{ padding: 26, textAlign: 'center' }}>
        <div style={{ color: 'var(--green)', display: 'flex', justifyContent: 'center' }}>
          <IconCheckCircle size={42} />
        </div>
        <h3 style={{ fontSize: 17, margin: '12px 0 8px' }}>დარეგისტრირდით!</h3>
        <p className="muted" style={{ fontSize: 14, margin: 0 }}>
          ადმინი გირჩევთ ბრეკეტში.
        </p>
      </div>
    );
  }

  return (
    <form className="card fade-in" style={{ padding: 18, display: 'grid', gap: 14 }} onSubmit={submit}>
      <h3 style={{ fontSize: 15 }}>შემოუერთდი ტურნირს</h3>
      <div>
        <label htmlFor="reg-name">ნიკნეიმი *</label>
        <input
          id="reg-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="მაგ. ShadowKa"
          maxLength={24}
          required
        />
      </div>
      <div>
        <label htmlFor="reg-tag">ტეგი (არასავალდებულო)</label>
        <input
          id="reg-tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="მაგ. GEO"
          maxLength={12}
        />
      </div>
      <div>
        <label>ავატარი (არასავალდებულო)</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={avatar ?? undefined} name={name} size={48} />
          <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => fileRef.current?.click()}>
            {avatar ? 'სურათის შეცვლა' : 'სურათის ატვირთვა'}
          </button>
        </div>
      </div>
      {error && (
        <div style={{ color: 'var(--red)', fontSize: 13, fontWeight: 600 }}>{error}</div>
      )}
      <button className="btn-primary" type="submit" disabled={busy}>
        {busy ? 'იგზავნება…' : 'რეგისტრაცია'}
      </button>
    </form>
  );
}
