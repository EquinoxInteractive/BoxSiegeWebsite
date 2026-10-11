import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Keyboard, Mic2, Palette, ShoppingBag, SlidersHorizontal, Swords, Trophy, Users, Zap, Flag, Skull, Dice5, Vibrate, Monitor, Save } from "lucide-react";
import { ARENAS, weaponImg } from "@/data/game";
import { MODES } from "@/data/modes";
import { Page } from "@/components/Page";
import { Reveal, popIn, stagger } from "@/components/ui";
import { sfx } from "@/lib/audio";




const FLOW = [
  { icon: Gamepad2, title: "Main Menu", text: "Campaign, Versus, Controls, Settings or Quit - plus Shop and Inventory docked on the right. Everything works with mouse, keyboard or controller." },
  { icon: Users, title: "How many players?", text: "Pick 2, 3 or 4 players. Controllers are assigned automatically in the order they connect." },
  { icon: Palette, title: "Choose Your Fighter", text: "A fighting-game style 4×6 roster of all 24 characters. Lock a fighter (each can only be used once), choose a skin if you own one, then your weapon and weapon skin, then READY. A RANDOM tile picks for you." },
  { icon: Users, title: "Select Your Teams", text: "3-4 player matches only: slide your token into a team lane. Skip it entirely for a free-for-all." },
  { icon: SlidersHorizontal, title: "Battle Settings", text: "Map → Time → Rounds → Objects → Power-ups on/off → Power-up amount → Power-up list → START." },
  { icon: Swords, title: "Fight!", text: "A 3-2-1 countdown, an announcer for every round, Final Round, Sudden Death and Flawless Victory callouts. Win enough rounds to win the match." },
];

const EXTRAS = [
  { icon: Mic2, t: "Voice announcer", d: "Every fighter and weapon has its own voice line, with round announcements all the way up to round 16, plus Final Round and Flawless Victory." },
  { icon: Skull, t: "Sudden Death", d: "Out of time with equal health? A sudden-death round decides it." },
  { icon: Flag, t: "Final Round", d: "Triggered when every player is one win away from the match." },
  { icon: Dice5, t: "Random everything", d: "Random arena, random fighter tile and random power-up spawns keep each match fresh." },
  { icon: Keyboard, t: "Four players, one keyboard", d: "Default key layouts for four players fit one keyboard - fully rebindable." },
  { icon: Gamepad2, t: "Controller hot-plug", d: "Plug in as many controllers as you like. The Nth connected pad becomes player N, with PlayStation / Xbox glyphs." },
  { icon: Vibrate, t: "Vibration & screen shake", d: "Rumble and screen shake are both toggles, so the game fits your taste." },
  { icon: Monitor, t: "Display options", d: "Fullscreen, FPS counter and a frame-rate limit from 30 up to unlimited." },
  { icon: Save, t: "Everything is saved", d: "Settings, match setup, campaign progress and cosmetics persist between sessions." },
  { icon: Zap, t: "Flawless victories", d: "Win a round without losing a single heart and you earn the flawless callout." },
];

