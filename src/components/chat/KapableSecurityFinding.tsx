import React, { useState } from "react";
import { ShieldAlert } from "lucide-react";
import {
  KapableCard,
  KapableCardHeader,
  KapableExpandIcon,
  KapableCardContent,
  type KapableAccentColor,
} from "./KapableCardPrimitives";
import {
  SeverityBadge,
  type SecurityLevel,
} from "@/components/security/severity";
import { VanillaMarkdownParser } from "./KapableMarkdownParser";

const VALID_LEVELS: readonly SecurityLevel[] = [
  "critical",
  "high",
  "medium",
  "low",
];

function isSecurityLevel(value: string | undefined): value is SecurityLevel {
  return value != null && (VALID_LEVELS as readonly string[]).includes(value);
}

// Map a finding's severity onto the card's left-accent color. The exact level
// is still conveyed precisely by the SeverityBadge; the accent is a coarser cue.
const ACCENT_BY_LEVEL: Record<SecurityLevel, KapableAccentColor> = {
  critical: "red",
  high: "red",
  medium: "amber",
  low: "slate",
};

interface KapableSecurityFindingProps {
  title?: string;
  level?: string;
  children?: React.ReactNode;
}

export function KapableSecurityFinding({
  title,
  level,
  children,
}: KapableSecurityFindingProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const validLevel = isSecurityLevel(level) ? level : undefined;
  const accentColor: KapableAccentColor = validLevel
    ? ACCENT_BY_LEVEL[validLevel]
    : "slate";
  const content = typeof children === "string" ? children : "";

  return (
    <KapableCard
      accentColor={accentColor}
      showAccent
      isExpanded={isExpanded}
      onClick={() => setIsExpanded(!isExpanded)}
      data-testid="security-finding"
    >
      <KapableCardHeader
        icon={<ShieldAlert size={15} />}
        accentColor={accentColor}
      >
        {validLevel && <SeverityBadge level={validLevel} />}
        <span className="font-medium text-sm text-foreground truncate">
          {title || "Security finding"}
        </span>
        <div className="ml-auto">
          <KapableExpandIcon isExpanded={isExpanded} />
        </div>
      </KapableCardHeader>
      <KapableCardContent isExpanded={isExpanded}>
        {content && (
          <div
            className="prose prose-sm dark:prose-invert max-w-none cursor-text"
            onClick={(e) => e.stopPropagation()}
          >
            <VanillaMarkdownParser content={content} />
          </div>
        )}
      </KapableCardContent>
    </KapableCard>
  );
}
