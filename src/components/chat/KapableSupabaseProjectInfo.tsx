import React from "react";
import { CustomTagState } from "./stateTypes";
import { KapableDbProjectInfo } from "./KapableDbProjectInfo";

interface KapableSupabaseProjectInfoProps {
  node: {
    properties: {
      state?: CustomTagState;
    };
  };
  children: React.ReactNode;
}

export function KapableSupabaseProjectInfo(
  props: KapableSupabaseProjectInfoProps,
) {
  return <KapableDbProjectInfo provider="Supabase" {...props} />;
}
