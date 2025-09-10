const requiredEnvVars = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
} as const;

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`환경 변수 값이 없습니다. [key: ${key}]`);
  }
});

export const ENV = requiredEnvVars;
