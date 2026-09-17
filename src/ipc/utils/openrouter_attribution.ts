// Sent as HTTP-Referer to OpenRouter for app attribution on their leaderboard.
// Points at the repository, since KapAble has no marketing site.
export const OPENROUTER_APP_REFERER =
  "https://github.com/AkshatSidharth/KapAble";
export const OPENROUTER_APP_TITLE = "KapAble";
export const OPENROUTER_APP_CATEGORIES = "native-app-builder,programming-app";

export function getOpenRouterAppAttributionHeaders(): Record<string, string> {
  return {
    "HTTP-Referer": OPENROUTER_APP_REFERER,
    "X-OpenRouter-Title": OPENROUTER_APP_TITLE,
    "X-OpenRouter-Categories": OPENROUTER_APP_CATEGORIES,
  };
}
