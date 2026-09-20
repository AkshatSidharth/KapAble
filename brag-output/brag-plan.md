# Brag Plan: KapAble

## What is this app?
KapAble is Kapture CRM's in-house AI app builder. It is connected to Kapture,
so a team can describe the dashboard or internal tool they need, and KapAble
reads Kapture's own fields and builds the thing — live — into the CRM they
already work in.

## The angle
The brag is not "AI builds your app" — that claim is table stakes. The brag is
**ownership plus connection**. Everyone in this market rents a builder that
knows nothing about their data; Kapture built one that is wired into Kapture.
Today a Kapture dashboard is assembled widget by widget out of a field picker.
The video shows the alternative in one unbroken move: say what you want, watch
it read `agent_performance`, watch it land in Configuration → Dashboards, then
click it and change it by describing the change. Confidence through restraint.
No hype, no "streamline your workflow".

## Hook (first 2-3 seconds)
The real KapAble window — dark, traffic lights, the red disc mark, the
"No app selected" chip. A cursor types **"A dashboard of agent performance this
week."** Underneath, a green dot: **Connected to Kapture CRM**. The hook is that
last line: this is not a generic builder, it is already plugged into the CRM.

## Key moments (the middle)
- KapAble reading Kapture's actual schema — `agent_performance`,
  `Agent Performance`, `Agent Ticket Sla`, `Agent Worked` — arriving one by one
  while the chart draws itself in the live preview beside them.
- The finished dashboard sitting inside Kapture's own chrome: navy rail,
  Configuration header, MediBuddy account, dotted canvas. Real agent names on
  the axis. It is not a mockup of a dashboard, it is the dashboard in place.
- Click-to-edit on the widget: one sentence adds a whole second series, and the
  red SLA-breach bars grow in beside the blue.

## Outro / punchline
Two lines, one at a time, in parallel:
**Kapture didn't buy an app builder. / Kapture built one.**
Then the mark, the name, the tagline, silence. Two lines rather than three: the
restraint is the flex.

## User flow worth showing
Entry → key action → result:
1. **Entry** — describe the dashboard in KapAble ("A dashboard of agent
   performance this week").
2. **Key action** — KapAble reads Kapture's fields over the existing connection
   and renders the chart in a live preview.
3. **Result** — the dashboard is in Kapture under Configuration → Dashboards;
   clicking the widget and describing a change rebuilds it on the spot.

## Tone
- Preset: `polished`
- Creative direction: quiet premium in-house-tooling film — the product speaks, the edit doesn't
- Interpretation: four scenes, long holds, 0.6s crossfades (0.34s on the one
  light→dark cut, where a slow dissolve would go muddy). Motion is purposeful
  rather than energetic; type is mixed case and medium weight.

## Format: landscape — 1920x1080
## Duration: 21s

## Visual identity (from the real product screenshots)
- KapAble: background `#0B1220`, panels `#131C2A`, text `#FFFFFF`, muted
  `#9FB0C6`, mark and active accent `#E11D2E`, coral caret `#FF6B80`
- Kapture CRM: rail `#10243A`, canvas `#EEF1EE` with an 18px dot grid, header
  white, text `#1A2332`, muted `#55637A`, dashboard-type link `#1668B3`
- Chart: resolved bars `#6C9BE8`, SLA-breach bars `#E11D2E`
- Display font: Geist (SemiBold/Medium) — real TTFs vendored to `assets/fonts/`
- Body font: Geist; Geist Mono for field names and dashboard types
- Strongest visual element: the same red disc mark reading as KapAble's identity
  on dark, and as Kapture's active nav state on light

## Share copy (draft)
Kapture didn't buy an AI app builder. We built one — and wired it into Kapture. Describe the dashboard, KapAble reads the CRM's own fields and builds it in place.

## Audio direction
- Role: warm bed with sparse professional accents
- Music: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` (60s, 109.96 BPM)
- Music treatment: bed at `0.22` gain via a `data-automation` volume lane —
  0→0.4s fade-in, hold, 19.5→21.0s fade-out to 0
- Music cue guidance: bundled preset read. Strong cue **18.55s** (strength 0.98)
  locks the mark reveal. Beat grid for sequential reveals: field rows on
  4.64 / 5.19 / 5.74 / 6.28; outro lines on 15.28 / 16.93.
- Audio-reactive treatment: subtle. Bass (`bands[0]`) drives the outro mark's
  scale within 4% and the softness of its red glow. Nothing else responds.
- SFX posture: sparse, motion-matched, low high-frequency risk only
- Restraint rule: no whoosh per transition, no riser into the outro, no stinger
  stacking on the logo

## Storyboard

### Scene 1 — Describe it — 4.1s
The KapAble window, dark. Title bar: traffic lights, mark, **KapAble**,
**No app selected** chip. Centered: the mark at 104px, **KapAble**, the line
*Describe it in plain language.*, then the input. A caret blinks and types
**"A dashboard of agent performance this week."** finishing ~3.0s. Send button
lights brand red. Below: a green dot and **Connected to Kapture CRM**.
Sequential/interaction: yes — text types character by character; send activates.
Audio intent: quiet, attentive, a room before work starts.
Transition mood: soft crossfade (0.6s) → Scene 2

### Scene 2 — It reads Kapture's own fields — 5.2s
Still KapAble, dark. Left panel: **Connected to Kapture CRM**, then
*READING FIELDS* and four rows in Geist Mono arriving on the beat grid
(4.64 / 5.19 / 5.74 / 6.28): `agent_performance`, `Agent Performance`,
`Agent Ticket Sla`, `Agent Worked`. Right: a white **Live preview** panel where
the bar chart draws itself, bars rising in a 0.045s stagger from 6.35s.
Sequential/interaction: yes — four field rows, then twelve bars rising.
Audio intent: momentum without urgency; something real being assembled.
Transition mood: soft crossfade (0.6s) → Scene 3

### Scene 3 — It lands inside Kapture — 5.4s
Kapture CRM, light. Navy rail with a red active item, **Configuration** header,
**MediBuddy** account, dotted canvas. The dashboard card sits in it:
*Agent performance — this week*, `agent_performance`, twelve agents on the axis.
The cursor moves in and clicks; a red ring snaps around the widget and an
`agent_performance` tag tucks onto its top-right corner. The instruction appears:
**"Add SLA breaches as a second series."** At 12.6s the red bars grow in beside
the blue and the legend gains its second entry.
Sequential/interaction: yes — simulated click, then twelve breach bars stagger in.
Audio intent: the quiet click of a decision landing.
Transition mood: short crossfade (0.34s, light→dark) → Scene 4

### Scene 4 — Not bought. Built. — 6.3s
KapAble dark again. Two lines arrive on the beat grid (15.28 / 16.93), stacking,
both holding until 18.2s:
**Kapture didn't buy an app builder.** / **Kapture built one.**
They clear to the mark at full scale with **KapAble** and
*Build for Kapture CRM, by describing it*. Ends on stillness.
Sequential/interaction: yes — two lines reveal one by one, stacking.
Audio intent: the argument landing without being shouted.

**Music mood for this video:** upbeat bed held deliberately low — warm, not celebratory
**Audio summary:** A quiet warm bed rises under a typed prompt, carries sparse
motion-matched ticks through the field reads and the click-to-edit, then clears
away so the two closing lines and the mark land in near-silence.
