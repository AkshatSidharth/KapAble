import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KapableCard, KapableStateIndicator } from "./KapableCardPrimitives";

describe("KapableCard", () => {
  it("lifts the card surface on hover in dark mode", () => {
    render(<KapableCard data-testid="card">Content</KapableCard>);

    const card = screen.getByTestId("card");
    expect(card.className).toContain("dark:bg-(--background-lighter)");
    expect(card.className).toContain("dark:hover:bg-muted/50");
  });
});

describe("KapableStateIndicator", () => {
  it("renders warning state with an amber indicator", () => {
    const { container } = render(
      <KapableStateIndicator state="warning" warningLabel="Needs attention" />,
    );

    expect(screen.getByText("Needs attention")).toBeTruthy();
    expect(container.querySelector(".text-amber-600")).toBeTruthy();
  });
});
