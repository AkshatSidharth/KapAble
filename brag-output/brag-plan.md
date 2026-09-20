# Brag Plan: KapAble

## What is this app?
KapAble is Kapture CRM's in-house AI app builder. A Kapture team describes the
internal tool it needs in plain language and KapAble writes the code, installs
it, and runs a live preview they can click through — a builder Kapture owns
outright rather than one it rents.

## The angle
The brag is not "AI builds your app" — that claim is table stakes and nobody
believes it anymore. The brag is **ownership**. Everyone in this market rents a
builder from someone else; Kapture went and built its own, and it builds
Kapture-shaped software. The video earns its 20 seconds by showing that builder
doing real CRM work — standing up a support triage board — and then landing the
flex plainly: Kapture didn't buy an app builder, Kapture built one. Confidence
through restraint. No hype, no "streamline your workflow". The product is not a
joke, so the film isn't either.

## Hook (first 2-3 seconds)
A cursor types a real prompt into the KapAble chat input, inside chrome marked
*Kapture CRM · internal tools*: **"A triage board for the support queue."**
Nothing else on screen. The hook is how ordinary the sentence is against what
happens next — and that it is unmistakably CRM work, not a toy.

## Key moments (the middle)
- Real files writing themselves into a real folder — `src/TriageBoard.tsx`,
  `src/TicketCard.tsx`, `package.json`, `index.html` — while the live preview
  fills in beside them. Not a progress bar: an actual file tree and an actual
  rendered support queue with ticket IDs, priorities and SLA timers.
- Click-to-edit: the cursor clicks a ticket row *in the preview*, a selection
  ring snaps around it, and a one-line instruction turns the SLA field into a
  big countdown. The point being made: nobody named a file.
- The SLA countdown ticking down as the card re-renders.

## Outro / punchline
The ownership landing. Two lines, one at a time, in parallel:
**Kapture didn't buy an app builder. / Kapture built one.**
Then the mark, the name, the tagline, and silence. Two lines rather than three:
the restraint is the flex.

