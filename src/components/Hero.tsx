import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Download, Swords } from "lucide-react";
import { ARENAS, BETA_WORD, CHARACTERS, POWERUPS, weaponImg, MUZZLE } from "@/data/game";
import { Counter, EASE } from "./ui";
import { sfx } from "@/lib/audio";
import { StatusBadge } from "./StatusBadge";

const STATS = [
  { n: 24, label: "Fighters", to: "/fighters" },
  { n: 10, label: "Arenas", to: "/arenas" },
  { n: 6, label: "Weapons", to: "/arsenal" },
  { n: 9, label: "Power-Ups", to: "/power-ups" },
  { n: 250, label: "Campaign Levels", to: "/campaign" },
  { n: 50, label: "Bosses", to: "/campaign" },
  { n: 301, label: "Shop Items", to: "/shop" },
];

/** Two fighters trading shots on a floor - purely CSS-driven, loops forever. */
function BattleScene({ floor }: { floor: string }) {
  const duelists = [
    { c: CHARACTERS[0], w: "smith" as const, p: 0, side: "left" as const },
    { c: CHARACTERS[22], w: "kurval" as const, p: 3, side: "right" as const },
  ];
  return (
    <div className="relative mx-auto mt-10 h-[190px] w-full max-w-5xl select-none md:mt-14 md:h-[210px]" aria-hidden>
      {duelists.map(({ c, w, p, side }, i) => {
        const left = side === "left";
        return (
          <div key={c.id} className="absolute bottom-[34px] z-[3]" style={{ [side]: "5%" }}>
            <div className="animate-bob" style={{ animationDelay: `${i * 0.7}s` }}>
              <div className="relative">
                <img src={c.img} alt="" className="px w-[70px] min-[420px]:w-[92px] md:w-[130px] drop-shadow-[0_10px_0_rgba(0,0,0,0.45)]" />
                <div className="absolute top-[45%] w-[60px] min-[420px]:w-[78px] md:w-[110px]" style={left ? { left: "58%" } : { right: "58%", transform: "scaleX(-1)" }}>
                  <img src={weaponImg(w, p)} alt="" className="px block w-full max-w-none" />
                  {/* bullets are children of the gun so they start exactly at the muzzle (and mirror with it) */}
                  <span className="absolute" style={{ left: "100%", top: `${MUZZLE[w] * 100}%` }}>
                    {[0, 1, 2].map((k) => (
                      <span key={k} className="absolute left-0 top-0 block -translate-y-1/2">
                        <img src="/assets/guns/bullet.webp" alt="" className="px block w-5 min-[420px]:w-6 md:w-8 max-w-none"
                          style={{ ["--dist" as string]: "clamp(120px, 36vw, 460px)", animation: `bullet-fly 2.3s linear ${k * 0.78 + i * 0.4}s infinite` }} />
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="absolute bottom-0 inset-x-[-4%] h-[48px] overflow-hidden rounded-xl border-t-4 border-black/60" style={{ background: `url(${floor}) repeat-x center/auto 100%`, imageRendering: "pixelated" }} />
    </div>
  );
}

export function Hero() {
  const [i, setI] = useState(0);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 160]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ARENAS.length), 5200);
    return () => clearInterval(t);
  }, []);
  const arena = ARENAS[i];

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pb-14 pt-24 sm:px-5 md:pb-16 md:pt-28">
      {/* rotating arena backdrop */}
      <motion.div className="absolute inset-0 -z-10" style={{ y: bgY }}>
        <AnimatePresence mode="sync">
          <motion.div
            key={arena.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            style={{ background: `url(${arena.bg}) center/cover`, imageRendering: "pixelated" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b1c]/80 via-[#0b0b1c]/55 to-[#0b0b1c]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0b0b1c_100%)]" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="mx-auto w-full max-w-6xl text-center">
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          <StatusBadge />
          <span className="chip text-gold border-gold/40">Local multiplayer · 2–4 players</span>
          <span className="chip text-cyan border-cyan/40">Solo campaign · 250 levels</span>
          <span className="chip text-mint border-mint/40">Free · Windows, macOS, Linux</span>
        </motion.div>

        <motion.img
          src="/assets/ui/title.webp"
          alt="BOX SIEGE"
          initial={{ opacity: 0, scale: 0.7, y: 30, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          className="px mx-auto mt-5 w-[min(88vw,820px)] drop-shadow-[0_12px_0_rgba(0,0,0,0.5)] md:mt-7 md:drop-shadow-[0_18px_0_rgba(0,0,0,0.5)]"
        />

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7, ease: EASE }} className="mx-auto mt-5 max-w-2xl text-base leading-snug text-white/85 sm:text-lg md:mt-7 md:text-2xl">
          Grab your friends, pick a box, and <span className="text-gold font-semibold">fight for the arena</span>. Brawl on one screen, or take on 250 solo levels and 50 bosses.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7, ease: EASE }} className="mx-auto mt-7 flex max-w-sm flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5 md:mt-9">
          <Link to="/download" className="skew-btn" onMouseEnter={() => sfx("ui_hover", 0.15)} onClick={() => sfx("ui_confirm", 0.4)}>
            <span className="flex items-center gap-2.5"><Download className="w-5 h-5" /> Download{BETA_WORD} free</span>
          </Link>
          <button
            onClick={() => { sfx("ui_confirm", 0.4); document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" }); }}
            onMouseEnter={() => sfx("ui_hover", 0.15)}
            className="skew-btn ghost"
          >
            <span className="flex items-center gap-2.5"><Swords className="w-5 h-5" /> Explore the game</span>
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
          <BattleScene floor={arena.floor} />
        </motion.div>

        <motion.ul
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 1.6 } } }}
          className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7"
        >
          {STATS.map((s) => (
            <motion.li key={s.label} className="last:col-span-2 sm:last:col-span-1" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <Link to={s.to} onClick={() => sfx("ui_confirm", 0.3)} onMouseEnter={() => sfx("ui_hover", 0.1)} className="panel block px-2 py-3.5 transition-all active:scale-[0.97] active:border-gold sm:py-4 sm:hover:-translate-y-1 sm:hover:border-gold">
                <Counter to={s.n} className="font-digital text-[2.1rem] text-gold sm:text-4xl md:text-5xl" />
                <p className="font-ui text-[10px] md:text-[11px] uppercase tracking-widest text-white/60 mt-1">{s.label}</p>
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/50">
          <span className="font-ui uppercase tracking-widest">Now showing:</span>
          <span className="font-ui text-white/80 uppercase tracking-widest">{arena.name} · {arena.world}</span>
        </p>
      </motion.div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/50 md:block" aria-hidden>
        <ChevronDown className="w-8 h-8" />
      </motion.div>

      {/* decorative power-up ring */}
      <div className="pointer-events-none absolute inset-0 -z-[5]" aria-hidden>
        {POWERUPS.slice(0, 7).map((p, k) => (
          <img key={p.id} src={p.icon} alt="" className="px absolute w-8 animate-bob-rot opacity-35 sm:w-10 sm:opacity-60 md:w-14 md:opacity-70" style={{ left: k % 2 ? `${86 + (k % 3) * 3}%` : `${3 + (k % 3) * 3}%`, top: `${14 + ((k * 23) % 60)}%`, animationDelay: `${k * 0.45}s`, filter: `drop-shadow(0 0 14px ${p.color}aa)` }} />
        ))}
      </div>
    </section>
  );
}