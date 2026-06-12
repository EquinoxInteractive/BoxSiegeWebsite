import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CHARACTERS_P1 as P1,
  CHARACTERS_P2 as P2,
  CHARACTERS_P3 as P3,
  CHARACTERS_P4 as P4,
} from "@/data/content";

export type Character = (typeof P1)[number];

type FactionKey = "p1" | "p2" | "p3" | "p4";

const FACTION_LIST: Record<FactionKey, typeof P1> = { p1: P1, p2: P2, p3: P3, p4: P4 };
const FACTION_TOGGLE_COLOR: Record<FactionKey, string> = {
  p1: "#ff3a2a",
  p2: "#00f1ff",
  p3: "#45005f",
  p4: "#ffb570",
};
const FACTION_LABEL: Record<FactionKey, string> = {
  p1: "Player One",
  p2: "Player Two",
  p3: "Player Three",
  p4: "Player Four",
};
const FACTION_SHORT: Record<FactionKey, string> = {
  p1: "Player 1",
  p2: "Player 2",
  p3: "Player 3",
  p4: "Player 4",
};

export function CharacterShowcase() {
  const [accent, setAccent] = useState<FactionKey>("p1");
  const list = FACTION_LIST[accent];
  const [activeByFaction, setActiveByFaction] = useState<Record<FactionKey, number>>({
    p1: 0, p2: 0, p3: 0, p4: 0,
  });
  const active = activeByFaction[accent];
  const setActive = (i: number) =>
    setActiveByFaction((s) => ({ ...s, [accent]: i }));
  const char = list[active];
  const [mode, setMode] = useState<"idle" | "death">("idle");

  const accentColor = char.color;
  const currentSprite = mode === "death" ? char.death : char.sprite;


  return (
    <div className="relative w-full">
      <div className="text-center mb-8">
        <h3 className="font-display text-4xl md:text-6xl text-gradient mt-2">
          {FACTION_LABEL[accent]}
        </h3>

        {/* P1 / P2 toggle */}
        <div className="mt-6 inline-flex flex-wrap justify-center rounded-full border border-white/15 bg-black/50 backdrop-blur p-1 relative">
          {(["p1", "p2", "p3", "p4"] as const).map((key) => {
            const isActive = accent === key;
            const color = FACTION_TOGGLE_COLOR[key];
            return (
              <button
                key={key}
                onClick={() => setAccent(key)}
                className="relative px-4 md:px-6 py-2 text-xs md:text-sm font-bold uppercase tracking-[0.3em] transition-colors cursor-pointer"
                style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.5)" }}
              >
                {isActive && (
                  <motion.span
                    layoutId="pp-toggle"
                    className="absolute inset-0 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}66)`, boxShadow: `0 0 18px ${color}99` }}
                    transition={{ type: "spring", damping: 22, stiffness: 220 }}
                  />
                )}
                <span className="relative z-10">{FACTION_SHORT[key]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-white/10"
        style={{
          background:
            `radial-gradient(circle at 30% 50%, ${accentColor}22 0%, transparent 60%), linear-gradient(180deg, #0a0a0a 0%, #050505 100%)`,
        }}
      >
        {/* Big background letter */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[28rem] leading-none opacity-[0.06] select-none"
          style={{ color: accentColor }}
        >
          {char.name[0]}
        </div>

        {/* Scanlines */}
        <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />

        <div className="relative grid md:grid-cols-2 gap-6 p-6 md:p-12 min-h-[560px]">
          {/* Left: info */}
          <div className="flex flex-col justify-center order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={char.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
              >

                <h2 className="font-display text-6xl md:text-8xl mt-2 leading-none">
                  {char.name}
                </h2>

                <div className="mt-8 flex gap-3">
                  {([
                    { src: char.sprite, key: "idle" as const, label: "Idle" },
                    { src: char.death, key: "death" as const, label: "Death" },
                  ]).map((item) => {
                    const isActive = mode === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setMode(item.key)}
                        aria-label={`Show ${item.label} sprite`}
                        className={`relative w-20 h-20 rounded-lg bg-black/50 border p-2 flex items-center justify-center transition-all cursor-pointer ${
                          isActive ? "scale-110 border-white/40" : "border-white/10 opacity-60 hover:opacity-100"
                        }`}
                        style={{ boxShadow: isActive ? `0 0 24px ${accentColor}cc` : `0 0 12px ${accentColor}33` }}
                      >
                        <img src={item.src} alt={item.label} className="w-full h-full object-contain" style={{ imageRendering: "pixelated" }} />
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-bold" style={{ color: isActive ? accentColor : "rgba(255,255,255,0.4)" }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-8 text-xs uppercase tracking-widest text-white/40">
                  Click sprite to preview · {mode === "death" ? "Death" : "Idle"}
                </p>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: big character */}
          <div className="relative flex items-center justify-center order-1 md:order-2 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${char.id}-${mode}`}
                src={currentSprite}
                alt={`${char.name} ${mode}`}
                initial={
                  mode === "death"
                    ? { opacity: 0, scale: 1.1, rotate: -8, y: -20 }
                    : { opacity: 0, scale: 0.8, y: 40 }
                }
                animate={
                  mode === "death"
                    ? { opacity: 1, scale: 1, rotate: 0, y: 0 }
                    : { opacity: 1, scale: 1, y: 0 }
                }
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: "spring", damping: 18, stiffness: 120 }}
                className="relative z-10 max-h-[440px] w-auto object-contain"
                style={{
                  imageRendering: "pixelated",
                  filter:
                    mode === "death"
                      ? `drop-shadow(0 0 50px #ff003355) grayscale(0.4) drop-shadow(0 20px 30px rgba(0,0,0,0.7))`
                      : `drop-shadow(0 0 40px ${accentColor}aa) drop-shadow(0 20px 30px rgba(0,0,0,0.6))`,
                }}
              />
            </AnimatePresence>

            {/* Floating ring */}
            <div
              aria-hidden
              className={`absolute w-[280px] h-[280px] rounded-full border-2 border-dashed spin-slow ${mode === "death" ? "opacity-50" : "opacity-30"}`}
              style={{ borderColor: mode === "death" ? "#ff0033" : accentColor }}
            />

            {/* Death stamp */}
            <AnimatePresence>
              {mode === "death" && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.4, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: -12 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ type: "spring", damping: 14, stiffness: 200 }}
                  className="absolute top-6 right-6 z-20 px-4 py-1 border-4 font-display text-2xl tracking-[0.3em]"
                  style={{ color: "#ff2244", borderColor: "#ff2244", textShadow: "0 0 12px #ff2244" }}
                >
                  K.O.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Selector */}
        <div className="relative grid grid-cols-4 border-t border-white/10">
          {list.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                className="group relative p-4 md:p-6 flex flex-col items-center gap-2 transition-all cursor-pointer"
                style={{
                  background: isActive ? `linear-gradient(180deg, ${c.color}22, transparent)` : "transparent",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId={`active-${accent}`}
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: c.color, boxShadow: `0 0 12px ${c.color}` }}
                  />
                )}
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-transform ${
                    isActive ? "scale-110" : "opacity-60 group-hover:opacity-100"
                  }`}
                >
                  <img
                    src={c.sprite}
                    alt={c.name}
                    className="max-w-full max-h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <span className={`text-xs uppercase tracking-widest font-bold ${isActive ? "text-white" : "text-white/50"}`}>
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}