export function Modes() {
  const [active, setActive] = useState<string>("campaign");
  const [step, setStep] = useState(2);
  const mode = MODES.find((m) => m.id === active)!;
  const Icon = mode.icon;
  return (
    <Page id="modes" title="Pick your mode"
      intro="Whether you have friends on the couch or a free evening alone, BOX SIEGE has a mode built for it.">
      <div className="grid gap-4 md:grid-cols-4">
        {MODES.map((m) => {
          const on = m.id === active;
          const I = m.icon;
          return (
            <motion.button
              key={m.id}
              onClick={() => { setActive(m.id); sfx("ui_move", 0.35); }}
              onMouseEnter={() => sfx("ui_hover", 0.1)}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              className="panel relative p-5 text-left cursor-pointer overflow-hidden"
              style={{ borderColor: on ? m.color : undefined, boxShadow: on ? `0 0 0 1px ${m.color}, 0 20px 50px -20px ${m.color}` : undefined }}
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity" style={{ background: m.color, opacity: on ? 0.5 : 0.12 }} />
              <I className="relative w-8 h-8" style={{ color: m.color }} />
              <p className="relative font-display text-3xl mt-3">{m.title}</p>
              <p className="relative font-ui text-[11px] uppercase tracking-widest text-white/55">{m.tag}</p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}
          className="panel mt-5 grid items-center gap-8 overflow-hidden p-6 md:grid-cols-2 md:p-10"
          style={{ ["--accent" as string]: mode.color }}
        >
          <div>
            <div className="flex items-center gap-3">
              <Icon className="w-7 h-7" style={{ color: mode.color }} />
              <h3 className="font-display text-4xl md:text-5xl">{mode.title}</h3>
            </div>
            <p className="mt-4 text-white/75 leading-relaxed text-lg">{mode.text}</p>
            <ul className="mt-5 grid gap-2">
              {mode.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-white/85">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rotate-45" style={{ background: mode.color }} /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex min-h-[230px] items-end justify-center gap-4 rounded-2xl p-6" style={{ background: `linear-gradient(180deg, ${mode.color}22, transparent), url(${ARENAS[(MODES.indexOf(mode) * 3) % 10].bg}) center/cover`, imageRendering: "pixelated" }}>
            <div className="absolute inset-0 rounded-2xl bg-[#0b0b1c]/55" />
            {mode.art.map((c, i) => (
              <motion.div key={c.id} initial={{ y: 60, opacity: 0, rotate: -8 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ delay: 0.1 * i, type: "spring", stiffness: 220, damping: 14 }} className="relative">
                <div className="animate-bob" style={{ animationDelay: `${i * 0.4}s` }}>
                  <img src={c.img} alt={c.name} className="px w-24 md:w-32 drop-shadow-[0_10px_0_rgba(0,0,0,0.5)]" />
                  {mode.id !== "shop" && <img src={weaponImg(["smith", "kurval", "flamer", "scream"][i % 4] as "smith", i % 4)} alt="" className="px absolute left-[60%] top-[45%] w-20 max-w-none" />}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* match flow */}
      <Reveal className="mt-24">
        <h3 className="text-center font-display text-4xl md:text-6xl">From menu to match</h3>
        <p className="mt-2 text-center text-white/60">Tap a step to see what happens.</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <ol className="grid gap-2">
            {FLOW.map((f, i) => {
              const I = f.icon;
              const on = i === step;
              return (
                <li key={f.title}>
                  <button
                    onClick={() => { setStep(i); sfx("ui_move", 0.3); }}
                    className="relative flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left cursor-pointer transition-colors"
                    style={{ borderColor: on ? "#ffd23f" : "rgba(255,255,255,0.1)", background: on ? "rgba(255,210,63,0.1)" : "rgba(255,255,255,0.03)" }}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg font-digital text-2xl" style={{ background: on ? "#ffd23f" : "rgba(255,255,255,0.08)", color: on ? "#0b0b1c" : "#fff" }}>{i + 1}</span>
                    <span className="font-ui text-lg">{f.title}</span>
                    <I className="ml-auto w-5 h-5 opacity-60" />
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="panel relative min-h-[260px] overflow-hidden p-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <p className="font-digital text-8xl text-gold/25 leading-none">0{step + 1}</p>
                <h4 className="font-display text-4xl md:text-5xl -mt-4">{FLOW[step].title}</h4>
                <p className="mt-4 text-white/75 leading-relaxed text-lg">{FLOW[step].text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-0 left-0 h-1.5 bg-gold transition-all duration-500" style={{ width: `${((step + 1) / FLOW.length) * 100}%` }} />
          </div>
        </div>
      </Reveal>

      {/* extras */}
      <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {EXTRAS.map((e) => {
          const I = e.icon;
          return (
            <motion.li key={e.t} variants={popIn} whileHover={{ y: -5 }} className="panel p-5">
              <I className="w-6 h-6 text-gold" />
              <p className="font-ui text-lg mt-3">{e.t}</p>
              <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{e.d}</p>
            </motion.li>
          );
        })}
      </motion.ul>
    </Page>
  );
}
