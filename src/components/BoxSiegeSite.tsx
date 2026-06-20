import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Gamepad2, Swords, Keyboard, Download, Volume2, ChevronDown, ArrowUp } from "lucide-react";
import { CharacterShowcase } from "./CharacterShowcase";
import { WeaponShowcase } from "./WeaponShowcase";
import { KeybindShowcase } from "./KeybindShowcase";
import { ThemeToggle, useInitTheme } from "./ThemeToggle";
import { MAPS, POWERUPS } from "@/data/content";

const NAV = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "characters", label: "Characters" },
  { id: "weapons", label: "Weapons" },
  { id: "maps", label: "Maps" },
  { id: "power-ups", label: "Power Ups" },
  { id: "download", label: "Download" },
];

const FEATURES = [
  { icon: Gamepad2, title: "Local Play", body: "You can play this game with your friends on one computer and it doesn't require internet. so you can play anywhere as long as you have a computer or laptop." },
  { icon: Swords, title: "Gameplay", body: "The game is based on 1v1 best of 3, and the time of each round can be set from 30 seconds to 5 minutes. Additional power up items are scattered around the map." },
  { icon: Keyboard, title: "Custom Keybinds", body: "You can change the buttons as you want, such as changing the fire, jump, left, right, and down buttons for player 1 and player 2." },
];

// ─── Scroll Lock Hook ────────────────────────────────────────────────────────
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (active) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [active]);
}

