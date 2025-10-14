import { handleGoogleLogin, handleNaverLogin } from "@/feature/auth/service";
import { Button } from "@/feature/ui/Button";
import koalaTextLogoImage from "@/assets/common/koala_mailman_text_logo.png";
import ScrollAnimation from "./ScrollAnimation";

export default function MainSection() {
  return (
    <section
      className="relative z-20 text-center"
      style={{
        transform: `translateY(${Math.min(scrollY * 0.1, 20)}px)`,
      }}
    >
      <div className="w-full">
        <img
          src={koalaTextLogoImage}
          alt="코알라 우체부"
          className="w-full pixelated drop-shadow-2xl max-w-xl mx-auto"
          style={{ filter: "drop-shadow(4px 4px 8px rgba(0,0,0,0.5))" }}
        />
      </div>
      <div className="space-y-4 max-w-sm mx-auto">
        <Button
          onClick={handleNaverLogin}
          className="w-full bg-[#0AA372] hover:bg-[#077351] text-white h-14 pixel-login-button text-lg shadow-2xl border-1 border-[#077351] hover:border-[#04432F] shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.25)] transition-shadow duration-200"
        >
          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
          </svg>
          네이버로 시작하기
        </Button>

        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full h-14 border-1 pixel-login-button border-[#B3B3B3] bg-[#FFFFFF] hover:bg-[#E6E6E6] hover:border-[#999999] backdrop-blur-sm text-gray-800 text-lg  shadow-2xl shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.25)] transition-shadow duration-200"
        >
          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          구글로 시작하기
        </Button>
      </div>
      <div className="mt-8">
        <p
          className="text-white/70 text-sm leading-relaxed mb-6"
          style={{
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          로그인하면 <span className="text-white font-medium">이용약관</span> 및{" "}
          <span className="text-white font-medium">개인정보처리방침</span>에
          동의하는 것으로 간주됩니다.
        </p>
        {/* 스크롤 안내 */}
        <ScrollAnimation />
      </div>
    </section>
  );
}
