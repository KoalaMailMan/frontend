export const getURLQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("access_token");

  return token;
};

export const APIWithRetry = async <T>(
  fn: () => Promise<T>,
  max: number = 3
) => {
  let retryCount = 0;

  while (retryCount < max) {
    const success = await fn();
    if (success) {
      retryCount = 0;
      return true;
    }

    retryCount++;
  }

  console.error(`모든 재시도를 시도했습니다.`);
  return false;
};
