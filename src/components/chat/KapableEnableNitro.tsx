import React from "react";
import { Server } from "lucide-react";
import {
  KapableCard,
  KapableCardHeader,
  KapableBadge,
  KapableStateIndicator,
} from "./KapableCardPrimitives";
import { CustomTagState } from "./stateTypes";

interface KapableEnableNitroProps {
  state?: CustomTagState;
}

export const KapableEnableNitro: React.FC<KapableEnableNitroProps> = ({
  state,
}) => {
  const isPending = state === "pending";
  const isAborted = state === "aborted";
  const headline = isPending
    ? "Adding Nitro server layer"
    : isAborted
      ? "Nitro server layer setup aborted"
      : "Added Nitro server layer";
  return (
    <KapableCard accentColor="emerald" state={state}>
      <KapableCardHeader icon={<Server size={15} />} accentColor="emerald">
        <KapableBadge color="emerald">Server layer</KapableBadge>
        <span className="text-sm font-medium text-foreground">{headline}</span>
        {state && (
          <KapableStateIndicator state={state} abortedLabel="Did not finish" />
        )}
      </KapableCardHeader>
      {!isPending && !isAborted && (
        <div className="px-3 pb-3">
          <p className="text-xs text-muted-foreground leading-snug">
            API routes can now live under{" "}
            <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-muted">
              server/routes/api/
            </code>
          </p>
        </div>
      )}
    </KapableCard>
  );
};
