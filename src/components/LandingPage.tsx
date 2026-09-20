import { useSetAtom } from "jotai";
import {
  ArrowRight,
  Database,
  Image as ImageIcon,
  Palette,
} from "lucide-react";

import { hasEnteredWorkspaceAtom } from "@/atoms/landingAtoms";
import { BRAND_NAME } from "@/constants/brand";
import { Button } from "@/components/ui/button";
// @ts-ignore
import logo from "../../assets/logo.svg";

/**
 * The front door: the product's name, what it does, and one way in.
 *
 * Sits at z-10, one below the title bar's z-11, so the window stays draggable
 * and its controls stay clickable while this covers the workspace — a
 * full-window overlay would swallow both on a frameless window.
 */
export function LandingPage() {
  const enterWorkspace = useSetAtom(hasEnteredWorkspaceAtom);

  return (
    <div
      data-testid="landing-page"
      className="app-region-drag fixed inset-0 z-10 flex flex-col items-center justify-center overflow-y-auto bg-(--sidebar) px-6 pt-[var(--layout-title-bar-offset)] text-center"
    >
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className="h-20 w-20 shrink-0 drop-shadow-lg"
      />

      <h1 className="mt-7 text-5xl font-bold tracking-tight text-sidebar-foreground">
        {BRAND_NAME}
      </h1>

      <p className="mt-4 max-w-xl text-lg leading-relaxed text-sidebar-foreground/70">
        Describe an app in plain language. {BRAND_NAME} writes the code onto
        your machine, gives it a database, and runs a live preview you can click
        through.
      </p>

      <Button
        size="lg"
        data-testid="landing-login-button"
        onClick={() => enterWorkspace(true)}
        className="no-app-region-drag mt-9 h-12 gap-2 rounded-full px-8 text-base font-semibold"
      >
        Log in
        <ArrowRight className="size-4" />
      </Button>

      <p className="mt-4 text-xs text-sidebar-foreground/45">
        Your code and your keys stay on this machine.
      </p>

      <div className="mt-14 grid max-w-3xl gap-5 sm:grid-cols-3">
        <Highlight
          icon={<Database className="size-4" />}
          title="Real backends"
          body="Every app starts with a server and a database, not just screens."
        />
        <Highlight
          icon={<ImageIcon className="size-4" />}
          title="Build from a screenshot"
          body="Paste a design and get it rebuilt as working components."
        />
        <Highlight
          icon={<Palette className="size-4" />}
          title="Pick a look"
          body="Seven design directions, so every app doesn't come out the same."
        />
      </div>
    </div>
  );
}

function Highlight({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-foreground/[0.04] p-4 text-left">
      <div className="flex items-center gap-2 text-sidebar-foreground">
        <span className="text-primary">{icon}</span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-sidebar-foreground/60">
        {body}
      </p>
    </div>
  );
}
