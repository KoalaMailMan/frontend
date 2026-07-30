import { createServerMandalaFixture } from "@/lib/stores/__tests__/fixtures/serverMandala";
import { toLegacyStructure } from "../service/transform";
import { applyChangesToServer } from "../service/server";

let server: ReturnType<typeof createServerMandalaFixture>;
let currentData: ReturnType<typeof toLegacyStructure>;

beforeEach(() => {
  server = createServerMandalaFixture();
  currentData = toLegacyStructure(server.data);
});

describe("applyChangesToServer", () => {
  describe("Core", () => {
    it("core 목표 수정 시 changedCells에 반영되어 변환된다.", () => {
      currentData.core.content = "헬스";

      const changedCells = new Set(["core-0"]);

      const result = applyChangesToServer(
        1,
        currentData,
        changedCells,
        server.data
      );
      const core = result.core;
      expect(core).toBeDefined();
      expect(core?.content).toBe("헬스");
    });
  });
  describe("Main", () => {
    it("main 목표 수정 시 changedCells에 반영되어 변환된다.", () => {
      currentData.core.mains[3].content = "헬스";

      const changedCells = new Set(["main-3"]);

      const result = applyChangesToServer(
        1,
        currentData,
        changedCells,
        server.data
      );
      const main = result.core.mains!.find((main) => main.position === 3);
      expect(main).toBeDefined();
      expect(main?.content).toBe("헬스");
    });
  });
  describe("Sub", () => {
    it("sub 목표 수정 시 changedCells에 반영되어 변환된다.", () => {
      currentData.core.mains[3].subs[2].content = "헬스";

      const changedCells = new Set(["sub-3-2"]);

      const result = applyChangesToServer(
        1,
        currentData,
        changedCells,
        server.data
      );
      const main = result.core.mains!.find((main) => main.position === 3);
      const sub = main?.subs.find((sub) => sub.position === 2);
      expect(sub).toBeDefined();
      expect(sub?.content).toBe("헬스");
    });
  });
});
