/**
 * Configures KapAble's hosted-service endpoints for the test run.
 *
 * In production these are unset by default, so the features that need them
 * degrade locally instead of calling a host this fork does not own (see
 * src/constants/brand.ts). A large part of the suite, though, is *about* those
 * remote paths — the model and MCP catalogs, the LLM gateway, OAuth token
 * refresh, the build-approval list — and asserts that the fetch happens. With
 * nothing configured those paths short-circuit and the assertions fail for the
 * wrong reason.
 *
 * So the suite runs with every endpoint pointed at a host in the reserved
 * `.test` TLD (RFC 2606), which can never resolve. Requests are mocked; if a
 * test ever escapes its mock, it fails with DNS rather than reaching a real
 * service.
 *
 * `??=` so a test that sets its own value, or deletes one to assert the
 * unconfigured behaviour, still wins.
 */

process.env.KAPABLE_ENGINE_URL ??= "https://engine.kapable.test/v1";
process.env.KAPABLE_API_URL ??= "https://api.kapable.test";
process.env.KAPABLE_ACCOUNT_URL ??= "https://account.kapable.test";
process.env.KAPABLE_OAUTH_URL ??= "https://oauth.kapable.test";
process.env.KAPABLE_SUPABASE_OAUTH_URL ??=
  "https://supabase-oauth.kapable.test";
process.env.KAPABLE_HELP_CHAT_URL ??= "https://helpchat.kapable.test/v1";
process.env.KAPABLE_LOG_UPLOAD_URL ??= "https://upload-logs.kapable.test";
process.env.KAPABLE_UPDATE_FEED_URL ??= "https://update.kapable.test/v1/update";
