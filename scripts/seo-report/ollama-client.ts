/**
 * Minimal client for a local or remote Ollama instance — an open-source,
 * no-API-key model backend. Every caller reads configuration from
 * environment variables only:
 *
 *   OLLAMA_BASE_URL  — default http://localhost:11434 (never hardcode a
 *                       public host; a remote server is opt-in only)
 *   OLLAMA_MODEL     — default "qwen3"
 *   OLLAMA_TIMEOUT_MS — default 120000
 *
 * No secrets, no credentials, no paid API involved anywhere in this file.
 */

export const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434';
export const DEFAULT_OLLAMA_MODEL = 'qwen3';
const DEFAULT_TIMEOUT_MS = 120_000;

export function getOllamaBaseUrl(): string {
  return process.env.OLLAMA_BASE_URL?.trim() || DEFAULT_OLLAMA_BASE_URL;
}

export function getOllamaModel(): string {
  return process.env.OLLAMA_MODEL?.trim() || DEFAULT_OLLAMA_MODEL;
}

function getTimeoutMs(): number {
  const raw = process.env.OLLAMA_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

export class OllamaError extends Error {}

/**
 * True if an Ollama server responds at all within a short timeout. Does not
 * guarantee the configured OLLAMA_MODEL has actually been pulled — only
 * that something is listening.
 */
export async function isOllamaReachable(timeoutMs = 5000): Promise<boolean> {
  const baseUrl = getOllamaBaseUrl();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export interface OllamaChatOptions {
  system?: string;
  temperature?: number;
}

interface OllamaChatResponse {
  message?: { role?: string; content?: string };
}

/**
 * Sends a single-turn chat request to Ollama and returns the response text,
 * trimmed. Thinking-capable models (Qwen3 included) are asked not to emit a
 * reasoning block via `think: false`; any `<think>...</think>` that slips
 * through anyway (older Ollama/model builds ignore the flag) is stripped as
 * a defensive fallback so callers always get plain answer text.
 *
 * Throws OllamaError with a specific, actionable message on any failure —
 * unreachable server, timeout, non-2xx response, or malformed JSON. Callers
 * decide whether that's fatal or a gracefully-skipped step; this function
 * never fabricates a response.
 */
export async function generateWithOllama(prompt: string, options: OllamaChatOptions = {}): Promise<string> {
  const baseUrl = getOllamaBaseUrl();
  const model = getOllamaModel();
  const timeoutMs = getTimeoutMs();

  const messages: { role: string; content: string }[] = [];
  if (options.system) messages.push({ role: 'system', content: options.system });
  messages.push({ role: 'user', content: prompt });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        think: false,
        ...(options.temperature !== undefined ? { options: { temperature: options.temperature } } : {}),
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new OllamaError(`Ollama request to ${baseUrl} (model "${model}") timed out after ${timeoutMs}ms.`);
    }
    throw new OllamaError(`Could not reach Ollama at ${baseUrl}: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new OllamaError(`Ollama returned HTTP ${res.status} from ${baseUrl} (model "${model}"): ${body.slice(0, 500)}`);
  }

  let data: OllamaChatResponse;
  try {
    data = (await res.json()) as OllamaChatResponse;
  } catch {
    throw new OllamaError(`Ollama response from ${baseUrl} was not valid JSON.`);
  }

  const raw = data.message?.content;
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new OllamaError(`Ollama response from ${baseUrl} (model "${model}") had no usable message content: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return stripThinking(raw).trim();
}

function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}
