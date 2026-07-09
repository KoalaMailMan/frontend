export const createServerMandalaFixture = () => ({
  data: {
    core: {
      goalId: 1,
      content: "자기계발",
      status: "UNDONE" as "DONE" | "UNDONE",
      mains: [
        {
          goalId: 2,
          position: 1,
          content: "독서",
          status: "UNDONE" as "DONE" | "UNDONE",
          subs: [
            {
              goalId: 3,
              position: 1,
              content: "30분 읽기",
              status: "UNDONE" as "DONE" | "UNDONE",
            },
          ],
        },
      ],
    },
  },
});
