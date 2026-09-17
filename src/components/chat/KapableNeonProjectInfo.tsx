import React from "react";
import { CustomTagState } from "./stateTypes";
import { KapableDbProjectInfo } from "./KapableDbProjectInfo";

interface KapableNeonProjectInfoProps {
  node: {
    properties: {
      state?: CustomTagState;
    };
  };
  children: React.ReactNode;
}

export function KapableNeonProjectInfo(props: KapableNeonProjectInfoProps) {
  return <KapableDbProjectInfo provider="Neon" {...props} />;
}
