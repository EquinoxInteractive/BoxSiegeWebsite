import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { A, ACCESSORIES, ARENAS, CHARACTERS, POWERUPS, weaponImg } from "@/data/game";
import { pageById } from "@/data/pages";
import { FighterFace, Reveal, stagger, popIn } from "./ui";
import { sfx } from "@/lib/audio";

function Tile({ id, className, children, tall = false, blurbW = "24ch" }: { id: string; className: string; children: ReactNode; tall?: boolean; blurbW?: string }) {
  const page = pageById(id);
  const arena = ARENAS.find((a) => a.id === page.stage)!;
  return (
    <motion.li variants={popIn} className={className}>
      <Link
        to={page.path}
        onClick={() => sfx("ui_confirm", 0.35)}
        onMouseEnter={() => sfx("ui_hover", 0.1)}
        className={`group relative isolate flex h-full ${tall ? "min-h-[360px] sm:min-h-[400px]" : "min-h-[210px] sm:min-h-[240px]"} flex-col overflow-hidden rounded-3xl border border-white/10 p-5 transition-all duration-300 active:scale-[0.985] active:border-[var(--accent)] sm:p-6 sm:hover:-translate-y-1.5 hover:border-[var(--accent)] hover:shadow-[0_24px_60px_-24px_var(--accent)] ${tall ? "justify-start" : "justify-between"}`}
        style={{ ["--accent" as string]: page.accent }}
        aria-label={`${page.label}: ${page.blurb}`}
      >
        <span className="absolute inset-0 -z-20 opacity-45 transition-all duration-700 group-hover:scale-110 group-hover:opacity-65" style={{ background: `url(${arena.bg}) center/cover`, imageRendering: "pixelated" }} />
        <span className="absolute inset-0 -z-10" style={{ background: `linear-gradient(160deg, rgba(11,11,28,0.92) 8%, rgba(11,11,28,0.5) 60%, ${page.accent}40 130%)` }} />

        <span className="pointer-events-none absolute inset-0 -z-[5]" aria-hidden>{children}</span>

        <span className="relative">
          <span className="flex items-baseline gap-2.5">
            <span className="font-digital text-4xl leading-none sm:text-5xl" style={{ color: page.accent }}>{page.count}</span>
            <span className="font-ui text-sm text-white/65">{page.countLabel}</span>
          </span>
          <span className="mt-2 block font-display text-[2.1rem] leading-none md:text-5xl" style={{ textShadow: "0 3px 0 #000" }}>{page.label}</span>
        </span>

        <span className={`relative block text-sm leading-snug text-white/75 ${tall ? "mt-3" : "mt-6"}`} style={{ maxWidth: blurbW }}>{page.blurb}</span>

        <span className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center sm:right-4 sm:top-4 sm:h-10 sm:w-10 rounded-full border border-white/20 bg-black/40 transition-all duration-300 group-hover:rotate-45 group-hover:border-transparent group-hover:text-ink group-hover:[background:var(--accent)]">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </Link>
    </motion.li>
  );
}

const sprite = "px absolute max-w-none drop-shadow-[0_8px_0_rgba(0,0,0,0.45)] transition-transform duration-500";

