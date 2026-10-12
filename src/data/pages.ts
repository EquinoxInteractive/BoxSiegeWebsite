import { Crosshair, Download, Gamepad2, Gavel, House, Map as MapIcon, ShoppingBag, Swords, Trophy, Users, Zap, type LucideIcon } from "lucide-react";

export type PageDef = {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  /** one-line teaser used on the home grid, nav menu and prev/next tiles */
  blurb: string;
  /** big number + caption shown on the home grid */
  count: string;
  countLabel: string;
  /** arena id whose backdrop dresses this page */
  stage: string;
  /** short facts shown under the page title */
  facts: string[];
  /** <meta name="description"> */
  desc: string;
};

export const HOME: PageDef = {
  id: "home",
  path: "/",
  label: "Home",
  icon: House,
  accent: "#ffd23f",
  blurb: "Back to the start",
  count: "",
  countLabel: "",
  stage: "earth",
  facts: [],
  desc: "BOX SIEGE: a chaotic local PvP brawler for 2–4 players plus a 250-level solo campaign. 24 fighters, 10 arenas, 9 power-ups, 250 levels, 50 bosses, a full shop. Free for Windows, macOS and Linux.",
};

export const PAGES: PageDef[] = [
  {
    id: "modes", path: "/modes", label: "Modes", icon: Swords, accent: "#ff4040",
    blurb: "Versus, team battles, campaign and how a match flows.",
    count: "4", countLabel: "ways to play", stage: "temple",
    facts: ["Solo campaign", "2–4 players on one screen", "No internet needed"],
    desc: "Every way to play BOX SIEGE: local Versus, Team Battles, the 250-level Campaign and the Shop, plus how a match flows from menu to fight.",
  },
  {
    id: "fighters", path: "/fighters", label: "Fighters", icon: Users, accent: "#4fd8ff",
    blurb: "24 boxes with their own faces, voices and skins.",
    count: "24", countLabel: "fighters", stage: "snow",
    facts: ["16 originals + 8 new faces", "240 character skins", "Every fighter has a voice line"],
    desc: "Meet all 24 BOX SIEGE fighters. Preview skins, KO poses and voice lines for every box.",
  },
  {
    id: "arsenal", path: "/arsenal", label: "Arsenal", icon: Crosshair, accent: "#ff9d2e",
    blurb: "Four main weapons, a pistol and a knife. Test-fire them.",
    count: "6", countLabel: "weapons", stage: "desert",
    facts: ["4 main weapons", "Pistol backup and a knife for everyone", "30 weapon skins"],
    desc: "Every BOX SIEGE weapon with live stats, test firing and weapon skins.",
  },
  {
    id: "arenas", path: "/arenas", label: "Arenas", icon: MapIcon, accent: "#4be3a0",
    blurb: "Ten mirrored stages with traps, lifts and portals.",
    count: "10", countLabel: "arenas", stage: "jungle",
    facts: ["Perfectly mirrored layouts", "Hazards on most maps", "3 brand-new arenas"],
    desc: "All 10 BOX SIEGE arenas with their hazards, fall zones and object density settings.",
  },
  {
    id: "powerups", path: "/power-ups", label: "Power-Ups", icon: Zap, accent: "#be5aff",
    blurb: "Nine crates that can turn a fight around in seconds.",
    count: "9", countLabel: "power-ups", stage: "space",
    facts: ["7 in Versus", "2 only in the Campaign", "Spawn rate is yours to set"],
    desc: "All 9 BOX SIEGE power-ups, how long they last and how to control crate spawns.",
  },
  {
    id: "campaign", path: "/campaign", label: "Campaign", icon: Trophy, accent: "#ff8a3a",
    blurb: "250 levels, 50 bosses and a perk after every win.",
    count: "250", countLabel: "levels", stage: "hell",
    facts: ["5 chapters, 10 worlds", "50 bosses", "12 perks to stack"],
    desc: "The solo BOX SIEGE Campaign: chapters, bosses, enemies, perks and scoring.",
  },
  {
    id: "rules", path: "/rules", label: "Match Rules", icon: Gavel, accent: "#ffd23f",
    blurb: "Rounds, timers and team handicaps, set your way.",
    count: "1–5", countLabel: "rounds to win", stage: "factory",
    facts: ["Timer from 30 s to unlimited", "Team lanes with fair-play handicap", "3 hearts per fighter"],
    desc: "How BOX SIEGE Versus matches work: rounds, timer, team lanes, handicaps and tie-breakers.",
  },
  {
    id: "shop", path: "/shop", label: "Shop", icon: ShoppingBag, accent: "#be5aff",
    blurb: "301 cosmetic items. Never pay-to-win.",
    count: "301", countLabel: "items", stage: "ocean",
    facts: ["4 rarities, Common to Legendary", "Earn coins in the Campaign", "Cosmetic only"],
    desc: "The BOX SIEGE shop and inventory: 240 fighter skins, 30 weapon skins and 31 accessories.",
  },
  {
    id: "controls", path: "/controls", label: "Controls", icon: Gamepad2, accent: "#4fd8ff",
    blurb: "Four players on one keyboard, or plug in controllers.",
    count: "4", countLabel: "players, one keyboard", stage: "earth",
    facts: ["Fully rebindable", "Controller hot-plug", "PlayStation and Xbox glyphs"],
    desc: "BOX SIEGE keyboard layouts for four players, controller mapping and settings.",
  },
  {
    id: "download", path: "/download", label: "Download", icon: Download, accent: "#ffd23f",
    blurb: "Free for Windows, macOS and Linux.",
    count: "Free", countLabel: "on 3 platforms", stage: "safari",
    facts: ["Windows, macOS and Linux", "Keyboard and / or gamepads", "6 GB RAM recommended"],
    desc: "Download BOX SIEGE for Windows, macOS and Linux, free. System requirements and install steps.",
  },
];

/** Pages shown as links in the header (Download has its own button). */
export const NAV_PAGES = PAGES.filter((p) => p.id !== "download");

export const pageById = (id: string): PageDef => {
  const p = PAGES.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown page id: ${id}`);
  return p;
};

/** Reading order used by the prev / next tiles. */
export const SEQUENCE: PageDef[] = [HOME, ...PAGES];