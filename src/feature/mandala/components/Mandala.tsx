import { handleLogout } from "@/feature/auth/service";
import { Button } from "@/feature/ui/Button";

export default function Mandala() {
  return (
    <>
      <Button onClick={handleLogout}>로그아웃</Button>
      <p>로그인 성공 페이지</p>
    </>
  );
}
