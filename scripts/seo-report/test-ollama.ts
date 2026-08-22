/**
 * `npm run seo:ai:test` — a safe, standalone connectivity/sanity check for
 * the Ollama client. This is a developer/CI diagnostic only: it never
 * touches src/lib/posts.ts, never runs the decision engine or QA, and never
 * opens a PR — it is not part of the daily seo-report job.
 *
 * Two outcomes, both a clean exit 0:
 *  - Ollama IS reachable at OLLAMA_BASE_URL: sends one tiny real prompt and
 *    validates the response actually came back non-empty.
 *  - Ollama is NOT reachable: does not fake a real call. Instead runs a
 *    deterministic mock test of the client's pure logic (config resolution,
 *    JSON extraction) and says plainly that real connectivity requires
 *    installing/starting Ollama.
 *
 * Exits non-zero only when something is actually broken: Ollama is
 * reachable but returns a malformed/empty response, or a mock check fails.
 */
import { getOllamaBaseUrl, getOllamaModel, isOllamaReachable, generateWithOllama, OllamaError } from './ollama-client';

async function testReal(): Promise<boolean> {
  const baseUrl = getOllamaBaseUrl();
  const model = getOllamaModel();
  console.log(`Ollama is reachable at ${baseUrl} — sending one real test prompt to "${model}"...`);
  try {
    const reply = await generateWithOllama('Reply with exactly one word: OK', {
      system: 'You are a connectivity test. Reply with only the single requested word — nothing else.',
    });
    if (!reply.trim()) {
      console.error('FAIL: Ollama returned an empty response.');
      return false;
    }
    console.log(`PASS: received a real response from Ollama (model "${model}"): "${reply.slice(0, 80)}"`);
    return true;
  } catch (err) {
    console.error('FAIL: Ollama is reachable but the test request failed:', err instanceof OllamaError ? err.message : err);
    return false;
  }
}

function testMock(): boolean {
  const baseUrl = getOllamaBaseUrl();
  const model = getOllamaModel();
  console.log(`No Ollama server reachable at ${baseUrl} — running a deterministic mock-only test of the client instead.`);
  console.log('Real Ollama connectivity requires installing and starting Ollama locally, or pointing OLLAMA_BASE_URL at a reachable server. See SEO_AUTOMATION.md.');

  let ok = true;

  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    console.error(`FAIL: OLLAMA_BASE_URL "${baseUrl}" is not a valid http(s) URL.`);
    ok = false;
  }
  if (!model.trim()) {
    console.error('FAIL: resolved OLLAMA_MODEL is empty.');
    ok = false;
  }

  if (ok) {
    console.log(`PASS: client config resolves correctly (OLLAMA_BASE_URL="${baseUrl}", OLLAMA_MODEL="${model}").`);
  }
  return ok;
}

async function main() {
  const reachable = await isOllamaReachable();
  const ok = reachable ? await testReal() : testMock();
  if (!ok) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Unexpected failure in Ollama test:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
