export type UserType = {
  code: number;
  message: string;
  data: {
    nickname: string;
    email: string;
  };
};

export type RefreshType = {
  code: number;
  message: string;
  data: {
    accessToken: string;
  };
};
