import { SERVICE_GUIDE_STEPS } from "@/data/step_guide";
import { ImageWithFallback } from "@/feature/ui/ImageWithFallback";

export default function StoryBoardComponents() {
  return (
    <div className="space-y-8">
      {SERVICE_GUIDE_STEPS.map((step, index) => (
        <div
          key={index}
          className="bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20"
        >
          <div
            className={`flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* 이미지 섹션 */}
            <div className="md:w-2/5">
              <div className="h-48 md:h-full relative">
                <ImageWithFallback
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
                {/* 이모지 오버레이 */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-xl">{step.emoji}</span>
                </div>
              </div>
            </div>

            {/* 텍스트 섹션 */}
            <div className="md:w-3/5 p-6 flex flex-col justify-center">
              <h3
                className="pixel-subtitle text-primary mb-2"
                style={{ fontSize: "14px" }}
              >
                {step.title}
              </h3>
              <h4 className="mb-3 text-gray-800 font-semibold">
                {step.subtitle}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 레거시 디자인
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
