import type { FC, ReactNode } from "react";
import { Globe } from "lucide-react";
import {
  KapableCard,
  KapableCardHeader,
  KapableBadge,
  KapableStateIndicator,
} from "./KapableCardPrimitives";
import { CustomTagState } from "./stateTypes";

interface KapableWebFetchProps {
  children?: ReactNode;
  node?: {
    properties: {
      state?: CustomTagState;
    };
  };
}

export const KapableWebFetch: FC<KapableWebFetchProps> = ({ children, node }) => {
  const state = node?.properties?.state as CustomTagState;

  return (
    <KapableCard state={state} accentColor="blue">
      <KapableCardHeader icon={<Globe size={15} />} accentColor="blue">
        <KapableBadge color="blue">Web Fetch</KapableBadge>
        {state && (
          <KapableStateIndicator
            state={state}
            pendingLabel="Fetching..."
            finishedLabel="Done"
            abortedLabel="Aborted"
          />
        )}
      </KapableCardHeader>
      {children && (
        <div className="px-3 pb-2 text-sm italic text-muted-foreground">
          {children}
        </div>
      )}
    </KapableCard>
  );
};
