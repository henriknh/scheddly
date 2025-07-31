import { HeroSection } from "@/components/root/HeroSection";
import { PlatformsSection } from "@/components/root/PlatformsSection";
import { FeaturesSection } from "@/components/root/FeaturesSection";
import { HowItWorksSection } from "@/components/root/HowItWorksSection";
import { PricingSection } from "@/components/root/PricingSection";
import { FinalCTASection } from "@/components/root/FinalCTASection";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-16 py-8 items-center">
      <HeroSection />
      <PlatformsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FinalCTASection />
    </div>
  );
}
