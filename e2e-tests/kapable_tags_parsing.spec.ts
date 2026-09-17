import { testSkipIfWindows } from "./helpers/test_helper";

testSkipIfWindows("kapable tags handles nested < tags", async ({ po }) => {
  await po.setUp({ autoApprove: true });
  await po.importApp("minimal");
  await po.sendPrompt("tc=kapable-write-angle");
  await po.snapshotAppFiles({
    name: "angle-tags-handled",
    files: ["src/foo/bar.tsx"],
  });
});
