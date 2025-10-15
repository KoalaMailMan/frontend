// image.ts
import { toPng } from "html-to-image";
import { toast } from "sonner";

export const captureAndDownload = async (
  mandaraGridRef: React.RefObject<HTMLDivElement | null>
) => {
  if (!mandaraGridRef?.current) return;

  const originalElement = mandaraGridRef.current;

  // 화면 잘림 이슈: 캡쳐할 영역 복사본
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "fixed";
  tempContainer.style.left = "-9999px"; // 화면 밖으로
  tempContainer.style.top = "0";
  tempContainer.style.zIndex = "-1";
  tempContainer.style.overflow = "visible";
  tempContainer.style.width = "max-content";
  tempContainer.style.height = "max-content";

  document.body.appendChild(tempContainer);

  try {
    const clonedElement = originalElement.cloneNode(true) as HTMLElement;

    clonedElement.style.overflow = "visible";
    clonedElement.style.maxHeight = "none";
    clonedElement.style.height = "auto";

    const allElements = clonedElement.querySelectorAll("*");
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.overflow = "visible";
      htmlEl.style.maxHeight = "none";
    });

    tempContainer.appendChild(clonedElement);

    // DOM 렌더링 완료 대기
    await new Promise((resolve) => setTimeout(resolve, 300));

    const dataUrl = await toPng(clonedElement, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
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
  } finally {
    document.body.removeChild(tempContainer);
  }
};

export const buildImageSrc = (
  path: string,
  { width, format }: { width?: string; format: string }
) => `${path}?width=${width}&format=${format}` as unknown as string;
