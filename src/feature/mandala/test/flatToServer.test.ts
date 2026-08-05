import { createServerMandalaFixture } from "@/lib/stores/__tests__/fixtures/serverMandala";
import { toFlatStructure, toLegacyStructure } from "../service/transform";
import { flatToServer } from "../service/server";

let server: ReturnType<typeof createServerMandalaFixture>;
let flatResult: ReturnType<typeof toFlatStructure>;
let result: ReturnType<typeof flatToServer>;

beforeEach(() => {
  server = createServerMandalaFixture();
  flatResult = toFlatStructure(server.data.core);
  result = flatToServer(flatResult.cells, flatResult.layout);
});

describe("flatToServer", () => {
  describe("Core 변환", () => {
    it("core를 서버 구조로 변환한다.", () => {
      expect(result.core.content).toBe("자기계발");
      expect(result.core.goalId).toBe(1);
      expect(result.core.status).toBe("UNDONE");
    });
  });

  describe("예외 케이스", () => {
    it("sub만 존재하면 main은 position만 포함한다", () => {
      const main = result.core.mains.find((m) => m.position === 7);
      expect(main).toEqual({
        position: 7,
        subs: [
          expect.objectContaining({
            position: 4,
            content: "유산소",
          }),
        ],
      });
    });
  });
});
