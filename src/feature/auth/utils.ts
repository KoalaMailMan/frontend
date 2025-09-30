export const getURLQuery = (query: string) => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get(query);

  return token;
};

export const APIWithRetry = async <T>(
  fn: () => Promise<T>,
  max: number = 2
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
