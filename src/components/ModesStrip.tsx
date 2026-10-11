import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ARENAS, weaponImg, type WeaponId } from "@/data/game";
import { MODES } from "@/data/modes";
import { Reveal, popIn, stagger } from "./ui";
import { sfx } from "@/lib/audio";

/** Short pitch per mode for the home page; the full text lives on /modes. */
const PITCH: Record<string, { text: string; stage: number }> = {
  versus: { text: "One screen, one keyboard or a pile of controllers. First to win enough rounds takes the match.", stage: 3 },
  teams: { text: "Slide into team lanes: 2v2, 3v1 and more. Bullets never hurt teammates.", stage: 6 },
  campaign: { text: "250 levels, a boss at the end of every world and a perk after each win.", stage: 1 },
};
const ORDER = ["versus", "teams", "campaign"];
const GUNS: WeaponId[] = ["smith", "kurval", "flamer", "scream"];

export function ModesStrip() {
  const modes = ORDER.map((id) => MODES.find((m) => m.id === id)!);
  return (
    <section className="relative px-5 pb-8 pt-16 md:pt-24">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14">
          <div>
            <h2 className="font-display text-5xl md:text-7xl" style={{ textShadow: "0 4px 0 #000" }}>Pick how you play</h2>
            <p className="mt-3 max-w-xl text-lg text-white/65">Brawl with friends on the couch, or take on the Campaign alone.</p>
          </div>
          <Link to="/modes" onClick={() => sfx("ui_confirm", 0.35)} className="group inline-flex items-center gap-2 font-ui text-lg text-gold">
            All modes and match flow <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </Reveal>

        <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-5 md:grid-cols-3">
          {modes.map((m) => {
            const Icon = m.icon;
            const pitch = PITCH[m.id];
            return (
              <motion.li key={m.id} variants={popIn} className="panel group flex flex-col overflow-hidden" style={{ ["--accent" as string]: m.color }}>
                <div className="relative flex h-44 items-end justify-center gap-2 overflow-hidden px-4" style={{ background: `url(${ARENAS[pitch.stage].bg}) center/cover`, imageRendering: "pixelated" }}>
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${m.color}22, rgba(11,11,28,0.8))` }} />
                  {m.art.slice(0, 3).map((c, i) => (
                    <div key={c.id} className="animate-bob relative" style={{ animationDelay: `${i * 0.4}s` }}>
                      <img src={c.img} alt="" className="px w-20 drop-shadow-[0_8px_0_rgba(0,0,0,0.5)] md:w-24" />
                      <img src={weaponImg(GUNS[i % 4], i % 4)} alt="" className="px absolute left-[60%] top-[45%] w-[85%] max-w-none" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-2.5 font-display text-4xl leading-none"><Icon className="h-6 w-6" style={{ color: m.color }} />{m.title}</p>
                  <p className="mt-1.5 font-ui text-sm text-white/55">{m.tag}</p>
                  <p className="mt-3 leading-relaxed text-white/75">{pitch.text}</p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
