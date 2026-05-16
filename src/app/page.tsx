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
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, #d4d4d4 0%, #e5e5e5 30%, #f0f0f0 60%, #fafafa 100%)",
        }}
      />

      <Header />

      <div className="relative z-10">
        <main className="relative">
          <Hero />
          <SocialProof />
        </main>
      </div>

      <div className="relative z-10">
        <div id="features" className="bg-white">
          <SectionHeader
            badge="რატომ არსი"
            heading={["ხარისხი.", "საიმედოობა."]}
            description="ათეულობით წლის გამოცდილებით ვაშენებთ პროექტებს, რომლებიც დროს უძლებს."
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
