import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useTransform, type Variants } from "framer-motion";
import { RARITY, type Rarity } from "@/data/game";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, y = 28, className = "", once = true }: { children: ReactNode; delay?: number; y?: number; className?: string; once?: boolean }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
export const popIn: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

/** Counts up to `to` once visible. */
export function Counter({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString("en-US"));
  useEffect(() => {
    if (inView) {
      const c = animate(mv, to, { duration: 1.6, ease: EASE });
      return () => c.stop();
    }
  }, [inView, to, mv]);
  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function StatBar({ label, value, display, color, delay = 0 }: { label: string; value: number; display: string; color: string; delay?: number }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] uppercase tracking-widest font-ui text-white/60 mb-1.5">
        <span>{label}</span>
        <span className="text-white">{display}</span>
      </div>
      <div className="bar-track">
        <motion.div
          className="bar-fill"
          style={{ background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 60%, white))`, boxShadow: `0 0 12px ${color}88` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: Math.max(0.03, Math.min(1, value)) }}
          transition={{ duration: 0.8, delay, ease: EASE }}
        />
      </div>
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, id, accent = "#ffd23f", className = "" }: {
  tabs: { id: T; label: string; badge?: string }[]; value: T; onChange: (v: T) => void; id: string; accent?: string; className?: string;
}) {
  return (
    <div className={`inline-flex flex-wrap justify-center gap-1.5 rounded-2xl bg-black/40 p-1.5 border border-white/10 ${className}`} role="tablist">
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            className="relative px-4 py-2.5 rounded-xl font-ui text-xs md:text-sm uppercase tracking-wider cursor-pointer transition-colors"
            style={{ color: on ? "#0b0b1c" : "rgba(255,255,255,0.7)" }}
          >
            {on && (
              <motion.span
                layoutId={`tab-${id}`}
                className="absolute inset-0 rounded-xl"
                style={{ background: accent, boxShadow: `0 6px 20px -6px ${accent}` }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {t.label}
              {t.badge && <span className="text-[10px] opacity-70">{t.badge}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function RarityTag({ r }: { r: Rarity }) {
  const c = RARITY[r];
  return (
    <span className="chip" style={{ color: c.color, borderColor: `${c.color}55`, background: `${c.color}14` }}>
      {c.label}
    </span>
  );
}

export function Coin({ className = "w-4 h-4" }: { className?: string }) {
  return <img src="/assets/ui/coin.webp" alt="" className={`px inline-block ${className}`} draggable={false} />;
}

export function Heart({ className = "w-5 h-5", dim = false }: { className?: string; dim?: boolean }) {
  return <img src="/assets/ui/heart.webp" alt="" className={`px inline-block ${className}`} style={{ opacity: dim ? 0.2 : 1, filter: dim ? "grayscale(1)" : undefined }} draggable={false} />;
}

/** Fighter portrait with optional accessories overlay (geometry matches the game's Cosmetics.draw_accessories). */
export function FighterFace({ src, size = 180, accessories = [], eyeY = 60, className = "" }: {
  src: string; size?: number; accessories?: { img: string; slot: string; layer: string }[]; eyeY?: number; className?: string;
}) {
  const k = size / 180;
  const layer = (back: boolean) =>
    accessories
      .filter((a) => (a.layer === "back") === back)
      .map((a) => (
        <img
          key={a.img}
          src={a.img}
          alt=""
          draggable={false}
          className="px absolute pointer-events-none max-w-none"
          style={{ width: 340 * k, height: 340 * k, left: -80 * k, top: -80 * k + (a.slot === "face" ? (eyeY - 60) * k : 0) }}
        />
      ));
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {layer(true)}
      <img src={src} alt="" draggable={false} className="px relative block w-full h-full" />
      {layer(false)}
    </div>
  );
}

export function useKeyDown(handler: (e: KeyboardEvent, down: boolean) => void) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const d = (e: KeyboardEvent) => ref.current(e, true);
    const u = (e: KeyboardEvent) => ref.current(e, false);
    window.addEventListener("keydown", d);
    window.addEventListener("keyup", u);
    return () => { window.removeEventListener("keydown", d); window.removeEventListener("keyup", u); };
  }, []);
}

export function useMedia(query: string) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const f = () => setM(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [query]);
  return m;
}
