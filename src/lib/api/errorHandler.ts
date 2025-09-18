import { useAuthStore } from "../stores/authStore";
import type { ApiError } from "./type";

export class ApiErrorHandler {
  static auth = useAuthStore.getState();
  static handle401(error: ApiError) {
    // 토큰 만료 등 인증 에러
    this.auth.setAccessToken(null);

    throw error;
  }

  static handle403(error: ApiError) {
    // 권한 없음
    console.error("권한이 없습니다", error.message);
    throw error;
  }
  static handle404(error: ApiError, context?: string): any {
    console.warn(`404 Error in ${context}:`, error.message);

    // 만다라트 같은 경우 빈 데이터로 처리
    if (context === "만다라트") {
      return { isEmpty: true, data: null };
    }

    // 다른 경우는 에러로 처리
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

  static async handleError(error: ApiError, context?: string) {
    const code = String(error.code) || "default";
    const handlers: Record<string | number, () => any> = {
      "401": () => this.handle401(error),
      "403": () => this.handle403(error),
      "404": () => this.handle404(error, context),
      "500": () => this.handle500(error),
      default: () => this.handleDefault(error),
    };
    if (handlers[code]) handlers[code]();
    else handlers["default"]();
  }
}
