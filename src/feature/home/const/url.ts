// @ts-expect-error -- vite-imagetools query import
import textLogoCol from "@/assets/common/koala_mailman_text_logo.png?width=320;576;940&format=webp&quality=60";
// @ts-expect-error -- vite-imagetools query import
import textLogoColSrcSet from "@/assets/common/koala_mailman_text_logo.png?as=srcset&width=320;576;940&format=webp&quality=60";

export const koalaTextLogoCol = textLogoCol;
export const koalaTextLogoColSrcSet = textLogoColSrcSet;

import redIcon from "@/assets/home/mini_red_koala.svg";
import greenIcon from "@/assets/home/mini_green_koala.svg";
import purpleIcon from "@/assets/home/mini_purple_koala.svg";

export const koalaRedImage = redIcon;
export const koalaGreenImage = greenIcon;
export const koalaPurpleImage = purpleIcon;

// @ts-expect-error -- vite-imagetools query import
import makeGoal from "@/assets/home/service_info/service_info_make_goals.jpg?width=313;626;939&format=webp&quality=60";
// @ts-expect-error -- vite-imagetools query import
import makeGoalSrcSet from "@/assets/home/service_info/service_info_make_goals.jpg?as=srcset&width=313;626;939&format=webp&quality=60";
// @ts-expect-error -- vite-imagetools query import
import regretGoal from "@/assets/home/service_info/service_info_regret.jpg?width=313;626;939&format=webp&quality=60";
// @ts-expect-error -- vite-imagetools query import
import regretGoalSrcSet from "@/assets/home/service_info/service_info_regret.jpg?as=srcset&width=313;626;939&format=webp&quality=60";
// @ts-expect-error -- vite-imagetools query import
import aiGoal from "@/assets/home/service_info/service_info_ai.jpg?width=471;942;1413&format=webp&quality=60";
// @ts-expect-error -- vite-imagetools query import
import aiGoalSrcSet from "@/assets/home/service_info/service_info_ai.jpg?as=srcset&width=471;942;1413&format=webp&quality=60";
// @ts-expect-error -- vite-imagetools query import
import mailGoal from "@/assets/home/service_info/service_info_mail.jpg?width=313;626;939&format=webp&quality=60";
// @ts-expect-error -- vite-imagetools query import
import mailGoalSrcSet from "@/assets/home/service_info/service_info_mail.jpg?as=srcset&width=313;626;939&format=webp&quality=60";
// @ts-expect-error -- vite-imagetools query import
import successGoal from "@/assets/home/service_info/service_info_success.jpg?width=313;626;939&format=webp&quality=60";
// @ts-expect-error -- vite-imagetools query import
import successGoalSrcSet from "@/assets/home/service_info/service_info_success.jpg?as=srcset&width=313;626;939&format=webp&quality=60";

export const unsplash_url =
  "https://images.unsplash.com/photo-1754299078912-602a882904a5?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwY2hhcnQlMjBwbGFubmluZyUyMGdyaWR8ZW58MXx8fHwxNzU3OTM2NDkxfDA&ixlib=rb-4.1.0";
export const service_info_mandalart = `${unsplash_url}&w=1080&q=80`;

export const service_info_make_goals = makeGoal[0];
export const service_info_regret = regretGoal[0];
export const service_info_ai = aiGoal[0];
export const service_info_mail = mailGoal[0];
export const service_info_success = successGoal[0];

export const service_info_mandalart_srcSet = `${unsplash_url}&w=390&q=80 390w, ${unsplash_url}&w=768&q=80 768w, ${unsplash_url}&w=1080&q=80 1080w`;
export const service_info_make_goals_srcSet = makeGoalSrcSet;
export const service_info_regret_srcSet = regretGoalSrcSet;
export const service_info_ai_srcSet = aiGoalSrcSet;
export const service_info_mail_srcSet = mailGoalSrcSet;
export const service_info_success_srcSet = successGoalSrcSet;

export const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";
