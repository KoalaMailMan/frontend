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
});
