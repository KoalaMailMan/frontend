import {
  service_info_ai,
  service_info_mail,
  service_info_make_goals,
  service_info_regret,
  service_info_success,
  service_info_ai_srcSet,
  service_info_mail_srcSet,
  service_info_make_goals_srcSet,
  service_info_regret_srcSet,
  service_info_success_srcSet,
  service_info_mandalart,
  service_info_mandalart_srcSet,
} from "@/feature/home/const/url";

export const SERVICE_GUIDE_STEPS = [
  {
    step: 1,
    title: "새해 목표 설정",
    subtitle: "올해는 정말 달라질 거야!",
    description: "새해가 되면 누구나 열정적으로 목표를 세웁니다.",
    image: service_info_make_goals,
    srcSet: service_info_make_goals_srcSet,
    emoji: "🎯",
  },
  {
    step: 2,
    title: "하지만 현실은?",
    subtitle: "뭐 적지... 어 내 목표가 뭐였지...",
    description:
      "목표를 갑자기 떠올리는 것도, 시간이 지나면 목표를 까먹는 것도 당연. 매년 똑같이 반복되는 목표들...",
    image: service_info_regret,
    srcSet: service_info_regret_srcSet,
    emoji: "🤔",
  },
  {
    step: 3,
    title: "코알라 우체부와 함께 만다라트를",
    subtitle: "오타니 쇼헤이의 성공 비결",
    description: "오타니 쇼헤이의 성공 비결이라는 만다라트 같이 작성해봐요",
    image: service_info_mandalart,
    srcSet: service_info_mandalart_srcSet,
    emoji: "📊",
  },
  {
    step: 4,
    title: "코알라 우체부는 목표를 추천해드려요",
    subtitle: "AI가 도와주는 똑똑한 목표 설정",
    description:
      "AI 챗봇이 당신의 상황에 맞는 구체적이고 실현 가능한 목표를 추천해드립니다",
    image: service_info_ai,
    srcSet: service_info_ai_srcSet,
    emoji: "🤖",
  },
  {
    step: 5,
    title: "정기적인 리마인드",
    subtitle: "코알라가 이메일로 알려드려요",
    description: "설정한 알림 기간마다 메일을 보내 목표를 리마인드 해드려요",
    image: service_info_mail,
    srcSet: service_info_mail_srcSet,
    emoji: "📧",
  },
  {
    step: 6,
    title: "목표 달성!!",
    subtitle: "성취의 기쁨을 함께 나누어요",
    description:
      "체계적인 계획과 꾸준한 리마인드로 당신의 꿈을 현실로 만들어보세요",
    image: service_info_success,
    srcSet: service_info_success_srcSet,
    emoji: "🎉",
  },
] as const;
