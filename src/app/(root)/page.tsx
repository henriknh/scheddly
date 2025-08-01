import { FeaturesSection } from "@/components/root/FeaturesSection";
import { FinalCTASection } from "@/components/root/FinalCTASection";
import { FAQSection } from "@/components/root/FAQSection";
import { HeroSection } from "@/components/root/HeroSection";
import { HowItWorksSection } from "@/components/root/HowItWorksSection";
import { PlatformsSection } from "@/components/root/PlatformsSection";
import { PricingSection } from "@/components/root/PricingSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <PlatformsSection />
      <FeaturesSection />
      {/* <StatisticsSection /> */}
      {/* <TestimonialsSection /> */}
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
