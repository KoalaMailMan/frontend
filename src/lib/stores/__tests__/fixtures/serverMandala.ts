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
        {
          goalId: 4,
          position: 3,
          content: "운동",
          status: "UNDONE" as "DONE" | "UNDONE",
          subs: [
            {
              goalId: 5,
              position: 1,
              content: "30분 근력운동",
              status: "UNDONE" as "DONE" | "UNDONE",
            },
            {
              goalId: 6,
              position: 3,
              content: "30분 유산소",
              status: "UNDONE" as "DONE" | "UNDONE",
            },
          ],
        },
        {
          goalId: 0,
          position: 2,
          content: "영화",
          status: "UNDONE" as "DONE" | "UNDONE",
          subs: [],
        },
      ],
    },
  },
});
