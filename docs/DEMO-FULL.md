# KapAble full feature demo — script

A 16–18 minute walkthrough covering the whole product, with chapter markers.
Cuts cleanly to ~8 minutes (see **Short cut** below).

Companion to:
- [`DEMO.md`](./DEMO.md) — 5-minute live demo, in the room
- [`DEMO-VIDEO.md`](./DEMO-VIDEO.md) — 2–3 minute recorded brag video
- [`DEMO-VIDEO-TELEPROMPTER.md`](./DEMO-VIDEO-TELEPROMPTER.md) — VO takes for that video

---

## The structural rule

**Do not tour the feature list.** A demo that walks the menu bar is forgettable
by minute four. This script builds **one real app end to end**, and the features
appear because the build needs them. The viewer remembers the app; the features
come along for free.

Everything that doesn't fit that narrative is quarantined in Act 5, which you
can drop entirely without the demo losing its shape.

**What you're building:** an internal *Support Ops console* for Kapture — a
queue view backed by a real database, wired to live Kapture data through MCP.
Big enough to need a backend, small enough to finish.

---

## Before you record

Everything in [`DEMO.md`](./DEMO.md) → "Before the room is watching", plus:

- [ ] **Vision-capable model selected** — Claude Opus 4.8, GPT-5.x (not Codex/Mini),
      or Gemini Pro. Act 1 pastes a screenshot. KapAble sends image parts to any
      model with **no capability check** (`chat_attachment_utils.ts:151`), so a
      non-vision model silently ignores the picture and the beat dies.
- [ ] **Not a local model via Ollama/LM Studio** for the screenshot section —
      most have no vision at all. Mention them in Act 5 instead.
- [ ] **Pre-warm**: build one throwaway app so template clone and dependency
      install are cached.
- [ ] **Kapture MCP plugin connected and verified** — Agent mode, `list my
      Kapture queues` returns real data. Act 4 is dead without it.
- [ ] Session cookies refreshed today.
- [ ] A screenshot of a UI ready on the clipboard for Act 1.
- [ ] Sandbox tenant, not production.

---

# ACT 1 — From nothing to running  *(0:00 – 4:30)*

## 1.1 Frame it *(0:00)*

Empty app list on screen.

> "This is KapAble. It's an AI app builder — you describe an app, it builds it.
> The difference from Lovable or v0 is that it runs on my machine, the code
> lands in a folder I own, and it's connected to our own systems.
>
> I'm going to build a support ops console, and I'm not going to skip any of
> the boring parts."

## 1.2 Templates *(0:30)*

**New app.** Show the template picker before choosing.

> "Every app starts from a template — React and Vite, Next.js, or a
> portal starter. And you can add your own: any public git repo URL becomes a
> template, so our house starter can be the default for the team."

Pick the **Next.js portal** template — it ships with database migrations, which
Act 3 needs.

## 1.3 Pick a look *(1:00)*

Show the design directions.

> "Seven design directions, so every app the team builds doesn't come out
> looking like the same grey dashboard."

Pick one and move on. Don't deliberate on camera.

## 1.4 Build from a screenshot *(1:30)*

Paste your screenshot into the prompt box alongside the text.

> "I can also just show it what I want."

Type alongside the pasted image:

```
Build the ticket queue screen from this screenshot. Match the layout,
spacing and colour. It needs a server and a database, not mock data.
```

Send.

> ⚠️ If the model is not vision-capable this does nothing and gives no warning.
> Check your model before recording. See the prep list.

## 1.5 Narrate the build *(2:00 – 4:30)*

Don't watch in silence. Talk over it:

> "It picks the template, scaffolds the project, and writes files. Each card in
> the chat is a real file landing on disk — not a summary of code.
>
> It installs dependencies, runs the migrations, and starts a dev server.
> Everything you're about to see is a normal Next.js app."

When the preview loads, **use it**. Click something. Scroll.

> "If I quit KapAble right now, that folder is still there and `npm run dev`
> still works."

**Chapter marker: 0:00 — Describe it, and it builds**

---

# ACT 2 — Iterating like a teammate  *(4:30 – 9:00)*

## 2.1 Click to edit *(4:30)*

The moment that separates this from a chat window.

Turn on component selection, click a ticket row in the preview, and ask:

```
Show the SLA as a countdown, and turn it red under an hour.
```

> "I didn't tell it which file to open. I pointed at the thing on the screen."

## 2.2 The four modes *(5:30)*

Open the mode picker.

> "Four modes. **Agent** plans and uses tools — it's the default and the one
> that can reach our integrations. **Build** just writes code. **Ask** is
> read-only, for questions about the codebase. **Plan** proposes an approach
> without touching a file."

Switch to **Ask** and ask something real:

```
Where is the ticket list fetched, and what happens if the request fails?
```

> "Read-only. It can explain the codebase without editing it — useful when
> you've inherited an app and don't trust it yet."

Switch back to **Agent**.

> ⚠️ Worth stating plainly: MCP tools only run in Agent mode. Build, Ask and
> Plan get none.

## 2.3 Context management *(6:30)*

Open the context panel.

> "Once an app is past a few dozen files, you can't send the whole codebase
> every turn. KapAble picks the relevant files automatically, you can pin files
> so they're always included, and older turns get compacted to stay inside the
> model's window.
>
> On a big app, pin the files you're working on. It's faster and cheaper."

## 2.4 Break it on purpose *(7:30)*

The most convincing ninety seconds if the room is technical.

Open the code panel, delete a closing brace, save.

