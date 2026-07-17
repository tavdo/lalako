export type MatchStatus = 'pending' | 'live' | 'done';
export type BracketSide = 'left' | 'right' | 'final';
export type PlayerCount = 8 | 16 | 32;

export interface Player {
  id: string;
  name: string;
  tag?: string;
  avatar?: string; // data URL (resized JPEG)
}

export interface Registration {
  id: string;
  name: string;
  tag?: string;
  avatar?: string;
  registeredAt: string; // ISO
}

export interface Match {
  id: string; // e.g. "L-1-0", "R-2-1", "F"
  round: number; // 1-based within side; final has its own round number
  position: number; // 0-based within round
  side: BracketSide;
  player1Id: string | null;
  player2Id: string | null;
  score1: number;
  score2: number;
  kills1: number;
  kills2: number;
  winnerId: string | null;
  status: MatchStatus;
  breakdown?: string; // admin notes / score breakdown
}

export interface Tournament {
  name: string;
  date: string;
  format: string;
  owner: string;
  playerCount: PlayerCount;
  mvp: string;
  players: Player[];
  registrations: Registration[];
  seeds: (string | null)[]; // length = playerCount, playerId or null (bye)
  matches: Match[];
}

export function defaultTournament(): Tournament {
  return {
    name: 'LALAKO TDM CUP',
    date: '',
    format: 'TDM · 1v1',
    owner: 'Lalako',
    playerCount: 8,
    mvp: '',
    players: [],
    registrations: [],
    seeds: Array(8).fill(null),
    matches: [],
  };
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
