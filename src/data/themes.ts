// type colorType = "purple" | "red" | "blue" | "green" | "yellow" | "pink";

export type ThemeColor = "spring" | "summer" | "autumn" | "winter";

export const themes = [
  {
    id: "spring" as ThemeColor,
    name: "봄",
    img: "/src/assets/background/background_spring.png",
    color: "#FFEDF091",
    borderColor: "#FF99A9",
    description: "봄",
  },
  {
    id: "summer" as ThemeColor,
    name: "여름",
    img: "/src/assets/background/background_summer.png",
    color: "#32F9FF26",
    borderColor: "#02C2FE",
    description: "여름",
  },
  {
    id: "autumn" as ThemeColor,
    name: "가을",
    img: "/src/assets/background/background_autumn.png",
    color: "#F8E6CBB5",
    borderColor: "#FA7018",
    description: "가을",
  },
  {
    id: "winter" as ThemeColor,
    name: "겨울",
    img: "/src/assets/background/background_winter.png",
    color: "#C2E4FC73",
    borderColor: "#3085BA",
    description: "겨울",
  },

  // {
  //   id: "purple" as ThemeColor,
  //   name: "보라",
  //   color: "#86569d",
  //   description: "고요한 보라",
  // },
  // {
  //   id: "red" as ThemeColor,
  //   name: "빨강",
  //   color: "#ff5042",
  //   description: "따뜻한 빨강",
  // },
  // {
  //   id: "blue" as ThemeColor,
  //   name: "파랑",
  //   color: "#40bbed",
  //   description: "시원한 파랑",
  // },
  // {
  //   id: "green" as ThemeColor,
  //   name: "초록",
  //   color: "#3aab63",
  //   description: "자연의 초록",
  // },
  // {
  //   id: "yellow" as ThemeColor,
  //   name: "노랑",
  //   color: "#ffe849",
  //   description: "밝은 노랑",
  // },
  // {
  //   id: "pink" as ThemeColor,
  //   name: "분홍",
  //   color: "#e17aaa",
  //   description: "부드러운 분홍",
  // },
];
