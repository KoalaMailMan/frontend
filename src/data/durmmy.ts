export const dummyData = {
  data: {
    mandalartId: 7,
    reminderOption: {
      reminderEnabled: true,
      remindInterval: "weekly", // 매주 알림
      remindScheduledAt: "2025-10-01T09:00:00Z",
    },
    core: {
      goalId: 100,
      content: "개인 성장",
      mains: [
        {
          goalId: 101,
          position: 0,
          content: "운동",
          subs: [
            { goalId: 102, position: 1, content: "주 3회 조깅" },
            { goalId: 103, position: 2, content: "근력 운동 2회" },
          ],
        },
        {
          goalId: 104,
          position: 1,
          content: "독서",
          subs: [
            { goalId: 105, position: 1, content: "비즈니스 서적 읽기" },
            { goalId: 106, position: 2, content: "추리소설 읽기" },
          ],
        },
        {
          goalId: 107,
          position: 2,
          content: "개발 공부",
          subs: [
            { goalId: 108, position: 1, content: "React 프로젝트 만들기" },
            { goalId: 109, position: 2, content: "TypeScript 패턴 학습" },
          ],
        },
        {
          goalId: 6,
          position: 5,
          content: "개발 공부",
          subs: [
            { goalId: 32, position: 1, content: "React 프로젝트 만들기" },
            { goalId: 129, position: 2, content: "TypeScript 패턴 학습" },
          ],
        },
      ],
    },
  },
};

export default dummyData;
