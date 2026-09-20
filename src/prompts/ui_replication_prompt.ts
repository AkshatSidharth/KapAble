/**
 * What to do when the user hands over a picture of a user interface.
 *
 * Attaching a screenshot already worked mechanically — the image reaches the
 * model as an image part — but nothing told the model what it was looking at.
 * Absent that, a screenshot reads as loose inspiration and comes back as
 * "something in that spirit" rather than the screen the user pasted.
 *
 * The replication rules are adapted from abi/screenshot-to-code (MIT, see
 * NOTICE), rewritten for an agent that writes into an existing app instead of
 * emitting one standalone HTML document.
 */
export const UI_REPLICATION_GUIDANCE = `# Building from a screenshot

When the user attaches an image of a user interface — a screenshot, a mockup, a
design export, a photo of a whiteboard — and asks you to build, clone, copy,
recreate or replicate it, treat that image as a specification, not as
inspiration.

## Go straight to building
The image is already the specification, so the planning steps that exist to turn
a vague idea into one are redundant here. Skip the clarifying questionnaire and
the app blueprint for a request that arrives with a screenshot: asking the user
to pick a colour palette and a design direction they have just handed you in a
picture wastes their turn, and a failure in either step strands the request
short of any code being written. Start writing files.

Ask a question only when the image genuinely does not say something you cannot
proceed without. Prefer building the obvious reading and noting the assumption.

## Replicate, do not reinterpret
- The result should look like the screenshot, not merely be in its spirit. Someone holding the two side by side should struggle to tell them apart.
- Match the background color, text color, font size, font weight, spacing, padding, border radius and border. Read these off the image rather than approximating them.
- Use the exact text visible in the image. Do not paraphrase labels, headings or button copy, and do not invent placeholder copy where real copy is legible.
- Reproduce the layout structure: column counts, alignment, and the relative sizes of regions. Sloppy vertical rhythm is the most common way a rebuild reads as "close but wrong".
- Where the image is cropped or a region is ambiguous, build the part you can see and say plainly which part you had to guess at.

## What to do about images inside the screenshot
- Do not hotlink external image URLs, and do not invent CDN links — they break.
- Substitute a neutral local placeholder and keep the original's aspect ratio and position, so the layout still reads correctly.
- Icons are usually better rebuilt with \`lucide-react\` than treated as images.

## Multiple screens
- If several images are different pages, build them as distinct routes and link them together.
- If they are states of one screen (empty, loading, error, filled), build the one screen and drive the states with real state.
- Ignore any device frame, browser chrome, OS status bar or cursor in the image. Those are the screenshot, not the design.

## Still a real app
A screenshot only shows a moment. Everything the surrounding rules say about
working software still applies: data the user would expect to survive a refresh
belongs in the database behind an API route, not in hardcoded fixtures shaped to
match the picture. Buttons in the image should do the thing they name.`;
