import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { VanillaMarkdownParser } from "./KapableMarkdownParser";
import { CustomTagState } from "./stateTypes";
import {
  KapableCard,
  KapableCardHeader,
  KapableBadge,
  KapableExpandIcon,
  KapableStateIndicator,
  KapableCardContent,
} from "./KapableCardPrimitives";

interface KapableWebSearchResultProps {
  node?: any;
  children?: React.ReactNode;
}

export const KapableWebSearchResult: React.FC<KapableWebSearchResultProps> = ({
  children,
  node,
}) => {
  const state = node?.properties?.state as CustomTagState;
  const inProgress = state === "pending";
  const [isExpanded, setIsExpanded] = useState(inProgress);

  useEffect(() => {
    if (!inProgress && isExpanded) {
      setIsExpanded(false);
    }
  }, [inProgress]);

  return (
    <KapableCard
      state={state}
      accentColor="blue"
      onClick={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    >
      <KapableCardHeader icon={<Globe size={15} />} accentColor="blue">
        <KapableBadge color="blue">Web Search Result</KapableBadge>
        {inProgress && (
          <KapableStateIndicator state="pending" pendingLabel="Loading..." />
        )}
        <div className="ml-auto">
          <KapableExpandIcon isExpanded={isExpanded} />
        </div>
      </KapableCardHeader>
      <KapableCardContent isExpanded={isExpanded}>
        <div className="text-sm text-muted-foreground">
          {typeof children === "string" ? (
            <VanillaMarkdownParser content={children} />
          ) : (
            children
          )}
        </div>
      </KapableCardContent>
    </KapableCard>
  );
};
