import Button from "@/feature/ui/Button";
import { handleNaverLogin } from "../service";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  svgClassName?: string;
};

export default function NaverLoginButton({ className, svgClassName }: Props) {
  return (
    <Button
      onClick={handleNaverLogin}
      className={cn(
        "w-full bg-[#0AA372] active:bg-[#077351] text-white h-14 pixel-login-button text-lg shadow-2xl border-1 border-[#077351] active:border-[#04432F] shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.25)] transition-shadow duration-200",
        className
      )}
    >
      <svg
        className={cn("w-6 h-6 mr-3", svgClassName)}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
      </svg>
      네이버로 시작하기
    </Button>
  );
}
