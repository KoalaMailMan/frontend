import { toLegacyStructure } from "@/feature/mandala/service/transform";
import { createServerMandalaFixture } from "./fixtures/serverMandala";

let server: ReturnType<typeof createServerMandalaFixture>;
let result: ReturnType<typeof toLegacyStructure>;

beforeEach(() => {
  server = createServerMandalaFixture();
  result = toLegacyStructure(server.data);
});

describe("toLegacyStructure", () => {
  describe("Core 변환", () => {
    it("core는 UI의 mains[0]으로 매핑된다.", () => {
      expect(result.core.mains[0]).toMatchObject({
        goalId: "core-0",
        content: "자기계발",
        status: "UNDONE",
        position: 0,
        originalId: 1,
      });
    });
    it("core의 내용이 sub-0-0에도 복사된다.", () => {
      expect(result.core.mains[0].subs[0]).toMatchObject({
        position: 0,
        content: "자기계발",
      });
    });
  });
  describe("Main 변환", () => {
    it("main을 position 기준으로 배치한다.", () => {
      expect(result.core.mains[3]).toMatchObject({
        position: 3,
        content: "운동",
      });
    });
  });
  describe("Sub 변환", () => {
    it("sub을 position 기준으로 배치", () => {
      expect(result.core.mains[3].subs[3]).toMatchObject({
        position: 3,
        content: "30분 유산소",
      });
    });
  });
});
