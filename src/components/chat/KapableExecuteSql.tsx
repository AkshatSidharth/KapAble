import type React from "react";
import type { ReactNode } from "react";
import { Children, useMemo, useState } from "react";
import { AlertTriangle, Database } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CodeHighlight } from "./CodeHighlight";
import { CustomTagState } from "./stateTypes";
import {
  KapableCard,
  KapableCardHeader,
  KapableBadge,
  KapableExpandIcon,
  KapableStateIndicator,
  KapableCardContent,
} from "./KapableCardPrimitives";
import {
  doesSqlDeleteData,
  doesSqlMutateSchema,
} from "@/lib/sqlSchemaMutation";

interface KapableExecuteSqlProps {
  children?: ReactNode;
  node?: any;
  description?: string;
}

function extractSqlText(children: ReactNode): string {
  if (typeof children === "string") return children;
  return Children.toArray(children)
    .map((child) => (typeof child === "string" ? child : ""))
    .join("");
}

export const KapableExecuteSql: React.FC<KapableExecuteSqlProps> = ({
  children,
  node,
  description,
}) => {
  const { t } = useTranslation("chat");
  const [isContentVisible, setIsContentVisible] = useState(false);
  const state = node?.properties?.state as CustomTagState;
  const inProgress = state === "pending";
  const aborted = state === "aborted";
  const queryDescription = description || node?.properties?.description;
  const sqlText = extractSqlText(children);
  const sqlMutatesSchema = useMemo(
    () => (sqlText ? doesSqlMutateSchema(sqlText) : false),
    [sqlText],
  );
  const sqlDeletesData = useMemo(
    () => (sqlText ? doesSqlDeleteData(sqlText) : false),
    [sqlText],
  );

  return (
    <KapableCard
      state={state}
      accentColor="teal"
      isExpanded={isContentVisible}
      onClick={() => setIsContentVisible(!isContentVisible)}
    >
      <KapableCardHeader icon={<Database size={15} />} accentColor="teal">
        <KapableBadge color="teal">SQL</KapableBadge>
        {sqlMutatesSchema && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            {t("changesDatabaseSchema")}
          </span>
        )}
        {sqlDeletesData && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            {t("destructiveDataChange")}
          </span>
        )}
        {queryDescription && (
          <span className="font-medium text-sm text-foreground truncate">
            {queryDescription}
          </span>
        )}
        {inProgress && (
          <KapableStateIndicator state="pending" pendingLabel="Executing..." />
        )}
        {aborted && (
          <KapableStateIndicator
            state="aborted"
            abortedLabel="Did not finish"
          />
        )}
        <div className="ml-auto">
          <KapableExpandIcon isExpanded={isContentVisible} />
        </div>
      </KapableCardHeader>
      <KapableCardContent isExpanded={isContentVisible}>
        <div className="text-xs">
          <CodeHighlight className="language-sql">{children}</CodeHighlight>
        </div>
      </KapableCardContent>
    </KapableCard>
  );
};
