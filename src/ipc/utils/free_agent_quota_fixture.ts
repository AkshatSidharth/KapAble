export function shouldSimulateFreeAgentQuotaExceeded(
  environment: NodeJS.ProcessEnv = process.env,
): boolean {
  return (
    environment.NODE_ENV === "development" &&
    environment.KAPABLE_SIMULATE_FREE_AGENT_QUOTA_EXCEEDED === "true"
  );
}
