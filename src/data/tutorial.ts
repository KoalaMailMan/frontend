type TutorialStep = {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: "top" | "bottom" | "left" | "right";
  koalaMessage: string;
};
export const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "안녕하세요! 코알라예요 🐨",
    description:
      "만다라트 목표 설정에 오신 걸 환영해요! 함께 체계적으로 목표를 세워볼까요?",
    targetSelector: "",
    position: "bottom",
    koalaMessage: "코알라가 친근하게 도와드릴게요!",
  },
  {
    id: "center-goal",
    title: "1단계: 핵심 목표 설정",
    description: "가장 중요한 목표를 중앙에 입력하세요",
    targetSelector: '[data-tutorial="center-cell"]',
    position: "top",
    koalaMessage: "여기가 바로 핵심이에요! 가장 이루고 싶은 목표를 적어주세요.",
  },
  {
    id: "main-goals",
    title: "2단계: 주요 목표 설정",
    description:
      "핵심 목표를 달성하기 위한 8개의 주요 목표를 주변 칸에 입력하세요",
    targetSelector: '[data-tutorial="main-cells"]',
    position: "top",
    koalaMessage: "중앙 목표를 이루기 위한 구체적인 방법들을 8개 적어보세요!",
  },
  {
    id: "sub-goals",
    title: "3단계: 세부 목표 설정",
    description:
      "주요 목표 칸의 화살표 버튼을 클릭하면 더 구체적인 계획을 세울 수 있어요",
    targetSelector: '[data-tutorial="tutorial-arrow-button"]',
    position: "left",
    koalaMessage:
      "칸 우측 상단의 화살표 버튼을 클릭해서 세부 목표를 설정해보세요!",
  },
  {
    id: "reminder",
    title: "4단계: 리마인드 설정",
    description: "목표를 잊지 않도록 정기적인 이메일 리마인더를 설정하세요",
    targetSelector: '[data-tutorial="reminder-button"]',
    position: "left",
    koalaMessage: "목표를 잊지 않도록 리마인드를 설정해보세요!",
  },
];
