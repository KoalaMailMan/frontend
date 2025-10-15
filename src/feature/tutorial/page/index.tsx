import { useViewportStore } from "@/lib/stores/viewportStore";
import OnboardingDesktop from "../components/OnboardingDesktop";
import OnboardingMobile from "../components/OnboardingMobile";

export default function OnboardingTutorial() {
  const isMobile = useViewportStore((state) => state.isMobile);
  return isMobile ? <OnboardingMobile /> : <OnboardingDesktop />;
}