export function ExploreGrid() {
  const acc = (id: string) => ACCESSORIES.filter((a) => a.id === id);
  return (
    <section id="explore" className="relative px-4 py-16 sm:px-5 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="font-display text-[2.7rem] leading-none sm:text-5xl md:text-7xl" style={{ textShadow: "0 4px 0 #000" }}>See what's in the box</h2>
          <p className="mt-3 max-w-xl text-base text-white/65 sm:text-lg">Every part of the game has its own page. Pick one to try it out.</p>
        </Reveal>

        <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[230px] lg:grid-cols-12">
          {/* Fighters: a crowd of boxes */}
          <Tile id="fighters" className="sm:col-span-2 lg:col-span-5 lg:row-span-2" tall blurbW="30ch">
            {[0, 5, 8, 11, 16, 19, 21, 23].map((c, i) => (
              <img key={c} src={CHARACTERS[c].img} alt="" className={`${sprite} animate-bob w-[21%] group-hover:-translate-y-2`}
                style={{ left: `${(i % 4) * 22 + (i > 3 ? 9 : 3)}%`, bottom: i > 3 ? "3%" : "21%", animationDelay: `${i * 0.35}s`, zIndex: i > 3 ? 2 : 1 }} />
            ))}
          </Tile>

          {/* Arsenal */}
          <Tile id="arsenal" className="lg:col-span-4" blurbW="19ch">
            {(["smith", "kurval", "flamer"] as const).map((w, i) => (
              <img key={w} src={weaponImg(w, i)} alt="" className={`${sprite} w-[42%] group-hover:translate-x-1`}
                style={{ right: `${3 + i * 3}%`, bottom: `${3 + i * 17}%`, transform: `rotate(${[-8, 3, -3][i]}deg)` }} />
            ))}
          </Tile>

          {/* Power-ups */}
          <Tile id="powerups" className="lg:col-span-3" blurbW="15ch">
            {["shield", "heal"].map((id, i) => {
              const p = POWERUPS.find((x) => x.id === id)!;
              return <img key={id} src={p.icon} alt="" className="px animate-bob-rot absolute w-[19%] max-w-none" style={{ right: `${4 + i * 21}%`, bottom: `${6 + i * 10}%`, animationDelay: `${i * 0.5}s`, filter: `drop-shadow(0 0 14px ${p.color})` }} />;
            })}
          </Tile>

          {/* Arenas */}
          <Tile id="arenas" className="sm:col-span-2 lg:col-span-7">
            {(["ocean", "space", "factory"] as const).map((id, i) => (
              <img key={id} src={ARENAS.find((a) => a.id === id)!.bg} alt="" className="px absolute aspect-video w-[24%] rounded-lg border-[3px] border-black/70 object-cover shadow-[0_10px_0_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:-translate-y-2"
                style={{ right: `${6 + i * 20}%`, bottom: `${14 + (i % 2) * 24}%`, transform: `rotate(${[-4, 3, -2][i]}deg)`, zIndex: i }} />
            ))}
          </Tile>

          {/* Campaign */}
          <Tile id="campaign" className="sm:col-span-2 lg:col-span-7">
            <img src={CHARACTERS[21].img} alt="" className={`${sprite} animate-bob w-[22%]`} style={{ right: "6%", bottom: "6%" }} />
            <img src={weaponImg("kurval", 1)} alt="" className="px absolute w-[19%] max-w-none" style={{ right: "22%", bottom: "20%", transform: "scaleX(-1)" }} />
            <img src={CHARACTERS[22].img} alt="" className={`${sprite} animate-bob w-[10%]`} style={{ right: "34%", bottom: "6%", animationDelay: "0.6s" }} />
            {[0, 1, 2].map((i) => <img key={i} src={`${A}/camp/star.webp`} alt="" className="px animate-bob-rot absolute w-[5%] max-w-none" style={{ right: `${12 + i * 7}%`, top: `${14 + (i % 2) * 8}%`, animationDelay: `${i * 0.4}s` }} />)}
          </Tile>

          {/* Shop: a fighter trying things on */}
          <Tile id="shop" className="sm:col-span-2 lg:col-span-5 lg:row-span-2">
            <span className="absolute bottom-[10%] right-[8%] w-[46%]">
              <span className="block animate-bob">
                <FighterFace src={CHARACTERS[16].img} size={200} eyeY={CHARACTERS[16].eyeY} accessories={[...acc("crown"), ...acc("sunglasses")]} className="!h-auto !w-full [&>img]:!h-auto" />
              </span>
            </span>
            {["halo", "cowboy_hat", "bat_wings"].map((id, i) => (
              <img key={id} src={ACCESSORIES.find((a) => a.id === id)!.img} alt="" className="px animate-bob-rot absolute w-[16%] max-w-none" style={{ right: `${58 + (i % 2) * 14}%`, top: `${30 + i * 18}%`, animationDelay: `${i * 0.45}s` }} />
            ))}
          </Tile>

          {/* Match rules */}
          <Tile id="rules" className="lg:col-span-4" blurbW="21ch">
            {[0, 1, 2].map((i) => <img key={i} src={`${A}/ui/heart.webp`} alt="" className="px animate-bob absolute w-[11%] max-w-none" style={{ right: `${6 + i * 13}%`, bottom: `${12 + (i % 2) * 12}%`, animationDelay: `${i * 0.4}s` }} />)}
          </Tile>

          {/* Controls */}
          <Tile id="controls" className="lg:col-span-3" blurbW="14ch">
            <span className="absolute bottom-[8%] right-[6%] grid grid-cols-3 gap-1">
              {[["", 0], ["W", 1], ["", 2], ["A", 3], ["S", 4], ["D", 5]].map(([k, n]) =>
                k ? <span key={n} className="keycap !h-9 !min-w-9 !text-sm" style={{ borderColor: "#ff3b3b", background: "linear-gradient(180deg,#ff3b3b55,#ff3b3b22)" }}>{k}</span> : <span key={n} />,
              )}
            </span>
          </Tile>
        </motion.ul>
      </div>
    </section>
  );
}