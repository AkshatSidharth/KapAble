import type { LocalAgentFixture } from "../../../../testing/fake-llm-server/localAgentTypes";

export const fixture: LocalAgentFixture = {
  description: "List files including ignored .kapable files",
  turns: [
    {
      text: "I'll list all files including the ignored .kapable directory for you.",
      toolCalls: [
        {
          name: "list_files",
          args: {
            directory: ".kapable",
            recursive: true,
            include_ignored: true,
          },
        },
      ],
    },
    {
      text: "Here are the ignored .kapable files.",
    },
  ],
};
