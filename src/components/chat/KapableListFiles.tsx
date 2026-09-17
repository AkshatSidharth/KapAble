import React, { useState } from "react";
import { CustomTagState } from "./stateTypes";
import { FolderOpen } from "lucide-react";
import {
  KapableCard,
  KapableCardHeader,
  KapableBadge,
  KapableExpandIcon,
  KapableStateIndicator,
  KapableCardContent,
} from "./KapableCardPrimitives";

interface KapableListFilesProps {
  node: {
    properties: {
      directory?: string;
      recursive?: string;
      include_ignored?: string;
      state?: CustomTagState;
      appName?: string;
    };
  };
  children: React.ReactNode;
}

export function KapableListFiles({ node, children }: KapableListFilesProps) {
  const { directory, recursive, include_ignored, state, appName } =
    node.properties;
  const isLoading = state === "pending";
  const isRecursive = recursive === "true";
  const isIncludeIgnored = include_ignored === "true";
  const content = typeof children === "string" ? children : "";
  const [isExpanded, setIsExpanded] = useState(false);

  const title = directory ? directory : "List Files";

  return (
    <KapableCard
      state={state}
      accentColor="slate"
      isExpanded={isExpanded}
      onClick={() => setIsExpanded(!isExpanded)}
      data-testid="kapable-list-files"
    >
      <KapableCardHeader icon={<FolderOpen size={15} />} accentColor="slate">
        <span className="font-medium text-sm text-foreground truncate">
          {title}
        </span>
        {appName && <KapableBadge color="sky">{appName}</KapableBadge>}
        {isRecursive && <KapableBadge color="slate">recursive</KapableBadge>}
        {isIncludeIgnored && (
          <KapableBadge color="slate">include ignored</KapableBadge>
        )}
        {isLoading && (
          <KapableStateIndicator state="pending" pendingLabel="Listing..." />
        )}
        <div className="ml-auto">
          <KapableExpandIcon isExpanded={isExpanded} />
        </div>
      </KapableCardHeader>
      <KapableCardContent isExpanded={isExpanded}>
        {content && (
          <div className="p-3 text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto bg-muted/20 rounded-lg">
            {content}
          </div>
        )}
      </KapableCardContent>
    </KapableCard>
  );
}
