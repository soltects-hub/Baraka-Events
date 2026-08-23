/**
 * Minimal client for the user's own AnythingLLM instance — reached over a
 * private Tailscale tailnet (never exposed publicly), backed by Ollama and
 * Qwen3:8b. AnythingLLM's workspace chat API is the real, live-verified
 * integration point (confirmed via a real GitHub Actions run joining the
 * tailnet and receiving a real Qwen3:8b response through workspace
 * "my-workspace") — this is not a guess at AnythingLLM's API shape.
 *
 * Configuration, all via environment variables:
 *   ANYTHINGLLM_BASE_URL       — default http://100.125.143.58:3001 (the
 *                                 user's own 24/7 Windows machine, private
 *                                 Tailscale IP; only reachable once the
 *                                 caller has joined the tailnet)
 *   ANYTHINGLLM_WORKSPACE_SLUG — default "my-workspace" (the real workspace
 *                                 confirmed to exist on the live instance)
 *   ANYTHINGLLM_API_KEY        — required secret; requests without it fail
 *                                 with 403 (confirmed live)
 *   ANYTHINGLLM_TIMEOUT_MS     — default 900000 (15 min). A full article
 *                                 generation on a local, CPU/GPU-bound
 *                                 Qwen3:8b — a thinking model that emits a
 *                                 <think> reasoning block before the actual
 *                                 answer — took over 3 minutes for the real
 *                                 multi-section article prompt in live
 *                                 testing (confirmed via a real
 *                                 workflow_dispatch run whose request timed
 *                                 out at the old 180000ms default with
 *                                 Tailscale/auth/network otherwise healthy),
 *                                 so a short connectivity-check timeout is
 *                                 not long enough for real generation.
 *
 * No value from this file is ever logged. The API key must only ever be
 * injected via the ANYTHINGLLM_API_KEY GitHub Actions secret.
 */

export const DEFAULT_ANYTHINGLLM_BASE_URL = 'http://100.125.143.58:3001';
export const DEFAULT_ANYTHINGLLM_WORKSPACE_SLUG = 'my-workspace';
const DEFAULT_TIMEOUT_MS = 900_000;

export function getAnythingLLMBaseUrl(): string {
  return process.env.ANYTHINGLLM_BASE_URL?.trim() || DEFAULT_ANYTHINGLLM_BASE_URL;
}

export function getAnythingLLMWorkspaceSlug(): string {
  return process.env.ANYTHINGLLM_WORKSPACE_SLUG?.trim() || DEFAULT_ANYTHINGLLM_WORKSPACE_SLUG;
}

function getApiKey(): string {
  return process.env.ANYTHINGLLM_API_KEY?.trim() || '';
}

function getTimeoutMs(): number {
  const raw = process.env.ANYTHINGLLM_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

export class AnythingLLMError extends Error {}

/**
 * True if AnythingLLM's unauthenticated /api/ping responds within a short
 * timeout. Does not confirm authentication or that the configured workspace
 * exists — only that something is listening at ANYTHINGLLM_BASE_URL (i.e.
 * the Tailscale connection, if any, is up and the machine is reachable).
 */
export async function isAnythingLLMReachable(timeoutMs = 5000): Promise<boolean> {
  const baseUrl = getAnythingLLMBaseUrl();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseUrl}/api/ping`, { signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export interface AnythingLLMChatOptions {
  /**
   * AnythingLLM's workspace chat endpoint has no separate per-request system
   * field — the workspace's own system prompt (configured in the AnythingLLM
   * UI) always applies. Any caller-supplied grounding/instruction text is
   * prepended to the user message instead, so the same call sites written
   * for a system+user split still get equivalent behavior.
   */
  system?: string;
}

interface AnythingLLMChatResponse {
  type?: string;
  textResponse?: string | null;
  error?: string | null;
}

/**
 * Sends one message to the configured AnythingLLM workspace and returns the
 * response text, trimmed. Throws AnythingLLMError with a specific,
 * actionable message on any failure — unreachable server, missing/invalid
 * API key, non-2xx response, malformed JSON, or an in-body error field.
 * Callers decide whether that's fatal or a gracefully-skipped step; this
 * function never fabricates a response.
 */
export async function generateWithAnythingLLM(prompt: string, options: AnythingLLMChatOptions = {}): Promise<string> {
  const baseUrl = getAnythingLLMBaseUrl();
  const slug = getAnythingLLMWorkspaceSlug();
  const apiKey = getApiKey();
  const timeoutMs = getTimeoutMs();

  if (!apiKey) {
    throw new AnythingLLMError('ANYTHINGLLM_API_KEY is not set — cannot authenticate to AnythingLLM.');
  }

  const message = options.system ? `${options.system}\n\n${prompt}` : prompt;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/v1/workspace/${encodeURIComponent(slug)}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ message, mode: 'chat' }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new AnythingLLMError(`AnythingLLM request to ${baseUrl} (workspace "${slug}") timed out after ${timeoutMs}ms.`);
    }
    throw new AnythingLLMError(`Could not reach AnythingLLM at ${baseUrl}: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new AnythingLLMError(`AnythingLLM returned HTTP ${res.status} from ${baseUrl} (workspace "${slug}"): ${body.slice(0, 500)}`);
  }

  let data: AnythingLLMChatResponse;
  try {
    data = (await res.json()) as AnythingLLMChatResponse;
  } catch {
    throw new AnythingLLMError(`AnythingLLM response from ${baseUrl} was not valid JSON.`);
  }

  if (data.error) {
    throw new AnythingLLMError(`AnythingLLM reported an error (workspace "${slug}"): ${data.error}`);
  }

  const raw = data.textResponse;
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new AnythingLLMError(`AnythingLLM response from ${baseUrl} (workspace "${slug}") had no usable text: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return stripThinking(raw).trim();
}

function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}
