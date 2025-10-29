import X from "@/feature/tutorial/components/icons/X";
import NaverLoginButton from "./NaverLoginButton";
import GoogleLoginButton from "./GoogleLoginButton";
import { useAuthStore } from "@/lib/stores/authStore";

export default function AuthComponent({ children }: any) {
  const isAuthOpen = useAuthStore((state) => state.isAuthOpen);
  const setAuthOpen = useAuthStore((state) => state.setAuthOpen);

  if (!isAuthOpen) return;

  return (
    <div className="md:w-[562px] h-[325px] bg-white border-1 border-[#B3B3B3] px-[20px] py-[20px] pb-[40px] rounded-lg fixed top-[50%] left-[50%] mt-[-162px] ml-[-281px] z-150">
      <p className="w-full h-[20px] flex justify-end mt-[4px]">
        <span className="w-[20px]" onClick={() => setAuthOpen(false)}>
          <X size={20} strokeColor="#B3B3B3" />
        </span>
      </p>
      <div className="flex flex-col gap-[6px] mb-[40px]">
        <h3 className="w-full h-[43px] text-2xl flex items-center justify-center leading-[180%] font-semibold text-[#000000]">
          {children}을 위해 로그인해주세요
        </h3>
        <p className="w-full h-[54px] text-[15px] leading-[180%] flex flex-col items-center justify-center font-semibold text-[#4C4C4C]">
          <span>로그인하고 나만의 목표를 만나보세요. </span>
          <span>AI가 당신에게 꼭 맞는 방향을 제안해드릴게요.</span>
        </p>
      </div>
      <nav className="px-[36px]">
        <NaverLoginButton
          className="h-[40px] text-base gap-[30px] mb-[18px]"
          svgClassName="w-[16px] h-[16px]"
        />
        <GoogleLoginButton
          className="h-[40px] text-base gap-[30px]"
          svgClassName="w-[16px] h-[16px]"
        />
      </nav>
    </div>
  );
}