// ─── Audio ───────────────────────────────────────────────────────────────────
function AudioControl() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio("/assets/BGM/BGM 1.MP3");
    a.loop = true;
    a.volume = 0.4;
    audioRef.current = a;
    return () => { a.pause(); };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute background music" : "Play background music"}
      className="fixed top-20 right-4 md:top-5 md:right-5 z-[1100] w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/60 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
      style={{ boxShadow: "0 0 20px rgba(0, 241, 255, 0.4)" }}
    >
      <div className={`absolute inset-1 rounded-full bg-cover bg-center ${playing ? "spin-slow" : "opacity-70"}`}
           style={{ backgroundImage: "url(/assets/Fix.jpg)" }} />
      <div className="absolute inset-0 rounded-full flex items-center justify-center">
        {playing ? null : <Volume2 className="w-4 h-4 text-white relative z-10 drop-shadow" />}
      </div>
    </button>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  // Close menu then scroll — we defer the scroll so it runs after
  // the dropdown finishes collapsing (avoids overflow:hidden blocking it).
  const handleMobileNav = (id: string) => {
    setOpen(false);
    // Two rAFs: first lets React flush the state, second lets the
    // browser recalculate layout now that overflow is gone.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateActive = () => {
      const sections = NAV.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
      if (!sections.length) return;

      // Find the section whose top is closest to 40% down the viewport
      const threshold = window.innerHeight * 0.4;
      let closest: HTMLElement | null = null;
      let closestDist = Infinity;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        // Only consider sections that have entered the viewport from the top
        if (rect.top <= threshold) {
          const dist = Math.abs(rect.top - threshold);
          if (dist < closestDist) {
            closestDist = dist;
            closest = section;
          }
        }
      }

      if (closest) setActive(closest.id);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-[1000] transition-all ${scrolled ? "bg-black/90 backdrop-blur border-b border-white/10" : "bg-gradient-to-b from-black/70 to-transparent"}`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        <a href="#home" className="font-display text-xl md:text-3xl text-gradient">BOX SIEGE</a>
        <ul className="hidden md:flex gap-7 text-sm uppercase tracking-widest font-semibold">
          {NAV.map(n => {
            const isActive = active === n.id;
            return (
              <li key={n.id}>
                <a href={`#${n.id}`} className={`relative transition-colors group ${isActive ? "text-[#00f1ff]" : "text-white/80 hover:text-[#00f1ff]"}`}>
                  {n.label}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-brand transition-all ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </a>
              </li>
            );
          })}
        </ul>
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle variant="inline" />
          <button
            className="relative w-10 h-10 flex items-center justify-center text-white rounded-md border border-white/15 bg-black/40 hover:border-[#00f1ff]/60 transition-colors cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block w-6 h-4">
              <motion.span
                className="themed-bar absolute left-0 right-0 h-0.5 bg-white origin-center"
                animate={open ? { top: "50%", y: "-50%", rotate: 45 } : { top: 0, y: 0, rotate: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="themed-bar absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white"
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="themed-bar absolute left-0 right-0 h-0.5 bg-white origin-center"
                animate={open ? { bottom: "50%", y: "50%", rotate: -45 } : { bottom: 0, y: 0, rotate: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </span>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-black/95 border-t border-white/10"
          >
            {NAV.map(n => (
              <li key={n.id} className="border-b border-white/5">
                <button
                  onClick={() => handleMobileNav(n.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 uppercase tracking-widest text-sm transition-colors cursor-pointer text-left ${active === n.id ? "text-[#00f1ff] bg-white/5" : "text-white/80"}`}
                >
                  <span className={`h-4 w-[3px] rounded-full transition-all ${active === n.id ? "bg-gradient-brand opacity-100" : "opacity-0"}`} />
                  {n.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover brightness-[0.4]">
        <source src="/assets/VIDS/BG.mp4" type="video/mp4" />
      </video>
      <div className="themed-hero-overlay absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
      <div className="absolute inset-0 scanline-overlay opacity-40" />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="uppercase tracking-[0.6em] text-xs md:text-sm text-[#00f1ff]"
        >
          A PVP CO-OP 2D
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-7xl md:text-[10rem] leading-none mt-4 text-gradient animate-glow"
        >
          BOX SIEGE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-4 text-lg md:text-2xl text-white/80"
        >
          Go fight with your friends
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="mt-10 flex justify-center gap-4 flex-wrap"
        >
          <a href="#download"
             className="shimmer relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-brand font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform glow-brand">
            <Download className="w-4 h-4" /> Download Game
          </a>
          <a href="#characters"
             className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 hover:border-[#00f1ff] hover:text-[#00f1ff] font-bold uppercase tracking-widest text-sm transition-colors">
            Meet the Roster
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </section>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ id, title, kicker, children }: { id?: string; title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {kicker && <p className="uppercase tracking-[0.5em] text-xs text-[#00f1ff] mb-3">{kicker}</p>}
          <h2 className="font-display text-5xl md:text-7xl text-gradient">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  return (
    <Section id="features" title="Game Features">
      <div className="grid md:grid-cols-3 gap-6">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-[#00f1ff]/50 transition-colors"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff0000]/10 to-[#00f1ff]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-brand flex items-center justify-center mb-6">
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-2xl mb-3 text-white">{f.title}</h3>
              <p className="text-white/70 leading-relaxed">{f.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <KeybindShowcase />
      </motion.div>
    </Section>
  );
}

// ─── Characters ───────────────────────────────────────────────────────────────
function Characters() {
  return (
    <section id="characters" className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 noise opacity-50" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-7xl text-gradient">Game Characters</h2>
        </motion.div>
        <CharacterShowcase />
      </div>
    </section>
  );
}

// ─── Weapons ──────────────────────────────────────────────────────────────────
function Weapons() {
  return (
    <section id="weapons" className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 noise opacity-50" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-3">Arsenal</p>
          <h2 className="font-display text-5xl md:text-7xl text-gradient">Game Weapons</h2>
        </motion.div>
        <WeaponShowcase />
      </div>
    </section>
  );
}


function Maps() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  useScrollLock(open);
  const map = MAPS[active];
  const accent = map.accent;

  return (
    <Section id="maps" title="Game Maps">
      <div
        className="themed-panel relative overflow-hidden rounded-3xl border border-white/10"
        style={{
          background: `radial-gradient(circle at 75% 30%, ${accent}22 0%, transparent 60%), linear-gradient(180deg, #060606 0%, #0a0a0a 100%)`,
        }}
      >
        {/* Background callsign */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[18rem] md:text-[22rem] leading-none opacity-[0.05] select-none uppercase tracking-tighter"
          style={{ color: accent }}
        >
          {map.name.split(" ")[1] ?? map.name}
        </div>
        <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />

        <div className="relative grid md:grid-cols-2 gap-6 p-6 md:p-12 min-h-[480px]">
          {/* Left: info */}
          <div className="flex flex-col justify-center order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={map.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold" style={{ color: accent }}>
                  Stage 0{active + 1} · of 0{MAPS.length}
                </p>
                <h3 className="font-display text-5xl md:text-7xl mt-2 leading-none">
                  {map.name}
                </h3>

                <div className="mt-7 grid grid-cols-2 gap-3 max-w-md">
                  {[
                    { k: "Place", v: map.biome },
                  ].map((t) => (
                    <div
                      key={t.k}
                      className="rounded-xl border border-white/10 p-3"
                      style={{ background: `linear-gradient(135deg, ${accent}1f, transparent 70%)` }}
                    >
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">{t.k}</p>
                      <p className="font-display text-lg mt-1">{t.v}</p>
                    </div>
                  ))}
                </div>

                {map.notices && map.notices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="mt-5"
                  >
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">Notices</p>
                    <ul className="space-y-1.5">
                      {map.notices.map((notice, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-white/80">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
                          {notice}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: floating map art + mini chip */}
          <div className="relative flex items-center justify-center order-1 md:order-2 min-h-[280px]">
            <div
              aria-hidden
              className="absolute w-[320px] h-[320px] rounded-full border border-dashed spin-slow opacity-25"
              style={{ borderColor: accent }}
            />
            <div
              aria-hidden
              className="absolute w-[220px] h-[220px] rounded-full border opacity-20"
              style={{ borderColor: accent }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={map.id}
                initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 6 }}
                transition={{ type: "spring", damping: 18, stiffness: 170 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
                  style={{
                    width: 280,
                    height: 200,
                    boxShadow: `0 30px 60px -20px ${accent}55, 0 0 40px ${accent}33`,
                  }}
                >
                  <img
                    src={map.full}
                    alt={map.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                    draggable={false}
                  />
                  {/* Corner brackets */}
                  {[
                    "top-2 left-2 border-l-2 border-t-2",
                    "top-2 right-2 border-r-2 border-t-2",
                    "bottom-2 left-2 border-l-2 border-b-2",
                    "bottom-2 right-2 border-r-2 border-b-2",
                  ].map((c) => (
                    <div key={c} className={`absolute w-4 h-4 ${c}`} style={{ borderColor: accent }} />
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Mini preview chip with expand */}
            <AnimatePresence mode="wait">
              <motion.button
                key={`c-${map.id}`}
                onClick={() => setOpen(true)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-2 right-2 w-40 md:w-52 rounded-xl overflow-hidden border border-white/15 bg-black/70 backdrop-blur shadow-2xl text-left cursor-pointer hover:border-white/40 transition-colors"
              >
                <img
                  src={map.thumb}
                  alt={map.name}
                  className="w-full aspect-video object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="px-2 py-1 text-[9px] uppercase tracking-[0.3em] text-white/70 flex items-center justify-between gap-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                    Tap to expand
                  </span>
                  <span style={{ color: accent }}>⤢</span>
                </div>
              </motion.button>
            </AnimatePresence>
          </div>
        </div>

        {/* Selector */}
        <div
          className="relative grid border-t border-white/10"
          style={{ gridTemplateColumns: `repeat(${MAPS.length}, minmax(0, 1fr))` }}
        >
          {MAPS.map((m, i) => {
            const isActive = i === active;
            return (
              <button
                key={m.id}
                onClick={() => setActive(i)}
                className="group relative p-4 md:p-5 flex items-center justify-center gap-3 cursor-pointer transition-all"
                style={{
                  background: isActive ? `linear-gradient(180deg, ${m.accent}22, transparent)` : "transparent",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="map-active"
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: m.accent, boxShadow: `0 0 12px ${m.accent}` }}
                  />
                )}
                <div
                  className={`w-14 h-10 md:w-16 md:h-11 rounded-md overflow-hidden border transition-all ${
                    isActive ? "border-white/30 scale-105" : "border-white/10 opacity-60 group-hover:opacity-100"
                  }`}
                >
                  <img
                    src={m.thumb}
                    alt={m.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <span className={`text-xs uppercase tracking-widest font-bold hidden sm:inline ${isActive ? "text-white" : "text-white/50"}`}>
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur flex items-center justify-center p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="relative max-w-5xl w-full rounded-2xl overflow-hidden border border-white/10 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(false)} className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/70 border border-white/20 hover:bg-[#ff0000] transition-colors cursor-pointer">×</button>
              <div className="p-4 md:p-6">
                <p className="uppercase tracking-widest text-xs" style={{ color: accent }}>Map In Game</p>
                <h3 className="font-display text-4xl mb-4">{map.name}</h3>
                <img src={map.full} alt={map.name} className="w-full rounded-lg" style={{ imageRendering: "pixelated" }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

// ─── Power-Ups ────────────────────────────────────────────────────────────────
function PowerUps() {
  const [active, setActive] = useState(0);
  const item = POWERUPS[active];
  const accent = item.accent;

  return (
    <Section id="power-ups" title="Power-Ups">
      <div
        className="themed-panel relative overflow-hidden rounded-3xl border border-white/10"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${accent}22 0%, transparent 60%), linear-gradient(180deg, #060606 0%, #0a0a0a 100%)`,
        }}
      >
        {/* Background callsign */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[18rem] md:text-[24rem] leading-none opacity-[0.05] select-none uppercase tracking-tighter"
          style={{ color: accent }}
        >
          {item.title.split(" ")[0]}
        </div>

        <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />

        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-6 p-6 md:p-10 min-h-[540px]">
          {/* Left column: preview + mobile icon */}
          <div className="flex flex-col gap-4">
            {/* Mobile: separated power-up icon above video */}
            <div className="md:hidden flex items-center justify-center gap-4 rounded-2xl border border-white/10 p-4"
              style={{ background: `radial-gradient(circle at 50% 50%, ${accent}22, transparent 70%)` }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={`ic-mobile-${item.id}`}
                  src={item.img}
                  alt={item.title}
                  initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotate: 15 }}
                  transition={{ type: "spring", damping: 16, stiffness: 170 }}
                  className="w-20 h-20 object-contain"
                  style={{
                    imageRendering: "pixelated",
                    filter: `drop-shadow(0 0 18px ${accent}cc) drop-shadow(0 8px 14px rgba(0,0,0,0.6))`,
                  }}
                  draggable={false}
                />
              </AnimatePresence>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold" style={{ color: accent }}>
                  Power-Up
                </p>
                <p className="font-display text-xl mt-0.5">{item.title}</p>
              </div>
            </div>

            {/* Video preview */}
            <div className="relative aspect-video md:aspect-auto md:h-full w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
              <AnimatePresence mode="wait">
                <motion.video
                  key={item.id}
                  src={item.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  initial={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-contain md:object-cover"
                />
              </AnimatePresence>

              {/* Corner brackets */}
              {[
                "top-3 left-3 border-l-2 border-t-2",
                "top-3 right-3 border-r-2 border-t-2",
                "bottom-3 left-3 border-l-2 border-b-2",
                "bottom-3 right-3 border-r-2 border-b-2",
              ].map((c) => (
                <div key={c} className={`absolute w-6 h-6 ${c}`} style={{ borderColor: accent }} />
              ))}

              {/* Desktop floating power-up icon overlay */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={`ic-${item.id}`}
                  src={item.img}
                  alt={item.title}
                  initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotate: 15 }}
                  transition={{ type: "spring", damping: 16, stiffness: 170 }}
                  className="hidden md:block absolute top-4 right-4 w-16 h-16 md:w-20 md:h-20 object-contain"
                  style={{
                    imageRendering: "pixelated",
                    filter: `drop-shadow(0 0 18px ${accent}cc) drop-shadow(0 8px 14px rgba(0,0,0,0.6))`,
                  }}
                  draggable={false}
                />
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] flex items-center gap-2" style={{ color: accent }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                    Live Preview
                  </p>
                  <p className="text-white/70 text-sm">In-game power-up demonstration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: info */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.4em] font-bold"
                  style={{ color: accent }}
                >
                  Power-Up · 0{active + 1} of 0{POWERUPS.length}
                </p>
                <h3 className="font-display text-5xl md:text-6xl mt-2 leading-none">
                  {item.title}
                </h3>

                <p className="text-white/70 mt-5 leading-relaxed max-w-md">{item.desc}</p>

                <div className="mt-7 grid grid-cols-2 gap-3 max-w-md">
                  {[
                    { k: "Duration", v: item.duration },
                    { k: "Effect", v: item.effect },
                  ].map((t) => (
                    <div
                      key={t.k}
                      className="rounded-xl border border-white/10 p-3"
                      style={{ background: `linear-gradient(135deg, ${accent}14, transparent 70%)` }}
                    >
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">{t.k}</p>
                      <p className="font-display text-lg mt-1">{t.v}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Selector */}
        <div
          className="relative grid border-t border-white/10"
          style={{ gridTemplateColumns: `repeat(${POWERUPS.length}, minmax(0, 1fr))` }}
        >
          {POWERUPS.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className="group relative p-3 md:p-4 cursor-pointer transition-all"
                style={{
                  background: isActive ? `linear-gradient(180deg, ${p.accent}22, transparent)` : "transparent",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="powerup-active"
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: p.accent, boxShadow: `0 0 12px ${p.accent}` }}
                  />
                )}
                <div className={`relative w-full aspect-video rounded-md overflow-hidden border flex items-center justify-center ${isActive ? "border-white/30" : "border-white/10 opacity-60 group-hover:opacity-100"} transition-all`}
                  style={{ background: `radial-gradient(circle at 50% 50%, ${p.accent}22, transparent 70%)` }}
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    className="max-w-[60%] max-h-[80%] object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <p className={`mt-2 text-[11px] uppercase tracking-widest font-bold ${isActive ? "text-white" : "text-white/50"}`}>
                  {p.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ─── Download ─────────────────────────────────────────────────────────────────
function DownloadSection() {
  return (
    <Section id="download" title="Download Game">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        >
          <h3 className="font-display text-4xl mb-4">Download BOX SIEGE</h3>
          <p className="text-white/70 mb-6 leading-relaxed">
            Immerse yourself in the ultimate PvP co-op 2D experience with Box Siege, exclusively available for Windows PC.
          </p>
          <h4 className="font-display text-xl text-[#00f1ff] mb-3">Minimum Requirements</h4>
          <ul className="space-y-2 mb-8 text-white/80">
            {[
              "OS: Windows 10/11 (64-bit)",
              "Processor: Dual Core 2GHz",
              "Memory: 6 GB RAM",
              "Graphics: 512 MB VRAM",
              "Storage: 500 MB available space",
            ].map(r => (
              <li key={r} className="flex gap-3"><span className="text-[#ff0000]">▸</span>{r}</li>
            ))}
          </ul>
          <a href="assets/GAME/BoxSiege.zip" download
             className="shimmer relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-brand font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform glow-brand">
            <Download className="w-5 h-5" />
            <div className="text-left leading-tight">
              <div>Download for Windows</div>
              <div className="text-[10px] opacity-80 font-normal normal-case tracking-normal">Beta Version</div>
            </div>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-white/10 glow-brand"
        >
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/assets/VIDS/SC.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Social Icons ─────────────────────────────────────────────────────────────
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12 px-6 bg-black">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-display text-3xl text-gradient mb-6">EQUINOX INTERACTIVE</p>
        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          <a href="https://www.tiktok.com/@equinox.interactive" target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-2 text-white/70 hover:text-[#00f1ff] transition-colors">
            <TikTokIcon className="w-4 h-4" /> TikTok
          </a>
          <a href="https://www.instagram.com/equinox.interactive/" target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-2 text-white/70 hover:text-[#00f1ff] transition-colors">
            <InstagramIcon className="w-4 h-4" /> Instagram
          </a>
          <a href="https://x.com/EquinoxIntratve" target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-2 text-white/70 hover:text-[#00f1ff] transition-colors">
            <XIcon className="w-4 h-4" /> X
          </a>
        </div>
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} Equinox Interactive. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── Back To Top ──────────────────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight - 600;
      setVisible(scrolled >= threshold && window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 cursor-pointer rounded-full p-3 md:p-4 bg-gradient-brand text-black shadow-lg glow-brand hover:scale-110 transition-transform"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function BoxSiegeSite() {
  useInitTheme();
  return (
    <div className="relative min-h-screen bg-black text-white">
      <AudioControl />
      <ThemeToggle variant="fixed" />
      <Header />
      <main>
        <Hero />
        <Features />
        <Characters />
        <Weapons />
        <Maps />
        <PowerUps />
        <DownloadSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}