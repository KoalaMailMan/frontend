import { koalaGreenImage, koalaPurpleImage, koalaRedImage } from "../const/url";

export default function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="flying-koala">
        <img
          src={koalaRedImage}
          alt="날아가는 코알라"
          className="w-20 h-20 pixelated opacity-85 "
          loading="lazy"
          fetchPriority="low"
          width={75}
          height={75}
        />
      </div>
      <div className="flying-koala" style={{ animationDelay: "3s" }}>
        <img
          src={koalaGreenImage}
          alt="날아가는 코알라"
          className="w-18 h-18 pixelated opacity-80"
          loading="lazy"
          fetchPriority="low"
          width={67}
          height={67}
        />
      </div>
      <div className="flying-koala" style={{ animationDelay: "6s" }}>
        <img
          src={koalaPurpleImage}
          alt="날아가는 코알라"
          className="w-16 h-16 pixelated opacity-90"
          loading="lazy"
          fetchPriority="low"
          width={57}
          height={57}
        />
      </div>
    </div>
  );
}
