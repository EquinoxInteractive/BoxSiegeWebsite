import { Link } from "react-router-dom";
import { Download as DL } from "lucide-react";
import { CHARACTERS, GAME_STATUS, STATUS_INFO } from "@/data/game";
import { Reveal } from "./ui";
import { sfx } from "@/lib/audio";

/** Closing call-to-action band for the home page. */
export function DownloadCta() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-5 md:py-28">
      <div className="pointer-events-none absolute inset-0 flex items-end justify-around opacity-30" aria-hidden>
        {CHARACTERS.filter((_, i) => i % 3 === 0).map((c, i) => (
          <img key={c.id} src={c.img} alt="" className="px animate-bob-rot w-14 sm:w-20 md:w-32" style={{ animationDelay: `${i * 0.35}s`, marginBottom: `${(i % 3) * 30}px` }} />
        ))}
      </div>
      <Reveal className="relative mx-auto max-w-4xl text-center">
        <h2 className="font-display text-[2.7rem] leading-none sm:text-5xl md:text-7xl">Ready to siege?</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{STATUS_INFO[GAME_STATUS].cta}</p>
        <div className="mx-auto mt-8 flex max-w-sm flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-5 md:mt-9">
          <Link to="/download" onMouseEnter={() => sfx("ui_hover", 0.15)} onClick={() => sfx("ui_confirm", 0.4)} className="skew-btn !px-6 !py-4 !text-base sm:!px-12 sm:!py-5 sm:!text-lg">
            <span className="flex items-center gap-2.5 sm:gap-3"><DL className="h-5 w-5 sm:h-6 sm:w-6" /> Download for Windows</span>
          </Link>
          <Link to="/modes" onClick={() => sfx("ui_confirm", 0.35)} className="skew-btn ghost"><span>Explore game modes</span></Link>
        </div>
      </Reveal>
    </section>
  );
}