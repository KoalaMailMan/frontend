import { SERVICE_GUIDE_STEPS } from "@/data/step_guide";
import { ImageWithFallback } from "@/feature/ui/ImageWithFallback";

export default function StoryBoardComponents() {
  return (
    <div className="space-y-12">
      {SERVICE_GUIDE_STEPS.map((item, index) => (
        <div key={index} className="flex items-center justify-center">
          <div className="mailbox-card overflow-hidden shadow-2xl bg-white/95 max-w-5xl w-full">
            <div
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              {/* 픽셀아트 스타일 이미지 섹션 */}
              <StepImageComponent
                step={item.step}
                emoji={item.emoji}
                title={item.title}
                img={item.koalaImage}
              />
              {/* 텍스트 섹션 */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative">
                {/* 픽셀 장식 */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary/20 rotate-45"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-yellow-300 rotate-12"></div>

                <h3
                  className="pixel-subtitle mb-4 text-primary"
                  style={{ fontSize: "14px" }}
                >
                  {item.title}
                </h3>
                <h4
                  className="mb-6 text-gray-800 font-semibold"
                  style={{ fontSize: "18px" }}
                >
                  {item.subtitle}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                {/* 픽셀 스타일 진행 바 */}
                <StepProgressBarComponents step={item.step} />
              </div>
            </div>

            {/* 픽셀 스타일 연결 화살표 */}
            {index < SERVICE_GUIDE_STEPS.length - 1 && <StepScrollArrow />}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepImageComponent({
  step,
  emoji,
  title,
  img,
}: {
  step: number;
  emoji: string;
  title: string;
  img: string;
}) {
  return (
    <div className="lg:w-1/2 relative">
      <div className="h-64 lg:h-80 relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        {/* 픽셀아트 격자 배경 */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 8px, var(--current-theme) 8px, var(--current-theme) 9px),
        repeating-linear-gradient(90deg, transparent, transparent 8px, var(--current-theme) 8px, var(--current-theme) 9px)
      `,
          }}
        ></div>

        <ImageWithFallback
          src={img}
          alt={title}
          className="w-full h-full object-cover opacity-80"
          style={{ imageRendering: "pixelated" }}
        />

        {/* 픽셀 스타일 스텝 번호 */}
        <StepNumberComponents step={step} />

        {/* 픽셀 스타일 이모지 */}
        <StepEmojiComponents emoji={emoji} />

        {/* 픽셀 스타일 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
      </div>
    </div>
  );
}

function StepNumberComponents({ step }: { step: number }) {
  return (
    <div
      className="absolute top-4 left-4 w-16 h-16 bg-primary shadow-lg flex items-center justify-center"
      style={{
        clipPath: "polygon(0 0, 100% 0, 85% 85%, 0 100%)",
        border: "3px solid white",
      }}
    >
      <span className="text-white pixel-subtitle" style={{ fontSize: "14px" }}>
        {step}
      </span>
    </div>
  );
}

function StepEmojiComponents({ emoji }: { emoji: string }) {
  return (
    <div
      className="absolute top-4 right-4 w-12 h-12 bg-white/90 flex items-center justify-center"
      style={{
        clipPath:
          "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)",
        border: "2px solid var(--current-theme)",
      }}
    >
      <span className="text-2xl">{emoji}</span>
    </div>
  );
}

function StepProgressBarComponents({ step }: { step: number }) {
  return (
    <div className="mt-6 flex items-center gap-1">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className={`w-4 h-2 ${i <= step - 1 ? "bg-primary" : "bg-gray-200"}`}
          style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 10% 100%)" }}
        ></div>
      ))}
      <span className="text-xs text-gray-500 ml-2 pixel-subtitle">
        {step}/6
      </span>
    </div>
  );
}

function StepScrollArrow() {
  return (
    <div className="flex justify-center py-8 relative">
      <div className="text-4xl text-primary animate-bounce">↓</div>
      {/* 픽셀 장식 점들 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col gap-2 mt-12">
        <div className="w-2 h-2 bg-primary/30 rounded-sm mx-auto animate-pulse"></div>
        <div
          className="w-2 h-2 bg-primary/20 rounded-sm mx-auto animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-primary/10 rounded-sm mx-auto animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
}
