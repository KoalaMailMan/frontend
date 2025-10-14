import { useEffect, useState } from "react";
import OnboardingDesktop from "../OnboardingDesktop";
import OnboardingMobile from "../OnboardingMobile";

export default function OnboardingTutorial() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return isMobile ? <OnboardingMobile /> : <OnboardingDesktop />;
}
