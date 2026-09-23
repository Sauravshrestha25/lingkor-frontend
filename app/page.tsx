import Hero from "@/features/hero/components/Hero";
// import Footer from "@/features/navigation/components/Footer";
import { AboutSection } from "@/features/home/components/AboutSection";
// import { StatementSection } from "@/features/home/components/StatementSection";
// import { PlaceBand } from "@/features/home/components/PlaceBand";
// import { JourneyDivider } from "@/features/home/components/JourneyDivider";
// import { StorySection } from "@/features/home/components/StorySection";
// import { SpacesSection } from "@/features/home/components/SpacesSection";
// import { RoomsSection } from "@/features/home/components/RoomsSection";
// import { VoicesSection } from "@/features/home/components/VoicesSection";
// import { ContactTeaserSection } from "@/features/home/components/ContactTeaserSection";

export default function Page() {
  return (
    <main className="w-full">
      <Hero />
      {/* <JourneyDivider /> */}
      <AboutSection />
      {/* <SpacesSection /> */}
      {/* <StatementSection /> */}
      {/* <StorySection /> */}
      {/* <PlaceBand /> */}
      {/* <RoomsSection /> */}
      {/* <VoicesSection /> */}
      {/* <ContactTeaserSection /> */}
      {/* <Footer bordered background="surface" /> */}
    </main>
  );
}
