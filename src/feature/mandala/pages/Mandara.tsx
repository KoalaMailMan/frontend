import { handleLogout } from "@/feature/auth/service";
import { Button } from "@/feature/ui/Button";
import Header from "@/shared/\bcomponents/header/Header";
import MandalaCell from "../components/MandaraCell";
import MandalaContainer from "../components/MandaraContainer";
import { useTheme } from "@/shared/hooks/useTheme";
import NoticeContainer from "@/feature/ui/NoticeContainer";
import { CardContent, CardHeader, CardTitle } from "@/feature/ui/Card";
import koalaPixelImage from "@/assets/default_koala.png";

export default function Mandala() {
  const { getCurrentBackground } = useTheme();
  return (
    <div>
      <div
        className="min-h-screen p-4"
        style={{
          backgroundImage: `url(${getCurrentBackground()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Header />
        {/* <NoticeContainer variant={"default"}> */}
        <div className="max-w-2xl mx-auto">
          <div className="mailbox-card backdrop-blur-sm bg-white/95 shadow-2xl">
            <div className="mailbox-slot"></div>
            <div className="mailbox-flag"></div>
            <CardHeader className="text-center pt-8">
              <CardTitle
                className="flex items-center justify-center gap-2 pixel-subtitle"
                style={{ fontSize: "14px" }}
              >
                <img src={koalaPixelImage} alt="코알라" className="w-6 h-6" />
                코알라 우체통 📮
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                중앙에{" "}
                <span className="font-semibold text-primary">핵심 목표</span>를,
                주변 8칸에{" "}
                <span className="font-semibold text-primary/80">주요 목표</span>
                를 입력하세요
              </p>
              <p className="text-xs text-gray-500 mt-1">
                목표를 우체통에 넣어 코알라가 정기적으로 리마인드해드려요! 📬
              </p>
            </CardHeader>
            <CardContent className="pb-6">
              <div
                className="grid grid-cols-3 gap-1 max-w-lg mx-auto aspect-square "
                data-tutorial="main-cells"
              >
                <MandalaContainer />
              </div>
              <div className="text-center mt-6">
                <Button className="pixel-button bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-base">
                  {/* <Save className="h-5 w-5 mr-2" /> */}
                  우체통에 저장하기 📮
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
        {/* </NoticeContainer> */}
      </div>
    </div>
  );
}
