import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WEAPONS_P1 as P1,
  WEAPONS_P2 as P2,
  WEAPONS_P3 as P3,
  WEAPONS_P4 as P4,
  MELEE_P1,
  MELEE_P2,
  MELEE_P3,
  MELEE_P4,
} from "@/data/content";

type FactionKey = "p1" | "p2" | "p3" | "p4";
const FACTION_LIST = { p1: P1, p2: P2, p3: P3, p4: P4 } as const;
const FACTION_MELEE = { p1: MELEE_P1, p2: MELEE_P2, p3: MELEE_P3, p4: MELEE_P4 } as const;
const FACTION_TOGGLE_COLOR: Record<FactionKey, string> = {
  p1: "#ff3a2a",
  p2: "#00f1ff",
  p3: "#45005f",
  p4: "#ffb570",
};
const FACTION_ACCENT: Record<FactionKey, string> = {
  p1: "#ff3a2a",
  p2: "#00f1ff",
  p3: "#45005f",
  p4: "#ffb570",
};
const FACTION_TITLE: Record<FactionKey, string> = {
  p1: "Player One Weapons",
  p2: "Player Two Weapons",
  p3: "Player Three Weapons",
  p4: "Player Four Weapons",
};
const FACTION_SHORT: Record<FactionKey, string> = {
  p1: "Player 1",
  p2: "Player 2",
  p3: "Player 3",
  p4: "Player 4",
};