The preview shows a build error, and KapAble offers a fix. Accept it.

> "It reads your build output. When something breaks it fixes it, rather than
> asking you to paste a stack trace."

**Chapter marker: 4:30 — Editing by pointing, not prompting**

---

# ACT 3 — Making it real software  *(9:00 – 12:30)*

## 3.1 The code is real *(9:00)*

Open the code panel properly. Scroll a component. Show the file tree.

> "Real files, normal Next.js, no proprietary runtime. Open it in your own
> editor, or hand it to someone who's never heard of KapAble."

## 3.2 Real backend *(9:45)*

Open the database panel.

> "Every app starts with a server and a database, not just screens. This one's
> on Neon — Supabase works the same way. Schema changes go through migrations,
> created from this panel rather than by hand-editing."

Add a column or create a migration live if your app supports it.

## 3.3 Security review *(10:45)*

Preview panel → **Security** tab. Run it.

> "Generated code needs reviewing, so there's a pass for the usual problems —
> exposed secrets, missing row-level security, unauthenticated endpoints,
> unsafe SQL. Findings link to the file and line.
>
> It's a first pass, not an audit. It catches frequent mistakes, not everything."

Say that last line. Overclaiming here is what loses a technical room.

## 3.4 GitHub *(11:45)*

Show the GitHub integration.

> "It's a git repository from the first commit. Push it, open a PR, review it
> like any other project. Nothing about this is a walled garden."

**Chapter marker: 9:00 — It's ordinary software underneath**

---

# ACT 4 — The part only we have  *(12:30 – 15:30)*

This is the payoff. Everything before it is table stakes; this is the argument.

## 4.1 Plugins *(12:30)*

Settings → **Plugins**. Show Kapture connected.

> "This is where it stops being a generic builder. KapAble speaks MCP, so it
> can be given tools. We've connected it to Kapture.
>
> It can read our queues, our tickets, our agents — and it can write back."

## 4.2 Live CRM data *(13:15)*

In Agent mode:

```
Replace the sample tickets with the real open tickets from Kapture,
sorted by how close they are to breaching SLA.
```

Let the Kapture tool-call cards land. **Do not rush these.**

> "That's KapAble calling Kapture. Reading the real ticket list, the real
> queues, the real agent roster — through the connection, live."

When the preview repopulates:

> "Those are our tickets. Those are our agents."

## 4.3 Write back *(14:30)*

The climax. Trigger an action that writes to Kapture — reassigning a ticket.

The consent banner appears. **Pause on it.**

> "And it's not read-only. KapAble is asking permission to write to Kapture.
> Reads I've auto-approved; writes still ask, every time."

Approve. Then switch to Kapture in a browser and show the ticket has moved.

> "The ticket has moved. In Kapture. Not in a copy of Kapture."

**Chapter marker: 12:30 — Wired into Kapture**

---

# ACT 5 — Everything else  *(15:30 – 17:30)*

Short, brisk, no lingering. Cut this act entirely for the short version.

## 5.1 Bring your own key *(15:30)*

Settings → AI.

> "Anthropic, OpenAI, Google, xAI, Bedrock, Azure, OpenRouter — or local models
> through Ollama and LM Studio, fully offline. Your keys, your choice of model,
> switchable mid-conversation."

## 5.2 Mobile *(16:00)*

> "An app can be wrapped with Capacitor for iOS and Android. iOS needs Xcode,
> Android needs the SDK — the usual native toolchain requirements."

## 5.3 Library, media, prompts *(16:30)*

> "Shared assets, media, and saved prompts, so the team isn't retyping the same
> instructions into every project."

## 5.4 Backup, upgrades, privacy *(17:00)*

> "Apps back up and restore. Older apps can take upgrades — mobile support, for
> instance, can be applied after the fact.
>
> And this fork sends no analytics. None. Your prompts go to whichever AI
> provider you chose, and nothing else leaves the machine."

**Chapter marker: 15:30 — Keys, mobile, and privacy**

---

# Closing  *(17:30 – 18:00)*

> "That's a working internal tool — real database, reviewed for the obvious
> security problems, in a git repo, reading and writing live Kapture data.
>
> Kapture's dashboard builder answers the questions we planned for. This
> answers the ones we didn't."

---

# Short cut (~8 minutes)

Keep: 1.1, 1.2, 1.4, 1.5, 2.1, 2.4, 3.3, all of Act 4, Closing.

Drop: 1.3, 2.2, 2.3, 3.1, 3.2, 3.4, all of Act 5.

Act 4 never gets cut. It is the only part of this demo that a competitor's
product cannot also show.

---

# Recording notes

- **Speed-ramp generation at 300–500%.** Let tool calls and the consent banner
  play at full speed — those are the proof frames.
- **Chapter markers** in the description so people can jump. A 17-minute video
  with no chapters gets abandoned at minute three.
- **Record in acts, not one take.** Five clean recordings beat one heroic run,
  and a mistake costs you one act instead of the afternoon.
- **Subtitles.** Much of this gets watched muted first.
- After recording, log out of Kapture and back in to rotate the session cookies
  you demoed with.

# What not to promise

- Managed accounts, hosted gateway and auto-update are **off** in this fork —
  it's bring-your-own-key. Those features exist in the codebase but point at
  services this project does not run.
- Generated apps still need review. Say "reviewable", not "production-ready".
- Big apps need context management. The demo app is small; be honest that a
  200-file project needs pinned context.
- The security pass catches common mistakes, not everything.
