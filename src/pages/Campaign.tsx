import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { BOSSES, BOSS_TRAITS, CHAPTERS, CHARACTERS, ENEMIES, ENEMY_BLURB, GRADES, PERKS, WORLDS, weaponImg, WEAPONS } from "@/data/game";
import { Page } from "@/components/Page";
import { Coin, Counter, Heart, Reveal, StatBar, Tabs } from "@/components/ui";
import { sfx } from "@/lib/audio";

type Tab = "world" | "bosses" | "enemies" | "perks" | "score";

function Worlds() {
  const [ch, setCh] = useState(0);
  const c = CHAPTERS[ch];
  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-5">
        {CHAPTERS.map((x, i) => (
          <button key={x.n} onClick={() => { setCh(i); sfx("ui_move", 0.3); }} className="panel cursor-pointer p-3.5 text-left transition-all last:col-span-2 active:scale-[0.97] sm:p-4 md:last:col-span-1 md:hover:-translate-y-1"
            style={{ borderColor: i === ch ? "#ff8a3a" : undefined, boxShadow: i === ch ? "0 0 30px -6px #ff8a3a" : undefined }}>
            <p className="font-digital text-3xl text-gold">0{x.n}</p>
            <p className="font-display text-2xl leading-none">{x.name}</p>
            <p className="mt-1 font-ui text-[11px] uppercase tracking-wider text-white/50">Levels {x.range[0]}-{x.range[1]}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={ch} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-center text-white/70">Chapter {c.n}: {c.blurb}</motion.p>
      </AnimatePresence>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-3 lg:grid-cols-5">
        {WORLDS.map((w, i) => (
          <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} whileHover={{ y: -6 }}
            className="group relative h-32 overflow-hidden rounded-2xl border border-white/10 sm:h-40">
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: `url(${w.arena.bg}) center/cover`, imageRendering: "pixelated" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="truncate font-display text-xl leading-none sm:text-2xl">{w.name}</p>
              <p className="mt-0.5 font-ui text-[10px] uppercase tracking-wider text-gold sm:text-[11px]">Levels {c.range[0] + w.from - 1}-{c.range[0] + w.to - 1}</p>
            </div>
            <span className="absolute right-1.5 top-1.5 chip !bg-black/60 !px-2 !text-[9px] sm:right-2 sm:top-2 sm:!px-2.5 sm:!text-[10px]">Boss at {(i + 1) * 5}</span>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-white/55">Each chapter has 50 levels (5 per world) and ends every world with a boss. Beat a chapter to unlock the next.</p>
    </div>
  );
}

function Bosses() {
  const [ch, setCh] = useState(1);
  const [sel, setSel] = useState(0);
  const list = BOSSES.filter((b) => b.chapter === ch);
  const b = list[sel];
  const char = CHARACTERS[b.char];
  const wpn = WEAPONS.find((w) => w.id === b.weapon)!;
  return (
    <div>
      <div className="flex justify-center">
        <Tabs id="bosschap" value={String(ch)} onChange={(v) => { setCh(+v); setSel(0); }} accent="#ff8a3a" tabs={CHAPTERS.map((c) => ({ id: String(c.n), label: `Ch. ${c.n}` }))} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid grid-cols-5 gap-2 lg:grid-cols-2">
          {list.map((x, i) => (
            <button key={x.id} onClick={() => { setSel(i); sfx("boss_roar", 0.25); }} className="panel flex cursor-pointer items-center justify-center gap-3 p-2 text-left transition-all active:scale-95 lg:justify-start hover:-translate-y-0.5"
              style={{ borderColor: i === sel ? "#ff8a3a" : undefined }}>
              <img src={CHARACTERS[x.char].img} alt="" className="px h-10 w-10 shrink-0 rounded-md" loading="lazy" />
              <span className="hidden min-w-0 lg:block"><span className="block truncate font-ui text-sm uppercase">{x.name}</span><span className="block text-[10px] uppercase tracking-wider text-white/45">{x.worldName}</span></span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={b.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="panel relative overflow-hidden p-4 sm:p-6 md:p-8">
            <div className="absolute inset-0 opacity-25" style={{ background: `url(${WORLDS.find((w) => w.id === b.worldId)!.arena.bg}) center/cover`, imageRendering: "pixelated" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#12122b] via-[#12122b]/85 to-transparent" />
            <div className="relative grid items-center gap-6 sm:grid-cols-[auto_1fr]">
              <div className="relative mx-auto grid h-40 w-40 place-items-end sm:h-44 sm:w-44">
                <div className="animate-bob relative" style={{ width: 80 + b.size * 40, height: 80 + b.size * 40 }}>
                  <img src={char.img} alt={b.name} className="px h-full w-full drop-shadow-[0_12px_0_rgba(0,0,0,0.5)]" />
                  <img src={weaponImg(b.weapon, 0)} alt="" className="px absolute left-[58%] top-[46%] w-[85%] max-w-none" />
                </div>
              </div>
              <div>
                <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-brand-red sm:text-xs sm:tracking-[0.3em]">Chapter {b.chapter} · Level {b.level} · {b.worldName}</p>
                <h4 className="mt-1 font-display text-4xl leading-none sm:text-5xl md:text-6xl">{b.name}</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="chip">{wpn.name}</span>
                  {b.shield && <span className="chip text-cyan">Shielded</span>}
                  {b.traits.map((t) => <span key={t} className="chip text-gold" title={BOSS_TRAITS[t]?.text}><Flame className="w-3 h-3" />{BOSS_TRAITS[t]?.name ?? t}</span>)}
                </div>
              </div>
            </div>
            <div className="relative mt-6 grid gap-3 sm:grid-cols-2" key={b.id}>
              <StatBar label="Health" value={b.hp / 130} display={`${b.hp} HP`} color="#ff4040" />
              <StatBar label="Move speed" value={b.speed / 400} display={`${b.speed}`} color="#4be3a0" delay={0.05} />
              <StatBar label="Damage" value={b.dmg / 2} display={`×${b.dmg}`} color="#ff9d2e" delay={0.1} />
              <StatBar label="Size" value={b.size / 2.2} display={`×${b.size}`} color="#4fd8ff" delay={0.15} />
            </div>
            <ul className="relative mt-5 grid gap-2 text-sm text-white/70">
              {b.traits.map((t) => BOSS_TRAITS[t] && <li key={t}><b className="font-ui text-gold">{BOSS_TRAITS[t].name}.</b> {BOSS_TRAITS[t].text}</li>)}
              <li className="text-white/45">Defeat reward: {b.score.toLocaleString("en-US")} points.</li>
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Enemies() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {ENEMIES.map((e, i) => (
        <motion.div key={e.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (i % 3) * 0.07 }} whileHover={{ y: -5 }} className="panel flex gap-4 p-4">
          <div className="relative grid h-20 w-20 shrink-0 place-items-center">
            <img src={CHARACTERS[e.char].img} alt={e.name} className="px rounded-lg" style={{ width: 40 + e.size * 24, height: 40 + e.size * 24 }} loading="lazy" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-2xl leading-none">{e.name}</p>
            <p className="mt-1 flex flex-wrap gap-x-3 font-ui text-[11px] uppercase tracking-wider text-white/55">
              <span>{e.knife ? "Knife" : e.weapon}</span><span>{e.hp} HP</span><span className="text-gold">{e.score} pts</span>
            </p>
            <p className="mt-1.5 text-sm text-white/65 leading-snug">{ENEMY_BLURB[e.id]}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Perks() {
  return (
    <div>
      <p className="mx-auto mb-6 max-w-2xl text-center text-white/65">After every cleared level you choose one of three random perks. They stack up to their cap and last for the rest of the run - boss rewards offer rarer ones more often.</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {PERKS.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (i % 4) * 0.06 }} whileHover={{ y: -6, rotate: -1 }}
            className="panel relative overflow-hidden p-4 sm:p-5" style={{ borderColor: `${p.color}55` }}>
            <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl" style={{ background: p.color, opacity: 0.3 }} />
            <img src={p.icon} alt="" className="px relative h-14 w-14 object-contain" loading="lazy" />
            <p className="relative mt-3 font-display text-xl leading-none sm:text-2xl" style={{ color: p.color }}>{p.name}</p>
            <p className="relative mt-1.5 text-sm text-white/70 leading-snug">{p.desc}</p>
            <p className="relative mt-3 flex items-center gap-1 font-ui text-[11px] uppercase tracking-wider text-white/45">Stacks up to {p.max}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Scoring() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="panel p-5 sm:p-7">
        <h4 className="font-display text-3xl">Stars & grades</h4>
        <ul className="mt-4 grid gap-3">
          {GRADES.map((g) => (
            <li key={g.letter} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-black/30 p-3">
              <span className="grid h-12 w-12 place-items-center rounded-lg font-display text-3xl text-ink" style={{ background: g.letter === "S" ? "#ffd23f" : g.letter === "A" ? "#4be3a0" : g.letter === "B" ? "#4fd8ff" : "#c8cddc" }}>{g.letter}</span>
              <div className="flex">{[0, 1, 2].map((s) => <Star key={s} className="w-5 h-5" fill={s < g.stars ? "#ffd23f" : "none"} stroke={s < g.stars ? "#ffd23f" : "rgba(255,255,255,0.25)"} />)}</div>
              <p className="min-w-[10rem] flex-1 text-sm text-white/70">{g.text}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-4">
        <div className="panel p-5 sm:p-7">
          <h4 className="font-display text-3xl">Lives & combos</h4>
          <div className="mt-4 flex items-center gap-2"><span className="font-ui text-xs uppercase tracking-widest text-white/55">Start with</span>{[0, 1, 2].map((i) => <Heart key={i} className="w-6 h-6" />)}<span className="text-xs text-white/45">· max 5</span></div>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">Lose all hearts and you spend a life; lose every life and the run ends. Defeat enemies in quick succession to build a combo - the score multiplier grows with each kill, up to ×3, and the chain breaks after four seconds. A flawless level adds a 1,000-point bonus.</p>
        </div>
        <div className="panel p-5 sm:p-7">
          <h4 className="font-display text-3xl">Coins & rewards</h4>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/70"><Coin className="w-6 h-6" /> Every cleared level pays out coins, spent in the Shop on skins and accessories. Progress is saved automatically.</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[["250", "Levels"], ["50", "Bosses"], ["12", "Perks"]].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-black/30 p-3"><Counter to={+n} className="font-digital text-4xl text-gold" /><p className="font-ui text-[10px] uppercase tracking-wider text-white/50">{l}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Campaign() {
  const [tab, setTab] = useState<Tab>("world");
  return (
    <Page id="campaign" title="Campaign" wide
      intro="Go it alone. Waves of enemies, a boss at the end of every world, and perks that make each run different.">
      <Reveal className="mb-8 flex justify-center sm:mb-10">
        <Tabs id="camp" value={tab} onChange={(t) => { setTab(t); sfx("ui_move", 0.3); }} accent="#ff8a3a"
          tabs={[{ id: "world", label: "Chapters" }, { id: "bosses", label: "Bosses", badge: "50" }, { id: "enemies", label: "Enemies", badge: "12" }, { id: "perks", label: "Perks", badge: "12" }, { id: "score", label: "Scoring" }]} />
      </Reveal>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
          {tab === "world" && <Worlds />}
          {tab === "bosses" && <Bosses />}
          {tab === "enemies" && <Enemies />}
          {tab === "perks" && <Perks />}
          {tab === "score" && <Scoring />}
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}