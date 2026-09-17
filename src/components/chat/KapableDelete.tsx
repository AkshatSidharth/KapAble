import type React from "react";
import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import {
  KapableCard,
  KapableCardHeader,
  KapableBadge,
  KapableFilePath,
  KapableDescription,
} from "./KapableCardPrimitives";
import { CustomTagState } from "./stateTypes";

interface KapableDeleteProps {
  children?: ReactNode;
  node?: any;
  path?: string;
}

export const KapableDelete: React.FC<KapableDeleteProps> = ({
  children,
  node,
  path: pathProp,
}) => {
  const path = pathProp || node?.properties?.path || "";
  const state = node?.properties?.state as CustomTagState;
  const fileName = path ? path.split("/").pop() : "";

  return (
    <KapableCard accentColor="red" state={state}>
      <KapableCardHeader icon={<Trash2 size={15} />} accentColor="red">
        {fileName && (
          <span className="font-medium text-sm text-foreground truncate">
            {fileName}
          </span>
        )}
        <KapableBadge color="red">Delete</KapableBadge>
      </KapableCardHeader>
      <KapableFilePath path={path} />
      {children && <KapableDescription>{children}</KapableDescription>}
    </KapableCard>
  );
};
