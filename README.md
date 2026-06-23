# Handoff: Tomato Timer — Digital Detox Pomodoro

## Overview
A full-bleed, painterly **digital-detox Pomodoro timer**. You pick a focus length, put your
phone down, and a tomato plant grows through a continuous illustrated lifecycle (seed → sprout →
flower → green fruit → ripe red cluster). Stopping early or finishing both record a *specimen*
(a snapshot of how far the plant grew) into a minimal day-by-day **Garden** journal. Tone is calm,
warm, and minimal — no punishment, no clutter.

The whole app lives inside a simulated iPhone frame and is one of two preserved directions; this
(“v2”, full-bleed image growth) is the current/primary design.

## About the design files
The bundled files are **design references built in HTML/React-via-Babel** — a working prototype
showing the intended look, motion, and behavior. They are **not** production code to ship as-is.
Recreate these designs in your target environment (React Native, SwiftUI, Flutter, etc.) using its
own patterns, navigation, and asset pipeline. If no app environment exists yet, pick the framework
that best fits a local-first mobile app and implement there.

The prototype uses inline JSX compiled in-browser by Babel and globals attached to `window`; that's
a prototyping convenience, not an architectural recommendation.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, imagery, motion, and interactions are all
intended as shown. Recreate pixel-faithfully, then swap the in-browser-Babel/localStorage scaffolding
for real components + persistence.

---

## Screens / Views

Device canvas: **402 × 874** (iPhone-ish). All screens are `position:absolute; inset:0` layers inside
the device. Cream background `#FDF7EB` everywhere.

