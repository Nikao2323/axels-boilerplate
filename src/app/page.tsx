import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { SectionHeader } from "@/components/section-header";
import { FeatureCarousel } from "@/components/feature-carousel";
import { Comparison } from "@/components/comparison";
import { ShowcaseSection } from "@/components/showcase-section";
import { Testimonials } from "@/components/testimonials";
import { CtaSection } from "@/components/cta-section";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Gradient background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, #818cf8 0%, #a5b4fc 30%, #c7d2fe 60%, #e0e7ff 100%)",
        }}
      />

      {/* Header */}
      <Header />

      {/* Dark section - Hero */}
      <div className="relative z-10">
        <main className="relative">
          <Hero />
          <SocialProof />
        </main>
      </div>

      {/* Light sections */}
      <div className="relative z-10">
        <div id="features" className="bg-white">
          <SectionHeader
            badge="Why people switch"
            heading={["You do less.", "It does the rest."]}
            description="Describe how your product eliminates painful steps that competitors make users do manually. Focus on the outcome, not the features."
          />
          <FeatureCarousel />
          <Comparison />
        </div>

        <ShowcaseSection />
        <Testimonials />
        <CtaSection />
      </div>
    </div>
  );
}
