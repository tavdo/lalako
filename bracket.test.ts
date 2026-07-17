// Sanity tests for bracket logic — run with: npx tsx bracket.test.ts
import { defaultTournament } from './src/lib/types';
import { syncBracket, champion, roundLabel } from './src/lib/bracket';

let failures = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error('FAIL:', msg);
  } else {
    console.log('ok  :', msg);
  }
}

// 8-player bracket structure
let t = defaultTournament();
t.players = Array.from({ length: 6 }, (_, i) => ({ id: `p${i}`, name: `Player${i}` }));
t.seeds = ['p0', 'p1', 'p2', null, 'p3', 'p4', 'p5', null]; // two byes
t = syncBracket(t);

assert(t.matches.length === 7, '8-player bracket has 7 matches');

const m = (id: string) => t.matches.find((x) => x.id === id)!;
assert(m('L-1-0').player1Id === 'p0' && m('L-1-0').player2Id === 'p1', 'seeds fill round 1');
assert(m('L-1-1').winnerId === 'p2' && m('L-1-1').status === 'done', 'bye auto-advances p2');
assert(m('R-1-1').winnerId === 'p5', 'bye auto-advances p5');
assert(m('L-2-0').player2Id === 'p2', 'bye winner feeds semifinal');

// finish L-1-0 → winner goes to semifinal slot 1
m('L-1-0').winnerId = 'p0';
m('L-1-0').status = 'done';
m('L-1-0').score1 = 25;
t = syncBracket(t);
assert(m('L-2-0').player1Id === 'p0', 'winner propagates to next round');

// finish everything on the way to the final
m('L-2-0').winnerId = 'p0';
m('L-2-0').status = 'done';
m('R-1-0').winnerId = 'p3';
m('R-1-0').status = 'done';
t = syncBracket(t);
assert(m('R-2-0').player1Id === 'p3' && m('R-2-0').player2Id === 'p5', 'right semifinal filled');
m('R-2-0').winnerId = 'p5';
m('R-2-0').status = 'done';
t = syncBracket(t);
assert(m('F').player1Id === 'p0' && m('F').player2Id === 'p5', 'final gets both side winners');
m('F').winnerId = 'p5';
m('F').status = 'done';
t = syncBracket(t);
assert(champion(t) === 'p5', 'champion detected');

// undoing an earlier result clears stale downstream winners
m('L-1-0').winnerId = 'p1';
t = syncBracket(t);
assert(m('L-2-0').player1Id === 'p1', 'changed winner re-propagates');
assert(m('L-2-0').winnerId === null && m('L-2-0').status === 'pending', 'stale semifinal winner cleared');
assert(m('F').player1Id === null, 'final slot cleared after upstream change');

// 32-player structure + labels
let t32 = defaultTournament();
t32.playerCount = 32;
t32 = syncBracket(t32);
assert(t32.matches.length === 31, '32-player bracket has 31 matches');
assert(roundLabel(1, 32) === 'რაუნდი 32-მდე', 'round-of-32 label');
assert(roundLabel(2, 32) === 'რაუნდი 16-მდე', 'round-of-16 label');
assert(roundLabel(3, 32) === 'მეოთხედფინალი', 'quarterfinal label');
assert(roundLabel(4, 32) === 'ნახევარფინალი', 'semifinal label');
assert(roundLabel(5, 32) === 'ფინალი', 'final label');

// fully empty bracket stays quiet
let tEmpty = syncBracket(defaultTournament());
assert(tEmpty.matches.every((x) => x.status === 'pending' && !x.winnerId), 'empty bracket has no winners');

if (failures) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll bracket tests passed.');
