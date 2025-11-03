import { useViewportStore } from "@/lib/stores/viewportStore";
import OnboardingDesktop from "../components/OnboardingDesktop";

export default function OnboardingTutorial() {
  const isMobile = useViewportStore((state) => state.isMobile);
  return <OnboardingDesktop isMobile={isMobile} />;
}
