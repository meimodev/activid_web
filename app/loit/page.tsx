import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Problem } from "./components/Problem";
import { Pillars } from "./components/Pillars";
import { HowItWorks } from "./components/HowItWorks";
import { BuiltFor } from "./components/BuiltFor";
import { Transparency } from "./components/Transparency";
import { Pricing } from "./components/Pricing";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";

export default function LoitPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Pillars />
        <HowItWorks />
        <BuiltFor />
        <Transparency />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
