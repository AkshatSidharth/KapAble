# Teleprompter — KapAble demo VO

Read-while-recording companion to [`DEMO-VIDEO.md`](./DEMO-VIDEO.md).

**Record the voiceover in takes, not one pass.** Eight short takes beat one
perfect three-minute run every time: you reset after a fluff instead of
starting over, and the edit gets natural breathing room between segments.

Record all the audio first, then cut the screen capture to it. Matching picture
to voice is far easier than the reverse.

**Delivery notes**
- Slower than feels right. You will speed up on camera; everyone does.
- The `///` marks are real pauses. Hold them. They are where the viewer reads
  the screen.
- Don't smile through it. Flat and certain sells an internal tool better than
  enthusiasm.

---

## TAKE 1 — the problem  *(over Kapture, clicking the widget library)*

> This is how you build a dashboard in Kapture today.
>
> Pick a dashboard type. Pick a field group. Pick your fields. Add the widget.
> Save.
>
> ///
>
> It works. It's also a fixed menu — and every question you didn't anticipate
> becomes a request to the engineering team, and a wait.

---

## TAKE 2 — the turn  *(cut to KapAble, dark, empty)*

> This is KapAble. We built it in-house.
>
> ///

---

## TAKE 3 — the connection  *(Settings → Plugins, Kapture connected)*

> And it's connected to Kapture. It can read your queues, your tickets, your
> agents — and it can write back to them.
>
> So instead of configuring a widget, you describe the tool you want.

---

## TAKE 4 — the ask  *(typing the prompt)*

> Here's a real one. It's nine in the morning, and I want to know what's about
> to breach SLA, and who's holding it.
>
> ///

---

## TAKE 5 — the proof  *(agent working; a Kapture tool call lands)*

> Now watch what it's doing. It's not guessing at a schema.
>
> ///
>
> That's KapAble calling Kapture. Reading the real ticket list, the real
> queues, the real agent roster — through the connection, live.
>
> Then it writes the app. Real files, on my machine, in a git repo I own.

---

## TAKE 6 — the payoff  *(preview loads with real data)*

> And there it is.
>
> Those are our tickets. Those are our agents. That's live data in a tool that
> didn't exist ninety seconds ago.
>
> ///

*Check the number against your actual run before recording this take.*

---

## TAKE 7 — pointing, not prompting  *(click the SLA card, refine)*

> Now the part that matters. I don't like how the countdown reads — so I click
> it, and I say what I want.
>
> ///
>
> I never told it which file to open. I pointed at the thing on the screen.

---

## TAKE 8 — the climax  *(Reassign → approval card → Kapture)*

> And this isn't a read-only report.
>
> ///  ← hold on the approval card. Longest pause in the video.
>
> KapAble is asking permission to write to Kapture. I approve it —
>
> *(cut to Kapture, ticket moved)*
>
> — and the ticket has moved. In Kapture. Not in a copy of Kapture.
>
> ///

---

## TAKE 9 — land it  *(code panel, then the app)*

> Underneath, it's an ordinary app. Real code, real repo, reviewable,
> deployable.
>
> ///
>
> Kapture's builder answers the questions we planned for. KapAble answers the
> ones we didn't — in the time it takes to describe them.

---

# Fallback VO — connection not live yet

Use these instead of takes 3, 5, 6 and 8 if KapAble can't reach Kapture yet.
Don't stage the integration; record the smaller true claim and re-cut later.

**Replaces TAKE 3:**

> Right now it's reading a sample of our ticket data. Wiring it to the live
> Kapture instance is the next step — and it's the same connection any of our
> internal tools would use.

**Replaces TAKE 5:**

> Watch what it's doing. It picks a template, writes the components, and wires
> the data through. Real files, on my machine, in a git repo I own.

**Replaces TAKE 6:**

> And there it is. A working tool that didn't exist ninety seconds ago.

**Replaces TAKE 8:** cut it. End on take 7, then go to take 9.

That version runs about two minutes and sells "fast internal tools" rather than
"fast internal tools wired into the CRM". Smaller claim, and a true one.

---

# Recording checklist

Tick these before the first take.

**Kapture connection**
- [ ] Agent mode selected — Build/Ask/Plan get no MCP tools
- [ ] A real Kapture call returned real data
- [ ] Session cookies refreshed today (they expire)
- [ ] Read tools auto-approved, **writes left on ask** — that approval card is take 8

**Environment**
- [ ] Pre-warmed: one throwaway app built, so templates and deps are cached
- [ ] Notifications off (macOS: Focus / Do Not Disturb)
- [ ] Menu bar clock and any personal bookmarks hidden
- [ ] UI zoomed one step up — it plays small on LinkedIn
- [ ] Sandbox/test queue, not a queue that pages a real agent
- [ ] Cookies not visible on screen anywhere

**Capture**
- [ ] 1920×1080, 30fps
- [ ] macOS: ⇧⌘5 → Record Selected Portion, or OBS for more control
- [ ] Record a 10-second throwaway first and play it back — check the mic

**After**
- [ ] Log out of Kapture and back in, to rotate the session cookies you used
