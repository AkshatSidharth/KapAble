# KapAble demo script

A five-minute walkthrough that shows what KapAble does. Written to be read
aloud while driving the app.

The story: **an idea typed in plain language becomes a working app, running
locally, that the audience can click.**

---

## Before the room is watching

Do these ahead of time. Each is slow enough to kill the pace of a live demo.

```bash
node --version          # must be 24.x
npm install             # compiles native modules; several minutes cold
npm start
```

Then, in the app:

1. **Settings → AI** — paste an API key and pick a model. Use a frontier model
   (Claude Opus, GPT-5, Gemini Pro); smaller models need more corrections and
   the demo drags.
2. **Create one throwaway app** and let it finish. This warms the template
   clone and the dependency install, so the app you build live starts in
   seconds instead of minutes.
3. **Check your network.** Creating a new app clones a starter template from
   GitHub and installs dependencies. On a locked-down conference network,
   pre-create the app and demo edits only.
4. **Turn off notifications** and anything else that will draw a screenshot.

Optional but worth it: have a second app already built and polished, to show
"here's where this goes" at the end without waiting for generation.

---

## The demo

### 1. Frame it (30 seconds)

> "This is KapAble. It's an AI app builder like Lovable or v0 — you describe an
> app and it builds it. The difference is that it runs on my laptop. The code
> is written to a folder I own, in a git repository I control, and the only
> thing that leaves this machine is the prompt."

Have the empty app list on screen. Don't explain the architecture yet.

### 2. Type the idea (1 minute)

Create a new app and type something concrete enough to be judged, small enough
to finish:

> A habit tracker. I add habits, tick them off each day, and see a streak
> count for each one. Clean, calm design — lots of whitespace.

Send it, then **narrate what the agent is doing** rather than watching silently:

- It picks a template and scaffolds the project.
- Each file it writes appears as a card in the chat — that is real code
  landing on disk, not a summary of code.
- It installs dependencies and starts a dev server.

> "Everything you're seeing is a normal Vite React app. If I quit KapAble right
> now, the folder is still there and `npm run dev` still works."

### 3. Show the preview (1 minute)

When the preview loads, **use the app**. Add two habits, tick one off. The
demo lands when the audience sees something they could have used.

Then open the code panel briefly:

> "Real files, normal React, no proprietary runtime. You can open this in your
> own editor."

### 4. Edit by clicking (1 minute)

This is the moment that separates it from a chat window.

Turn on component selection in the preview, click the habit card, and ask for
something visible:

> Make this card show the streak as a big number with a flame icon next to it.

> "I didn't tell it which file to open. I pointed at the thing on screen."

The agent edits only that component and the preview hot-reloads.

### 5. Break it on purpose (1 minute)

Optional, and the most convincing thirty seconds if the room is technical.

Open the code panel, delete a closing brace, save. The preview shows a build
error — and KapAble offers to fix it. Accept, and watch it read the error and
repair the file.

> "It reads your build output. When something breaks, it fixes it rather than
> asking you to paste the stack trace."

### 6. Land it (30 seconds)

> "That was five minutes, on my laptop, with my own API key. The app is a git
> repository I can push to GitHub, connect to Supabase for a real database, and
> deploy like any other project."

If you pre-built a polished app, show it here.

---

## Recovery lines

Things go wrong live. Have these ready and say them without apologising.

| If this happens            | Say this, then                                                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Generation is slow         | "It's writing the whole project — let's look at the files it's already dropped." Open the code panel.                                                |
| The model makes a bad call | "This is the actual workflow: you correct it like a teammate." Correct it in one sentence. Recovering on camera is a _better_ demo than a clean run. |
| The preview won't start    | Check the build log in the preview panel. Usually a port collision — restart the app from the panel.                                                 |
| Dependency install fails   | Network. Fall back to the pre-built app and demo editing instead.                                                                                    |
| An AI rate limit hits      | Switch model in the picker mid-conversation; the chat continues.                                                                                     |

## What not to promise

Be straight about the edges — it costs nothing and buys credibility:

- **Managed accounts, hosted gateway, auto-update are off.** KapAble is
  bring-your-own-key. Those features exist in the codebase but point at
  services this project does not run; see
  [Hosted services](./README.md#hosted-services).
- **Generated apps still need review.** The security panel catches common
  mistakes, not everything.
- **Big apps need context management.** The demo app is small; be honest that
  a 200-file project needs pinned context.

## Reset between runs

```bash
# Quit KapAble first.
rm -rf ~/.config/kapable          # Linux
# rm -rf ~/Library/Application\ Support/kapable   # macOS
```

That clears apps, chats and settings — including your API key, so you will
re-enter it. To keep settings and drop only the demo app, delete the app from
the app list instead.
