export default function PixelAnimationComponent() {
  return (
    <div className="flex justify-center mt-6 gap-2">
      {/* 픽셀 하트 애니메이션 */}

      <div className="w-3 h-3 bg-red-400 rotate-45 animate-pulse"></div>
      <div
        className="w-2 h-2 bg-pink-400 rotate-45 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="w-3 h-3 bg-red-400 rotate-45 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>
  );
}
