# LALAKO TDM CUP 🏆

Mobile-only ვებ-აპლიკაცია PUBG **TDM · 1v1** ტურნირისთვის. Hosted by **Lalako**.

- **საჯარო გვერდი** (`/`) — ბრეკეტი, რეგისტრაცია, მატჩების ისტორია
- **ადმინ პანელი** (`/admin`) — პარამეტრები, რეგისტრაციები, მოთამაშეები, განაწილება, მატჩები

## სტეკი

React + TypeScript + Vite · React Router · Supabase (Realtime) · Vercel

## ლოკალური გაშვება

```bash
npm install
npm run dev
```

Supabase-ის env ცვლადების გარეშე აპი მუშაობს **dev fallback** რეჟიმში (localStorage) —
production-ისთვის აუცილებელია Supabase.

## Supabase Setup

1. შექმენით პროექტი [supabase.com](https://supabase.com)-ზე.
2. **SQL Editor**-ში გაუშვით ჯერ `supabase/schema.sql`, შემდეგ `supabase/register_player.sql`.
3. **ადმინის პაროლი**: შეცვალეთ `'lalako2026!!'` `schema.sql`-ის `save_tournament` ფუნქციაში
   და იგივე მნიშვნელობა ჩაწერეთ `NEXT_PUBLIC_ADMIN_PASSWORD` env ცვლადში —
   ორივე უნდა ემთხვეოდეს.
4. დააკოპირეთ `.env.example` → `.env` და შეავსეთ:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_ADMIN_PASSWORD=lalako2026!!
```

მონაცემები ინახება `tournament` ცხრილში (ერთი მწკრივი, `id='main'`, `data=jsonb`):

- **RLS**: SELECT — public; INSERT/UPDATE/DELETE — აკრძალული (მხოლოდ RPC-ით)
- **RPC**: `save_tournament(p_password, p_data)` — ადმინის ჩანაწერები;
  `register_player(p_name, p_tag, p_avatar)` — საჯარო თვითრეგისტრაცია
- **Realtime**: ჩართულია `tournament` ცხრილზე — საჯარო გვერდი ავტომატურად ახლდება („● Live“)

## Vercel Deploy

1. ატვირთეთ რეპო GitHub-ზე და დააკავშირეთ Vercel-თან (Framework: **Vite**).
2. **Project → Settings → Environment Variables**-ში დაამატეთ სამივე `NEXT_PUBLIC_*` ცვლადი.
3. `vercel.json` უკვე შეიცავს SPA rewrite-ს — `/admin` პირდაპირ გახსნაც იმუშავებს.

## ბრეკეტის ლოგიკა

- ზომა: 8 / 16 / 32 მოთამაშე (ადმინიდან), რაუნდები გენერირდება ავტომატურად (log₂)
- ორმხრივი ბრეკეტი (მარცხენა/მარჯვენა) + ცენტრში ფინალი
- გამარჯვებული ავტომატურად გადადის შემდეგ რაუნდში (`propagateWinners`)
- **Bye**: ცარიელი seed სლოტი → მოწინააღმდეგე ავტომატურად გადადის

## სტრუქტურა

```
src/
  lib/        ტიპები, bracket ლოგიკა, Supabase store, avatar resize
  components/ Bracket, MatchCard, RegisterForm, Avatar, StatusPill, Confetti
  pages/      PublicPage (/), AdminPage (/admin)
supabase/     schema.sql, register_player.sql
```