## User flow worth showing
Entry → key action → result, following the shape of `docs/DEMO.md` but with
Kapture's own domain as the subject:
1. **Entry** — type the internal tool into the chat input ("A triage board for
   the support queue").
2. **Key action** — files are written to a local folder; live preview boots
   showing a working support queue.
3. **Result** — click a ticket row in the preview, describe the change in one
   sentence, watch the component change.
This is the centerpiece. The claims stay out of it except as the closing tagline.

## Tone
- Preset: `polished`
- Creative direction: quiet premium in-house-tooling film — the product speaks, the edit doesn't
- Interpretation: four scenes, long holds, slow crossfades (0.6s). Motion is
  purposeful rather than energetic; type is mixed case and medium weight. The
  restraint *is* the argument — an ownership flex delivered loudly would read as
  insecurity, so the film states it once and stops.

## Format: landscape — 1920x1080
## Duration: 21s

## Visual identity (from the project)
- Background: `#F1F5F9` (light surface), dark navy rail `#0F172A` for the app chrome
- Accent: `#E11D2E` (brand primary), `#FF6B80` (secondary, fills/dark-mode accent only)
- Text: `#0F172A`
- Display font: Geist
- Body font: Geist / Geist Mono for file paths and the `npm run dev` line
- Strongest visual element: the KapAble mark — a white angular glyph knocked out
  of a brand-red disc (`assets/logo.svg`) — plus the app's own navy-rail-and-light-canvas chrome

## Share copy (draft)
Kapture didn't buy an AI app builder. We built one. KapAble turns a sentence into a working internal tool — here it stands up a support triage board in about twenty seconds.

## Audio direction
- Role: warm bed with sparse professional accents
- Music: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` (60s, ~110 BPM)
- Music treatment: start at 0.0s, sit low (roughly -20 LUFS under the edit),
  0.4s fade-in, and fade out across the final 1.5s (19.5→21.0) so the outro lands in near-silence
- Music cue guidance: preset cue file read (`cues/…vol-10….music-cues.md`, 109.96 BPM).
  Target strong cues at **15.82s** (outro lines begin) and **18.55s** (mark settles, beat-locked).
  Beat grid for sequential reveals: file rows on 4.64 / 5.19 / 5.74; outro lines
  on 15.28 / 16.93 (every third beat, ~1.65s apart; both stay on screen until 18.2s).
- Audio-reactive treatment: subtle — the red disc may carry a faint presence/glow
  response on the two strong cues only. No waveform bars, no pulsing UI.
- SFX posture: sparse, motion-matched. Key ticks under the typed prompt, a soft
  click on the preview selection, one dry accent as the mark settles. Nothing else.
- Audio-coupled moments: typed hook text; file rows arriving one by one; the
  click on the habit card; the streak counter ticking; the final mark.
- Restraint rule: no whoosh on every transition, no riser into the outro, no
  stinger stacking on the logo. If a cue is not carrying meaning, it is cut.

## Storyboard

### Scene 1 — Type the idea — 4.1s
KapAble chrome: dark navy left rail with the red mark at top, light canvas,
title bar reading *support-triage — KapAble* on the left and **Kapture CRM ·
internal tools** on the right. The chat input sits centered. A caret blinks,
then types **"A triage board for the support queue."** character by character,
finishing ~3.0s, and holds. Send button lights brand red on the last character.
Sequential/interaction: yes — text types character by character; the send button
activates on completion.
Audio intent: quiet, attentive, a room before work starts.
Audio-coupled idea: subtle key ticks under the typing, thinning out rather than
one-per-character; a single soft click as send activates.
Music: warm low bed, just entered.
Transition mood: soft crossfade (0.6s) → Scene 2

### Scene 2 — It writes real files — 5.2s
Split canvas. Left: a file tree writing itself — `package.json`, `index.html`,
`src/TriageBoard.tsx`, `src/TicketCard.tsx` — rows arriving one by one on the
beat grid (4.64 / 5.19 / 5.74 / 6.28), each row holding ~0.9s so the paths are
readable, in Geist Mono. Right: the live preview boots and renders an actual
support queue — three ticket rows with IDs, subjects, priority dots and SLA
pills, whitespace-heavy and calm.
Sequential/interaction: yes — four file rows arrive one by one; the preview fades
up once the third row lands.
Audio intent: momentum without urgency; something real being assembled.
Audio-coupled idea: a soft, dry tick per file row, motion-matched, decreasing in
prominence; no sound on the preview fade.
Music: bed continues, slight lift.
Transition mood: soft crossfade (0.6s) → Scene 3

### Scene 3 — Point at the thing on screen — 5.4s
Preview fills the frame. The cursor moves to a ticket row and clicks; a brand-red
selection ring snaps around it and a `src/TicketCard.tsx` tag appears at its
right edge. A single instruction line appears beneath, in mixed case:
**"Show the SLA as a big countdown."** (7 words — holds ~3.7s, well above the
sentence floor). The row then re-renders: the SLA pill becomes a large red
countdown ticking from **2:14** down to **2:10** with a clock glyph beside it.
Sequential/interaction: yes — simulated cursor click on the card, selection ring,
then the card morphs and the counter ticks up.
Audio intent: the quiet click of a decision landing.
Audio-coupled idea: one soft UI click on the ring snap; faint counter ticks under
the count-up, ending clean.
Music: bed holds steady, no swell.
Transition mood: soft crossfade (0.6s) → Scene 4

### Scene 4 — Not bought. Built. — 6.3s
Light canvas, generous whitespace. Two lines arrive one at a time on the beat
grid (15.28 / 16.93 — every third beat, ~1.65s apart), stacking rather than
replacing, so both hold on screen until 18.2s:
**Kapture didn't buy an app builder.** / **Kapture built one.**
They hold together, then clear to the KapAble mark at full scale with
**KapAble** and *Kapture's in-house AI app builder* beneath it. Ends on
stillness.
Sequential/interaction: yes — two lines reveal one by one, stacking.
Audio intent: the argument landing without being shouted.
Audio-coupled idea: no sound on the lines themselves; one dry accent as the mark
settles at ~18.55s, then the bed fades to silence.
Music: fades out across the final 1.5s.

**Music mood for this video:** upbeat bed held deliberately low — warm, not celebratory
**Audio summary:** A quiet warm bed rises under a typed prompt, carries sparse
motion-matched ticks through the build and the click-to-edit, then clears away so
the two closing lines and the mark land in near-silence.
