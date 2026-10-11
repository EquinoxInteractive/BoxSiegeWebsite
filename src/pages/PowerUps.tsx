import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Swords, Zap } from "lucide-react";
import { POWERUPS, PU_AMOUNTS } from "@/data/game";
import { Page } from "@/components/Page";
import { Reveal, Tabs } from "@/components/ui";
import { sfx } from "@/lib/audio";

export function PowerUps() {
  const [id, setId] = useState("shield");
  const [amt, setAmt] = useState(1);
  const idx = POWERUPS.findIndex((x) => x.id === id);
  const p = POWERUPS[idx];
  const a = PU_AMOUNTS[amt];

  const choose = (n: string) => {
    setId(n);
    sfx(POWERUPS.find((x) => x.id === n)!.sfx, 0.5);
  };

  return (
    <Page id="powerups" title="9 power-ups" wide
      intro="Crates drop onto the arena while you fight. Seven are used in Versus; Nuke and Freeze appear only in the Campaign. Click one to hear it.">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {POWERUPS.map((x, i) => (
            <motion.button key={x.id} onClick={() => choose(x.id)} initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 16 }}
              whileHover={{ y: -8, rotate: i % 2 ? 3 : -3 }} whileTap={{ scale: 0.92 }}
              className="panel relative aspect-square cursor-pointer overflow-hidden p-2 sm:p-3"
              style={{ borderColor: x.id === id ? x.color : undefined, boxShadow: x.id === id ? `0 0 34px ${x.color}77` : undefined }} aria-pressed={x.id === id}>
              <span className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 50% 40%, ${x.color}, transparent 65%)` }} />
              <img src={x.icon} alt={x.name} className={`px relative mx-auto h-[62%] w-[62%] object-contain ${x.id === id ? "animate-bob" : ""}`} />
              <p className="relative mt-1 truncate text-center font-ui text-[10px] uppercase tracking-wide sm:text-[11px] sm:tracking-wider">{x.name}</p>
              {x.campaignOnly && <span className="absolute right-1.5 top-1.5 rounded bg-brand-red px-1 font-ui text-[8px] uppercase">Campaign</span>}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={p.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}
            className="panel relative flex h-full flex-col gap-4 overflow-hidden p-4 sm:gap-5 sm:p-6 md:p-8"
            style={{ borderColor: `${p.color}55` }}>
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl" style={{ background: p.color, opacity: 0.25 }} />

            {/* header: judul kiri, nomor urut kanan */}
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-ui text-xs uppercase tracking-[0.4em]" style={{ color: p.color }}>{p.campaignOnly ? "Campaign only" : "Versus & campaign"}</p>
                <h3 className="font-display mt-2 text-[2.6rem] leading-none sm:text-5xl md:text-7xl" style={{ textShadow: "0 5px 0 #000" }}>{p.name}</h3>
              </div>
              <p className="shrink-0 font-digital text-4xl leading-none text-white/35 md:text-5xl">
                {String(idx + 1).padStart(2, "0")}<span className="text-white/20">/{String(POWERUPS.length).padStart(2, "0")}</span>
              </p>
            </div>

            {/* stage: ikon besar di tengah, mengisi seluruh sisa tinggi */}
            <div className="relative flex min-h-[190px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${p.color}55, transparent 62%)` }} />
              <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
              <img src={p.icon} alt={p.name} className="px relative h-32 w-32 object-contain animate-bob-rot sm:h-40 sm:w-40 md:h-56 md:w-56"
                style={{ filter: `drop-shadow(0 0 28px ${p.color})` }} />
              <span className="absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2" style={{ borderColor: p.color }} />
              <span className="absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2" style={{ borderColor: p.color }} />
              <span className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2" style={{ borderColor: p.color }} />
              <span className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2" style={{ borderColor: p.color }} />
            </div>

            <p className="relative text-base leading-relaxed text-white/80 md:text-lg">{p.text}</p>

            {/* statistik: 3 kolom sama lebar */}
            <div className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {[
                { label: "Duration", value: p.duration, Icon: Clock },
                { label: "Effect", value: p.effect, Icon: Zap },
                { label: "Found in", value: p.campaignOnly ? "Campaign" : "Versus + Campaign", Icon: Swords },
              ].map(({ label, value, Icon }) => (
                <div key={label} className="flex flex-col gap-1.5 rounded-xl border bg-black/30 p-3 last:col-span-2 sm:last:col-span-1 md:p-4" style={{ borderColor: `${p.color}44` }}>
                  <p className="flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-wider text-white/50"><Icon className="h-3.5 w-3.5" style={{ color: p.color }} />{label}</p>
                  <p className="font-ui text-sm uppercase leading-snug md:text-base" style={{ color: p.color }}>{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Reveal className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-2">
        <div className="panel p-5 sm:p-7">
          <h4 className="font-display text-3xl">Spawn control</h4>
          <p className="mt-1 text-sm text-white/60">Before each match you choose how many crates appear.</p>
          <Tabs id="amount" value={String(amt)} onChange={(v) => setAmt(+v)} accent="#be5aff" className="mt-4"
            tabs={PU_AMOUNTS.map((x, i) => ({ id: String(i), label: x.name }))} />
          <div className="mt-6 grid grid-cols-3 gap-2 text-center sm:gap-3">
            <div className="rounded-xl bg-black/30 p-3"><p className="font-digital text-3xl text-gold sm:text-4xl">{a.min}-{a.max}s</p><p className="font-ui text-[10px] uppercase tracking-wider text-white/50">Between drops</p></div>
            <div className="rounded-xl bg-black/30 p-3"><p className="font-digital text-3xl text-gold sm:text-4xl">{a.cap}</p><p className="font-ui text-[10px] uppercase tracking-wider text-white/50">Crates at once</p></div>
            <div className="rounded-xl bg-black/30 p-3"><p className="font-digital text-3xl text-gold sm:text-4xl">12s</p><p className="font-ui text-[10px] uppercase tracking-wider text-white/50">Crate lifetime</p></div>
          </div>
        </div>
        <div className="panel p-5 leading-relaxed text-white/75 sm:p-7">
          <h4 className="font-display text-3xl text-white">Your rules</h4>
          <ul className="mt-3 grid gap-2.5 text-sm">
            <li className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-gold" />Switch power-ups off completely for a pure gun fight.</li>
            <li className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-gold" />Open the power-up list and ban any of the seven you dislike.</li>
            <li className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-gold" />Crates blink during their last seconds, then vanish if nobody grabs them.</li>
            <li className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-gold" />Ammo Refill is smart - Scream users get Scream back, not the Pistol.</li>
          </ul>
        </div>
      </Reveal>
    </Page>
  );
}