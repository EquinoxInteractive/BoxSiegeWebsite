import { Hero } from "@/components/Hero";
import { Trailer } from "@/components/Trailer";
import { Marquee } from "@/components/Marquee";
import { ModesStrip } from "@/components/ModesStrip";
import { ExploreGrid } from "@/components/ExploreGrid";
import { DownloadCta } from "@/components/DownloadCta";
import { useDocumentMeta } from "@/components/Page";
import { HOME } from "@/data/pages";

export default function Home() {
  useDocumentMeta("BOX SIEGE - Local Multiplayer Box", HOME.desc);
  return (
    <>
      <Hero />
      <Trailer />
      <Marquee />
      <ModesStrip />
      <ExploreGrid />
      <DownloadCta />
    </>
  );
}