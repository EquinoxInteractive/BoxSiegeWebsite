import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { Bug, Check, Download as DL, FlaskConical, Monitor } from "lucide-react";
import { BETA_WORD, DOWNLOAD, GAME_STATUS, IS_BETA, LINKS, STATUS_INFO } from "@/data/game";
import { sfx } from "@/lib/audio";
import { detectOS } from "@/lib/os";
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
  /** direct download link (see DOWNLOAD in data/game.ts) */
  url: string;
};

/**
 * ─── PLATFORMS ────────────────────────────────────────────────────────────────
 *  Semua platform sudah bisa di-download. Link ada di `DOWNLOAD` (src/data/game.ts).
 *  Status Beta / Released tidak diatur di sini, tapi lewat GAME_STATUS di src/data/game.ts.
 *
 *  Deteksi OS: `id` di bawah ("windows" | "macos" | "linux") harus sama dengan hasil detectOS()
 *  di src/lib/os.ts. Kartu milik OS pengunjung menyala, kartu lainnya diredupkan.
 * ────────────────────────────────────────────────────────────────────────────── */
export const PLATFORMS: Platform[] = [
  {
    id: "windows", name: "Windows", icon: WindowsIcon, accent: "#4fd8ff",
    detail: "Windows 10 / 11 (64-bit)", file: ".exe", url: DOWNLOAD.windows,
  },
  {
    id: "macos", name: "macOS", icon: AppleIcon, accent: "#be5aff",
    detail: "macOS 12 or newer", file: ".zip", url: DOWNLOAD.macos,
  },
  {
    id: "linux", name: "Linux", icon: LinuxIcon, accent: "#ff9d2e",
    detail: "64-bit distro with glibc 2.31+", file: ".x86_64", url: DOWNLOAD.linux,
  },
];

/** match = OS pengunjung · dim = OS lain (diredupkan) · normal = OS tidak terdeteksi, semua menyala */
type CardState = "match" | "dim" | "normal";

function PlatformCard({ p, index, state }: { p: Platform; index: number; state: CardState }) {
  const Icon = p.icon;
  const info = STATUS_INFO[GAME_STATUS];
  const dim = state === "dim";

  return (
    <Reveal delay={index * 0.09} className="h-full">
      <div
        className="panel relative flex h-full flex-col overflow-hidden p-5 sm:p-6 md:p-7"
        style={{
          ["--accent" as string]: p.accent,
          opacity: dim ? 0.38 : 1,
          filter: dim ? "grayscale(1)" : "none",
          transition: "opacity .35s ease, filter .35s ease",
          ...(state === "match" ? { borderColor: p.accent, boxShadow: `0 0 0 2px ${p.accent}, 0 18px 50px -18px ${p.accent}` } : {}),
        }}
      >
        {/* accent edge + glow */}
        <span className="absolute inset-x-0 top-0 h-1" style={{ background: p.accent }} />
        <span className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl" style={{ background: p.accent, opacity: 0.2 }} />

        <div className="relative flex items-start justify-between gap-3">
          <span
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl"
            style={{ background: p.accent, color: "#0b0b1c", boxShadow: `0 10px 28px -10px ${p.accent}` }}
          >
            <Icon className="h-9 w-9" />
          </span>
          <div className="flex flex-col items-end gap-2">
            {state === "match" && (
              <span className="chip" style={{ color: "#0b0b1c", borderColor: p.accent, background: p.accent }}><Monitor className="h-3.5 w-3.5" /> Your system</span>
            )}
            {IS_BETA ? (
              <span className="chip" style={{ color: info.color, borderColor: `${info.color}55`, background: `${info.color}14` }}><FlaskConical className="h-3.5 w-3.5" /> Beta</span>
            ) : (
              <span className="chip" style={{ color: "#4be3a0", borderColor: "#4be3a055", background: "#4be3a014" }}><Check className="h-3.5 w-3.5" /> Available</span>
            )}
          </div>
        </div>

        <h3 className="relative mt-4 font-display text-[2.6rem] leading-none sm:mt-5 sm:text-5xl" style={{ textShadow: "0 4px 0 #000" }}>{p.name}</h3>
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
          <a
            // kartu yang diredupkan tidak punya link, jadi tidak bisa diklik / di-tab
            href={dim ? undefined : p.url}
            aria-disabled={dim || undefined}
            tabIndex={dim ? -1 : undefined}
            onMouseEnter={dim ? undefined : () => sfx("ui_hover", 0.15)}
            onClick={dim ? (e) => e.preventDefault() : () => sfx("won", 0.4)}
            className={`skew-btn w-full !py-4${dim ? " pointer-events-none" : ""}`}
            style={{ background: p.accent, boxShadow: `0 0 0 3px #0b0b1c, 0 0 0 5px ${p.accent}, 0 14px 30px -10px ${p.accent}99` }}
          >
            <span className="flex items-center gap-2.5"><DL className="h-5 w-5" /> Download{BETA_WORD} for {p.name}</span>
          </a>
        </div>
      </div>
    </Reveal>
  );
}

/** The platform picker on the Download page: one card per operating system. */
export function PlatformCards() {
  // Hasil deteksi OS pengunjung. "other" (HP, tablet, ChromeOS, tidak dikenali) = semua kartu menyala.
  const [os] = useState(detectOS);
  const [showAll, setShowAll] = useState(false);

  const detected = PLATFORMS.find((p) => p.id === os);
  const filtered = !!detected && !showAll;

  const stateOf = (p: Platform): CardState => {
    if (!filtered) return "normal";
    return p.id === os ? "match" : "dim";
  };

  return (
    <div>
      <p className="mb-5 text-center font-ui text-sm uppercase tracking-[0.2em] text-white/55">
        {filtered ? `We detected ${detected?.name}` : "Choose your platform"}
      </p>
      <ul className="grid gap-5 md:grid-cols-3">
        {PLATFORMS.map((p, i) => (
          <li key={p.id}><PlatformCard p={p} index={i} state={stateOf(p)} /></li>
        ))}
      </ul>

      {/* Bukan OS yang dipakai? (mis. download untuk komputer lain) → nyalakan semua kartu */}
      {detected && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onMouseEnter={() => sfx("ui_hover", 0.15)}
            onClick={() => { sfx("ui_confirm", 0.35); setShowAll((v) => !v); }}
            className="font-ui text-sm uppercase tracking-widest text-white/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-gold active:text-gold"
          >
            {showAll ? `Show only ${detected.name}` : "Other system? Show all platforms"}
          </button>
        </div>
      )}

      {/* Report an issue: opens the GitHub Issues page (LINKS.issues in data/game.ts) */}
      <div className="mt-8 flex flex-col items-center gap-2 text-center">
        <a
          href={LINKS.issues}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => sfx("ui_hover", 0.15)}
          onClick={() => sfx("ui_confirm", 0.35)}
          className="skew-btn ghost"
        >
          <span className="flex items-center gap-2.5"><Bug className="h-5 w-5" /> Report an issue</span>
        </a>
        <p className="text-sm text-white/55">Found a bug{IS_BETA ? " in the beta" : ""}? Tell us on GitHub.</p>
      </div>
    </div>
  );
}