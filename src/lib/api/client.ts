import { ENV } from "@/const";
import type { ApiError, RequestConfig } from "./type";
import { ApiErrorHandler } from "./errorHandler";
type ResponseInterceptor = {
  id?: string; // ID 필드 추가
  onSuccess?: (response: Response) => Promise<any>;
  onError?: (error: any) => Promise<any>;
};

type RequestInterceptor = {
  id?: string; // ID 필드 추가
  onRequest?: (config: any) => any;
  onError?: (error: any) => any;
};
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  constructor(baseURL: string = "", timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  get(url: string, config?: RequestConfig) {
    return this.request(url, { ...config, method: "GET" });
  }

  post(url: string, data?: any, config?: RequestConfig) {
    if (data) {
      return this.request(url, { ...config, method: "POST", data });
    }
    return this.request(url, { ...config, method: "POST" });
  }
  put(url: string, data: any, config?: RequestConfig) {
    if (!data) throw new Error("PUT 요청: 데이터를 찾을 수 없습니다.");
    return this.request(url, { ...config, method: "PUT", data });
  }
  patch(url: string, data: any, config?: RequestConfig) {
    if (!data) throw new Error("PATCH 요청: 데이터를 찾을 수 없습니다.");
    return this.request(url, { ...config, method: "PATCH", data });
  }
  delete(url: string, config?: RequestConfig) {
    return this.request(url, { ...config, method: "DELETE" });
  }

  addRequestInterceptor(interceptors: RequestInterceptor) {
    this.requestInterceptors.push(interceptors);
  }
  addResponseInterceptor(interceptors: ResponseInterceptor) {
    const id = `interceptor_${Date.now()}_${Math.random()}`;
    this.responseInterceptors.push({ ...interceptors, id });
    return id;
  }

  removeResponseInterceptor(id: string) {
    const index = this.responseInterceptors.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.responseInterceptors.splice(index, 1);
      return true;
    }
    return false;
  }

  // 요청 처리 시작
  async request(url: string, options: RequestConfig = {}) {
    const finalURL = url.startsWith("http") ? url : `${this.baseURL}${url}`;
    let config: RequestConfig = {
      ...options,
      url: finalURL,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // interceptor 순차 실행
    for (const interceptor of this.requestInterceptors) {
      try {
        if (interceptor.onRequest) {
          const interceptorResult = await interceptor.onRequest(config);

          if (interceptorResult && typeof interceptorResult === "object") {
            config = {
              ...config,
              ...interceptorResult,
              headers: {
                ...config.headers,
                ...(interceptorResult.headers || {}),
              },
            };
          }
        }
      } catch (error) {
        console.error("Request interceptor failed:", error);
      }
    }

    // body data 직렬화
    if (
      config.data &&
      ["POST", "PATCH", "PUT"].includes(config.method?.toUpperCase() || "")
    ) {
      if (typeof config.data === "string") {
        config.body = config.data;
      } else {
        config.body = JSON.stringify(config.data);
      }
      delete config.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      if (!config.url) {
        const error: ApiError = {
          message: `데이터에 url이 존재하지 않습니다. [config]: ${config}`,
          status: 0,
        };
        throw error;
      }
      const response = await fetch(config.url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP Error: ${response.status}`,
          status: response.status,
        };
        try {
          const errorData = await response.json();
          error.message = errorData.message || error.message;
          error.code = errorData.code;
        } catch (error) {
          // 기본 메세지 사용 -> error 객체
        }

        throw error;
      }

      let result;
      if (this.responseInterceptors.length > 0) {
        result = response;
        for (const interceptor of this.responseInterceptors) {
          if (interceptor.onSuccess) {
            result = await interceptor.onSuccess(result);
          }
        }
      } else {
        if (
          response.status === 204 ||
          response.headers.get("content-length") === "0"
        ) {
          result = null;
        } else {
          try {
            result = await response.json();
          } catch (jsonError) {
            console.warn("JSON parsing failed, treating as empty response");
            result = null;
          }
        }
      }

      return result;
    } catch (error) {
      const apiError: ApiError =
        error instanceof Error
          ? {
              message: error.message,
              status: error.name === "AbortError" ? 408 : 0,
            }
          : (error as ApiError);

      await ApiErrorHandler.handleError(apiError);

      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onError) {
          await interceptor.onError(apiError);
        }
      }

      throw apiError;
    }
  }
}

export const apiClient = new ApiClient(ENV.BACKEND_URL);
