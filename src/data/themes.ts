export type ThemeColor =
  | "purple"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "pink";

export const themes = [
  {
    id: "purple" as ThemeColor,
    name: "보라",
    color: "#86569d",
    description: "고요한 보라",
  },
  {
    id: "red" as ThemeColor,
    name: "빨강",
    color: "#df6556",
    description: "따뜻한 빨강",
  },
  {
    id: "blue" as ThemeColor,
    name: "파랑",
    color: "#40bbed",
    description: "시원한 파랑",
  },
  {
    id: "green" as ThemeColor,
    name: "초록",
    color: "#3aab63",
    description: "자연의 초록",
  },
  {
    id: "yellow" as ThemeColor,
    name: "노랑",
    color: "#ffe849",
    description: "밝은 노랑",
  },
  {
    id: "pink" as ThemeColor,
    name: "분홍",
    color: "#e17aaa",
    description: "부드러운 분홍",
  },
];
