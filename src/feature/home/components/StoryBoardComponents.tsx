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
