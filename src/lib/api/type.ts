export interface RequestConfig extends RequestInit {
  url?: string;
  baseURL?: string;
  timeout?: number;
  data?: any;
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
}
