import type React from "react";
import type { ReactNode } from "react";
import { Copy } from "lucide-react";
import {
  KapableCard,
  KapableCardHeader,
  KapableBadge,
  KapableFilePath,
  KapableDescription,
  KapableStateIndicator,
} from "./KapableCardPrimitives";
import { CustomTagState } from "./stateTypes";

interface KapableCopyProps {
  children?: ReactNode;
  node?: any;
}

export const KapableCopy: React.FC<KapableCopyProps> = ({ children, node }) => {
  const from = node?.properties?.from || "";
  const to = node?.properties?.to || "";
  const description = node?.properties?.description || "";
  const state = node?.properties?.state as CustomTagState;

  const toFileName = to ? to.split("/").pop() : "";
  // Hide the "From" line for temp attachment paths (absolute paths) since they
  // show cryptic hash filenames that mean nothing to the user.
  const isTempAttachment =
    /^(\/|[A-Za-z]:\\)/.test(from) || from.includes(".kapable/media/");

  return (
    <KapableCard accentColor="teal" state={state}>
      <KapableCardHeader icon={<Copy size={15} />} accentColor="teal">
        {toFileName && (
          <span className="font-medium text-sm text-foreground truncate">
            {toFileName}
          </span>
        )}
        <KapableBadge color="teal">Copy</KapableBadge>
        <span className="ml-auto">
          {state === "pending" && (
            <KapableStateIndicator state="pending" pendingLabel="Copying..." />
          )}
          {state === "aborted" && (
            <KapableStateIndicator
              state="aborted"
              abortedLabel="Did not finish"
            />
          )}
          {state === "finished" && (
            <KapableStateIndicator state="finished" finishedLabel="Copied" />
          )}
        </span>
      </KapableCardHeader>
      {from && !isTempAttachment && <KapableFilePath path={`From: ${from}`} />}
      {to && <KapableFilePath path={`To: ${to}`} />}
      {description && <KapableDescription>{description}</KapableDescription>}
      {children && <KapableDescription>{children}</KapableDescription>}
    </KapableCard>
  );
};
