import React from "react";
import { CustomTagState } from "./stateTypes";
import { Database } from "lucide-react";
import {
  KapableCard,
  KapableCardHeader,
  KapableBadge,
  KapableStateIndicator,
} from "./KapableCardPrimitives";

interface KapableDatabaseSchemaProps {
  node: {
    properties: {
      state?: CustomTagState;
    };
  };
  children: React.ReactNode;
}

export function KapableDatabaseSchema({
  node,
  children,
}: KapableDatabaseSchemaProps) {
  const { state } = node.properties;
  const isLoading = state === "pending";
  const content = typeof children === "string" ? children : "";

  return (
    <KapableCard state={state} accentColor="teal">
      <KapableCardHeader icon={<Database size={15} />} accentColor="teal">
        <KapableBadge color="teal">Database Schema</KapableBadge>
        {isLoading && <KapableStateIndicator state="pending" />}
      </KapableCardHeader>
      {content && (
        <div className="px-3 pb-3">
          <div className="p-3 text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto bg-muted/20 rounded-lg">
            {content}
          </div>
        </div>
      )}
    </KapableCard>
  );
}
