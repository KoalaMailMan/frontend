export const getGridClasses = (idx: number) => {
  if (idx === 0) return "col-start-2 row-start-2"; // 중앙
  const positions = [
    "col-start-1 row-start-1", // 좌상
    "col-start-2 row-start-1", // 중상
    "col-start-3 row-start-1", // 우상
    "col-start-1 row-start-2", // 좌중
    "col-start-3 row-start-2", // 우중
    "col-start-1 row-start-3", // 좌하
    "col-start-2 row-start-3", // 중하
    "col-start-3 row-start-3", // 우하
  ];
  return positions[idx - 1] || "col-start-1 row-start-1";
};

export type Type = "center" | "main" | "main-center" | "sub";

export const findbyCSS = (type: Type) => {
  const typeObj = {
    center: " bg-primary/20 border-primary text-primary font-semibold",
    "main-center": " bg-primary/5 border-primary/30",
    main: " bg-primary/10 border-primary/50 font-medium",
    sub: " bg-gray-50 border-gray-200",
  };
  if (typeObj[type]) return typeObj[type];
  return typeObj["sub"];
};
