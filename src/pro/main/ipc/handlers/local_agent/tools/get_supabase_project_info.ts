import { z } from "zod";
import {
  ToolDefinition,
  AgentContext,
  canUseSupabaseTools,
  escapeXmlContent,
} from "./types";
import { getSupabaseProjectInfo } from "../../../../../../supabase_admin/supabase_context";
import { KapableError, KapableErrorKind } from "@/errors/kapable_error";

const getSupabaseProjectInfoSchema = z.object({
  includeDbFunctions: z
    .boolean()
    .optional()
    .describe(
      "When true, includes database functions in the response. Defaults to false.",
    ),
});

export const getSupabaseProjectInfoTool: ToolDefinition<
  z.infer<typeof getSupabaseProjectInfoSchema>
> = {
  name: "get_supabase_project_info",
  description:
    "Get Supabase project overview: project ID, publishable key, secret names, and table names. Use this to discover what tables exist before fetching detailed schemas. Optionally include database functions.",
  inputSchema: getSupabaseProjectInfoSchema,
  defaultConsent: "always",
  isEnabled: canUseSupabaseTools,

  getConsentPreview: () => "Get Supabase project info",

  execute: async (args, ctx: AgentContext) => {
    if (!canUseSupabaseTools(ctx)) {
      throw new KapableError(
        "Supabase is not connected to this app",
        KapableErrorKind.Precondition,
      );
    }

    ctx.onXmlStream(
      "<kapable-supabase-project-info></kapable-supabase-project-info>",
    );

    const info = await getSupabaseProjectInfo({
      supabaseProjectId: ctx.supabaseProjectId,
      organizationSlug: ctx.supabaseOrganizationSlug ?? null,
      includeDbFunctions: args.includeDbFunctions,
    });

    ctx.onXmlComplete(
      `<kapable-supabase-project-info>\n${escapeXmlContent(info)}\n</kapable-supabase-project-info>`,
    );

    return info;
  },
};
