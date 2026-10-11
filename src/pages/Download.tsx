import { Fragment } from "react";
import { Link } from "react-router-dom";
import { FileArchive, FolderOpen, Gamepad2, Monitor } from "lucide-react";
import { PAGES } from "@/data/pages";
import { Page } from "@/components/Page";
import { StatusBadge } from "@/components/StatusBadge";
import { VideoPreview } from "@/components/Trailer";
import { PLATFORMS, PlatformCards } from "@/components/PlatformCards";
import { Reveal } from "@/components/ui";
import { sfx } from "@/lib/audio";

const STEPS = [
  { icon: FileArchive, title: "Download the game", text: "One free file for your platform." },
  { icon: FolderOpen, title: "Unpack it", text: "Extract it into a folder." },
  { icon: Gamepad2, title: "Plug in and brawl", text: "Plug in a few controllers or share one keyboard, then start a match." },
];

export default function Download() {
  const live = PLATFORMS.filter((p) => p.url !== null).map((p) => p.name);
  const soon = PLATFORMS.filter((p) => p.url === null).map((p) => p.name);
  const intro = `Free for ${live.length ? live.join(" and ") : "everyone"}${soon.length ? `, with ${soon.join(" and ")} coming soon` : ""}. Download, unpack, plug in a few controllers and start brawling.`;
  const inside = PAGES.filter((p) => ["fighters", "arsenal", "arenas", "powerups", "campaign", "shop"].includes(p.id));
  return (
    <Page id="download" title="Download" intro={intro}>
      <PlatformCards />

      <Reveal className="mx-auto mt-14 max-w-4xl text-center sm:mt-20">
        <div className="flex justify-center"><StatusBadge /></div>
        <h2 className="mt-4 font-display text-[2.2rem] leading-none sm:text-4xl md:text-6xl">Watch before you download</h2>
        <p className="mt-2 text-white/65">A short look at the gameplay you are about to get.</p>
        <VideoPreview className="mt-6 sm:mt-8" />
      </Reveal>

      <div className="mt-14 grid gap-5 sm:mt-20 sm:gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Reveal className="panel p-5 sm:p-7 md:p-9">
          <h2 className="font-display text-4xl md:text-5xl">How to install</h2>
          <ol className="mt-6 grid gap-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="flex items-center gap-4 rounded-xl bg-black/30 p-3 sm:gap-5 sm:p-4">
                  <span className="grid h-12 w-12 shrink-0 sm:h-14 sm:w-14 place-items-center rounded-xl bg-gold font-digital text-3xl text-ink">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-ui text-xl"><Icon className="h-5 w-5 text-gold" />{s.title}</p>
                    <p className="mt-0.5 text-sm text-white/65">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>

        <Reveal delay={0.08} className="panel p-5 sm:p-7 md:p-9">
          <h2 className="flex items-center gap-3 font-display text-4xl md:text-5xl"><Monitor className="h-7 w-7 text-gold" />System requirements</h2>
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-[15px] sm:gap-x-8 sm:text-base">
            {PLATFORMS.map((p) => (
              <Fragment key={p.id}>
                <dt className="text-white/50">{p.name}</dt>
                <dd>{p.detail}{p.url === null && <span className="ml-2 text-xs text-gold">coming soon</span>}</dd>
              </Fragment>
            ))}
            <dt className="text-white/50">Memory</dt><dd>6 GB RAM recommended</dd>
            <dt className="text-white/50">Players</dt><dd>1 (campaign) · 2-4 (local versus)</dd>
            <dt className="text-white/50">Input</dt><dd>Keyboard and / or gamepads</dd>
          </dl>
        </Reveal>
      </div>

      <Reveal className="mt-14 sm:mt-20">
        <h2 className="font-display text-4xl md:text-6xl">Still deciding?</h2>
        <p className="mt-2 text-white/65">Look around before you download.</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inside.map((p) => {
            const Icon = p.icon;
            return (
              <li key={p.id}>
                <Link to={p.path} onClick={() => sfx("ui_confirm", 0.35)} className="panel group flex items-center gap-4 p-3.5 transition-colors active:border-[var(--accent)] hover:border-[var(--accent)] sm:p-4" style={{ ["--accent" as string]: p.accent }}>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: p.accent, color: "#0b0b1c" }}><Icon className="h-6 w-6" /></span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[1.6rem] leading-none sm:text-3xl">{p.count} {p.countLabel}</span>
                    <span className="mt-1 block truncate text-sm text-white/60">{p.label}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Page>
  );
}