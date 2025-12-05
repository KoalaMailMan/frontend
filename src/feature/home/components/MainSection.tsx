// @ts-expect-error -- vite-imagetools query import
import koalaTextLogoImage from "@/assets/common/koala_mailman_text_logo.png?width=470;940;1410&as=srcset&format=webp";
import ScrollAnimation from "./ScrollAnimation";
import GoogleLoginButton from "@/feature/auth/components/GoogleLoginButton";
import NaverLoginButton from "@/feature/auth/components/NaverLoginButton";
import type { AuthState } from "@/lib/stores/authStore";

type Props = {
  onTemporaryLogin: (state: AuthState) => void;
};

export default function MainSection({ onTemporaryLogin }: Props) {
  return (
    <section
      className="relative z-20 text-center"
      style={{
        transform: `translateY(${Math.min(scrollY * 0.1, 20)}px)`,
      }}
    >
      <div className="w-full">
        <h1>
          <img
            src={koalaTextLogoImage}
            alt="만다라트 목표 작성 & 리마인드 | 코알라 우체부"
            className="w-full pixelated drop-shadow-2xl max-w-xl mx-auto"
            style={{
              height: "auto",
              filter: "drop-shadow(4px 4px 8px rgba(0,0,0,0.5))",
            }}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            srcSet={koalaTextLogoImage}
            sizes="(max-width: 768px) 90vw, 470px"
            width={470}
            height={470}
          />
          <span className="sr-only">
            만다라트 목표 작성 & 리마인드 | 코알라 우체부
          </span>
        </h1>
      </div>
      <div className="space-y-4 max-w-sm mx-auto">
        <NaverLoginButton />
        <GoogleLoginButton />

        <p
          className="h-[46px] flex justify-center items-center underline text-[12px] text-[#191919] font-medium leading-[17.5px]"
          onClick={() => onTemporaryLogin("temporary")}
        >
          로그인 없이 이용하기
        </p>
      </div>
      <div className="mt-8">
        <p
          className="text-white/70 text-sm leading-relaxed mb-6"
          style={{
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          로그인하면 <span className="text-white font-medium">이용약관</span> 및
          <span className="text-white font-medium">개인정보처리방침</span>에
          동의하는 것으로 간주됩니다.
        </p>
        {/* 스크롤 안내 */}
        <ScrollAnimation />
      </div>
    </section>
  );
}
