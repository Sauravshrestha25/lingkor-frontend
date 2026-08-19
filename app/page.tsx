import Hero from "@/features/hero/components/Hero";
import Preloader from "@/features/preloader/components/Preloader";
import Footer from "@/features/navigation/components/Footer";
import KoraCircle from "@/features/kora/components/KoraCircle";
import { AboutSection } from "@/features/home/components/AboutSection";
import { StatementSection } from "@/features/home/components/StatementSection";
import { StorySection } from "@/features/home/components/StorySection";
import { SpacesSection } from "@/features/home/components/SpacesSection";
import { RoomsSection } from "@/features/home/components/RoomsSection";
import { VoicesSection } from "@/features/home/components/VoicesSection";
import { EnquireSection } from "@/features/home/components/EnquireSection";

export default function Page() {
  return (
    <main className="w-full">
      {/* <Preloader /> */}
      <Hero />
      <AboutSection />
      <StatementSection />
      <StorySection />
      <SpacesSection />
      <RoomsSection />
      <KoraCircle />
      <VoicesSection />
      <EnquireSection />
      <Footer />
    </main>
  );
}
