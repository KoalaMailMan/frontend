import { toPng } from "html-to-image";
import { toast } from "sonner";

export const captureAndDownload = async (
  mandaraGridRef: React.RefObject<HTMLDivElement | null>
) => {
  if (!mandaraGridRef?.current) return;

  try {
    const dataUrl = await toPng(mandaraGridRef.current, {
      cacheBust: true,
      pixelRatio: 2, // 고해상도
      backgroundColor: "#ffffff", // 원하는 배경색
    });

    const link = document.createElement("a");
    link.download = `koalart-mandara-${new Date()
      .toISOString()
      .slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();

    toast("만다라트 이미지가 저장되었습니다!");
  } catch (error) {
    console.error("이미지 저장 중 오류:", error);
    toast.error(
      "만다라트 이미지 저장 중 오류가 발생했습니다. 잠시후 다시 시도해주세요."
    );
  }
};
