import type React from "react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Zap } from "lucide-react";
import { CodeHighlight } from "./CodeHighlight";
import { CustomTagState } from "./stateTypes";
import {
  KapableCard,
  KapableCardHeader,
  KapableBadge,
  KapableExpandIcon,
  KapableStateIndicator,
  KapableDescription,
  KapableCardContent,
} from "./KapableCardPrimitives";

interface KapableEditProps {
  children?: ReactNode;
  node?: any;
  path?: string;
  description?: string;
}

export const KapableEdit: React.FC<KapableEditProps> = ({
  children,
  node,
  path: pathProp,
  description: descriptionProp,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const path = pathProp || node?.properties?.path || "";
  const description = descriptionProp || node?.properties?.description || "";
  const state = node?.properties?.state as CustomTagState;
  const inProgress = state === "pending";
  const aborted = state === "aborted";

  const fileName = path ? path.split("/").pop() : "";

  return (
    <KapableCard
      state={state}
      accentColor="sky"
      onClick={() => setIsContentVisible(!isContentVisible)}
      isExpanded={isContentVisible}
    >
      <KapableCardHeader icon={<Zap size={15} />} accentColor="sky">
        <div className="min-w-0 truncate">
          {fileName && (
            <span className="font-medium text-sm text-foreground truncate block">
              {fileName}
            </span>
          )}
          {path && (
            <span className="text-[11px] text-muted-foreground truncate block">
              {path}
            </span>
          )}
        </div>
        {inProgress && (
          <KapableStateIndicator state="pending" pendingLabel="Editing..." />
        )}
        {aborted && (
          <KapableStateIndicator
            state="aborted"
            abortedLabel="Did not finish"
          />
        )}
        <div className="ml-auto flex items-center gap-1">
          <KapableBadge color="sky">Turbo Edit</KapableBadge>
          <KapableExpandIcon isExpanded={isContentVisible} />
        </div>
      </KapableCardHeader>
      {description && (
        <KapableDescription>
          <span className={!isContentVisible ? "line-clamp-2" : undefined}>
            <span className="font-medium">Summary: </span>
            {description}
          </span>
        </KapableDescription>
      )}
      <KapableCardContent isExpanded={isContentVisible}>
        <div
          className="text-xs cursor-text"
          onClick={(e) => e.stopPropagation()}
        >
          <CodeHighlight className="language-typescript">
            {children}
          </CodeHighlight>
        </div>
      </KapableCardContent>
    </KapableCard>
  );
};
