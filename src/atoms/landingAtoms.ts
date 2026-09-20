import { atom } from "jotai";

/**
 * Whether the landing screen has been passed for this run of the app.
 *
 * Deliberately not persisted: the landing screen is the product's front door,
 * so every launch arrives at it and the click-through into the workspace is
 * repeatable — which is what makes it demonstrable. Persisting "seen" would
 * show it exactly once per machine and never again.
 */
export const hasEnteredWorkspaceAtom = atom(false);
