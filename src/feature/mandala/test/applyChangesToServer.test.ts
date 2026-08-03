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
  describe("예외 케이스", () => {
    it("기존 main이 없는데 UI에서 입력한 경우 push 된다.", () => {
      currentData.core.mains[5].content = "수영";
      const changedCells = new Set(["main-5"]);
      const result = applyChangesToServer(
        1,
        currentData,
        changedCells,
        server.data
      );
      const main = result.core.mains!.find((main) => main.position === 5);
      expect(main).toBeDefined();
      expect(main?.content).toBe("수영");
    });
    it("기존 sub이 없는데 UI에서 입력한 경우 push 된다.", () => {
      currentData.core.mains[3].subs[6].content = "배영하기";
      const changedCells = new Set(["sub-3-6"]);
      const result = applyChangesToServer(
        1,
        currentData,
        changedCells,
        server.data
      );
      const main = result.core.mains!.find((main) => main.position === 3);
      console.log(main);
      const sub = main?.subs.find((sub) => sub.position === 6);
      expect(sub).toBeDefined();
      expect(sub?.content).toBe("배영하기");
    });
    it("기존 main도, sub도 없는데 UI에서 입력한 경우 push 된다.", () => {
      currentData.core.mains[8].content = "놀기";
      currentData.core.mains[8].subs[4].content = "게임하기";
      const changedCells = new Set(["main-8", "sub-8-4"]);
      const result = applyChangesToServer(
        1,
        currentData,
        changedCells,
        server.data
      );
      const main = result.core.mains!.find((main) => main.position === 8);
      expect(main).toBeDefined();
      expect(main?.content).toBe("놀기");
      const sub = main?.subs.find((sub) => sub.position === 4);
      expect(sub).toBeDefined();
      expect(sub?.content).toBe("게임하기");
    });
    it("main이 없어도 sub 입력 시 main을 생성한다.", () => {
      currentData.core.mains[7].subs[4].content = "숙면";
      const changedCells = new Set(["sub-7-4"]);
      const result = applyChangesToServer(
        1,
        currentData,
        changedCells,
        server.data
      );

      const main = result.core.mains!.find((main) => main.position === 7);
      expect(main).toBeDefined();
      expect(main).toMatchObject({
        position: 7,
      });

      const sub = main?.subs.find((sub) => sub.position === 4);
      expect(sub).toBeDefined();
      expect(sub?.content).toBe("숙면");
    });
  });
});
