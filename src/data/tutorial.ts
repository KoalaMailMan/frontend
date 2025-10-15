type TutorialStep = {
  id: string;
  title: string;
  description: string;
  className: string;
  targetSelector: string;
  position: "top" | "bottom" | "left" | "right";
  mobilePosition: "top" | "bottom" | "left" | "right";
};
export const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "안녕하세요! 코알라 우체부예요",
    description:
      "만다라트로 당신의 꿈 여행을 시작해봐요. \n제가 옆에서 하나씩 안내해드릴게요.",
    targetSelector: '[data-tutorial="next-button"]',
    className: "next-button",
    position: "right",
    mobilePosition: "top",
  },
  {
    id: "center-goal",
    title: "1단계: 핵심 목표를 정해주세요",
    description:
      "가장 이루고 싶은 꿈을 중앙에 적어주세요. \n이곳이 바로 시작점이에요!",
    targetSelector: '[data-tutorial="center-cell"]',
    className: "center-cell",
    position: "left",
    mobilePosition: "top",
  },
  {
    id: "main-goals",
    title: "2단계: 주요 목표를 정해주세요",
    description:
      "중심에 있는 핵심 목표를 이루기 위해, \n그 주변에 8개의 작은 목표를 적어보세요.",
    targetSelector: '[data-tutorial="main-cells"]',
    className: "main-cells",
    position: "left",
    mobilePosition: "top",
  },
  {
    id: "sub-goals",
    title: "3단계: 조금 더 구체적으로 계획해봐요",
    description:
      "칸 우측 상단의 화살표를 눌러보세요. \n더 세밀한 계획을 세울 수 있어요!",
    targetSelector: '[data-tutorial="tutorial-arrow-button"]',
    className: "tutorial-arrow-button",
    position: "left",
    mobilePosition: "top",
  },
  {
    id: "recommend",
    title: "4단계: 목표를 추천 받을 수 있어요",
    description:
      "중앙의 주요 목표를 작성했다면? \n세부 목표를 추천 받을 수 있어요",
    targetSelector: '[data-tutorial="recommendation-button"]',
    className: "recommendation-button",
    position: "right",
    mobilePosition: "top",
  },
  {
    id: "save",
    title: "5단계: 우체통에 저장해요",
    description:
      "목표를 저장하면, 저장한 목표를 정기적으로 확인하고, \n언제든 확인하고 이어서 작성할 수 있어요.",
    targetSelector: '[data-tutorial="save-button"]',
    className: "save-button",
    position: "top",
    mobilePosition: "top",
  },
  {
    id: "reminder",
    title: "6단계: 우체부 서비스 신청해요",
    description:
      "목표를 잊지 않도록 정기적으로 응원 메일을 보내드릴게요. 함께 성장해요!",
    targetSelector: '[data-tutorial="reminder-button"]',
    className: "reminder-button",
    position: "top",
    mobilePosition: "top",
  },
];
