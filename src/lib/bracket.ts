import type { BracketSide, Match, Tournament } from './types';

/** Number of rounds on each side (final excluded). 8 → 2, 16 → 3, 32 → 4 */
export function sideRounds(playerCount: number): number {
  return Math.log2(playerCount) - 1;
}

export function matchId(side: BracketSide, round: number, position: number): string {
  return side === 'final' ? 'F' : `${side === 'left' ? 'L' : 'R'}-${round}-${position}`;
}

function emptyMatch(side: BracketSide, round: number, position: number): Match {
  return {
    id: matchId(side, round, position),
    round,
    position,
    side,
    player1Id: null,
    player2Id: null,
    score1: 0,
    score2: 0,
    kills1: 0,
    kills2: 0,
    winnerId: null,
    status: 'pending',
  };
}

/** Build the full empty match list for a bracket size. */
export function generateMatches(playerCount: number): Match[] {
  const rounds = sideRounds(playerCount);
  const matches: Match[] = [];
  for (const side of ['left', 'right'] as const) {
    for (let r = 1; r <= rounds; r++) {
      const count = playerCount / 2 / Math.pow(2, r);
      for (let p = 0; p < count; p++) matches.push(emptyMatch(side, r, p));
    }
  }
  matches.push(emptyMatch('final', rounds + 1, 0));
  return matches;
}

/**
 * Ensure matches exist for the current playerCount, preserving scores of
 * matches whose ids still exist, then propagate seeds/winners through the tree.
 */
export function syncBracket(t: Tournament): Tournament {
  const fresh = generateMatches(t.playerCount);
  const existing = new Map(t.matches.map((m) => [m.id, m]));
  const matches = fresh.map((m) => existing.get(m.id) ?? m);
  const seeds = [...t.seeds];
  seeds.length = t.playerCount;
  for (let i = 0; i < seeds.length; i++) if (seeds[i] === undefined) seeds[i] = null;
  return propagateWinners({ ...t, matches, seeds });
}

/**
 * Fill player slots from seeds (round 1) and from winners of previous rounds.
 * A branch counts as "decisively empty" when its whole subtree has no players,
 * which enables bye auto-advance without mistaking an unfinished match for a bye.
 */
export function propagateWinners(t: Tournament): Tournament {
  const rounds = sideRounds(t.playerCount);
  const byId = new Map(t.matches.map((m) => [m.id, { ...m }]));
  // emptyBranch[matchId] = true when no player can ever come out of that match
  const emptyBranch = new Map<string, boolean>();

  const resolve = (m: Match): void => {
    if (m.side !== 'final' && m.round === 1) {
      const half = t.playerCount / 2;
      const base = (m.side === 'left' ? 0 : half) + m.position * 2;
      m.player1Id = t.seeds[base] ?? null;
      m.player2Id = t.seeds[base + 1] ?? null;
    } else {
      const srcSide = m.side;
      const srcRound = m.round - 1;
      const feed = (slot: 0 | 1): { player: string | null; empty: boolean } => {
        const src =
          m.side === 'final'
            ? byId.get(matchId(slot === 0 ? 'left' : 'right', rounds, 0))!
            : byId.get(matchId(srcSide, srcRound, m.position * 2 + slot))!;
        return { player: src.winnerId, empty: emptyBranch.get(src.id) ?? false };
      };
      const f1 = feed(0);
      const f2 = feed(1);
      m.player1Id = f1.player;
      m.player2Id = f2.player;
      // clear stale manual winner if its player vanished from the slot
      if (m.winnerId && m.winnerId !== m.player1Id && m.winnerId !== m.player2Id) {
        m.winnerId = null;
        if (m.status === 'done') m.status = 'pending';
      }
      // bye: one slot filled, the other branch can never produce a player
      if (m.player1Id && !m.player2Id && f2.empty && !m.winnerId) {
        m.winnerId = m.player1Id;
        m.status = 'done';
      } else if (m.player2Id && !m.player1Id && f1.empty && !m.winnerId) {
        m.winnerId = m.player2Id;
        m.status = 'done';
      }
    }

    // round-1 byes (seed slot left empty)
    if (m.side !== 'final' && m.round === 1) {
      if (m.winnerId && m.winnerId !== m.player1Id && m.winnerId !== m.player2Id) {
        m.winnerId = null;
        if (m.status === 'done') m.status = 'pending';
      }
      if (m.player1Id && !m.player2Id) {
        m.winnerId = m.player1Id;
        m.status = 'done';
      } else if (m.player2Id && !m.player1Id) {
        m.winnerId = m.player2Id;
        m.status = 'done';
      } else if (!m.player1Id && !m.player2Id) {
        m.winnerId = null;
        m.status = 'pending';
      }
    }

    emptyBranch.set(m.id, !m.player1Id && !m.player2Id && branchDead(m));
  };

  const branchDead = (m: Match): boolean => {
    if (m.side !== 'final' && m.round === 1) return true;
    if (m.side === 'final') {
      return (
        (emptyBranch.get(matchId('left', rounds, 0)) ?? false) &&
        (emptyBranch.get(matchId('right', rounds, 0)) ?? false)
      );
    }
    return (
      (emptyBranch.get(matchId(m.side, m.round - 1, m.position * 2)) ?? false) &&
      (emptyBranch.get(matchId(m.side, m.round - 1, m.position * 2 + 1)) ?? false)
    );
  };

  for (let r = 1; r <= rounds; r++) {
    for (const side of ['left', 'right'] as const) {
      for (const m of [...byId.values()].filter((x) => x.side === side && x.round === r)) {
        resolve(m);
      }
    }
  }
  resolve(byId.get('F')!);

  return { ...t, matches: [...byId.values()] };
}

/** Georgian round label. roundsTotal includes the final. */
export function roundLabel(round: number, playerCount: number): string {
  const total = sideRounds(playerCount) + 1; // final round number
  const fromEnd = total - round;
  if (fromEnd === 0) return 'ფინალი';
  if (fromEnd === 1) return 'ნახევარფინალი';
  if (fromEnd === 2) return 'მეოთხედფინალი';
  return `რაუნდი ${Math.pow(2, fromEnd + 1)}-მდე`;
}

export function champion(t: Tournament): string | null {
  const final = t.matches.find((m) => m.id === 'F');
  return final?.status === 'done' ? final.winnerId : null;
}
