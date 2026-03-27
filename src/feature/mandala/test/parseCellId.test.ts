import { parseCellId } from "../service/parseCellId";

describe("parseCellId", () => {
  //core
  it("core-0 -> core 타입", () => {
    expect(parseCellId("core-0")).toEqual({ type: "core" });
  });

  //main
  it("main-3 → main 타입, mainIndex: 3", () => {
    expect(parseCellId("main-3")).toEqual({ type: "main", mainIndex: 3 });
  });

  // 서브 대시보드
  it("sub-2-4 → sub 타입, mainIndex: 2, subIndex: 4", () => {
    expect(parseCellId("sub-2-4")).toEqual({
      type: "sub",
      mainIndex: 2,
      subIndex: 4,
    });
  });

  // 전체 대시보드 특수 케이스
  it("sub-0-3 → main 타입, mainIndex: 3", () => {
    expect(parseCellId("sub-0-3")).toEqual({ type: "main", mainIndex: 3 });
  });
  it("sub-center-3 → main 타입, mainIndex: 3", () => {
    expect(parseCellId("sub-center-3")).toEqual({ type: "main", mainIndex: 3 });
  });

  // 알 수 없는 케이스
  it("main-center-3 → main 타입, mainIndex: 3", () => {
    expect(parseCellId("main-center-3")).toEqual({ type: "unknown" });
  });
  it("unknown-x → unknown 타입", () => {
    expect(parseCellId("unknown-x")).toEqual({ type: "unknown" });
  });
});
