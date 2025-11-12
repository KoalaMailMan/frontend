// @ts-expect-error -- vite-imagetools query import
import koalaRedImage from "@/assets/home/mini_red_koala.png?width=75;150;225;&as=srcset&format=webp";
// @ts-expect-error -- vite-imagetools query import
import koalaGreenImage from "@/assets/home/mini_green_koala.png?width=75;150;225;&as=srcset&format=webp";
// @ts-expect-error -- vite-imagetools query import
import koalaPurpleImage from "@/assets/home/mini_purple_koala.png?width=75;150;225;&as=srcset&format=webp";

export default function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="flying-koala">
        <img
          src={koalaRedImage}
          alt="날아가는 코알라"
          className="w-20 h-20 pixelated opacity-85 "
          loading="lazy"
          decoding="async"
          srcSet={koalaRedImage}
          sizes="(max-width: 768px) 90vw, 75px"
          width={75}
          height={75}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
      <div className="flying-koala" style={{ animationDelay: "3s" }}>
        <img
          src={koalaGreenImage}
          alt="날아가는 코알라"
          className="w-18 h-18 pixelated opacity-80"
          loading="lazy"
          decoding="async"
          srcSet={koalaGreenImage}
          sizes="(max-width: 768px) 90vw, 67px"
          width={67}
          height={67}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
      <div className="flying-koala" style={{ animationDelay: "6s" }}>
        <img
          src={koalaPurpleImage}
          alt="날아가는 코알라"
          className="w-16 h-16 pixelated opacity-90"
          loading="lazy"
          decoding="async"
          srcSet={koalaPurpleImage}
          sizes="(max-width: 768px) 90vw, 57px"
          width={57}
          height={57}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
