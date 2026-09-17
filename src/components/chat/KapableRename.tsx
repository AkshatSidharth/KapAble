import type React from "react";
import type { ReactNode } from "react";
import { FileEdit } from "lucide-react";
import {
  KapableCard,
  KapableCardHeader,
  KapableBadge,
  KapableFilePath,
  KapableDescription,
} from "./KapableCardPrimitives";
import { CustomTagState } from "./stateTypes";

interface KapableRenameProps {
  children?: ReactNode;
  node?: any;
  from?: string;
  to?: string;
}

export const KapableRename: React.FC<KapableRenameProps> = ({
  children,
  node,
  from: fromProp,
  to: toProp,
}) => {
  const from = fromProp || node?.properties?.from || "";
  const to = toProp || node?.properties?.to || "";
  const state = node?.properties?.state as CustomTagState;

  const fromFileName = from ? from.split("/").pop() : "";
  const toFileName = to ? to.split("/").pop() : "";

  const displayTitle =
    fromFileName && toFileName
      ? `${fromFileName} → ${toFileName}`
      : fromFileName || toFileName || "";

  return (
    <KapableCard accentColor="amber" state={state}>
      <KapableCardHeader icon={<FileEdit size={15} />} accentColor="amber">
        {displayTitle && (
          <span className="font-medium text-sm text-foreground truncate">
            {displayTitle}
          </span>
        )}
        <KapableBadge color="amber">Rename</KapableBadge>
      </KapableCardHeader>
      {from && <KapableFilePath path={`From: ${from}`} />}
      {to && <KapableFilePath path={`To: ${to}`} />}
      {children && <KapableDescription>{children}</KapableDescription>}
    </KapableCard>
  );
};
