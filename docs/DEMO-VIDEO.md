# KapAble demo video — shooting script

A 2–3 minute recorded demo with voiceover, for showing KapAble as a build layer
on top of Kapture CRM.

Companion to [`DEMO.md`](./DEMO.md), which is the *live, in-the-room* script.
This one is written for **screen recording plus voiceover**, where you can
retake, cut, and speed up. Different medium, different rules: no recovery
lines, no filler, and every second of dead air gets edited out.

---

## The one idea this video sells

> Kapture's dashboard builder answers the questions you anticipated.
> KapAble answers the ones you didn't — in minutes, against live CRM data,
> and it can act on the CRM, not just chart it.

Everything in the cut serves that sentence. If a shot doesn't, drop it.

**The climax is the write-back.** A read-only dashboard is a nice demo; a tool
that *reassigns a ticket in Kapture* is a different category of claim. Build the
whole video toward that moment at ~2:10.

---

## What you are building on camera

**An SLA war room.** One screen that shows tickets about to breach SLA, who
owns them, and which agents have capacity — with a **Reassign** button that
writes back to Kapture.

Why this and not "an agent performance dashboard":

- Kapture can already chart agent performance. Rebuilding it proves nothing.
- The war room spans several field groups and adds an *action*. That is
  precisely what the widget library cannot assemble.
- It is a real thing a support lead wants at 9am. The audience recognises it.

---

## Before you record

Everything in `DEMO.md` → "Before the room is watching" applies. Additionally:

1. **Verify the Kapture connection actually works.** Settings → Plugins →
   Kapture CRM should be connected and enabled. Then, in a throwaway chat, ask
   *"list my Kapture queues"* and confirm you get real data back. **If this does
   not work, stop — the video has no story.** See "If the connection isn't ready"
   below.
2. **Use a sandbox tenant or a test queue.** You are going to reassign a real
   ticket on camera. Do it somewhere that does not page a real agent.
3. **Turn on auto-approve for Kapture read tools**, leave writes manual. Reads
   auto-approving keeps the build flowing; the write staying manual gives you the
   approval card on screen at the climax, which is the most persuasive frame in
   the video.
4. **Do a full dry run and keep it.** If the live take drags, you can cut to dry
   run footage for the slow middle.
5. **Record at 1920×1080, 30fps, app maximised.** Hide the dock, the menu bar
   clock, notifications, and any tab bar with personal bookmarks.
6. **Pre-warm.** Build one throwaway app first so template clone and dependency
   install are cached. This is the single biggest difference between a 3-minute
   cut and a 9-minute one.
7. **Zoom the UI one step up.** Text that is comfortable on your monitor is
   unreadable in a LinkedIn player at 60% size.

---

## Shot list

Timings are the **finished cut**, not how long recording takes. Record far more
than this and cut down.

| # | Time | Screen | What you do |
|---|------|--------|-------------|
| 1 | 0:00–0:16 | **Kapture CRM** → Configuration → Dashboards, Widget Library open | Click slowly through `Dashboard Type` → a field group → fields. Do *not* finish. Let it look laborious. |
| 2 | 0:16–0:34 | **KapAble**, empty, then Settings → Plugins | Cut to the KapAble home. Then show the Kapture plugin card, connected, green. Hover so the tool list is visible if it expands. |
| 3 | 0:34–0:52 | KapAble chat | Type the prompt (below). Send. |
| 4 | 0:52–1:30 | KapAble chat, agent working | **Speed to 300–500%.** Let the MCP tool-call cards to Kapture land at normal speed for ~2s each — those are the proof. File cards scroll past fast. |
| 5 | 1:30–1:52 | Live preview | The app loads with **real Kapture data**. Point the cursor at a real agent name and a real ticket ID. Scroll once. |
| 6 | 1:52–2:12 | Preview, component selection on | Click the SLA card. Type the refine prompt. Preview hot-reloads. |
| 7 | 2:12–2:34 | Preview → approval card → Kapture | Click **Reassign**. The Kapture write tool-call appears — **pause here**. Approve. Then cut to Kapture and show the ticket actually moved. |
| 8 | 2:34–2:48 | Code panel, then the app | Open the file tree briefly. Close it. End on the finished app. |

---

## The prompts, word for word

Type these exactly. They are tuned to be specific enough to judge and small
enough to finish.

**Shot 3 — the build prompt:**

```
An SLA war room for the support team. Pull open tickets from Kapture,
show the ones closest to breaching SLA at the top with a countdown,
and next to each one show who it's assigned to. Add a second panel
listing agents with how many open tickets each has right now.
Clean, calm, lots of whitespace — this is for a 9am standup.
```

**Shot 6 — the refine prompt** (after clicking the SLA card):

