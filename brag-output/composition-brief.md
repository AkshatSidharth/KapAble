# Hyperframes Composition Brief: KapAble

## Objective
Create a short launch-style brag video for KapAble — Kapture CRM's in-house AI app builder.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21 seconds

## Source Material
- Project root: `/home/user/KapAble`
- Primary files read: `README.md`, `package.json`, `docs/DEMO.md`,
  `src/styles/globals.css`, `src/constants/brand.ts`, `assets/logo.svg`
- Product name: KapAble
- Positioning (from the user, not the repo): KapAble is **Kapture CRM's in-house
  AI app builder**. The repo README still carries the upstream local-first
  framing; the video follows the in-house one.
- Tagline / strongest claim: "Kapture's in-house AI app builder" — the brag is
  ownership: everyone in this market rents a builder, Kapture built its own.
- Key UI or visual moment to recreate: the KapAble app shell — dark navy left
  rail (`#0F172A`) carrying the red disc mark, light canvas (`#F1F5F9`), title
  bar marked *Kapture CRM · internal tools* — with the chat input, a written
  file tree, and the live preview of a generated support triage board.
- Copy that must appear verbatim:
  - `A triage board for the support queue.`
  - `Show the SLA as a big countdown.`
  - `Kapture didn't buy an app builder.`
  - `Kapture built one.`
  - `Kapture CRM · internal tools`
  - `Kapture's in-house AI app builder`

## Creative Direction
- Tone preset: `polished`
- Creative direction: quiet premium in-house-tooling film — the product speaks, the edit doesn't
- Interpretation: four scenes, long holds, 0.6s crossfades. Purposeful motion
  over energetic motion; mixed-case medium-weight type. The restraint is the
  argument — a local-first tool that shouts would undercut itself.
- Angle: The brag is not "AI builds your app" — that is table stakes. The brag
  is **ownership**. Everyone in this market rents a builder from someone else;
  Kapture went and built its own, and it builds Kapture-shaped software. Show
  that builder doing real CRM work, then land the flex plainly.
- Hook: a cursor types `A triage board for the support queue.` into the KapAble
  chat input, inside chrome marked *Kapture CRM · internal tools*.
- Outro / punchline: Kapture didn't buy an app builder. / Kapture built one.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign

## Visual Identity
- Background: `#F1F5F9` (canvas), `#0F172A` (app rail / chrome)
- Text: `#0F172A`, muted `#64748B`
- Accent: `#E11D2E` (brand primary), `#FF6B80` (secondary — fills only, never light-mode text)
- Display font: Geist (SemiBold/Medium) — real TTFs vendored to `assets/fonts/`
- Body font: Geist; Geist Mono for file paths and the `npm run dev` line
- Visual references from the project: the mark from `assets/logo.svg` (white
  angular glyph knocked out of a brand-red disc), the navy-rail-and-light-canvas
  chrome, and a support queue in Kapture's own domain — ticket IDs, priority
  dots, SLA timers

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Type the idea — 4.1s — KapAble chrome marked *Kapture CRM · internal tools*; `A triage board for the support queue.` types into the chat input; send button lights brand red.
2. It writes real files — 5.2s — `src/TriageBoard.tsx`, `src/TicketCard.tsx` and two more arrive one by one; the live preview boots beside them showing a working support queue with ticket IDs, priorities and SLA pills.
3. Point at the thing on screen — 5.4s — cursor clicks a ticket row, red selection ring snaps on, `src/TicketCard.tsx` tag appears, one instruction line, the row re-renders to a big red SLA countdown ticking 2:14 → 2:10.
4. Not bought. Built. — 6.3s — two lines one at a time, then the mark, the name, the tagline, silence.

## Audio
- Audio role: warm bed with sparse professional accents
- Audio arc: bed enters under the typed prompt, carries motion-matched ticks
  through the build and the click-to-edit, then fades away so the final three
  lines and the mark land in near-silence.
- Music: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` (60s, 109.96 BPM)
- Music treatment: bed at `0.22` gain via a `data-automation` volume lane —
  0→0.4s fade-in, hold, 19.5→21.0s fade-out to 0.
- Music cue guidance: bundled preset read
  (`assets/music/cues/…vol-10….music-cues.md`). Strong cue **18.55s** (strength
  0.98) locks the mark reveal. Beat grid for sequential reveals: file rows on
  4.64 / 5.19 / 5.74 / 6.28; outro lines on 15.28 / 16.38 / 17.47 (every other
  beat). Outro lines at 15.28 / 16.93, every third beat, stacking on screen.
- Audio-reactive treatment: subtle. `audio-data.json` extracted at 30fps / 16
  bands. Bass (`bands[0]`) drives the outro mark's scale within 3-4% and the
  softness of its red glow. Nothing else responds. No waveform bars, no pulsing UI.
- Audio-coupled moments:
  - Scene 1 typed prompt — thinned key ticks under the typing, one soft click as send activates
  - Scene 2 file rows — one dry tick per row, motion-matched, on the beat grid
  - Scene 3 selection ring — a single soft UI click on the snap; faint ticks under the SLA countdown
  - Scene 4 mark — one dry warm accent as it settles, beat-locked to 18.55s
- SFX selection guidance: low high-frequency-risk files only, per
  `sfx-analysis.md`. Ticks match motion exactly; nothing fires that is not
  carrying meaning. No whoosh per transition, no riser into the outro, no
  stinger stacking on the logo.
- SFX analysis guidance: `/home/user/latent-spaces/brag/skills/brag/assets/sfx/sfx-analysis.md`
  — selected `keypress-002/003/005.wav`, `ui/click2.ogg`,
  `interface/click_003.ogg`, `interface/click_005.ogg`,
  `impact/impactSoft_medium_001.ogg` (all low HF risk, warm/balanced).
- Exact SFX choice: chosen against the implemented animation, timestamps matched to motion.
- Audio files: copied into `composition/assets/music/` and `composition/assets/sfx/`.

## Hyperframes Instructions
Requirements:
- Show at least one real UI, copy, or visual element from the source project. ✔ app chrome, mark, Kapture's own ticket/SLA domain
- Keep all text readable in the final render. ✔ reading-time floors honoured
- Keep the video within 15-25 seconds. ✔ 21s
- Include the planned music/SFX layer. ✔
- Treat music cue metadata as optional timing hints; 1 strong-cue lock (18.55s).
- Run `hyperframes check` before render — brag's single gate.
