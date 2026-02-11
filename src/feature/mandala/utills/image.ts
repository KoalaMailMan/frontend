import { toPng } from "html-to-image";
import { toast } from "sonner";

// const copyComputedStyles = (
//   originalElement: HTMLElement,
//   clonedElement: HTMLElement
// ) => {
//   const originalElements = originalElement.querySelectorAll("*");
//   const clonedElements = clonedElement.querySelectorAll("*");

//   originalElements.forEach((original, index) => {
//     const computedStyle = window.getComputedStyle(original);
//     const clonedEl = clonedElements[index] as HTMLElement;
//     console.log(computedStyle);

//     Array.from(computedStyle).forEach((style) => {
//       clonedEl.style.setProperty(
//         style,
//         computedStyle.getPropertyValue(style),
//         computedStyle.getPropertyPriority(style)
//       );
//     });
//   });
// };

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
  tempContainer.style.paddingTop = "50px";
  tempContainer.style.paddingBottom = "50px";

  document.body.appendChild(tempContainer);

  try {
    const clonedElement = originalElement.cloneNode(true) as HTMLElement;

    await document.fonts.ready;
    // copyComputedStyles(originalElement, clonedElement);
    const gridElement = clonedElement.querySelector(".grid") as HTMLElement;
    if (gridElement) {
      gridElement.style.width = "800px";
    }

    tempContainer.appendChild(clonedElement);

    // DOM 렌더링 완료 대기
    await new Promise((resolve) => setTimeout(resolve, 300));

    const dataUrl = await toPng(clonedElement, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `koala-mailman-${new Date()
      .toISOString()
      .slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();
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
