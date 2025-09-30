import { reissueWithRefreshToken } from "@/feature/auth/service";
import { useAuthStore } from "../stores/authStore";
import type { ApiError } from "./type";

export class ApiErrorHandler {
  static auth = useAuthStore.getState();
  static handle400(error: ApiError) {
    console.error(`404 Error in ${error}`);
  }
  static async handle401(error: ApiError) {
    // 토큰 만료 등 인증 에러
    const newAccessToken = await reissueWithRefreshToken();

    if (!newAccessToken) {
      throw new Error("Unauthorized - refresh failed");
    }
  }

  static handle403(error: ApiError) {
    // 권한 없음
    console.error("권한이 없습니다", error.message);
    throw error;
  }
  static handle404(error: ApiError): any {
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

  static async handleError(error: ApiError) {
    const code = String(error.code) || "default";
    const handlers: Record<string | number, () => any> = {
      "401": () => this.handle401(error),
      "403": () => this.handle403(error),
      "404": () => this.handle404(error),
      "500": () => this.handle500(error),
      default: () => this.handleDefault(error),
    };
    if (handlers[code]) handlers[code]();
    else handlers["default"]();
  }
}
