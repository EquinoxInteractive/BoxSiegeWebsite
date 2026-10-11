import { Link } from "react-router-dom";
import { Download as DL } from "lucide-react";
import { CHARACTERS, GAME_STATUS, STATUS_INFO } from "@/data/game";
import { Reveal } from "./ui";
import { sfx } from "@/lib/audio";

/** Closing call-to-action band for the home page. */
export function DownloadCta() {
  return (
    <section className="relative overflow-hidden px-5 py-28">
      <div className="pointer-events-none absolute inset-0 flex items-end justify-around opacity-30" aria-hidden>
        {CHARACTERS.filter((_, i) => i % 3 === 0).map((c, i) => (
          <img key={c.id} src={c.img} alt="" className="px animate-bob-rot w-20 md:w-32" style={{ animationDelay: `${i * 0.35}s`, marginBottom: `${(i % 3) * 30}px` }} />
        ))}
      </div>
      <Reveal className="relative mx-auto max-w-4xl text-center">
        <h2 className="font-display text-5xl md:text-7xl">Ready to siege?</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{STATUS_INFO[GAME_STATUS].cta}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <Link to="/download" onMouseEnter={() => sfx("ui_hover", 0.15)} onClick={() => sfx("ui_confirm", 0.4)} className="skew-btn !px-12 !py-5 !text-lg">
            <span className="flex items-center gap-3"><DL className="h-6 w-6" /> Download for Windows</span>
          </Link>
          <Link to="/modes" onClick={() => sfx("ui_confirm", 0.35)} className="skew-btn ghost"><span>Explore game modes</span></Link>
        </div>
      </Reveal>
    </section>
  );
}