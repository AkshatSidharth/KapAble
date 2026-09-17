import { normalizePath } from "../../../shared/normalizePath";
import { unescapeXmlAttr, unescapeXmlContent } from "../../../shared/xmlEscape";
import log from "electron-log";
import { SqlQuery } from "../../lib/schemas";

const logger = log.scope("kapable_tag_parser");

interface KapableFileTag {
  path: string;
  content: string;
  description?: string;
}

function escapeRegexLiteral(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Parse `<tagName path="..." description="...">content</tagName>` occurrences
 * into file tags. Used for `<kapable-write>`: a `path`/`description` plus a body
 * with optional surrounding markdown fences.
 */
function parseKapableFileTags(
  fullResponse: string,
  tagName: string,
): KapableFileTag[] {
  const escapedTagName = escapeRegexLiteral(tagName);
  const tagRegex = new RegExp(
    `<${escapedTagName}([^>]*)>([\\s\\S]*?)</${escapedTagName}>`,
    "gi",
  );
  const pathRegex = /path="([^"]+)"/;
  const descriptionRegex = /description="([^"]+)"/;

  let match;
  const tags: KapableFileTag[] = [];

  while ((match = tagRegex.exec(fullResponse)) !== null) {
    const attributesString = match[1];
    let content = unescapeXmlContent(match[2].trim());

    const pathMatch = pathRegex.exec(attributesString);
    const descriptionMatch = descriptionRegex.exec(attributesString);

    if (pathMatch && pathMatch[1]) {
      const path = unescapeXmlAttr(pathMatch[1]);
      const description = descriptionMatch?.[1]
        ? unescapeXmlAttr(descriptionMatch[1])
        : undefined;

      const contentLines = content.split("\n");
      if (contentLines[0]?.startsWith("```")) {
        contentLines.shift();
      }
      if (contentLines[contentLines.length - 1]?.startsWith("```")) {
        contentLines.pop();
      }
      content = contentLines.join("\n");

      tags.push({ path: normalizePath(path), content, description });
    } else {
      logger.warn(
        `Found <${tagName}> tag without a valid 'path' attribute:`,
        match[0],
      );
    }
  }
  return tags;
}

export function getKapableWriteTags(fullResponse: string): KapableFileTag[] {
  return parseKapableFileTags(fullResponse, "kapable-write");
}

export function getKapableRenameTags(fullResponse: string): {
  from: string;
  to: string;
}[] {
  const kapableRenameRegex =
    /<kapable-rename from="([^"]+)" to="([^"]+)"[^>]*>([\s\S]*?)<\/kapable-rename>/g;
  let match;
  const tags: { from: string; to: string }[] = [];
  while ((match = kapableRenameRegex.exec(fullResponse)) !== null) {
    tags.push({
      from: normalizePath(unescapeXmlAttr(match[1])),
      to: normalizePath(unescapeXmlAttr(match[2])),
    });
  }
  return tags;
}

export function getKapableCopyTags(fullResponse: string): {
  from: string;
  to: string;
  description?: string;
}[] {
  const kapableCopyRegex =
    /<kapable-copy([^>]*?)(?:>([\s\S]*?)<\/kapable-copy>|\/>)/gi;
  const fromRegex = /from="([^"]+)"/;
  const toRegex = /to="([^"]+)"/;
  const descriptionRegex = /description="([^"]+)"/;

  let match;
  const tags: { from: string; to: string; description?: string }[] = [];

  while ((match = kapableCopyRegex.exec(fullResponse)) !== null) {
    const attrs = match[1];
    const fromMatch = fromRegex.exec(attrs);
    const toMatch = toRegex.exec(attrs);
    const descriptionMatch = descriptionRegex.exec(attrs);

    if (fromMatch?.[1] && toMatch?.[1]) {
      tags.push({
        from: normalizePath(unescapeXmlAttr(fromMatch[1])),
        to: normalizePath(unescapeXmlAttr(toMatch[1])),
        description: descriptionMatch?.[1]
          ? unescapeXmlAttr(descriptionMatch[1])
          : undefined,
      });
    } else {
      logger.warn(
        "Found <kapable-copy> tag without valid 'from' or 'to' attributes:",
        match[0],
      );
    }
  }
  return tags;
}

