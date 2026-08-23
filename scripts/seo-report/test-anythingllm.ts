/**
 * `npm run seo:ai:test` — a safe, standalone connectivity/sanity check for
 * the AnythingLLM client. This is a developer/CI diagnostic only: it never
 * touches src/lib/posts.ts, never runs the decision engine or QA, and never
 * opens a PR — it is not part of the daily seo-report job.
 *
 * Two outcomes, both a clean exit 0:
 *  - AnythingLLM IS reachable at ANYTHINGLLM_BASE_URL: sends one tiny real
 *    prompt to the configured workspace and validates the response actually
 *    came back non-empty.
 *  - AnythingLLM is NOT reachable: does not fake a real call. Instead runs a
 *    deterministic mock test of the client's pure logic (config resolution)
 *    and says plainly that real connectivity requires this machine (or the
 *    job) to be joined to the Tailscale tailnet that can reach it.
 *
 * Exits non-zero only when something is actually broken: AnythingLLM is
 * reachable but returns a malformed/empty response or an error, or a mock
 * check fails.
 */
import { getAnythingLLMBaseUrl, getAnythingLLMWorkspaceSlug, isAnythingLLMReachable, generateWithAnythingLLM, AnythingLLMError } from './anythingllm-client';

async function testReal(): Promise<boolean> {
  const baseUrl = getAnythingLLMBaseUrl();
  const workspace = getAnythingLLMWorkspaceSlug();
  console.log(`AnythingLLM is reachable at ${baseUrl} — sending one real test prompt to workspace "${workspace}"...`);
  try {
    const reply = await generateWithAnythingLLM('Reply with exactly one word: OK', {
      system: 'You are a connectivity test. Reply with only the single requested word — nothing else.',
    });
    if (!reply.trim()) {
      console.error('FAIL: AnythingLLM returned an empty response.');
      return false;
    }
    console.log(`PASS: received a real response from AnythingLLM (workspace "${workspace}"): "${reply.slice(0, 80)}"`);
    return true;
  } catch (err) {
    console.error('FAIL: AnythingLLM is reachable but the test request failed:', err instanceof AnythingLLMError ? err.message : err);
    return false;
  }
}

function testMock(): boolean {
  const baseUrl = getAnythingLLMBaseUrl();
  const workspace = getAnythingLLMWorkspaceSlug();
  console.log(`AnythingLLM is not reachable at ${baseUrl} — running a deterministic mock-only test of the client instead.`);
  console.log('Real connectivity requires this job to have joined the Tailscale tailnet that can reach the AnythingLLM host. See SEO_AUTOMATION.md.');

  let ok = true;

  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    console.error(`FAIL: ANYTHINGLLM_BASE_URL "${baseUrl}" is not a valid http(s) URL.`);
    ok = false;
  }
  if (!workspace.trim()) {
    console.error('FAIL: resolved ANYTHINGLLM_WORKSPACE_SLUG is empty.');
    ok = false;
  }

  if (ok) {
    console.log(`PASS: client config resolves correctly (ANYTHINGLLM_BASE_URL="${baseUrl}", ANYTHINGLLM_WORKSPACE_SLUG="${workspace}").`);
  }
  return ok;
}

async function main() {
  const reachable = await isAnythingLLMReachable();
  const ok = reachable ? await testReal() : testMock();
  if (!ok) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Unexpected failure in AnythingLLM test:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
