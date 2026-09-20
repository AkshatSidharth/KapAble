# Brag Plan: KapAble

## What is this app?
KapAble is a local, open-source AI app builder — you describe an app in plain
language and it writes real code onto your own machine, installs it, and runs a
live preview you can click through. Like Lovable, v0 or Bolt, except nothing
leaves your laptop but the prompt.

## The angle
Every competitor in this category is a cloud service. The brag is not "AI builds
your app" — that claim is table stakes and nobody believes it anymore. The brag
is **where the code lands**. The video earns its 20 seconds by showing the app
being built and then quietly pointing at the folder on disk: quit the tool and
`npm run dev` still works. Confidence through restraint — no hype, no "streamline
your workflow". The product is not a joke, so the film isn't either.

## Hook (first 2-3 seconds)
A cursor types a real prompt into the KapAble chat input on the dark navy rail:
**"A habit tracker with streaks."** Nothing else on screen. The hook is the
ordinariness of the sentence against what happens next.

## Key moments (the middle)
- Real files writing themselves into a real folder — `src/App.tsx`,
  `package.json`, `index.html` — while the live preview fills in beside them.
  Not a progress bar: an actual file tree and an actual rendered habit tracker.
- Click-to-edit: the cursor clicks a habit card *in the preview*, a selection
  ring snaps around it, and a one-line instruction turns it into a big streak
  number with a flame. The point being made: nobody named a file.
- The streak number counting up to 12 as the card re-renders.

## Outro / punchline
The local-first landing. Three short lines, one at a time:
**Quit KapAble. / The folder is still there. / `npm run dev` still works.**
Then the mark, the name, the tagline, and silence.

## User flow worth showing
Entry → key action → result, straight from `docs/DEMO.md`:
1. **Entry** — type the idea into the chat input ("A habit tracker with streaks").
2. **Key action** — files are written to a local folder; live preview boots.
3. **Result** — click a component in the preview, describe the change in one
   sentence, watch the component change.
This is the centerpiece. The landing-page claims stay out of it except as the
closing tagline.

## Tone
- Preset: `polished`
- Creative direction: quiet premium developer-tool film — the product speaks, the edit doesn't
- Interpretation: four scenes, long holds, slow crossfades (0.6s). Motion is
  purposeful rather than energetic; type is mixed case and medium weight. The
  restraint *is* the argument — a local-first tool that shouts would undercut itself.

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
Built KapAble: describe an app, it writes real code to a folder you own. Quit the app and `npm run dev` still works.

## Audio direction
- Role: warm bed with sparse professional accents
- Music: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` (60s, ~110 BPM)
- Music treatment: start at 0.0s, sit low (roughly -20 LUFS under the edit),
  0.4s fade-in, and fade out across the final 1.5s (19.5→21.0) so the outro lands in near-silence
- Music cue guidance: preset cue file read (`cues/…vol-10….music-cues.md`, 109.96 BPM).
  Target strong cues at **15.82s** (outro lines begin) and **18.55s** (mark settles, beat-locked).
  Beat grid for sequential reveals: file rows on 4.64 / 5.19 / 5.74; outro lines
  on 15.28 / 16.38 / 17.47 (every other beat, ~1.1s apart — above the readable floor).
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
KapAble chrome: dark navy left rail with the red mark at top, light canvas. The
chat input sits center-bottom. A caret blinks, then types
**"A habit tracker with streaks."** character by character, finishing ~3.0s, and
holds. Send button lights brand red on the last character.
Sequential/interaction: yes — text types character by character; the send button
activates on completion.
Audio intent: quiet, attentive, a room before work starts.
Audio-coupled idea: subtle key ticks under the typing, thinning out rather than
one-per-character; a single soft click as send activates.
Music: warm low bed, just entered.
Transition mood: soft crossfade (0.6s) → Scene 2

### Scene 2 — It writes real files — 5.2s
Split canvas. Left: a file tree writing itself — `package.json`, `index.html`,
`src/App.tsx`, `src/HabitCard.tsx` — rows arriving one by one on the beat grid
(4.64 / 5.19 / 5.74), each row holding ~0.9s so the paths are readable, in Geist
Mono. Right: the live preview boots and renders an actual habit tracker — three
habit rows, whitespace-heavy, calm, exactly as the demo script describes it.
Sequential/interaction: yes — four file rows arrive one by one; the preview fades
up once the third row lands.
Audio intent: momentum without urgency; something real being assembled.
Audio-coupled idea: a soft, dry tick per file row, motion-matched, decreasing in
prominence; no sound on the preview fade.
Music: bed continues, slight lift.
Transition mood: soft crossfade (0.6s) → Scene 3

### Scene 3 — Point at the thing on screen — 5.4s
Preview fills the frame. The cursor moves to a habit card and clicks; a brand-red
selection ring snaps around that card. A single instruction line appears beneath,
in mixed case: **"Show the streak as a big number with a flame."** (8 words —
holds ~2.4s, above the sentence floor). The card then re-renders: the streak
becomes a large numeral counting up to **12** with a flame glyph beside it.
Sequential/interaction: yes — simulated cursor click on the card, selection ring,
then the card morphs and the counter ticks up.
Audio intent: the quiet click of a decision landing.
Audio-coupled idea: one soft UI click on the ring snap; faint counter ticks under
the count-up, ending clean.
Music: bed holds steady, no swell.
Transition mood: soft crossfade (0.6s) → Scene 4

### Scene 4 — Where the code lives — 6.3s
Light canvas, generous whitespace. Three lines arrive one at a time on the beat
grid (15.28 / 16.38 / 17.47 — every other beat), each holding ≥1.0s:
**Quit KapAble.** / **The folder is still there.** / **`npm run dev` still works.**
(third line in Geist Mono). They hold together for a beat, then clear to the
KapAble mark at full scale with **KapAble** and *A local, open-source AI app
builder* beneath it. Ends on stillness.
Sequential/interaction: yes — three lines reveal one by one, every other beat.
Audio intent: the argument landing without being shouted.
Audio-coupled idea: no sound on the lines themselves; one dry accent as the mark
settles at ~18.55s, then the bed fades to silence.
Music: fades out across the final 1.5s.

**Music mood for this video:** upbeat bed held deliberately low — warm, not celebratory
**Audio summary:** A quiet warm bed rises under a typed prompt, carries sparse
motion-matched ticks through the build and the click-to-edit, then clears away so
the final three lines and the mark land in near-silence.