type StatBarProps = { label: string; value: number; max: number; unit?: string; color: string; infinite?: boolean };
function StatBar({ label, value, max, unit, color, infinite }: StatBarProps) {
  const pct = infinite ? 100 : Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="weapon-stat-label text-[10px] uppercase tracking-[0.3em] text-white/50">{label}</span>
        <span className="weapon-stat-value font-display text-2xl text-white">
          {infinite ? (
            <svg
              width="36" height="20"
              viewBox="0 0 36 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              <path
                d="M18 10
                   C18 10 15.5 4 10 4
                   C4.477 4 1 7.134 1 10
                   C1 12.866 4.477 16 10 16
                   C15.5 16 18 10 18 10
                   C18 10 20.5 4 26 4
                   C31.523 4 35 7.134 35 10
                   C35 12.866 31.523 16 26 16
                   C20.5 16 18 10 18 10 Z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          ) : value}
          {!infinite && unit && <span className="text-xs text-white/40 ml-1">{unit}</span>}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-white/5 overflow-hidden border border-white/10">
        <motion.div
          key={value}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}55)`, boxShadow: `0 0 12px ${color}` }}
        />
      </div>
    </div>
  );
}

const HEART_SRC = "/assets/IMG/ui/heart.png";
const BULLET_SRC = "/assets/IMG/ui/bullet.png";

function DamageStat({ value, }: { value: number; color: string }) {
  const size = 26;
  const full = Math.floor(value);
  const frac = +(value - full).toFixed(2);
  const hearts: number[] = [];
  for (let i = 0; i < full; i++) hearts.push(1);
  if (frac > 0) hearts.push(frac);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="weapon-stat-label text-[10px] uppercase tracking-[0.3em] text-white/50">Damage</span>
        <span className="weapon-stat-value-muted font-display text-lg text-white/70">{value}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
        {hearts.length === 0 ? (
          <span className="text-xs text-white/30">—</span>
        ) : (
          hearts.map((fill, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 14, stiffness: 220, delay: i * 0.06 }}
              className="relative"
              style={{ width: size, height: size }}
            >
              <img
                src={HEART_SRC}
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
                style={{ imageRendering: "pixelated", opacity: 0.18, filter: "grayscale(1) brightness(0.6)" }}
                draggable={false}
              />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <img
                  src={HEART_SRC}
                  alt=""
                  style={{
                    width: size,
                    height: size,
                    maxWidth: "none",
                    imageRendering: "pixelated",
                  }}
                  draggable={false}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function MagazineStat({ value, infinite, label = "Magazine" }: { value: number; color: string; infinite?: boolean; label?: string }) {
  const isInf = infinite || value === Infinity;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="weapon-stat-label text-[10px] uppercase tracking-[0.3em] text-white/50">{label}</span>
      </div>
      <div className="flex items-center gap-2 min-h-[26px]">
        <motion.img
          key={value}
          initial={{ y: -8, opacity: 0, rotate: -15 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 14, stiffness: 220 }}
          src={BULLET_SRC}
          alt="bullets"
          className="w-7 h-7 object-contain"
          style={{ imageRendering: "pixelated" }}
          draggable={false}
        />
        <span className="weapon-stat-value font-display text-3xl text-white leading-none">
          {isInf ? (
            <svg width="36" height="20" viewBox="0 0 36 20" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
              <path
                d="M18 10 C18 10 15.5 4 10 4 C4.477 4 1 7.134 1 10 C1 12.866 4.477 16 10 16 C15.5 16 18 10 18 10 C18 10 20.5 4 26 4 C31.523 4 35 7.134 35 10 C35 12.866 31.523 16 26 16 C20.5 16 18 10 18 10 Z"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"
              />
            </svg>
          ) : value}
        </span>
      </div>
    </div>
  );
}

export function WeaponShowcase() {
  const [faction, setFaction] = useState<FactionKey>("p1");
  const list = FACTION_LIST[faction];
  const [activeByFaction, setActiveByFaction] = useState<Record<FactionKey, number>>({
    p1: 0, p2: 0, p3: 0, p4: 0,
  });
  const active = activeByFaction[faction];
  const setActive = (i: number) =>
    setActiveByFaction((s) => ({ ...s, [faction]: i }));
  const weapon = list[active];
  const accent = FACTION_ACCENT[faction];
  const showSecondary = !!weapon.secondary;
  const melee = FACTION_MELEE[faction];

  return (
    <div className="relative w-full">
      {/* Header / faction toggle */}
      <div className="text-center mb-8">
        <h3 className="font-display text-4xl md:text-6xl text-gradient mt-2">
          {FACTION_TITLE[faction]}
        </h3>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* P1 / P2 toggle */}
          <div className="weapon-tab-wrapper inline-flex flex-wrap justify-center rounded-full border border-white/15 bg-black/50 backdrop-blur p-1 relative">
            {(["p1", "p2", "p3", "p4"] as const).map((key) => {
              const isActive = faction === key;
              const c = FACTION_TOGGLE_COLOR[key];
              return (
                <button
                  key={key}
                  onClick={() => setFaction(key)}
                  className={`relative px-4 md:px-6 py-2 text-xs md:text-sm font-bold uppercase tracking-[0.3em] transition-colors cursor-pointer${isActive ? "" : " weapon-tab-inactive"}`}
                  style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.5)" }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="wpn-faction-toggle"
                      className="absolute inset-0 rounded-full"
                      style={{ background: `linear-gradient(135deg, ${c}, ${c}66)`, boxShadow: `0 0 18px ${c}99` }}
                      transition={{ type: "spring", damping: 22, stiffness: 220 }}
                    />
                  )}
                  <span className="relative z-10">{FACTION_SHORT[key]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main panel */}
      <div
        className="themed-panel relative overflow-hidden rounded-3xl border border-white/10"
        style={{
          background: `radial-gradient(circle at 70% 40%, ${accent}22 0%, transparent 60%), linear-gradient(180deg, #060606 0%, #0a0a0a 100%)`,
        }}
      >
        {/* Background callsign */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[22rem] md:text-[28rem] leading-none opacity-[0.05] select-none uppercase tracking-tighter"
          style={{ color: accent }}
        >
          {weapon.name.split(" ")[0]}
        </div>

        <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />

        <div className="relative grid md:grid-cols-2 gap-6 p-6 md:p-12 min-h-[560px]">
          {/* Left: weapon image(s) */}
          <div className="relative flex flex-col items-center justify-center min-h-[280px] order-1 gap-6">
            {/* Decorative crosshair rings */}
            <div
              aria-hidden
              className="absolute w-[300px] h-[300px] rounded-full border border-dashed spin-slow opacity-25"
              style={{ borderColor: accent }}
            />
            <div
              aria-hidden
              className="absolute w-[200px] h-[200px] rounded-full border opacity-20"
              style={{ borderColor: accent }}
            />

            {/* Primary */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${faction}-${weapon.id}`}
                initial={{ opacity: 0, x: -160, rotate: -22, scale: 0.8, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, rotate: -8, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 180, rotate: 18, scale: 0.85, filter: "blur(8px)" }}
                transition={{ type: "spring", damping: 18, stiffness: 140 }}
                className="relative z-10"
              >
                <img
                  src={weapon.image}
                  alt={weapon.name}
                  className="max-h-[220px] md:max-h-[260px] w-auto object-contain"
                  style={{
                    imageRendering: "pixelated",
                    filter: `drop-shadow(0 0 40px ${accent}aa) drop-shadow(0 20px 30px rgba(0,0,0,0.6))`,
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Secondary (stacked below) */}
            <AnimatePresence initial={false}>
              {showSecondary && weapon.secondary && (
                <motion.div
                  key={`sec-${weapon.id}`}
                  initial={{ opacity: 0, height: 0, scale: 0.7, filter: "blur(10px)" }}
                  animate={{ opacity: 1, height: "auto", scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, height: 0, scale: 0.7, filter: "blur(10px)" }}
                  transition={{
                    height: { duration: 0.55, ease: [0.32, 0.72, 0, 1] },
                    opacity: { duration: 0.4, ease: "easeOut" },
                    scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    filter: { duration: 0.4, ease: "easeOut" },
                  }}
                  className="relative z-10 overflow-visible flex justify-center"
                >
                  <motion.img
                    initial={{ rotate: 14 }}
                    animate={{ rotate: 8 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    src={weapon.secondary.image}
                    alt={weapon.secondary.name}
                    className="max-h-[160px] md:max-h-[180px] w-auto object-contain"
                    style={{
                      imageRendering: "pixelated",
                      filter: `drop-shadow(0 0 30px ${accent}88) drop-shadow(0 10px 20px rgba(0,0,0,0.6))`,
                      transform: "scale(0.85)",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Muzzle flash burst on swap */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`flash-${faction}-${weapon.id}`}
                initial={{ opacity: 0.9, scale: 0.3 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute right-[18%] top-[35%] w-24 h-24 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${accent}cc 0%, transparent 70%)` }}
              />
            </AnimatePresence>

            {/* Melee — re-animates on every weapon swap */}
            <div className="relative z-10 mt-2 h-[130px] md:h-[150px] flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`melee-${faction}-${weapon.id}`}
                  initial={{ opacity: 0, x: 80, y: -20, rotate: 90, scale: 0.6, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 18, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -100, y: 10, rotate: -40, scale: 0.7, filter: "blur(6px)" }}
                  transition={{
                    type: "spring",
                    damping: 16,
                    stiffness: 180,
                    opacity: { duration: 0.35, ease: "easeOut" },
                    filter: { duration: 0.35, ease: "easeOut" },
                  }}
                  className="absolute"
                >
                  <motion.img
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    src={melee.image}
                    alt={melee.name}
                    className="max-h-[110px] md:max-h-[130px] w-auto object-contain"
                    style={{
                      imageRendering: "pixelated",
                      filter: `drop-shadow(0 0 22px ${accent}aa) drop-shadow(0 10px 18px rgba(0,0,0,0.6))`,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
              {/* Slash arc on swap */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`slash-${weapon.id}`}
                  initial={{ opacity: 0.8, scaleX: 0, rotate: -25 }}
                  animate={{ opacity: 0, scaleX: 1.2, rotate: -25 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute h-[3px] w-40 pointer-events-none origin-left"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, boxShadow: `0 0 16px ${accent}` }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Right: info & stats */}
          <div className="flex flex-col justify-center order-2">
            <AnimatePresence mode="wait">
              <motion.div
                  key={`${faction}-${weapon.id}-info`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.4em] font-bold"
                  style={{ color: accent }}
                >
                  {FACTION_SHORT[faction]} · Primary
                </p>
                <h2 className="font-display text-5xl md:text-7xl mt-2 leading-none">{weapon.name}</h2>

                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
                  <DamageStat value={weapon.damage} color={accent} />
                  <MagazineStat value={weapon.magazine} color={accent} />
                  <StatBar label="Bullet Speed" value={weapon.bulletSpeed} max={1000} color={accent} />
                  <StatBar label="Fire Rate" value={weapon.fireRate} max={800} color={accent} />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Secondary stats card */}
            <AnimatePresence initial={false}>
              {showSecondary && weapon.secondary && (
                <motion.div
                  key={`sec-stats-${weapon.id}`}
                  initial={{ opacity: 0, height: 0, marginTop: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24, filter: "blur(0px)" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, filter: "blur(8px)" }}
                  transition={{
                    height: { duration: 0.55, ease: [0.32, 0.72, 0, 1] },
                    marginTop: { duration: 0.55, ease: [0.32, 0.72, 0, 1] },
                    opacity: { duration: 0.4, ease: "easeOut" },
                    filter: { duration: 0.4, ease: "easeOut" },
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ y: 16, scale: 0.98 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 8, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-2xl border border-white/10 p-5 md:p-6"
                    style={{
                      background: `linear-gradient(135deg, ${accent}10, transparent 70%)`,
                    }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.4em] font-bold"
                      style={{ color: accent }}
                    >
                      Secondary
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl mt-1">{weapon.secondary.name}</h3>

                    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
                      <DamageStat value={weapon.secondary.damage} color={accent} />
                      <MagazineStat value={weapon.secondary.magazine} color={accent} infinite={weapon.secondary.magazine === Infinity} />
                      <StatBar label="Bullet Speed" value={weapon.secondary.bulletSpeed} max={1000} color={accent} />
                      <StatBar label="Fire Rate" value={weapon.secondary.fireRate} max={800} color={accent} />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Melee stats — re-animates on every weapon swap */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`melee-stats-${faction}-${weapon.id}`}
                initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)", clipPath: "inset(0 100% 0 0)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", clipPath: "inset(0 0% 0 0)" }}
                exit={{ opacity: 0, y: -16, scale: 0.97, filter: "blur(6px)", clipPath: "inset(0 0 0 100%)" }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  clipPath: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
                }}
                className="mt-6 rounded-2xl border border-white/10 p-5 md:p-6 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${accent}10, transparent 70%)`,
                }}
              >
                <motion.div
                  aria-hidden
                  initial={{ x: "-120%" }}
                  animate={{ x: "120%" }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                  className="absolute inset-y-0 w-1/3 pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}44, transparent)` }}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-[0.4em] font-bold"
                      style={{ color: accent }}
                    >
                      Melee
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl mt-1">{melee.name}</h3>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
                  <DamageStat value={melee.damage} color={accent} />
                  <StatBar label="Fire Rate" value={melee.fireRate} max={5} color={accent} />
                  <StatBar label="Range" value={melee.range} max={10} color={accent} unit="m" />
                  <MagazineStat value={melee.bullet} color={accent} infinite={melee.bullet === Infinity} label="Bullet" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Selector — primary weapons only */}
        <div
          className="relative grid border-t border-white/10"
          style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}
        >
          {list.map((w, i) => {
            const isActive = i === active;
            return (
              <button
                key={w.id}
                onClick={() => setActive(i)}
                className="group relative p-4 md:p-6 flex items-center justify-center gap-3 transition-all cursor-pointer"
                style={{
                  background: isActive ? `linear-gradient(180deg, ${accent}22, transparent)` : "transparent",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId={`wpn-active-${faction}`}
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
                  />
                )}
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-transform ${
                    isActive ? "scale-110" : "opacity-60 group-hover:opacity-100"
                  }`}
                >
                  <img
                    src={w.image}
                    alt={w.name}
                    className="max-w-full max-h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <span className={`text-xs uppercase tracking-widest font-bold hidden sm:inline ${isActive ? "weapon-selector-name-active text-white" : "weapon-selector-name-inactive text-white/50"}`}>
                  {w.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}