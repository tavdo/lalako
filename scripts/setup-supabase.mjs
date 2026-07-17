#!/usr/bin/env node
/**
 * One-shot Supabase setup for LALAKO TDM CUP.
 * Requires: supabase CLI logged in (`npx supabase login`)
 * Usage: node scripts/setup-supabase.mjs
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (file) => {
  console.log(`\n▶ ${file}`);
  execSync(`npx supabase db query --linked -f ${file}`, { cwd: root, stdio: 'inherit' });
};

console.log('Linking project tocmjpybcokqagqycdvz…');
execSync('npx supabase link --project-ref tocmjpybcokqagqycdvz --yes', { cwd: root, stdio: 'inherit' });
run('supabase/schema.sql');
run('supabase/register_player.sql');
console.log('\n✅ Supabase setup complete.');
