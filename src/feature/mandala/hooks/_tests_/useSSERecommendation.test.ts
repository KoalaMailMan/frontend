import { renderHook, act } from "@testing-library/react";
import useSSERecommendation from "../useSSERecommendation";

// EventSource Mock
const mockEventSource = {
  close: vi.fn(),

  addEventListener: vi.fn(),
};

const MockEventSourcePolyfill = vi.fn(() => mockEventSource);

vi.mock("event-source-polyfill", () => ({
  EventSourcePolyfill: MockEventSourcePolyfill,
}));

describe("useSSERecommendation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("startStream 호출 시  EventSource를 생성한다", async () => {
    const getAccessToken = vi.fn().mockResolvedValue("mock-token");

    const { result } = renderHook(() =>
      useSSERecommendation({
        goal: "운동하기",
        subs: [{ goalId: "1", content: "", status: "UNDONE" }],
        getAccessToken,
      })
    );

    await act(async () => {
      await result.current.startStream(3);
    });

    expect(MockEventSourcePolyfill).toHaveBeenCalledTimes(1);

    expect(MockEventSourcePolyfill).toHaveBeenLastCalledWith(
      expect.stringContaining("/api/recommend/streaming"),
      expect.objectContaining({
        headers: {
          Authorization: "Bearer mock-token",
        },
      })
    );
  });
});
