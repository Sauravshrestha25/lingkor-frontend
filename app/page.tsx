import Hero from "@/features/hero/components/Hero";
import Footer from "@/features/navigation/components/Footer";
import KoraCircle from "@/features/kora/components/KoraCircle";
import { AboutSection } from "@/features/home/components/AboutSection";
// import { StatementSection } from "@/features/home/components/StatementSection";
// import { PlaceBand } from "@/features/home/components/PlaceBand";
import { JourneyDivider } from "@/features/home/components/JourneyDivider";
// import { StorySection } from "@/features/home/components/StorySection";
import { SpacesSection } from "@/features/home/components/SpacesSection";
import { RoomsSection } from "@/features/home/components/RoomsSection";
// import { VoicesSection } from "@/features/home/components/VoicesSection";
import { EnquireSection } from "@/features/home/components/EnquireSection";

export default function Page() {
  return (
    <main className="w-full">
      <Hero />
      <JourneyDivider />
      <AboutSection />
      <SpacesSection />
      {/* <StatementSection /> */}
      {/* <StorySection /> */}
      {/* <PlaceBand /> */}
      <RoomsSection />
      <KoraCircle />
      {/* <VoicesSection /> */}
      <EnquireSection />
      <Footer />
    </main>
  );
}
