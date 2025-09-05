export default function ScrollAnimation() {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center animate-bounce z-30">
      <div
        className="pixel-subtitle text-white/80 mb-2"
        style={{ fontSize: "10px", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
      >
        아래로 스크롤해서 서비스 소개 보기
      </div>
      <div
        className="text-3xl text-white"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
      >
        ↓
      </div>
    </div>
  );
}
