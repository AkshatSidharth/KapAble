# Claude Code Configuration

This directory contains Claude Code configuration for the KapAble project.

## Skills

Skills are invoked with `/kapable:<skill>`. Available skills:

| Skill                              | Description                                              | Uses                                            |
| ---------------------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| `/kapable:plan-to-issue`              | Convert a plan to a GitHub issue                         | -                                               |
| `/kapable:fix-issue`                  | Fix a GitHub issue                                       | `pr-push`                                       |
| `/kapable:pr-fix`                     | Fix PR issues from CI failures or review comments        | `pr-fix:comments`, `pr-fix:ci`                  |
| `/kapable:pr-fix:comments`            | Address unresolved PR review comments                    | `pr-push`                                       |
| `/kapable:pr-fix:ci`                  | Fix latest-run E2E and cross-platform unit test failures | `deflake-e2e-from-run`, `e2e-rebase`, `pr-push` |
| `/kapable:pr-rebase`                  | Rebase the current branch                                | `pr-push`                                       |
| `/kapable:pr-push`                    | Push changes and create/update a PR                      | `remember-learnings`                            |
| `/kapable:e2e-rebase`                 | Rebase E2E test snapshots                                | -                                               |
| `/kapable:deflake-e2e`                | Deflake flaky E2E tests                                  | -                                               |
| `/kapable:deflake-e2e-recent-commits` | Gather flaky tests from recent CI runs and deflake them  | `deflake-e2e`, `pr-push`                        |
| `/kapable:session-debug`              | Debug session issues                                     | -                                               |
| `/kapable:pr-screencast`              | Record visual demo of PR feature                         | -                                               |
| `/kapable:feedback-to-issues`         | Turn customer feedback into GitHub issues                | -                                               |
| `/kapable:promote-beta-to-stable`     | Promote latest pre-release to stable release             | -                                               |
| `/remember-learnings`              | Capture session learnings into AGENTS.md/rules           | -                                               |
