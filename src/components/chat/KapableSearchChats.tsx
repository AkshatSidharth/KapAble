import type React from "react";
import type { ReactNode } from "react";
import { useState } from "react";
import { MessagesSquare } from "lucide-react";
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

interface KapableSearchChatsProps {
  children?: ReactNode;
  node?: {
    properties?: {
      state?: CustomTagState;
      query?: string;
      indexStatus?: string;
      resultCount?: string;
    };
  };
}

export const KapableSearchChats: React.FC<KapableSearchChatsProps> = ({
  children,
  node,
}) => {
  const { t } = useTranslation("chat");
  const [isContentVisible, setIsContentVisible] = useState(false);

  const state = node?.properties?.state as CustomTagState;
  const inProgress = state === "pending";
  const aborted = state === "aborted";

  const query = node?.properties?.query || "";
  const indexStatus = node?.properties?.indexStatus || "";
  const resultCount = node?.properties?.resultCount;

  return (
    <KapableCard
      state={state}
      accentColor="violet"
      onClick={() => setIsContentVisible(!isContentVisible)}
      isExpanded={isContentVisible}
      data-testid="kapable-search-chats"
    >
      <KapableCardHeader icon={<MessagesSquare size={15} />} accentColor="violet">
        <KapableBadge color="violet">{t("searchChatsTool.badge")}</KapableBadge>
        <span className="font-medium text-sm text-foreground truncate">
          {`"${query}"`}
        </span>
        {resultCount !== undefined && !inProgress && (
          <span className="text-xs text-muted-foreground shrink-0">
            ({t("searchChatsTool.chatCount", { count: Number(resultCount) })})
          </span>
        )}
        {indexStatus === "indexing" && (
          <span className="text-xs text-muted-foreground shrink-0">
            {t("searchChatsTool.stillIndexing")}
          </span>
        )}
        {inProgress && (
          <KapableStateIndicator
            state="pending"
            pendingLabel={t("searchChatsTool.searching")}
          />
        )}
        {aborted && (
          <KapableStateIndicator
            state="aborted"
            abortedLabel={t("searchChatsTool.didNotFinish")}
          />
        )}
        <div className="ml-auto">
          <KapableExpandIcon isExpanded={isContentVisible} />
        </div>
      </KapableCardHeader>
      <KapableCardContent isExpanded={isContentVisible}>
        <div className="text-xs" onClick={(e) => e.stopPropagation()}>
          <CodeHighlight className="language-log">{children}</CodeHighlight>
        </div>
      </KapableCardContent>
    </KapableCard>
  );
};
