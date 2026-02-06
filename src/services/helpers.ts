import { HttpError } from './httpError';
import type { HttpClientConfig, RequestOptions } from './types';

function buildUrl(baseUrl: string, path: string, query?: RequestOptions['query']) {
  const url = new URL(path, baseUrl);

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      url.searchParams.set(k, String(v));
    }
  }

  return url.toString();
}

export function createHttpClient(config: HttpClientConfig) {
  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = buildUrl(config.baseUrl, path, options.query);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    };

    const shouldAuth = options.auth !== false;
    if (shouldAuth && config.getToken) {
      const token = config.getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });

    const contentType = res.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    const payload = isJson
      ? await res.json().catch(() => undefined)
      : await res.text().catch(() => undefined);

    if (!res.ok) {
      const msg =
        typeof payload === 'object' && payload && 'message' in (payload as any)
          ? String((payload as any).message)
          : `Request failed: ${res.status}`;
      throw new HttpError(msg, res.status, payload);
    }

    return payload as T;
  }

  return { request };
}
