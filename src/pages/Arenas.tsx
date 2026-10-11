import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ARENAS, DENSITIES, MAP_FACTS } from "@/data/game";
import { Page } from "@/components/Page";
import { Reveal } from "@/components/ui";
import { sfx } from "@/lib/audio";

export function Arenas() {
  const [i, setI] = useState(0);
  const [dens, setDens] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-35% 0px -35% 0px" });
  const a = ARENAS[i];

  useEffect(() => {
    const r = document.documentElement.style;
    if (inView) {
      r.setProperty("--accent", a.palette[2]);
      r.setProperty("--bg-top", a.palette[0]);
      r.setProperty("--bg-bottom", a.palette[1]);
    } else {
      r.removeProperty("--accent"); r.removeProperty("--bg-top"); r.removeProperty("--bg-bottom");
    }
    return () => { r.removeProperty("--accent"); r.removeProperty("--bg-top"); r.removeProperty("--bg-bottom"); };
  }, [inView, a]);

  return (
    <Page id="arenas" title="10 arenas" wide
      intro="Each arena is hand-built, perfectly mirrored, and has its own hazards. Pick one - or let the dice decide.">
      <div ref={ref} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="panel relative overflow-hidden">
          <div className="relative aspect-[16/9] overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div key={a.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                style={{ background: `url(${a.bg}) center/cover`, imageRendering: "pixelated" }} />
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 h-[16%]" style={{ background: `url(${a.floor}) repeat-x center/auto 100%`, imageRendering: "pixelated" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 sm:left-5 sm:top-4 sm:gap-2">
              {a.isNew && <span className="chip bg-mint text-ink border-0">New arena</span>}
              <span className="chip bg-black/60">Fall zone: {a.fallZone}</span>
            </div>
            <div className="absolute bottom-[19%] left-4 right-3 sm:left-6">
              <AnimatePresence mode="wait">
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h3 className="font-display text-[2.4rem] leading-none text-white min-[420px]:text-5xl sm:text-6xl md:text-8xl" style={{ textShadow: "0 5px 0 #000" }}>{a.name}</h3>
                  <p className="font-ui uppercase tracking-widest" style={{ color: a.palette[2] }}>{a.world}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="p-4 sm:p-5 md:p-7">
            <p className="text-base text-white/80 sm:text-lg">{a.tagline}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {a.hazards.length === 0 && <p className="rounded-xl bg-black/30 p-4 text-sm text-white/65 sm:col-span-2">No special objects - just platforms, pickups and the fall zone. {a.id === "hell" ? "The lava below is deadly." : "A pure skill arena."}</p>}
              {a.hazards.map((h) => (
                <motion.div key={a.id + h.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 rounded-xl bg-black/30 p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg font-ui text-xl" style={{ background: `${a.palette[2]}33`, color: a.palette[2] }}>{h.icon}</span>
                  <div><p className="font-ui text-sm uppercase tracking-wider">{h.name}</p><p className="text-xs text-white/60 leading-relaxed">{h.text}</p></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2.5">
            {ARENAS.map((x, k) => (
              <button key={x.id} onClick={() => { setI(k); sfx("ui_move", 0.3); }} onMouseEnter={() => sfx("ui_hover", 0.08)}
                className="group relative h-16 cursor-pointer overflow-hidden rounded-xl border-2 transition-all active:scale-95 sm:h-20 sm:hover:-translate-y-1"
                style={{ borderColor: k === i ? x.palette[2] : "rgba(255,255,255,0.1)", boxShadow: k === i ? `0 0 24px ${x.palette[2]}66` : undefined }}>
                <span className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{ background: `url(${x.bg}) center/cover`, imageRendering: "pixelated" }} />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
                <span className="absolute bottom-1.5 left-2.5 font-ui text-sm uppercase tracking-wider">{x.name}</span>
                {x.isNew && <span className="absolute right-1.5 top-1.5 rounded bg-mint px-1 font-ui text-[9px] uppercase text-ink">New</span>}
              </button>
            ))}
          </div>
          <div className="panel p-5">
            <p className="font-ui text-xs uppercase tracking-widest text-white/55">Objects density</p>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {DENSITIES.map((d, k) => (
                <button key={d.name} onClick={() => { setDens(k); sfx("ui_move", 0.25); }} className="cursor-pointer rounded-lg py-2.5 font-ui text-xs uppercase transition-colors active:scale-95" style={{ background: dens === k ? a.palette[2] : "rgba(255,255,255,0.07)", color: dens === k ? "#0b0b1c" : "#fff" }}>{d.name}</button>
              ))}
            </div>
            <p className="mt-3 text-sm text-white/65">{DENSITIES[dens].text}</p>
          </div>
          <Reveal className="panel p-5 text-sm text-white/70 leading-relaxed">
            <p><b className="font-ui text-white">Mirrored design.</b> {MAP_FACTS.mirrored}</p>
            <p className="mt-2"><b className="font-ui text-white">Falling.</b> {MAP_FACTS.hit}</p>
            <p className="mt-2"><b className="font-ui text-white">Random.</b> Choose RANDOM in Battle Settings and the game picks a different arena for each match.</p>
          </Reveal>
        </div>
      </div>
    </Page>
  );
}