import { Link } from "react-router-dom";
import { LINKS } from "@/data/game";
import { PAGES } from "@/data/pages";
import { InstagramIcon, TikTokIcon, XIcon } from "./BrandIcons";

/** path segments from data/pages.ts */
const COLUMNS = [
  { title: "Play", paths: ["modes", "campaign", "rules", "controls"] },
  { title: "Collection", paths: ["fighters", "arsenal", "arenas", "power-ups", "shop"] },
];

const SOCIALS = [
  { label: "Instagram", href: LINKS.instagram, Icon: InstagramIcon },
  { label: "X", href: LINKS.x, Icon: XIcon },
  { label: "TikTok", href: LINKS.tiktok, Icon: TikTokIcon },
];

const byPath = (stem: string) => PAGES.find((p) => p.path === `/${stem}`)!;

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#080816]/80 px-5 pb-24 pt-12 backdrop-blur md:pb-10 md:pt-14">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" aria-label="BOX SIEGE home"><img src="/assets/ui/title.webp" alt="BOX SIEGE" className="px h-12 w-auto" /></Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">A chaotic local brawler for 2–4 players, plus a 250-level solo campaign. Free for Windows.</p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                title={label}
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition-all active:scale-95 active:text-gold hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="font-display text-2xl text-gold">{col.title}</p>
            <ul className="mt-2 grid gap-0.5 text-sm md:mt-3 md:gap-2">
              {col.paths.map((stem) => {
                const p = byPath(stem);
                return <li key={p.id}><Link to={p.path} className="block py-1.5 text-white/70 transition-colors hover:text-white active:text-gold md:py-0">{p.label}</Link></li>;
              })}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-2xl text-gold">Get the game</p>
          <ul className="mt-2 grid gap-2 text-sm md:mt-3">
            <li><Link to="/download" className="block py-1.5 text-white/70 transition-colors hover:text-white active:text-gold md:py-0">Download &amp; system requirements</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-[1400px] border-t border-white/10 pt-6 text-center text-sm text-white/45 md:mt-12">© {new Date().getFullYear()} Equinox Interactive · BOX SIEGE</p>
    </footer>
  );
}