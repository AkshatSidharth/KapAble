import React, { useDeferredValue, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { KapableWrite } from "./KapableWrite";
import { KapableRename } from "./KapableRename";
import { KapableCopy } from "./KapableCopy";
import { KapableDelete } from "./KapableDelete";
import { KapableAddDependency } from "./KapableAddDependency";
import { KapableExecuteSql } from "./KapableExecuteSql";
import { KapableLogs } from "./KapableLogs";
import { KapableGrep } from "./KapableGrep";
import { KapableSearchChats } from "./KapableSearchChats";
import { KapableReadChat } from "./KapableReadChat";
import { KapableExploreCode } from "./KapableExploreCode";
import { KapableExploreChatHistory } from "./KapableExploreChatHistory";
import { KapableAddIntegration } from "./KapableAddIntegration";
import { KapableEnableNitro } from "./KapableEnableNitro";
import { KapableEdit } from "./KapableEdit";
import { KapableSearchReplace } from "./KapableSearchReplace";
import { KapableCodebaseContext } from "./KapableCodebaseContext";
import { KapableThink } from "./KapableThink";
import { CodeHighlight } from "./CodeHighlight";
import { useAtomValue } from "jotai";
import { selectedChatIdAtom } from "@/atoms/chatAtoms";
import {
  useChatStreamPreview,
  useChatStreamState,
} from "@/hooks/useChatStream";
import { isStreamActive } from "@/chat_stream/transition";
import { CustomTagState } from "./stateTypes";
import { KapableOutput } from "./KapableOutput";
import { KapableProblemSummary } from "./KapableProblemSummary";
import { KapableSecurityFinding } from "./KapableSecurityFinding";
import { ipc } from "@/ipc/types";
import { KapableMcpToolCall } from "./KapableMcpToolCall";
import { KapableMcpToolResult } from "./KapableMcpToolResult";
import {
  buildMcpPairing,
  EMPTY_MCP_PAIRING,
  type McpPairing,
  type CustomTagBlock,
} from "./mcpPairing";
import { KapableMcpToolSearch } from "./KapableMcpToolSearch";
import { KapableMcpToolSchema } from "./KapableMcpToolSchema";
import { KapableWebSearchResult } from "./KapableWebSearchResult";
import { KapableWebSearch } from "./KapableWebSearch";
import { KapableWebCrawl } from "./KapableWebCrawl";
import { KapableWebFetch } from "./KapableWebFetch";
import { KapableImageGeneration } from "./KapableImageGeneration";
import { KapableCodeSearchResult } from "./KapableCodeSearchResult";
import { KapableCodeSearch } from "./KapableCodeSearch";
import { KapableRead } from "./KapableRead";
import { KapableListFiles } from "./KapableListFiles";
import { KapableDatabaseSchema } from "./KapableDatabaseSchema";
import { KapableDbTableSchema } from "./KapableDbTableSchema";
import { KapableSupabaseProjectInfo } from "./KapableSupabaseProjectInfo";
import { KapableNeonProjectInfo } from "./KapableNeonProjectInfo";
import { KapableStatus } from "./KapableStatus";
import { KapableCompaction } from "./KapableCompaction";
import { KapableWritePlan } from "./KapableWritePlan";
import { KapableExitPlan } from "./KapableExitPlan";
import { KapableQuestionnaire } from "./KapableQuestionnaire";
import { KapableStepLimit } from "./KapableStepLimit";
import { KapableAppBlueprintCard } from "./KapableAppBlueprintCard";
import { KapableTestAssertionsCard } from "./KapableTestAssertionsCard";
import { KapableReadGuide } from "./KapableReadGuide";
import { KapableScript } from "./KapableScript";
import { KapableGit } from "./KapableGit";
import { KapableSubagent } from "./KapableSubagent";
import { mapActionToButton } from "./ChatInput";
import { SuggestedAction } from "@/lib/schemas";
import { FixAllErrorsButton } from "./FixAllErrorsButton";
import {
  advanceParser,
  type Block,
  getOpenBlock,
  initialParserState,
  parseFullMessage,
  type ParserState,
} from "@/lib/streamingMessageParser";

interface KapableMarkdownParserProps {
  content: string;
  messageId?: number;
  showStreamingPreview?: boolean;
}

const customLink = ({
  node: _node,
  ...props
}: {
  node?: any;
  [key: string]: any;
}) => (
  <a
    {...props}
    onClick={(e) => {
      const url = props.href;
      if (url) {
        e.preventDefault();
        ipc.system.openExternalUrl(url);
      }
    }}
  />
);

export const VanillaMarkdownParser = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: CodeHighlight,
        a: customLink,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

/**
 * Custom component to parse markdown content with KapAble-specific tags.
 *
 * The block list is sourced from a component-local incremental parser. Completed
 * blocks keep referential identity across streaming chunks, so React.memo can
 * skip prior blocks and leave only the open trailing block to re-render.
 */
export const KapableMarkdownParser: React.FC<KapableMarkdownParserProps> = ({
  content,
  messageId,
  showStreamingPreview = false,
}) => {
  const chatId = useAtomValue(selectedChatIdAtom);
  const streamState = useChatStreamState(chatId ?? undefined) ?? {
    type: "idle",
  };
  const isStreaming = isStreamActive(streamState);
  const deferredContent = useDeferredValue(content);
  const contentToParse = isStreaming ? deferredContent : content;

  // Component-local parser cache. Closed-block refs stay stable across chunks
  // so MemoClosedBlocks can skip its subtree; only the open trailing block
  // changes shape per chunk. On prefix-mismatch (full-message replace, etc.)
  // we restart from initialParserState — same correctness as a one-shot parse.
  //
  // Note: we write to parserCacheRef inside useMemo. React docs flag this as
  // a side effect during render; in practice the cache is purely advisory and
  // advanceParser is deterministic on (state, content), so the worst case
  // (StrictMode dev double-render, discarded concurrent render) is a wasted
  // re-parse, not a correctness issue.
  const parserCacheRef = useRef<{
    messageId?: number;
    content: string;
    state: ParserState;
  } | null>(null);

  const parserState = useMemo(() => {
    const cached = parserCacheRef.current;
    if (
      cached &&
      cached.messageId === messageId &&
      contentToParse.startsWith(cached.content)
    ) {
      const state = advanceParser(cached.state, contentToParse);
      parserCacheRef.current = { messageId, content: contentToParse, state };
      return state;
    }
    const state = advanceParser(initialParserState(), contentToParse);
    parserCacheRef.current = { messageId, content: contentToParse, state };
    return state;
  }, [messageId, contentToParse]);

  const closedBlocks = parserState.blocks;
  const openBlock = getOpenBlock(parserState);

  // Pair MCP tool-call blocks with their tool-result blocks by call-id so the
  // renderer can collapse the two into one card. Keyed on `closedBlocks`, which
  // only changes when a block closes (not per streamed token), so the scan
  // stays off the streaming hot path.
  const mcpPairing = useMemo(
    () => buildMcpPairing(closedBlocks),
    [closedBlocks],
  );

  // The button is hidden while streaming, so avoid scanning the block list on
  // every chunk. Do the full scan only for settled content.
  const { errorMessages, errorCount, lastErrorIndex } = useMemo(() => {
    if (isStreaming) {
      return EMPTY_ERROR_SCAN;
    }
    const errors: string[] = [];
    let lastIndex = -1;
    closedBlocks.forEach((block, index) => {
      if (
        block.kind === "custom-tag" &&
        block.tag === "kapable-output" &&
        block.attributes.type === "error"
      ) {
        const msg = block.attributes.message?.trim();
        if (msg) {
          errors.push(msg);
          lastIndex = index;
        }
      }
    });
    return {
      errorMessages: errors,
      errorCount: errors.length,
      lastErrorIndex: lastIndex,
    };
  }, [closedBlocks, isStreaming]);

  const showFixAll =
    errorCount > 1 && !isStreaming && chatId !== null && chatId !== undefined;

  return (
    <>
      <MemoClosedBlocks
        blocks={closedBlocks}
        lastErrorIndex={lastErrorIndex}
        errorMessages={errorMessages}
        showFixAll={showFixAll}
        chatId={chatId ?? null}
        resultByCallId={mcpPairing.resultByCallId}
        callIds={mcpPairing.callIds}
        isStreaming={isStreaming}
      />
      {openBlock ? renderOpenBlock(openBlock, isStreaming, mcpPairing) : null}
      {showStreamingPreview && chatId !== null && chatId !== undefined && (
        <StreamingPreviewBlocks chatId={chatId} isStreaming={isStreaming} />
      )}
    </>
  );
};

// Stable ref for the "nothing to scan" return path so MemoClosedBlocks's
// memo doesn't invalidate every render during streaming.
const EMPTY_ERROR_SCAN: {
  errorMessages: string[];
  errorCount: number;
  lastErrorIndex: number;
} = { errorMessages: [], errorCount: 0, lastErrorIndex: -1 };

function StreamingPreviewBlocks({
  chatId,
  isStreaming,
}: {
  chatId: number;
  isStreaming: boolean;
}) {
  const previewXml = useChatStreamPreview(chatId);
  const previewBlocks = useMemo<Block[] | null>(() => {
    if (!previewXml) return null;
    return parseFullMessage(previewXml).blocks;
  }, [previewXml]);

  const previewPairing = useMemo(
    () => (previewBlocks ? buildMcpPairing(previewBlocks) : EMPTY_MCP_PAIRING),
    [previewBlocks],
  );

  if (!previewBlocks) return null;

  return (
    <>
      {previewBlocks.map((block) => (
        <React.Fragment key={`preview-${block.id}`}>
          {renderOpenBlock(block, isStreaming, previewPairing)}
        </React.Fragment>
      ))}
    </>
  );
}

function renderBlock(block: Block, isStreaming: boolean): React.ReactNode {
  if (block.kind === "markdown") {
    return block.content ? <MemoMarkdown content={block.content} /> : null;
  }
  return <MemoBlockCustomTag block={block} isStreaming={isStreaming} />;
}

// Render the trailing open block, accounting for MCP pairing: an open
// tool-call shows as a pending card; an open tool-result whose call already
// has a card is hidden (the call card will absorb it once it closes).
function renderOpenBlock(
  block: Block,
  isStreaming: boolean,
  pairing: McpPairing,
): React.ReactNode {
  if (block.kind === "custom-tag") {
    const callId = block.attributes["call-id"];
    if (callId && block.tag === "kapable-mcp-tool-call") {
      return (
        <MemoMcpToolPair
          callBlock={block}
          resultBlock={pairing.resultByCallId.get(callId)}
          isStreaming={isStreaming}
        />
      );
    }
    if (
      callId &&
      block.tag === "kapable-mcp-tool-result" &&
      pairing.callIds.has(callId)
    ) {
      return null;
    }
  }
  return renderBlock(block, isStreaming);
}

// Render a closed block, collapsing MCP call/result pairs into one card and
// hiding the standalone result block that the call card now renders.
function renderClosedBlock(
  block: Block,
  {
    resultByCallId,
    callIds,
    isStreaming,
  }: {
    resultByCallId: Map<string, CustomTagBlock>;
    callIds: Set<string>;
    isStreaming: boolean;
  },
): React.ReactNode {
  if (block.kind === "custom-tag") {
    const callId = block.attributes["call-id"];
    if (callId && block.tag === "kapable-mcp-tool-call") {
      return (
        <MemoMcpToolPair
          callBlock={block}
          resultBlock={resultByCallId.get(callId)}
          isStreaming={isStreaming}
        />
      );
    }
    // Hide the standalone result only when its call is on screen to absorb it;
    // an unmatched result still renders on its own.
    if (
      callId &&
      block.tag === "kapable-mcp-tool-result" &&
      callIds.has(callId)
    ) {
      return null;
    }
  }
  return renderBlock(block, false);
}

// One card for an MCP tool call + its result. Memoizes on both block refs;
// once the result is present the card is "finished" regardless of streaming,
// so isStreaming is only compared while still waiting for a result.
const MemoMcpToolPair = React.memo(
  function MemoMcpToolPair({
    callBlock,
    resultBlock,
    isStreaming,
  }: {
    callBlock: CustomTagBlock;
    resultBlock: CustomTagBlock | undefined;
    isStreaming: boolean;
  }) {
    const isError = resultBlock?.attributes["is-error"] === "true";
    const state: CustomTagState = !resultBlock
      ? isStreaming
        ? "pending"
        : "aborted"
      : isError
        ? "aborted"
        : "finished";
    return (
      <KapableMcpToolCall
        node={{
          properties: {
            serverName: callBlock.attributes.server || "",
            toolName: callBlock.attributes.tool || "",
            autoApprovedReason:
              callBlock.attributes["auto-approved-reason"] || "",
          },
        }}
        resultContent={resultBlock?.content}
        state={state}
        isError={isError}
      >
        {callBlock.content}
      </KapableMcpToolCall>
    );
  },
  (prev, next) =>
    prev.callBlock === next.callBlock &&
    prev.resultBlock === next.resultBlock &&
    (next.resultBlock != null || prev.isStreaming === next.isStreaming),
);

// Memoized wrapper for closed blocks. Memo hits when blocks ref + error
// props are unchanged, so the closed-block subtree is skipped per chunk.
// Closed children also memo on `prev.block === next.block` and skip their
// subtrees on commit chunks.
const MemoClosedBlocks = React.memo(function MemoClosedBlocks({
  blocks,
  lastErrorIndex,
  errorMessages,
  showFixAll,
  chatId,
  resultByCallId,
  callIds,
  isStreaming,
}: {
  blocks: Block[];
  lastErrorIndex: number;
  errorMessages: string[];
  showFixAll: boolean;
  chatId: number | null;
  resultByCallId: Map<string, CustomTagBlock>;
  callIds: Set<string>;
  isStreaming: boolean;
}) {
  // Hoisted once per render rather than allocated per block in the map.
  const mcpCtx = { resultByCallId, callIds, isStreaming };
  return (
    <>
      {blocks.map((block, index) => (
        <React.Fragment key={block.id}>
          {renderClosedBlock(block, mcpCtx)}
          {showFixAll &&
            index === lastErrorIndex &&
            chatId !== null &&
            chatId !== undefined && (
              <div className="mt-3 w-full flex">
                <FixAllErrorsButton
                  errorMessages={errorMessages}
                  chatId={chatId}
                />
              </div>
            )}
        </React.Fragment>
      ))}
    </>
  );
});

// Module-level constants so MemoMarkdown never gets fresh refs for these
// props, which would defeat ReactMarkdown's internal prop-equality checks.
const REMARK_PLUGINS = [remarkGfm];
const MARKDOWN_COMPONENTS = { code: CodeHighlight, a: customLink };

// Memoized markdown piece. Without this, ReactMarkdown re-parses every
// completed segment's text into an AST on every streaming chunk.
const MemoMarkdown = React.memo(function MemoMarkdown({
  content,
}: {
  content: string;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={REMARK_PLUGINS}
      components={MARKDOWN_COMPONENTS}
    >
      {content}
    </ReactMarkdown>
  );
});

// Memoized custom-tag block. The incremental parser preserves the Block
// reference for any completed (closed) tag across streaming patches, so
// referential equality on `block` is sufficient — completed blocks
// short-circuit and skip renderCustomTag entirely.
const MemoBlockCustomTag = React.memo(
  function MemoBlockCustomTag({
    block,
    isStreaming,
  }: {
    block: CustomTagBlock;
    isStreaming: boolean;
  }) {
    return <>{renderCustomTag(block, { isStreaming })}</>;
  },
  (prev, next) =>
    prev.block === next.block &&
    // Completed tags ignore isStreaming (getState returns "finished"
    // regardless), so skip the check to avoid one-time re-renders of every
    // completed tag when streaming ends.
    (prev.block.inProgress === false || prev.isStreaming === next.isStreaming),
);

function getState({
  isStreaming,
  inProgress,
  explicitState,
}: {
  isStreaming?: boolean;
  inProgress?: boolean;
  explicitState?: string;
}): CustomTagState {
  if (
    explicitState === "aborted" ||
    explicitState === "error" ||
    explicitState === "finished" ||
    explicitState === "warning"
  ) {
    return explicitState;
  }
  if (explicitState === "in-progress" || explicitState === "pending") {
    return "pending";
  }
  if (!inProgress) {
    return "finished";
  }
  return isStreaming ? "pending" : "aborted";
}

/**
 * Render a custom tag based on its type
 */
function renderCustomTag(
  block: CustomTagBlock,
  { isStreaming }: { isStreaming: boolean },
): React.ReactNode {
  const { tag, attributes, content, inProgress } = block;

  switch (tag) {
    case "kapable-subagent": {
      const subagentChatId = Number(attributes["chat-id"]);
      if (!Number.isSafeInteger(subagentChatId)) return null;
      return (
        <KapableSubagent
          chatId={subagentChatId}
          threadId={attributes["thread-id"] || ""}
          persona={attributes.persona || "agent"}
          taskName={attributes["task-name"] || "Sub-agent task"}
          renderActivity={(xml, activityId) => (
            <KapableMarkdownParser content={xml} messageId={activityId} />
          )}
        />
      );
    }
    case "kapable-read":
      return (
        <KapableRead
          node={{
            properties: {
              path: attributes.path || "",
              startLine: attributes.start_line || "",
              endLine: attributes.end_line || "",
              appName: attributes.app_name || "",
            },
          }}
        >
          {content}
        </KapableRead>
      );
    case "kapable-git":
      return (
        <KapableGit
          node={{
            properties: {
              ...attributes,
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableGit>
      );
    case "kapable-web-search":
      return (
        <KapableWebSearch
          node={{
            properties: {
              query: attributes.query || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableWebSearch>
      );
    case "kapable-search-chats":
      return (
        <KapableSearchChats
          node={{
            properties: {
              query: attributes.query || "",
              indexStatus: attributes["index-status"] || "",
              resultCount: attributes["result-count"],
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state as CustomTagState,
              }),
            },
          }}
        >
          {content}
        </KapableSearchChats>
      );
    case "kapable-read-chat":
      return (
        <KapableReadChat
          node={{
            properties: {
              chatId: attributes["chat-id"] || "",
              title: attributes.title || "",
              range: attributes.range || "",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state as CustomTagState,
              }),
            },
          }}
        >
          {content}
        </KapableReadChat>
      );
    case "kapable-web-crawl":
      return (
        <KapableWebCrawl
          node={{
            properties: {},
          }}
        >
          {content}
        </KapableWebCrawl>
      );
    case "kapable-web-fetch":
      return (
        <KapableWebFetch
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableWebFetch>
      );
    case "kapable-code-search":
      return (
        <KapableCodeSearch
          node={{
            properties: {
              query: attributes.query || "",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
              appName: attributes.app_name || "",
            },
          }}
        >
          {content}
        </KapableCodeSearch>
      );
    case "kapable-code-search-result":
      return (
        <KapableCodeSearchResult
          node={{
            properties: {},
          }}
        >
          {content}
        </KapableCodeSearchResult>
      );
    case "kapable-web-search-result":
      return (
        <KapableWebSearchResult
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableWebSearchResult>
      );
    case "think":
      return (
        <KapableThink
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableThink>
      );
    // "kapable-generate-test" is legacy: no longer emitted, but historical chats
    // still contain it. Both tags carry a path/description and a file body, so
    // the old test cards render as plain file-write cards instead of raw markup.
    case "kapable-generate-test":
    case "kapable-write":
      return (
        <KapableWrite
          node={{
            properties: {
              path: attributes.path || "",
              description: attributes.description || "",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
            },
          }}
        >
          {content}
        </KapableWrite>
      );

    case "kapable-rename":
      return (
        <KapableRename
          node={{
            properties: {
              from: attributes.from || "",
              to: attributes.to || "",
            },
          }}
        >
          {content}
        </KapableRename>
      );

    case "kapable-copy":
      return (
        <KapableCopy
          node={{
            properties: {
              from: attributes.from || "",
              to: attributes.to || "",
              description: attributes.description || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableCopy>
      );

    case "kapable-delete":
      return (
        <KapableDelete
          node={{
            properties: {
              path: attributes.path || "",
            },
          }}
        >
          {content}
        </KapableDelete>
      );

    case "kapable-add-dependency":
      return (
        <KapableAddDependency
          node={{
            properties: {
              packages: attributes.packages || "",
            },
          }}
        >
          {content}
        </KapableAddDependency>
      );

    case "kapable-execute-sql":
      return (
        <KapableExecuteSql
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
              description: attributes.description || "",
            },
          }}
        >
          {content}
        </KapableExecuteSql>
      );

    case "kapable-read-logs":
      return (
        <KapableLogs
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
              time: attributes.time || "",
              type: attributes.type || "",
              level: attributes.level || "",
              count: attributes.count || "",
            },
          }}
        >
          {content}
        </KapableLogs>
      );

    case "kapable-grep":
      return (
        <KapableGrep
          node={{
            properties: {
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
              query: attributes.query || "",
              include: attributes.include || "",
              exclude: attributes.exclude || "",
              "case-sensitive": attributes["case-sensitive"] || "",
              count: attributes.count || "",
              total: attributes.total || "",
              truncated: attributes.truncated || "",
              appName: attributes.app_name || "",
            },
          }}
        >
          {content}
        </KapableGrep>
      );

    case "kapable-explore-chat-history":
      return (
        <KapableExploreChatHistory
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
              query: attributes.query || "",
              chats: attributes.chats || "",
              evidence: attributes.evidence || "",
              outcome: attributes.outcome || "",
            },
          }}
        >
          {content}
        </KapableExploreChatHistory>
      );

    case "kapable-explore-code":
      return (
        <KapableExploreCode
          node={{
            properties: {
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
              query: attributes.query || "",
              appName: attributes.app_name || "",
              files: attributes.files || "",
              symbols: attributes.symbols || "",
              indexMs: attributes.index_ms || "",
              searchMs: attributes.search_ms || "",
              truncated: attributes.truncated || "",
            },
          }}
        >
          {content}
        </KapableExploreCode>
      );

    case "kapable-add-integration":
      return (
        <KapableAddIntegration
          provider={
            attributes.provider === "neon" || attributes.provider === "supabase"
              ? attributes.provider
              : undefined
          }
          outcome={
            attributes.outcome === "pending" ||
            attributes.outcome === "skipped" ||
            attributes.outcome === "completed" ||
            attributes.outcome === "dismissed"
              ? attributes.outcome
              : undefined
          }
        >
          {content}
        </KapableAddIntegration>
      );

    case "kapable-enable-nitro":
      return (
        <KapableEnableNitro state={getState({ isStreaming, inProgress })} />
      );

    case "kapable-edit":
      return (
        <KapableEdit
          node={{
            properties: {
              path: attributes.path || "",
              description: attributes.description || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableEdit>
      );

    case "kapable-search-replace":
      return (
        <KapableSearchReplace
          node={{
            properties: {
              path: attributes.path || "",
              description: attributes.description || "",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
            },
          }}
        >
          {content}
        </KapableSearchReplace>
      );

    case "kapable-codebase-context":
      return (
        <KapableCodebaseContext
          node={{
            properties: {
              files: attributes.files || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableCodebaseContext>
      );

    case "kapable-mcp-tool-search":
      return (
        <KapableMcpToolSearch
          node={{
            properties: {
              query: attributes.query || "",
              server: attributes.server || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableMcpToolSearch>
      );

    case "kapable-mcp-tool-schema":
      return (
        <KapableMcpToolSchema
          node={{
            properties: {
              tools: attributes.tools || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableMcpToolSchema>
      );
    case "kapable-mcp-tool-call":
      return (
        <KapableMcpToolCall
          node={{
            properties: {
              serverName: attributes.server || "",
              toolName: attributes.tool || "",
              autoApprovedReason: attributes["auto-approved-reason"] || "",
            },
          }}
        >
          {content}
        </KapableMcpToolCall>
      );

    case "kapable-mcp-tool-result":
      return (
        <KapableMcpToolResult
          node={{
            properties: {
              serverName: attributes.server || "",
              toolName: attributes.tool || "",
            },
          }}
        >
          {content}
        </KapableMcpToolResult>
      );

    case "kapable-output":
      return (
        <KapableOutput
          type={attributes.type as "warning" | "error"}
          message={attributes.message}
        >
          {content}
        </KapableOutput>
      );

    case "kapable-script":
      return (
        <KapableScript
          node={{
            properties: {
              description: attributes.description || "",
              truncated: attributes.truncated || "",
              executionMs: attributes["execution-ms"] || "",
              fullOutputPath: attributes["full-output-path"] || "",
            },
          }}
        >
          {content}
        </KapableScript>
      );

    case "kapable-problem-report":
      return (
        <KapableProblemSummary summary={attributes.summary}>
          {content}
        </KapableProblemSummary>
      );

    case "kapable-security-finding":
      return (
        <KapableSecurityFinding
          title={attributes.title}
          level={attributes.level}
        >
          {content}
        </KapableSecurityFinding>
      );

    case "kapable-chat-summary":
      // Don't render anything for kapable-chat-summary
      return null;

    case "kapable-command":
      if (attributes.type) {
        const action = {
          id: attributes.type,
        } as SuggestedAction;
        return <>{mapActionToButton(action)}</>;
      }
      return null;

    case "kapable-list-files":
      return (
        <KapableListFiles
          node={{
            properties: {
              directory: attributes.directory || "",
              recursive: attributes.recursive || "",
              include_ignored:
                attributes.include_ignored || attributes.include_hidden || "",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
              appName: attributes.app_name || "",
            },
          }}
        >
          {content}
        </KapableListFiles>
      );

    case "kapable-database-schema":
      return (
        <KapableDatabaseSchema
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableDatabaseSchema>
      );

    case "kapable-db-table-schema":
    // Backward compat: old messages used provider-specific tags
    case "kapable-supabase-table-schema":
    case "kapable-neon-table-schema":
      return (
        <KapableDbTableSchema
          provider={
            tag === "kapable-supabase-table-schema"
              ? "Supabase"
              : tag === "kapable-neon-table-schema"
                ? "Neon"
                : (attributes.provider as string) || ""
          }
          node={{
            properties: {
              table: attributes.table || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableDbTableSchema>
      );

    case "kapable-supabase-project-info":
      return (
        <KapableSupabaseProjectInfo
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableSupabaseProjectInfo>
      );

    case "kapable-neon-project-info":
      return (
        <KapableNeonProjectInfo
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableNeonProjectInfo>
      );

    case "kapable-read-guide":
      return (
        <KapableReadGuide
          node={{
            properties: {
              name: attributes.name || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableReadGuide>
      );

    case "kapable-image-generation":
      return (
        <KapableImageGeneration
          node={{
            properties: {
              prompt: attributes.prompt || "",
              path: attributes.path || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableImageGeneration>
      );

    case "kapable-status":
      return (
        <KapableStatus
          node={{
            properties: {
              title: attributes.title || "Processing...",
              state: getState({
                isStreaming,
                inProgress,
                explicitState: attributes.state,
              }),
            },
          }}
        >
          {content}
        </KapableStatus>
      );

    case "kapable-compaction":
      return (
        <KapableCompaction
          node={{
            properties: {
              title: attributes.title || "Compacting conversation",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableCompaction>
      );

    case "kapable-write-plan":
      return (
        <KapableWritePlan
          node={{
            properties: {
              title: attributes.title || "Implementation Plan",
              summary: attributes.summary,
              complete: attributes.complete,
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableWritePlan>
      );

    case "kapable-exit-plan":
      return (
        <KapableExitPlan
          node={{
            properties: {
              notes: attributes.notes,
            },
          }}
        />
      );

    case "kapable-questionnaire":
      return <KapableQuestionnaire>{content}</KapableQuestionnaire>;

    case "kapable-step-limit":
      return (
        <KapableStepLimit
          node={{
            properties: {
              steps: attributes.steps,
              limit: attributes.limit,
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableStepLimit>
      );

    case "kapable-app-blueprint":
      return (
        <KapableAppBlueprintCard
          node={{
            properties: {
              "app-name": attributes["app-name"] || "",
              template: attributes.template || "react",
              theme: attributes.theme || "default",
              "design-direction": attributes["design-direction"] || "",
              "primary-color": attributes["primary-color"] || "",
              complete: attributes.complete,
              state: getState({ isStreaming, inProgress }),
            },
          }}
        />
      );

    case "kapable-test-assertions":
      return (
        <KapableTestAssertionsCard
          node={{
            properties: {
              "proposal-id": attributes["proposal-id"] || "",
              "request-id": attributes["request-id"] || "",
              status: attributes.status || "proposed",
              "spec-path": attributes["spec-path"] || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </KapableTestAssertionsCard>
      );

    default:
      return null;
  }
}
