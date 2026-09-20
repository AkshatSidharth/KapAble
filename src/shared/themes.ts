export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
}

export const DEFAULT_THEME_ID = "default";

/**
 * Rules every theme enforces, whatever it looks like.
 *
 * These are quality floors rather than style: unreadable contrast, a desktop
 * -only layout, or a beautiful app that does not work are failures under any
 * art direction. Holding them in one place keeps six copies from drifting
 * apart as themes are edited.
 */
const UNIVERSAL_RULES = `#### Contrast (never negotiable)
Never pair closely matched colors for an element's background and its foreground content — it is the single most common way a generated app becomes unusable.
**Bad:** light gray text (#B0B0B0) on white; dark blue (#1A1A4E) on black; pale yellow button (#FFF9C4) with white text.
**Good:** dark charcoal (#333333) on white or light gray; cream (#FFFDF5) on deep navy (#1A1A2E); a saturated accent (#6366F1) with white text.
#### Layout
- ALWAYS design mobile-first, then enhance for larger screens.
- Centralize colors through CSS variables so the palette stays consistent and can be changed in one place.
#### Substance
- Do not neglect functionality in the pursuit of appearance. You must achieve BOTH.
- Don't build text-only walls — use imagery, iconography, and spacing to create rhythm.`;

/**
 * Wraps a theme's own art direction in the framing every theme shares.
 *
 * `direction` is what makes the theme itself: the type, color, shape and
 * motion decisions a designer would make before writing any markup.
 */
function buildThemePrompt(heading: string, direction: string): string {
  return `
<theme>
Any instruction in this theme should override other instructions if there's a contradiction.
### ${heading}
<rules>
All the rules are critical and must be strictly followed, otherwise it's a failure state.
${direction.trim()}
${UNIVERSAL_RULES}
</rules>
<workflow>
1. **Commit to the direction above before writing markup.** Decide the type scale, the palette, and the shape language first, and apply them consistently to every screen.
2. **Then build the application.** A theme is how the app looks, not a reason for it to do less.
</workflow>
</theme>`;
}

/**
 * Kept verbatim rather than rebuilt from `buildThemePrompt`.
 *
 * Every app created before the other themes existed is on this one, and its
 * exact wording — down to the planning_questionnaire hint and the "analyze the
 * industry and target users" step — is what those apps have been generated
 * against. Adding themes should not quietly restyle them.
 */
const DEFAULT_THEME_PROMPT = `
<theme>
Any instruction in this theme should override other instructions if there's a contradiction.
### Default Theme
<rules>
All the rules are critical and must be strictly followed, otherwise it's a failure state.
#### Core Principles
- This is the default theme used by KapAble users, so it is important to create websites that leave a good impression.
- AESTHETICS ARE VERY IMPORTANT. All web apps should LOOK AMAZING and have GREAT FUNCTIONALITY!
- You are expected to deliver interfaces that balance creativity and functionality.
#### Component Guidelines
- Never ship default shadcn components — every component must be customized in style, spacing, and behavior.
- Always prefer rounded shapes.
#### Typography
- Type should actively shape the interface's character, not fade into neutrality.
#### Color System
- Establish a clear and confident color system.
- Centralize colors through variables to maintain consistency.
- Avoid using gradient backgrounds.
- Avoid using black as the primary color. Aim for colorful websites.
#### Motion & Interaction
- Apply motion with restraint and purpose.
- A small number of carefully composed sequences (like a coordinated entrance with delayed elements) creates more impact than numerous minor effects.
- Motion should clarify structure and intent, not act as decoration.
#### Visual Content
- Visuals are essential: Use images to create mood, context, and appeal.
- Don't build text-only walls.
#### Contrast Guidelines
Never use closely matched colors for an element's background and its foreground content. Insufficient contrast reduces readability and degrades the overall user experience.
**Bad Examples:**
- Light gray text (#B0B0B0) on a white background (#FFFFFF)
- Dark blue text (#1A1A4E) on a black background (#000000)
- Pale yellow button (#FFF9C4) with white text (#FFFFFF)
**Good Examples:**
- Dark charcoal text (#333333) on a white or light gray background
- White or light cream text (#FFFDF5) on a deep navy or dark background (#1A1A2E)
- Vibrant accent button (#6366F1) with white text for clear call-to-action visibility
### Layout structure
- ALWAYS design mobile-first, then enhance for larger screens.
</rules>
<workflow>
Follow this workflow when building web apps:
1. **Determine Design Direction**
   - Analyze the industry and target users of the website.
   - Define colors, fonts, mood, and visual style (you are allowed to ask the user if you have access to planning_questionnaire tool).
   - Ensure the design direction does NOT contradict the rules defined for this theme.
2. **Build the Application**
   - Do not neglect functionality in the pursuit of making a beautiful website.
   - You must achieve both great aesthetics AND great functionality.
</workflow>
</theme>`;

