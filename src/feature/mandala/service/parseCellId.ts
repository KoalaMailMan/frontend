type ParsedCellId =
  | { type: "core" }
  | { type: "main"; mainIndex: number }
  | { type: "sub"; mainIndex: number; subIndex: number }
  | { type: "unknown" };

export const parseCellId = (cellId: string): ParsedCellId => {
  // 메인 대시보드
  // main-{mainIndex}                → main 타입

  // 서브 대시보드
  // sub-{mainIndex}-{subIndex}      → sub 타입

  // 전체 대시보드 (9x9)
  // core-0                          → core 타입
  // sub-0-{mainIndex}               → core 주위 메인 8개 (mainIndex가 parts[2])
  // sub-center-{mainIndex}          → 각 서브 대시보드의 메인 셀 (중첩 요소)
  // sub-{mainIndex}-{subIndex}      → 나머지 서브 셀들 (동일한 패턴)

  const parts = cellId.split("-");
  const prefix = parts[0];

  if (prefix === "core") return { type: "core" };

  if (prefix === "main") {
    const mainIndex = parseInt(parts[1]);
    if (isNaN(mainIndex)) return { type: "unknown" };
    return { type: "main", mainIndex };
  }

  if (prefix === "sub") {
    if (parts[1] === "0" || parts[1] === "center") {
      const mainIndex = parseInt(parts[2]);
      if (isNaN(mainIndex)) return { type: "unknown" };
      return { type: "main", mainIndex };
    }
    if (parts[2] === "0") {
      const mainIndex = parseInt(parts[1]);
      if (isNaN(mainIndex)) return { type: "unknown" };
      return { type: "main", mainIndex };
    }
    const mainIndex = parseInt(parts[1]);
    const subIndex = parseInt(parts[2]);
    if (isNaN(mainIndex) || isNaN(subIndex)) return { type: "unknown" };
    return { type: "sub", mainIndex, subIndex };
  }

  return { type: "unknown" };
};
