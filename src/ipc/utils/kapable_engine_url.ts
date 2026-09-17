export function getKapableEngineBaseUrl(): string {
  return process.env.KAPABLE_ENGINE_URL ?? "https://engine.kapable.sh/v1";
}