const EDITORIAL_THEME_PROMPT = buildThemePrompt(
  "Editorial",
  `#### Core Principles
- Design as though laying out a printed magazine: the page has a considered structure, not a stack of identical cards.
- Whitespace is the primary design material. Be generous with it, especially around headings.
#### Typography
- A serif display face for headings (Playfair Display, Fraunces, Lora, or similar) against a clean sans for body text. Load them from Google Fonts.
- Large type scale contrast: headings should be dramatically larger than body copy, not one step up.
- Body text sits at a comfortable reading measure — cap line length around 70 characters.
#### Color System
- Restrained and warm: an off-white or cream paper ground, near-black ink, and ONE accent color used sparingly for emphasis and links.
- No more than three colors carry meaning. Resist adding a fourth.
#### Shape & Layout
- Minimal rounding (0–4px). Prefer hairline rules and generous margins over borders and shadows to separate content.
- Use asymmetry deliberately: offset headings, pull quotes, and images that break the text column.
#### Motion & Interaction
- Almost none. A quiet fade or a subtle underline on hover. Nothing slides, bounces, or scales.`,
);

const BRUTALIST_THEME_PROMPT = buildThemePrompt(
  "Brutalist",
  `#### Core Principles
- Structure is exposed, not softened. The grid should be visible and the hierarchy blunt.
- Confidence over polish: this should look deliberate and a little loud, never accidental.
#### Typography
- Heavy grotesque sans throughout (Inter, Archivo, Space Grotesk, or similar) with tight tracking on large headings.
- Headings are oversized and set in uppercase or near-uppercase weight. Use type size, not color, to establish hierarchy.
#### Color System
- Flat, saturated blocks of color against stark white or black. No tints, no gradients, no transparency.
- One dominant color doing a lot of work, plus black and white.
#### Shape & Layout
- NO rounded corners anywhere — border-radius is 0. NO soft drop shadows; if you need depth, use a hard offset shadow with no blur.
- Thick visible borders (2–4px, solid, high contrast) define every surface.
- Lay elements on an obvious grid and let them butt directly against each other.
#### Motion & Interaction
- Instant and mechanical. State changes snap — a block inverts its colors, a shadow offset shifts. No easing curves longer than 120ms.`,
);

const SOFT_THEME_PROMPT = buildThemePrompt(
  "Soft",
  `#### Core Principles
- Calm, friendly, and unhurried. The interface should feel like it is on the user's side.
- Nothing shouts. Emphasis comes from spacing and gentle weight changes, not from alarm colors.
#### Typography
- A rounded or humanist sans (Nunito, Quicksand, Rubik, or similar) from Google Fonts.
- Moderate type scale with comfortable line height (1.6 or so for body). Medium weights rather than bold.
#### Color System
- Soft, desaturated pastels — blush, sage, sky, sand — over a warm off-white ground.
- IMPORTANT: pastel backgrounds still need dark text. Keep body copy near-black; the softness lives in the surfaces, never in the text contrast.
#### Shape & Layout
- Generously rounded (12–24px) on cards, inputs, and buttons. Pill-shaped primary actions.
- Diffuse, low-opacity shadows for a gentle lift. Airy padding — crowding breaks the whole effect.
#### Motion & Interaction
- Smooth and slightly slow (200–300ms, ease-out). Gentle scale or lift on hover. Nothing abrupt.`,
);

const DASHBOARD_THEME_PROMPT = buildThemePrompt(
  "Dense Dashboard",
  `#### Core Principles
- Information density is the point. Fit more real data on screen than a marketing layout would, without becoming unreadable.
- Every pixel of chrome is competing with data. Cut decoration ruthlessly.
#### Typography
- Compact sans (Inter, IBM Plex Sans, or similar) at a small base size (13–14px).
- Use tabular numerals for anything numeric so columns align: \`font-variant-numeric: tabular-nums\`.
- Labels are small, uppercase, and muted; values are the emphasis.
#### Color System
- Neutral gray scale carries the interface. Color is reserved for meaning — status, deltas, thresholds — never for decoration.
- Support both light and dark surfaces; dashboards get stared at for long stretches.
#### Shape & Layout
- Small radius (4–6px). Compact padding. Thin dividing lines instead of gaps between rows.
- Prefer tables, split panes, and stat rows over large cards. Keep controls inline with the data they filter.
#### Motion & Interaction
- Minimal and fast (under 150ms). Hover states and focus rings must be obvious, since these interfaces are driven by keyboard and pointer precision.
- Charts should animate once on load at most; never loop.`,
);

