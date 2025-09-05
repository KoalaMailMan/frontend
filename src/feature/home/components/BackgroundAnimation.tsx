const koalaPixelImage = ""; // 이미지 asset 연동

export default function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="flying-koala">
        <img
          src={koalaPixelImage}
          alt="날아가는 코알라"
          className="w-12 h-12 pixelated opacity-60"
        />
      </div>
      <div className="flying-koala" style={{ animationDelay: "3s" }}>
        <img
          src={koalaPixelImage}
          alt="날아가는 코알라"
          className="w-8 h-8 pixelated opacity-40"
        />
      </div>
      <div className="flying-koala" style={{ animationDelay: "6s" }}>
        <img
          src={koalaPixelImage}
          alt="날아가는 코알라"
          className="w-10 h-10 pixelated opacity-50"
        />
      </div>
    </div>
  );
}
