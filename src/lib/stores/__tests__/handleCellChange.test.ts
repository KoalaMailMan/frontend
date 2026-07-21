import { useMandalaStore } from "../mandalaStore";
import { createStoreFixture } from "./fixtures/createStoreState";

let fixture: ReturnType<typeof createStoreFixture>;

beforeEach(() => {
  fixture = createStoreFixture();
  useMandalaStore.setState(fixture);
});

describe("handleCellChange", () => {
  it("core 셀 수정", () => {
    useMandalaStore
      .getState()
      .handleCellChange("core-0", "운동", fixture.serverData);

    const state = useMandalaStore.getState();

    expect(state.data.core.content).toBe("운동");
    expect(state.flatData.cells["core-0"].content).toBe("운동");
  });

  it("main 셀 수정", () => {
    useMandalaStore
      .getState()
      .handleCellChange("main-3", "운동", fixture.serverData);

    const state = useMandalaStore.getState();
    expect(state.data.core.mains[3].content).toBe("운동");
    expect(state.flatData.cells["main-3"].content).toBe("운동");
  });
  it("sub 셀 수정", () => {
    useMandalaStore
      .getState()
      .handleCellChange("sub-3-5", "운동", fixture.serverData);

    const state = useMandalaStore.getState();
    expect(state.data.core.mains[3].subs[5].content).toBe("운동");
    expect(state.flatData.cells["sub-3-5"].content).toBe("운동");
  });

  it("main-3 셀 수정 시 sub-3-0도 수정", () => {
    useMandalaStore
      .getState()
      .handleCellChange("main-3", "운동", fixture.serverData);

    const state = useMandalaStore.getState();
    expect(state.data.core.mains[3].content).toBe("운동");
    expect(state.data.core.mains[3].subs[0].content).toBe("운동");

    // Flat에서는 둘 다 main-3 하나로 표현된다.
    expect(state.flatData.cells["main-3"].content).toBe("운동");
  });

  it("sub-3-4 수정 시 main-3은 동기화되지 않아야 함.", () => {
    useMandalaStore
      .getState()
      .handleCellChange("sub-3-4", "독서", fixture.serverData);

    const state = useMandalaStore.getState();
    expect(state.flatData.cells["main-3"].content).not.toBe("독서");
    expect(state.data.core.mains[3].subs[4].content).toBe("독서");
  });
  it("changedCells 추가", () => {
    useMandalaStore
      .getState()
      .handleCellChange("core-0", "운동", fixture.serverData);

    const state = useMandalaStore.getState();
    console.log(state.changedCells);
    expect(state.changedCells.has("core-0")).toBe(true);
  });
  it("changedCells 삭제", () => {
    useMandalaStore
      .getState()
      .handleCellChange("core-0", "운동", fixture.serverData);
    useMandalaStore
      .getState()
      .handleCellChange("core-0", "자기계발", fixture.serverData);

    const state = useMandalaStore.getState();
    console.log(state.changedCells);
    expect(state.changedCells.has("core-0")).toBe(false);
  });
});