const PLAYFUL_THEME_PROMPT = buildThemePrompt(
  "Playful",
  `#### Core Principles
- Energetic and characterful. The app should feel fun to poke at.
- Personality beats restraint here — but it still has to be legible and usable.
#### Typography
- Expressive display face for headings (Poppins, Baloo 2, Outfit, or similar) at heavy weights, paired with a simple sans for body.
- Big, confident headings. Playful details like a rotated word or an underline squiggle are welcome in moderation.
#### Color System
- Bright, saturated, and multi-color. Three or four strong hues working together over white or a light tint.
- Gradients ARE allowed in this theme, on accents and hero areas — but never behind body text.
#### Shape & Layout
- Chunky rounded shapes (16px+), thick outlines, and solid offset shadows for a sticker-like feel.
- Overlap elements slightly and vary card sizes so the grid feels lively rather than uniform.
#### Motion & Interaction
- Springy and responsive. Bounce on hover, pop on click, staggered entrances.
- Keep each animation short so the interface stays quick to use.`,
);

const TECHNICAL_THEME_PROMPT = buildThemePrompt(
  "Technical",
  `#### Core Principles
- Dark-surface-first, built for a developer audience. Precise, quiet, and dense with signal.
- Looks like a well-made tool, not a landing page.
#### Typography
- Monospace for data, identifiers, metrics, and code (JetBrains Mono, IBM Plex Mono, or similar); a clean sans for prose.
- Small, tight type. Letter-spaced uppercase for section labels.
#### Color System
- Deep neutral ground (near-black or very dark slate, NOT pure black) with layered elevation via slightly lighter surfaces.
- ONE luminous accent — cyan, lime, or amber — for focus, active state, and key values. Used sparingly, it reads as precision; used everywhere, it reads as noise.
- Keep body text at a high-contrast light gray rather than pure white, which vibrates on dark backgrounds.
#### Shape & Layout
- Small radius (4–6px). Thin 1px borders in a slightly lighter shade of the background do the separating.
- Glow is permitted only on the accent, only on interactive focus, and only faintly.
#### Motion & Interaction
- Fast and precise (100–150ms, linear or ease-out). Terminal-like: things appear, they do not swoosh.`,
);

export const themesData: Theme[] = [
  {
    id: "default",
    name: "Default Theme",
    description:
      "Balanced design system emphasizing aesthetics, contrast, and functionality.",
    icon: "palette",
    prompt: DEFAULT_THEME_PROMPT,
  },
  {
    id: "editorial",
    name: "Editorial",
    description:
      "Serif headlines, generous whitespace, and a restrained palette — print-inspired and calm.",
    icon: "book-open",
    prompt: EDITORIAL_THEME_PROMPT,
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description:
      "Hard edges, thick borders, and flat saturated blocks. No rounding, no soft shadows.",
    icon: "square",
    prompt: BRUTALIST_THEME_PROMPT,
  },
  {
    id: "soft",
    name: "Soft",
    description:
      "Rounded shapes, pastel surfaces, and gentle motion. Friendly and unhurried.",
    icon: "cloud",
    prompt: SOFT_THEME_PROMPT,
  },
  {
    id: "dashboard",
    name: "Dense Dashboard",
    description:
      "Compact, data-first layouts with tabular numerals and color reserved for meaning.",
    icon: "layout-grid",
    prompt: DASHBOARD_THEME_PROMPT,
  },
  {
    id: "playful",
    name: "Playful",
    description:
      "Bright multi-color palettes, chunky shapes, and springy motion with plenty of character.",
    icon: "shapes",
    prompt: PLAYFUL_THEME_PROMPT,
  },
  {
    id: "technical",
    name: "Technical",
    description:
      "Dark surfaces, monospace data, and one luminous accent. Built to look like a tool.",
    icon: "terminal",
    prompt: TECHNICAL_THEME_PROMPT,
  },
];
