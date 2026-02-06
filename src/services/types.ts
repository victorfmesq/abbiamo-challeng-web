export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type HttpClientConfig = {
  baseUrl: string;
  getToken?: () => string | null;
};

export type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  signal?: AbortSignal;
  auth?: boolean; // default true
};
