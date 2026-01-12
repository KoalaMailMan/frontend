import {
  service_info_ai,
  service_info_mail,
  service_info_make_goals,
  service_info_regret,
  service_info_success,
} from "@/feature/home/const/url";

export const SERVICE_GUIDE_STEPS = [
  {
    step: 1,
    title: "새해 목표 설정",
    subtitle: "올해는 정말 달라질 거야!",
    description: "새해가 되면 누구나 열정적으로 목표를 세웁니다.",
    image: service_info_make_goals,
    emoji: "🎯",
  },
  {
    step: 2,
    title: "하지만 현실은?",
    subtitle: "뭐 적지... 어 내 목표가 뭐였지...",
    description:
      "목표를 갑자기 떠올리는 것도, 시간이 지나면 목표를 까먹는 것도 당연. 매년 똑같이 반복되는 목표들...",
    image: service_info_regret,
    emoji: "🤔",
  },
  {
    step: 3,
    title: "코알라 우체부와 함께 만다라트를",
    subtitle: "오타니 쇼헤이의 성공 비결",
    description: "오타니 쇼헤이의 성공 비결이라는 만다라트 같이 작성해봐요",
    image:
      "https://images.unsplash.com/photo-1754299078912-602a882904a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwY2hhcnQlMjBwbGFubmluZyUyMGdyaWR8ZW58MXx8fHwxNzU3OTM2NDkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    emoji: "📊",
  },
  {
    step: 4,
    title: "코알라 우체부는 목표를 추천해드려요",
    subtitle: "AI가 도와주는 똑똑한 목표 설정",
    description:
      "AI 챗봇이 당신의 상황에 맞는 구체적이고 실현 가능한 목표를 추천해드립니다",
    image: service_info_ai,
    emoji: "🤖",
  },
  {
    step: 5,
    title: "정기적인 리마인드",
    subtitle: "코알라가 이메일로 알려드려요",
    description: "설정한 알림 기간마다 메일을 보내 목표를 리마인드 해드려요",
    image: service_info_mail,
    emoji: "📧",
  },
  {
    step: 6,
    title: "목표 달성!!",
    subtitle: "성취의 기쁨을 함께 나누어요",
    description:
      "체계적인 계획과 꾸준한 리마인드로 당신의 꿈을 현실로 만들어보세요",
    image: service_info_success,
    emoji: "🎉",
  },
] as const;
