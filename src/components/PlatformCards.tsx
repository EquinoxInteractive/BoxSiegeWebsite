import { useState, type ComponentType, type SVGProps } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Download as DL, Lock } from "lucide-react";
import { DOWNLOAD } from "@/data/game";
import { sfx } from "@/lib/audio";
import { AppleIcon, LinuxIcon, WindowsIcon } from "./BrandIcons";
import { Reveal } from "./ui";

export type Platform = {
  id: string;
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent: string;
  /** shown on the card and in the system requirements */
  detail: string;
  /** file type of the download */
  file: string;
  /** download link, or `null` while that build is not released yet */
  url: string | null;
};

/**
 * ─── HOW "COMING SOON" WORKS ──────────────────────────────────────────────────
 *  - `url: null`      → the card shows a locked "Coming soon" button (click = little shake + sound).
 *  - `url: "https://…"` → the very same card becomes a normal, working download button.
 *
 *  EXAMPLE – when the macOS build is released, change ONLY its url line:
 *
 *      { id: "macos", name: "macOS", …, url: null }
 *                                          ↓
 *      { id: "macos", name: "macOS", …,
 *        url: "https://github.com/EquinoxInteractive/BoxSiege/releases/download/Game/BOX-SIEGE-macOS.zip" }
 *
 *  The badge, the button, the intro text and the system requirements all update by themselves.
 * ────────────────────────────────────────────────────────────────────────────── */
export const PLATFORMS: Platform[] = [
  {
    id: "windows", name: "Windows", icon: WindowsIcon, accent: "#4fd8ff",
    detail: "Windows 10 / 11 (64-bit)", file: ".zip",
    url: null, // released
  },
  {
    id: "macos", name: "macOS", icon: AppleIcon, accent: "#be5aff",
    detail: "macOS 12 or newer", file: ".zip",
    url: null, // coming soon  (when released: url: DOWNLOAD.macos)
  },
  {
    id: "linux", name: "Linux", icon: LinuxIcon, accent: "#ff9d2e",
    detail: "64-bit distro with glibc 2.31+", file: ".zip",
    url: null, // coming soon  (when released: url: DOWNLOAD.linux)
  },
];

const HATCH = "repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0 8px, transparent 8px 16px)";

function PlatformCard({ p, index }: { p: Platform; index: number }) {
  const Icon = p.icon;
  const soon = p.url === null;
  const [shake, setShake] = useState(0);
  const [hint, setHint] = useState(false);

  const poke = () => {
    sfx("gun_empty", 0.35);
    setShake((n) => n + 1);
    setHint(true);
    window.setTimeout(() => setHint(false), 2200);
  };

  return (
    <Reveal delay={index * 0.09} className="h-full">
      <div className="panel relative flex h-full flex-col overflow-hidden p-6 md:p-7" style={{ ["--accent" as string]: p.accent }}>
        {/* accent edge + glow */}
        <span className="absolute inset-x-0 top-0 h-1" style={{ background: p.accent, opacity: soon ? 0.35 : 1 }} />
        <span className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl" style={{ background: p.accent, opacity: soon ? 0.08 : 0.2 }} />

        <div className="relative flex items-start justify-between gap-3">
          <span
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl"
            style={{ background: p.accent, color: "#0b0b1c", opacity: soon ? 0.6 : 1, boxShadow: soon ? "none" : `0 10px 28px -10px ${p.accent}` }}
          >
            <Icon className="h-9 w-9" />
          </span>
          {soon ? (
            <span className="chip" style={{ color: "#ffd23f", borderColor: "#ffd23f55", background: "#ffd23f14" }}><Clock className="h-3.5 w-3.5" /> Coming soon</span>
          ) : (
            <span className="chip" style={{ color: "#4be3a0", borderColor: "#4be3a055", background: "#4be3a014" }}><Check className="h-3.5 w-3.5" /> Available</span>
          )}
        </div>

        <h3 className="relative mt-5 font-display text-5xl leading-none" style={{ textShadow: "0 4px 0 #000" }}>{p.name}</h3>
        <p className="relative mt-2 text-sm text-white/65">{p.detail}</p>

        <dl className="relative mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-black/30 px-3.5 py-2.5">
            <dt className="font-ui text-[11px] uppercase tracking-widest text-white/45">Format</dt>
            <dd className="mt-0.5 font-ui text-base">{p.file}</dd>
          </div>
          <div className="rounded-xl bg-black/30 px-3.5 py-2.5">
            <dt className="font-ui text-[11px] uppercase tracking-widest text-white/45">Price</dt>
            <dd className="mt-0.5 font-ui text-base">Free</dd>
          </div>
        </dl>

        <div className="relative mt-auto pt-6">
          {soon ? (
            <motion.div key={shake} animate={shake ? { x: [0, -9, 9, -6, 6, -3, 0] } : undefined} transition={{ duration: 0.45 }}>
              <button
                type="button"
                aria-disabled="true"
                onClick={poke}
                title={`${p.name} build is coming soon`}
                className="relative inline-flex w-full cursor-not-allowed items-center justify-center px-7 py-4 font-ui text-sm uppercase tracking-[0.08em] text-white/60 ring-2 ring-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                style={{ transform: "skewX(-10deg)", background: `${HATCH}, rgba(255,255,255,0.04)` }}
              >
                <span className="flex items-center gap-2.5" style={{ transform: "skewX(10deg)" }}><Lock className="h-4 w-4" /> Coming soon</span>
              </button>
            </motion.div>
          ) : (
            <a
              href={p.url!}
              onMouseEnter={() => sfx("ui_hover", 0.15)}
              onClick={() => sfx("won", 0.4)}
              className="skew-btn w-full !py-4"
              style={{ background: p.accent, boxShadow: `0 0 0 3px #0b0b1c, 0 0 0 5px ${p.accent}, 0 14px 30px -10px ${p.accent}99` }}
            >
              <span className="flex items-center gap-2.5"><DL className="h-5 w-5" /> Download for {p.name}</span>
            </a>
          )}
          <AnimatePresence>
            {soon && hint && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute inset-x-0 bottom-[-4px] translate-y-full text-center text-xs text-gold"
                role="status"
              >
                The {p.name} build isn’t out yet. Check back soon!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  );
}

/** The platform picker on the Download page: one card per operating system. */
export function PlatformCards() {
  const anySoon = PLATFORMS.some((p) => p.url === null);
  return (
    <div>
      <p className="mb-5 text-center font-ui text-sm uppercase tracking-[0.2em] text-white/55">Choose your platform</p>
      <ul className="grid gap-5 md:grid-cols-3">
        {PLATFORMS.map((p, i) => (
          <li key={p.id}><PlatformCard p={p} index={i} /></li>
        ))}
      </ul>
      {anySoon && <p className="mt-9 text-center text-sm text-white/50">Builds marked “Coming soon” are still in the works. They will unlock here as soon as they are released.</p>}
    </div>
  );
}