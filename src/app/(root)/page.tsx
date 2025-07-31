import { FeaturesSection } from "@/components/root/FeaturesSection";
import { FinalCTASection } from "@/components/root/FinalCTASection";
import { HeroSection } from "@/components/root/HeroSection";
import { HowItWorksSection } from "@/components/root/HowItWorksSection";
import { PlatformsSection } from "@/components/root/PlatformsSection";
import { PricingSection } from "@/components/root/PricingSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-16 py-8 items-center">
      <HeroSection />
      <PlatformsSection />
      <FeaturesSection />
      {/* <StatisticsSection /> */}
      {/* <TestimonialsSection /> */}
      <HowItWorksSection />
      <PricingSection />
      <FinalCTASection />
    </div>
  );
}
