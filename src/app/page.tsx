import { Providers } from "@/components/providers";
import Cursor from "@/components/Cursor";
import WorldAtmosphere from "@/components/WorldAtmosphere";
import ElevationMeter from "@/components/ElevationMeter";
import BlueprintMode from "@/components/BlueprintMode";
import HeroSwitchboard from "@/components/HeroSwitchboard";
import TechPipeline from "@/components/TechPipeline";
import HomeAutomationRig from "@/components/HomeAutomationRig";
import AdventureHorizontal from "@/components/AdventureHorizontal";
import ChaosBento from "@/components/ChaosBento";
import TerminalFooter from "@/components/TerminalFooter";
import ScrollTrail from "@/components/ScrollTrail";

export default function Page() {
  return (
    <Providers>
      <Cursor />
      <WorldAtmosphere />
      <ElevationMeter />
      <BlueprintMode />

      <main id="top" className="relative">
        <ScrollTrail />
        <HeroSwitchboard />
        <TechPipeline />
        <HomeAutomationRig />
        <AdventureHorizontal />
        <ChaosBento />
        <TerminalFooter />
      </main>
    </Providers>
  );
}