export function getKapableDeleteTags(fullResponse: string): string[] {
  const kapableDeleteRegex =
    /<kapable-delete path="([^"]+)"[^>]*>([\s\S]*?)<\/kapable-delete>/g;
  let match;
  const paths: string[] = [];
  while ((match = kapableDeleteRegex.exec(fullResponse)) !== null) {
    paths.push(normalizePath(unescapeXmlAttr(match[1])));
  }
  return paths;
}

export function getKapableAddDependencyTags(fullResponse: string): string[] {
  const kapableAddDependencyRegex =
    /<kapable-add-dependency packages="([^"]+)">[^<]*<\/kapable-add-dependency>/g;
  let match;
  const packages: string[] = [];
  while ((match = kapableAddDependencyRegex.exec(fullResponse)) !== null) {
    packages.push(...unescapeXmlAttr(match[1]).trim().split(/\s+/));
  }
  return packages;
}

export function getKapableChatSummaryTag(fullResponse: string): string | null {
  const kapableChatSummaryRegex =
    /<kapable-chat-summary>([\s\S]*?)<\/kapable-chat-summary>/g;
  const match = kapableChatSummaryRegex.exec(fullResponse);
  if (match && match[1]) {
    return unescapeXmlContent(match[1].trim());
  }
  return null;
}

export function getKapableExecuteSqlTags(fullResponse: string): SqlQuery[] {
  const kapableExecuteSqlRegex =
    /<kapable-execute-sql([^>]*)>([\s\S]*?)<\/kapable-execute-sql>/g;
  const descriptionRegex = /description="([^"]+)"/;
  let match;
  const queries: { content: string; description?: string }[] = [];

  while ((match = kapableExecuteSqlRegex.exec(fullResponse)) !== null) {
    const attributesString = match[1] || "";
    let content = unescapeXmlContent(match[2].trim());
    const descriptionMatch = descriptionRegex.exec(attributesString);
    const description = descriptionMatch?.[1]
      ? unescapeXmlAttr(descriptionMatch[1])
      : undefined;

    // Handle markdown code blocks if present
    const contentLines = content.split("\n");
    if (contentLines[0]?.startsWith("```")) {
      contentLines.shift();
    }
    if (contentLines[contentLines.length - 1]?.startsWith("```")) {
      contentLines.pop();
    }
    content = contentLines.join("\n");

    queries.push({ content, description });
  }

  return queries;
}

export function getKapableCommandTags(fullResponse: string): string[] {
  const kapableCommandRegex =
    /<kapable-command type="([^"]+)"[^>]*><\/kapable-command>/g;
  let match;
  const commands: string[] = [];

  while ((match = kapableCommandRegex.exec(fullResponse)) !== null) {
    commands.push(unescapeXmlAttr(match[1]));
  }

  return commands;
}

export function getKapableSearchReplaceTags(fullResponse: string): {
  path: string;
  content: string;
  description?: string;
}[] {
  const kapableSearchReplaceRegex =
    /<kapable-search-replace([^>]*)>([\s\S]*?)<\/kapable-search-replace>/gi;
  const pathRegex = /path="([^"]+)"/;
  const descriptionRegex = /description="([^"]+)"/;

  let match;
  const tags: { path: string; content: string; description?: string }[] = [];

  while ((match = kapableSearchReplaceRegex.exec(fullResponse)) !== null) {
    const attributesString = match[1] || "";
    let content = unescapeXmlContent(match[2].trim());

    const pathMatch = pathRegex.exec(attributesString);
    const descriptionMatch = descriptionRegex.exec(attributesString);

    if (pathMatch && pathMatch[1]) {
      const path = unescapeXmlAttr(pathMatch[1]);
      const description = descriptionMatch?.[1]
        ? unescapeXmlAttr(descriptionMatch[1])
        : undefined;

      // Handle markdown code fences if present
      const contentLines = content.split("\n");
      if (contentLines[0]?.startsWith("```")) {
        contentLines.shift();
      }
      if (contentLines[contentLines.length - 1]?.startsWith("```")) {
        contentLines.pop();
      }
      content = contentLines.join("\n");

      tags.push({ path: normalizePath(path), content, description });
    } else {
      logger.warn(
        "Found <kapable-search-replace> tag without a valid 'path' attribute:",
        match[0],
      );
    }
  }
  return tags;
}
