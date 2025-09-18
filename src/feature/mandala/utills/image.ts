import html2canvas from "html2canvas";

export const captureAndDownload = async (
  mandaraGridRef: React.RefObject<HTMLDivElement | null>
) => {
  if (mandaraGridRef && mandaraGridRef.current) {
    try {
      // 캡처 중에는 다크 모드 클래스를 제거하여 oklch 사용을 방지
      const htmlElement = document.documentElement;
      const hadDarkClass = htmlElement.classList.contains("dark");

      if (hadDarkClass) {
        htmlElement.classList.remove("dark");
      }

      // 잠시 동안 hover 효과 등을 비활성화
      const gridElement = mandaraGridRef.current;
      const originalStyle = gridElement.style.cssText;

      // 캡처를 위해 임시로 스타일 조정
      gridElement.style.transform = "none";
      gridElement.style.transition = "none";

      // 잠시 기다려서 스타일이 적용되도록 함
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(gridElement, {
        backgroundColor: "#ffffff",
        scale: 2, // 고해상도
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: gridElement.scrollWidth,
        height: gridElement.scrollHeight,
        onclone: (clonedDoc: Document) => {
          // 클론된 문서에서도 다크 모드 제거
          const clonedHtml = clonedDoc.documentElement;
          clonedHtml.classList.remove("dark");

          // 모든 요소의 oklch 스타일을 제거
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            const computedStyle = window.getComputedStyle(el as Element);
            const element = el as HTMLElement;

            // oklch를 사용하는 스타일을 기본값으로 변경
            element.style.color = element.style.color || "#2a2d3a";
            element.style.backgroundColor =
              element.style.backgroundColor || "transparent";
            element.style.borderColor = element.style.borderColor || "#e5e7eb";
          });
        },
      });

      // 다크 모드 클래스 복원
      if (hadDarkClass) {
        htmlElement.classList.add("dark");
      }

      // 원래 스타일 복원
      gridElement.style.cssText = originalStyle;

      // 이미지 다운로드
      const link = document.createElement("a");
      link.download = `koalart-mandara-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 성공 메시지 (선택적)
      console.log("만다라트 이미지가 저장되었습니다!");
    } catch (error) {
      console.error("이미지 저장 중 오류가 발생했습니다:", error);

      // 오류 발생 시에도 다크 모드 복원
      const htmlElement = document.documentElement;
      if (!htmlElement.classList.contains("dark")) {
        // 원래 다크 모드였다면 복원
        htmlElement.classList.add("dark");
      }
    }
  }
};
