import { reissueWithRefreshToken } from "@/feature/auth/service";
import type { ApiError } from "./type";
import type { ApiClient } from "./client";
import { performLogout } from "@/feature/auth/hooks/useLogout";
import { toast } from "sonner";

export class ApiErrorHandler {
  static async handle401(error: ApiError, client: ApiClient) {
    // 토큰 만료 등 인증 에러
    const type = error.type;
    if (type === "INVALID_TOKEN") {
      const newToken = await reissueWithRefreshToken();
      if (newToken && error.originalRequest) {
        return client.request(
          error.originalRequest.url,
          error.originalRequest.options
        );
      }
      performLogout();
      toast("세션 종료로 인해 화면으로 돌아갑니다.");
      return;
    }
    if (type === "UNAUTHORIZED") {
      performLogout();
    }

    const newAccessToken = await reissueWithRefreshToken();

    if (!newAccessToken) {
      throw new Error(`Unauthorized - refresh failed/ ${error}`);
    }
  }

  static handle403(error: ApiError) {
    // 권한 없음
    console.error("권한이 없습니다", error.message);
    throw error;
  }
  static handle404(error: ApiError): ApiError {
    throw error;
  }
  static handle500(error: ApiError) {
    // 서버 에러
    console.error("서버 오류", error.message);
    throw error;
  }
  static handleDefault(error: ApiError) {
    // 권한 없음
    console.error("API 에러", error);
    throw error;
  }

  static async handleError(error: ApiError, client: ApiClient) {
    console.log(error);
    const code = String(error.status) || "default";
    const handlers: Record<string, () => Promise<unknown>> = {
      "401": async () => this.handle401(error, client),
      "403": async () => this.handle403(error),
      "404": async () => this.handle404(error),
      "500": async () => this.handle500(error),
      default: async () => this.handleDefault(error),
    };
    if (handlers[code]) handlers[code]();
    else handlers["default"]();
  }
}