```
Colour this red when there's under an hour left, amber under four.
```

**Shot 7 — the action prompt** (if Reassign isn't already wired):

```
Add a Reassign button on each ticket that moves it to the agent with
the fewest open tickets, and write that change back to Kapture.
```

> Record shot 7's build separately and cut it in. Asking for it live adds a
> minute of generation to the middle of the video.

---

## Voiceover script

~400 words, ≈2:45 at a relaxed pace. **Read it slower than feels right.** Leave
the marked pauses — they are where the viewer actually absorbs the screen.

---

**[0:00 — over Kapture, clicking through the widget library]**

This is how you build a dashboard in Kapture today. Pick a dashboard type. Pick
a field group. Pick your fields. Add the widget. Save.

It works. It's also a fixed menu — and every question you didn't anticipate
becomes a request to the engineering team, and a wait.

*(pause)*

**[0:16 — cut to KapAble, dark, empty]**

This is KapAble. We built it in-house.

**[0:22 — Settings → Plugins, Kapture connected]**

And it's connected to Kapture. It can read your queues, your tickets, your
agents — and it can write back to them.

So instead of configuring a widget, you describe the tool you want.

**[0:34 — typing the prompt]**

Here's a real one. It's 9am, and I want to know what's about to breach SLA and
who's holding it.

*(read the prompt aloud as it types, or let it land in silence for 3 seconds —
whichever you prefer, don't do both)*

**[0:52 — agent working, sped up]**

Now watch what it's doing. It's not guessing at a schema.

**[0:58 — a Kapture tool call lands, at normal speed]**

That's KapAble calling Kapture. It's reading the real ticket list, the real
queues, the real agent roster — through the connection, live.

Then it writes the app. Real files, on my machine, in a git repo I own.

*(pause)*

**[1:30 — preview loads with real data]**

And there it is. Those are our tickets. Those are our agents. That's live data
in a tool that didn't exist ninety seconds ago.

**[1:52 — click the SLA card, refine]**

Now the part that matters. I don't like how the countdown reads, so I click it
and say what I want.

*(pause for the reload)*

I never told it which file to open. I pointed at the thing on the screen.

**[2:12 — click Reassign, approval card appears]**

And this isn't a read-only report.

*(pause on the approval card — let it sit)*

KapAble is asking permission to write to Kapture. I approve it —

**[2:22 — cut to Kapture showing the moved ticket]**

— and the ticket has moved. In Kapture. Not in a copy of Kapture.

*(pause)*

**[2:34 — code panel, then the app]**

Underneath it's an ordinary app. Real code, real repo, reviewable, deployable.

**[2:42 — end on the app]**

Kapture's builder answers the questions we planned for. KapAble answers the ones
we didn't — in the time it takes to describe them.

---

## Editing notes

- **Cut the silence ruthlessly.** Every "thinking" gap over 1.5 seconds goes.
- **Speed ramps, not jump cuts,** through generation. A smooth 400% ramp reads
  as fast software; a hard cut reads as something hidden.
- **Hold the two proof frames at 100%:** the Kapture tool call (~0:58) and the
  write approval (~2:12). Everything else can move.
- **Zoom in** on the tool-call cards and the approval dialog. They carry the
  argument and they are small.
- **Subtitles.** Most of this gets watched muted the first time.
- **Music:** something low and warm, well under the voice, fading out under the
  last line. Same posture as the 21-second cut.
- **No transitions.** Straight cuts only. Wipes and dissolves make internal tools
  look like ads.

---

## What not to claim

Straight from `DEMO.md` — it costs nothing and buys credibility:

- Don't imply generated apps ship unreviewed. Say "reviewable", not "production".
- Don't promise the write-back is safe by default. It asked for approval on
  camera; that *is* the safety story, so say so rather than glossing it.
- Don't show latency as instant if you sped it up. "Ninety seconds" in the VO
  should be roughly true. Adjust the number to your actual run.
- Don't demo on live production data with real customer names. Sandbox tenant.

---

## If the connection isn't ready

If KapAble cannot actually reach Kapture yet, **do not fake it.** A staged
integration is the one thing that will get noticed and will cost you the room.

Record the honest version instead and re-cut later:

- Keep shots 1, 3, 4, 5, 6, 8.
- Build the war room against a seeded local database instead of Kapture, and
  change the VO at 0:22 to: *"Right now it's reading a sample of our ticket
  data. Wiring it to the live Kapture instance is the next step — and that's
  the same connection any of our internal tools would use."*
- Drop shot 7 and the climax entirely. Land on the click-to-edit moment instead.

That version is still a good 2-minute video. It just sells "fast internal tools"
rather than "fast internal tools wired into the CRM" — a smaller claim, but a
true one.
