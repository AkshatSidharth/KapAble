import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";

import { LandingPage } from "./LandingPage";
import { hasEnteredWorkspaceAtom } from "@/atoms/landingAtoms";

function setup() {
  const store = createStore();
  render(
    <Provider store={store}>
      <LandingPage />
    </Provider>,
  );
  return { store, user: userEvent.setup() };
}

describe("LandingPage", () => {
  it("shows before the workspace, so the app has a front door", () => {
    // Not persisted on purpose: every launch lands here.
    expect(createStore().get(hasEnteredWorkspaceAtom)).toBe(false);
  });

  it("names the product and offers one way in", () => {
    setup();
    expect(screen.getByRole("heading", { name: "KapAble" })).toBeVisible();
    expect(screen.getByRole("button", { name: /log in/i })).toBeVisible();
  });

  it("enters the workspace when the call to action is clicked", async () => {
    const { store, user } = setup();
    await user.click(screen.getByRole("button", { name: /log in/i }));
    expect(store.get(hasEnteredWorkspaceAtom)).toBe(true);
  });

  it("hides the logo from screen readers, since the heading already names it", () => {
    // Otherwise the product name is announced twice in a row.
    const { container } = render(
      <Provider store={createStore()}>
        <LandingPage />
      </Provider>,
    );
    const logo = container.querySelector("img");
    expect(logo).toHaveAttribute("aria-hidden", "true");
    expect(logo).toHaveAttribute("alt", "");
  });

  it("keeps the button clickable on a frameless window", () => {
    // The overlay is a drag region so the window can still be moved; without
    // no-app-region-drag on the button, the click would be swallowed by it.
    setup();
    expect(screen.getByTestId("landing-page").className).toContain(
      "app-region-drag",
    );
    expect(screen.getByTestId("landing-login-button").className).toContain(
      "no-app-region-drag",
    );
  });
});
