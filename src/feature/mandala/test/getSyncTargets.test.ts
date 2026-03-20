import { getSyncTargets } from "../service/getSyncTargets";

describe("getSyncTargets", () => {
  //core
  it("core-0 -> core 타입", () => {
    expect(getSyncTargets({ type: "core" })).toEqual([
      { mainIndex: 0 },
      { mainIndex: 0, subIndex: 0 },
    ]);
  });

  //main
  it("main-3 → main 타입, mainIndex: 3", () => {
    expect(getSyncTargets({ type: "main", mainIndex: 3 })).toEqual([
      { mainIndex: 3 },
      { mainIndex: 3, subIndex: 0 },
    ]);
  });

  it("main-3 → main 타입, mainIndex: 5", () => {
    expect(getSyncTargets({ type: "main", mainIndex: 5 })).toEqual([
      { mainIndex: 5 },
      { mainIndex: 5, subIndex: 0 },
    ]);
  });

  // 서브 대시보드

  it("sub-0-3 → sub 타입, mainIndex: 0, subIndex: 3", () => {
    expect(getSyncTargets({ type: "sub", mainIndex: 0, subIndex: 3 })).toEqual([
      { mainIndex: 0, subIndex: 3 },
    ]);
  });
  it("sub-8-2 → sub 타입, mainIndex: 8, subIndex: 2", () => {
    expect(getSyncTargets({ type: "sub", mainIndex: 8, subIndex: 2 })).toEqual([
      {
        mainIndex: 8,
        subIndex: 2,
      },
    ]);
  });

  // 알 수 없는 케이스
  it("sub-9-2 → sub 타입, mainIndex: 9, subIndex: 2", () => {
    expect(getSyncTargets({ type: "sub", mainIndex: 9, subIndex: 2 })).toEqual(
      null
    );
  });
  it("unknown-x → unknown 타입", () => {
    expect(getSyncTargets({ type: "unknown" })).toEqual(null);
  });
});