### 1. Grow — idle (home)  ← also the launch screen
The home IS the timer. Opening the app lands here (unless onboarding hasn't run).
- **Background**: full-bleed plant illustration, **frame 0 (seed)**, `object-fit: contain`, scaled
  1.10, with a vertical feather mask and a paper-grain overlay (see Interactions).
- **Top-left greeting** (z21, at top:60 left:24): line 1 = `"{n} day streak"` (or `"Take it slow today"`
  when streak 0), 13px/700, color `#A8927C`, `font-family: sans-serif`. Line 2 = `"Hi, {name}"`,
  23px, serif wordmark (Newsreader), color `#5A4636`.
- **Top-right**: two 40×40 round glass buttons (`rgba(255,255,255,0.6)`, shadow
  `0 2px 8px -4px rgba(90,70,50,0.3)`): **sprout** icon (→ Garden) and **gear/cog** icon (→ Settings),
  monotone stroke `#7A6552`.
- **Bottom panel** (cream top-gradient): caption `"How many minutes will you focus?"` (13.5px, weight
  200, `"SF Pro", system-ui`, color `#A8927C`) above three tappable numbers **10 · 25 · 50**
  (30px/800, color `#4A3A2C`, gap 30). Tapping a number starts a session immediately.

### 2. Grow — running (focus, S2)
- Same full-bleed plant, now showing the **frame for current progress** (continuous crossfade).
- **Top-center** (z21): stage label + percent, e.g. `"Green tomato · 80%"` (13px/700 `#A8927C`),
  and large countdown `09:54` (52px, weight 300, `#4A3A2C`, tabular-nums).
- **Bottom**: two glass pills **Pause / Stop** (`Resume` when paused); a tiny low-contrast text
  button `"Touch phone (simulate distraction)"` (11px, `#C7B49E`) — this exists only to demo the
  distraction state; in a real build replace with actual phone-use detection / DND.
- **Progress line**: 4px accent bar pinned to the very bottom, width = progress%.

### 3. Distraction (S3) — overlay on Grow
Triggered by `document.visibilitychange → hidden` while running, or the simulate button.
- Cream scrim `rgba(253,247,235,0.55)` + `backdrop-filter: blur(3px)`; the plant behind desaturates
  (`grayscale(0.7) brightness(0.97)`).
- Center copy: wordmark `"Hey, stay with me"` (24px `#5A4636`) + `"{name} is wilting. Come back and
  it grows again."` (15px/600 `#8B7560`).
- Buttons: primary CTA `"I'm back, refocus"` (resumes), text button `"Stop for today"` (records a
  partial specimen, returns home). Tone guardrail: never blame — only worry/longing.

### 4. Complete / Harvest (S4)
- Full-bleed **final frame (ripe red cluster, frame 32)**, contain, breathing.
- Top: eyebrow `"HARVEST"` (or `"FIRST HARVEST"` on first run) + wordmark `"All ripe!"`.
- Body: `"Perfectly ripe — {duration} min done!"` (or `"Thanks for coming back. It ripened!"` if
  the session had a distraction) + `"#{n} in your garden"`.
- CTAs: `Take a break` (primary) and a row of `Again` / `Garden` (or single `Add your first tomato →`
  on first run). **No confetti** (intentionally removed).

### 5. Break (S5)
- Solid calm bg `#EFF3EA`. A breathing circle (radial green gradient, gentle scale loop),
  alternating `"Breathe in…" / "Breathe out…"` every 4s, sub-copy `"Relax your shoulders and look out
  the window"`, a countdown, and a `Skip break` pill. Break length = `max(3, round(focus/5))` min.

### 6. Garden (S6) — minimal specimen journal
- Back bar (back chevron in a round glass button + serif title `"{name}'s Garden"`).
- Quiet line: `"{count} specimen(s) · {n} day streak"` (13px/600 `#A8927C`).
- **Specimens grouped by day**, newest day first, with light date headers (`Today`, `Yesterday`,
  `Jun 21`…). Within a day, newest session first.
- Each specimen = a **1:1 rounded tile** (radius 16, bg `#FFFDF8`, soft shadow) showing the frame the
  plant reached (`object-fit: cover`, `object-position: center 42%`), with a small percent caption
  below (`100%` in accent color, partials like `48%` in `#A8927C`). Grid: 3 columns, gap 12.
- Empty state: `"Nothing planted yet. Grow your first tomato 🌱"`.
- No variety types, no farmer levels, no charts — deliberately minimal.

### 7. Settings (S7)
- Back bar + serif `"Settings"`. Grouped inset cards (`rgba(255,255,255,0.65)`, radius 20) with
  uppercase section heads (12.5px/800 `#B9A48E`): **TOMATO** (Name → opens rename modal, shows
  current name + `›`), **NOTIFICATIONS · PERMISSIONS** (Notifications, Focus mode, Daily reminder —
  each a toggle), **FOCUS · SOUND** (Sound effects, Haptics), **DATA** (Reset garden → confirm modal).
- Row icons are **monotone line icons** (`#8A7561`, ~27px): pen (Name), bell, moon, alarm clock,
  speaker, vibrate, trash.
- Toggles: 48×29 pill, on = accent, off = `#E3D5C2`, 23px white knob.
- Footer: `"Honor mode · works without permissions"` / `"Tomato Timer · offline-first"`.

### 8. Welcome (onboarding, minimal)
Two steps only — value-before-permission, fast first win:
1. Full-bleed ripe-tomato image + wordmark `"Tomato Timer"` + `"Put your phone down and focus, and a
   tomato grows."` + `Get started`.
2. Full-bleed seed image + `"Want to name this tomato?"` + centered text input (placeholder `Toma`) +
   `Start with '{name}'` / `Maybe later`. Then drops straight into Grow (default name `Toma`).

### Modals
- **Rename**: small white card (radius 26), `"Tomato name"`, centered input, `Save`.
- **Reset garden**: `"Reset your garden?"` + `"All your specimens and records will be gone. This can't
  be undone."` + red `Reset` / `Cancel`. (No emoji.)

---

## Interactions & Behavior

### Timer engine
- A `requestAnimationFrame` loop accumulates elapsed focus-seconds. Demo speed: a tweak `secPerMin`
  maps 1 focus-minute → N real seconds (default 1, i.e. a 50-min session finishes in ~50s for demo).
  **In production, 1 min = 60 s.**
- `progress = elapsed / (duration*60)`, clamped 0–1.
- Pausing and the distraction overlay both halt accumulation. Returning resumes.
- On completion (`progress ≥ 1`): record a 100% specimen, go to Complete.
- Session position is persisted (`tomatoTimer.session` = `{duration, elapsed}`) every tick so a
  refresh resumes mid-session; cleared on stop/complete (and ignored if already finished).

### Growth animation (the core motion)
- A **33-frame** illustrated sequence (seed → ripe cluster). The plant shown is driven continuously
  by `progress`: `pos = progress*(N-1)`, `i = floor(pos)`, `frac = pos-i`.
- **Crossfade with morph feel**: frame `i` is fully opaque; the **incoming** frame `i+1` eases in by
  `e = smoothstep(frac)` AND scales from **1.04 → 1.10** as it appears (so it reads as growing/morphing,
  not a flat dissolve). Current frame held at scale 1.10. Opacity transition ~90ms; scale tracks `frac`.
- All durations use all 33 frames (longer real sessions simply dwell longer per frame → smoother).
- **Avoid** a looping breathing/zoom on the growth stack — it made the crossfade feel jittery and was
  removed. (The single-image Welcome/Complete screens may keep a gentle breathing loop.)

### Edge blending (so the rectangular image never shows a seam)
- **Feather**: vertical mask on the image layer
  `linear-gradient(to bottom, transparent 0%, #000 27%, #000 73%, transparent 100%)` — fades top/bottom
  into the cream.
- **Grain**: a low-opacity SVG `feTurbulence` noise overlay (`opacity .07; mix-blend-mode: multiply;`
  160px tile) sits over each screen so the flat CSS cream matches the illustrations' paper texture.

### Navigation
Idle Grow → (sprout) Garden / (gear) Settings / (number) start session. Running → Pause/Resume, Stop
(→ home, records partial), distraction overlay. Complete → Break / Again / Garden. Back bars return to
Grow. First run: Welcome → first session → Complete(first) → home.

### Distraction detection
Prototype uses `visibilitychange`. Production: iOS Screen Time / Focus mode, Android UsageStats / DND.
Always degrade gracefully to **honor mode** (no blocking) — the core loop must work with zero permissions.

---

## State Management

Persisted under `localStorage["tomatoTimer.v2"]`:
```
{
  onboarded: bool,
  name: string,                 // tomato's name, default "Toma"
  specimens: [{ d: "YYYY-MM-DD", f: 0..1, ts: epochMs }],  // one per session
  streak: number,               // consecutive days with ≥1 session
  totalMinutes: number,
  daily: { "YYYY-MM-DD": minutes },
  lastDate: "YYYY-MM-DD",
  perms: { notif: bool, dnd: bool },
  reminder: "HH:MM" | null,
  sound: bool, haptic: bool,
  honorMode: bool               // true when no detox permissions granted
}
```
Transient: `localStorage["tomatoTimer.session"] = { duration, elapsed }` (resume support).
Recording a specimen also updates `daily`, `totalMinutes`, `streak`, `lastDate`.
Streak rule: same-day repeat keeps streak; yesterday → +1; otherwise reset to 1.

Tweaks (prototype-only control panel): `accentTheme` (Tomato/Apricot/Plum/Olive/Blue) and `secPerMin`
(demo speed). Accent themes only retint chrome (buttons, toggles, progress, percent) — the illustrations
stay constant.

---

## Design Tokens

**Color**
- Cream bg `#FDF7EB`; page outside `#EFE3D2`; tile bg `#FFFDF8`; card `rgba(255,255,255,0.6–0.65)`
- Ink: primary `#4A3A2C` / `#5A4636`; body `#8B7560`; muted `#A8927C`; faint `#B9A48E`
- Icon stroke `#7A6552` (corner), `#8A7561` (settings rows)
- Divider `#F0E7D9`; toggle-off `#E3D5C2`
- Accent (default “Tomato”): `--accent #E0573C`, `--accent-soft #FBEAE3`, `--accent-ink #B7401F`,
  `--accent-shadow rgba(224,87,60,0.45)`
- Other accents: Apricot `#E08A3C`, Plum `#B5527A`, Olive `#7E9450`, Blue `#5B79C4` (each with soft/ink/shadow)

**Type**
- Display/wordmark: **Newsreader** (serif), weight 500. Used for titles, greetings, harvest text.
- Body/UI: system sans (`-apple-system, system-ui`). Numbers 10/25/50 at 800; timer at 300.
- Greeting streak line explicitly `sans-serif`.

**Radius**: buttons/CTAs 999 (pill); cards 20–26; tiles 16; glass buttons 40px circle.
**Shadow**: CTA `0 10px 24px -8px var(--accent-shadow)`; glass `0 2px 8px -4px rgba(90,70,50,0.3)`;
tile `0 2px 9px -6px rgba(90,70,50,0.5)`.
**Motion**: crossfade opacity ~90ms; incoming scale 1.04→1.10 (smoothstep); toggle/menu .2s.

---

## Assets
- **`assets/seq/f00.jpg … f32.jpg`** — the 33-frame growth sequence (≈540px wide JPEGs), ordered
  seed → ripe red cluster. Generated by downscaling the source illustrations in `uploads/` (groups
  A→B→C→D→E). Key frames: f00 seed, f28 single ripe tomato (HERO_RED), f32 four-tomato cluster (RIPE).
- Source full-res art is in `uploads/` (`A-1.png`…`E-5.png`).
- Replace the in-browser device bezel (`frames/ios-frame.jsx`) and Tweaks panel (`tweaks-panel.jsx`)
  with your platform's real chrome — they are prototype scaffolding.

## Files (in this bundle)
- `토마토 타이머.html` — entry; global styles (grain, feather, fonts), script load order.
- `grow.jsx` — Grow (idle+running), Distraction overlay, Complete, Break, PlantStack crossfade engine,
  Grain, corner icons, frame list + helpers.
- `screens2.jsx` — Garden, Settings (+monotone icons), Welcome, BackBar.
- `app2.jsx` — app shell: routing, store + persistence, specimen recording, scaler, modals, Tweaks.
- `tweaks-panel.jsx`, `frames/ios-frame.jsx` — prototype scaffolding.
- `assets/seq/` — the 33 growth frames.

A second preserved direction (cute SVG mascot + full onboarding O1–O11) exists as
`토마토 타이머 (v1 캐릭터).html` in the project if useful as reference, but the full-bleed version
above is the intended design.
