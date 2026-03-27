export interface RequestConfig extends RequestInit {
  requiresAuth: boolean;
  url?: string;
  baseURL?: string;
  timeout?: number;
  data?: unknown;
}

export type RequestInterceptor = (
  config: RequestConfig
) => Promise<RequestConfig> | RequestConfig;

export interface ResponseInterceptor {
  onSuccess?: <T>(response: Response) => Promise<T> | T;
  onError?: (error: ApiError) => Promise<void> | void;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  type?: string;
  originalRequest?: { url: string; options: RequestConfig };
}
