# Hyperframes Composition Brief: KapAble

## Objective
Create a short launch-style brag video for KapAble — Kapture CRM's in-house AI
app builder, connected to Kapture so it can build dashboards and internal tools
straight into the CRM.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21 seconds

## Source Material
- Project root: `/home/user/KapAble`
- **Primary source: product screenshots supplied by the user** — the KapAble
  window (dark), the Kapture CRM Configuration → Dashboards screen (light), and
  the Kapture widget library showing `agent_performance` and its field groups.
  These override the repo's upstream framing wherever the two disagree.
- Repo files read: `README.md`, `package.json`, `src/styles/globals.css`,
  `src/constants/brand.ts`, `assets/logo.svg`
- Product name: KapAble
- Positioning: Kapture CRM's own AI app builder, wired into Kapture. The brag is
  ownership plus connection.
- Copy that must appear verbatim:
  - `A dashboard of agent performance this week.`
  - `Connected to Kapture CRM`
  - `agent_performance`
  - `Add SLA breaches as a second series.`
  - `Kapture didn't buy an app builder.`
  - `Kapture built one.`
  - `Build for Kapture CRM, by describing it`

## Creative Direction
- Tone preset: `polished`
- Creative direction: quiet premium in-house-tooling film — the product speaks, the edit doesn't
- Angle: Everyone in this market rents a builder that knows nothing about their
  data. Kapture built one that is wired into Kapture. Today a Kapture dashboard
  is assembled widget by widget from a field picker; the video shows the
  alternative in one unbroken move.
- Hook: the real KapAble window; a cursor types the dashboard request, with
  `Connected to Kapture CRM` sitting under the input.
- Outro / punchline: Kapture didn't buy an app builder. / Kapture built one.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Inventing UI that contradicts the supplied screenshots

## Visual Identity
Two products, two themes — both recreated from the screenshots:
- **KapAble (dark):** bg `#0B1220`, panels `#131C2A`, text `#FFFFFF`, muted
  `#9FB0C6`, mark `#E11D2E`, caret `#FF6B80`. Title bar carries traffic lights,
  the mark, the wordmark, and a chip.
- **Kapture CRM (light):** rail `#10243A` with a red active item, canvas
  `#EEF1EE` with an 18px dot grid, header white, text `#1A2332`, muted
  `#55637A`, dashboard-type `#1668B3`.
- Chart: resolved `#6C9BE8`, SLA breaches `#E11D2E`.
- Display/body font: Geist; Geist Mono for field names and dashboard types.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Describe it — 4.1s — KapAble dark; the prompt types in; `Connected to Kapture CRM` below.
2. It reads Kapture's own fields — 5.2s — four schema rows arrive on the beat grid while the chart draws itself in the live preview.
3. It lands inside Kapture — 5.4s — the dashboard in Kapture's Configuration chrome; click the widget, one sentence, the SLA-breach series grows in.
4. Not bought. Built. — 6.3s — two lines, then the mark, the name, the tagline, silence.

## Audio
- Audio role: warm bed with sparse professional accents
- Music: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` (60s, 109.96 BPM)
- Music treatment: `data-automation` volume lane at `0.22` — 0→0.4s fade-in,
  hold, 19.5→21.0s fade-out to 0
- Music cue guidance: bundled preset. Strong cue **18.55s** (0.98) locks the mark
  reveal. Beat grid: field rows 4.64 / 5.19 / 5.74 / 6.28; outro lines 15.28 / 16.93.
- Audio-reactive treatment: subtle. `audio-data.json` at 30fps / 16 bands; bass
  (`bands[0]`) drives the outro mark's scale within 4% and its red glow. Nothing
  else responds.
- Audio-coupled moments:
  - Scene 1 typed prompt — thinned key ticks, one soft click as send activates
  - Scene 2 field rows — one dry tick per row on the beat grid
  - Scene 3 widget click — one soft UI click on the ring snap; faint ticks under the series growth
  - Scene 4 mark — one dry warm accent, beat-locked to 18.55s
- SFX: `keypress-002/003/005.wav`, `ui/click2.ogg`, `interface/click_003.ogg`,
  `interface/click_005.ogg`, `impact/impactSoft_medium_001.ogg` — all low
  high-frequency risk per `sfx-analysis.md`.

## Notes for future edits
- The one light→dark cut (scene 3 → 4) uses a **0.34s** crossfade, not the 0.6s
  used elsewhere. A slow dissolve between a bright CRM screen and a dark outro
  goes muddy in the middle and trips ~25 transient contrast findings. Keep it short.
- GSAP is vendored at `assets/js/gsap.min.js`; this environment's proxy blocks
  the jsdelivr CDN and an external script fails the runtime gate.
- `npx hyperframes check` is the single pre-render gate. It currently passes with
  0 errors.
