import { toFlatStructure } from "@/feature/mandala/service/transform";
import { createServerMandalaFixture } from "./fixtures/serverMandala";

let server: ReturnType<typeof createServerMandalaFixture>;
let result: ReturnType<typeof toFlatStructure>;

beforeEach(() => {
  server = createServerMandalaFixture();
  result = toFlatStructure(server.data.core);
});

describe("toFlatStructure", () => {
  describe("Cells 변환", () => {
    it("Core 변환", () => {
      expect(result.cells["core-0"]).toMatchObject({
        goalId: "core-0",
        content: "자기계발",
        status: "UNDONE",
      });
    });
    it("Main 변환", () => {
      expect(result.cells["main-1"]).toMatchObject({
        goalId: "main-1",
        content: "독서",
        status: "UNDONE",
        position: 1,
      });
    });
    it("Sub 변환", () => {
      expect(result.cells["sub-1-1"]).toMatchObject({
        goalId: "sub-1-1",
        content: "30분 읽기",
        status: "UNDONE",
        position: 1,
      });
    });
  });
  describe("Layouts 변환", () => {
    it("mains 변환", () => {
      expect(result.layout.mains).toEqual([
        "core-0",
        "main-1",
        "main-2",
        "main-3",
        "main-4",
        "main-5",
        "main-6",
        "main-7",
        "main-8",
      ]);
    });
    it("subs 변환", () => {
      expect(result.layout.subs["main-3"]).toEqual([
        "main-3",
        "sub-3-1",
        "sub-3-2",
        "sub-3-3",
        "sub-3-4",
        "sub-3-5",
        "sub-3-6",
        "sub-3-7",
        "sub-3-8",
      ]);
    });
    it("grid 변환", () => {
      expect(result.layout.grid[3][3]).toBe("sub-3-3");
    });
  });
});
