import { RAW } from "./generated";

export const A = "/assets";

// ───────────────────────────── shared ─────────────────────────────
export const PLAYER_COLORS = ["#ff3b3b", "#3b9bff", "#a855f7", "#ff8a1f"] as const;
export const PLAYER_NAMES = ["PLAYER 1", "PLAYER 2", "PLAYER 3", "PLAYER 4"] as const;
export const MAX_HP = 3;

export const RARITY = {
  common: { label: "Common", color: "#c8cddc" },
  rare: { label: "Rare", color: "#46a0ff" },
  epic: { label: "Epic", color: "#be5aff" },
  legendary: { label: "Legendary", color: "#ffcd3c" },
} as const;
export type Rarity = keyof typeof RARITY;

// ───────────────────────────── characters ─────────────────────────────
const NAMES: Record<string, string> = {
  angry: "Angry", melow: "Melow", bandel: "Bandel", ninja: "Ninja",
  calm: "Calm", baik: "Baik", silat: "Silat", mime: "Mime",
  spiderweaver: "Spider Weaver", blind: "Blind", joker: "Joker", drunk: "Drunk",
  "bald-man": "Bald Man", savior: "Savior", spiderblack: "Spider Black", deadswim: "Deadswim",
  robot: "Robot", zombie: "Zombie", pirate: "Pirate", pocong: "Pocong",
  vampire: "Vampire", cyclops: "Cyclops", pumpkin: "Pumpkin", alien: "Alien",
};

export type Character = {
  index: number;
  id: string;
  name: string;
  color: string;
  isNew: boolean;
  eyeY: number;
  img: string;
  die: string;
  voice: string;
};

export const CHARACTERS: Character[] = RAW.characters.map((c, i) => ({
  index: i,
  id: c.id,
  name: NAMES[c.id] ?? c.id,
  color: (c as unknown as { color: string }).color,
  isNew: i >= 16,
  eyeY: RAW.eyeY[i],
  img: `${A}/chars/${c.id}.webp`,
  die: `${A}/chars/${c.id}_die.webp`,
  voice: `${A}/sfx/voice/${c.id}.mp3`,
}));

export const charSkinImg = (charId: string, skinId: string) => `${A}/skins/${charId}/${skinId}.webp`;

// ───────────────────────────── weapons ─────────────────────────────
export type WeaponId = "smith" | "kurval" | "flamer" | "scream" | "pistol" | "knife";
export type Weapon = {
  id: WeaponId;
  name: string;
  kind: "gun" | "melee";
  selectable: boolean;
  damage: number;
  ammo: number; // -1 = unlimited
  cooldown: number;
  bulletSpeed: number;
  auto: boolean;
  recoil: number;
  spread: number;
  reach: number;
  color: string;
  glow: string;
  tagline: string;
  blurb: string;
  sfx: string;
};

const W = RAW.weapons;
const WEAPON_COPY: Record<WeaponId, { tagline: string; blurb: string; sfx: string }> = {
  smith: {
    tagline: "The reliable all-rounder",
    blurb: "A steady semi-auto with a deep 25-round magazine. Three clean hits drop anyone, and the low recoil keeps your aim honest.",
    sfx: "gun_smith",
  },
  kurval: {
    tagline: "Slow, heavy, brutal",
    blurb: "Bigger rounds, bigger kick. Two hits is all it takes, but every shot throws you backwards - pick your moments.",
    sfx: "gun_kurval",
  },
  flamer: {
    tagline: "Hold the trigger, spread the fire",
    blurb: "Fully automatic with a wild vertical spread. Chip damage adds up fast when 30 rounds roar out in a couple of seconds.",
    sfx: "gun_flamer",
  },
  scream: {
    tagline: "One shot. One hero down.",
    blurb: "Three damage means a guaranteed kill, fired at 1750 px/s with a huge recoil. Only 3 rounds, then you draw the Pistol as a backup.",
    sfx: "gun_scream",
  },
  pistol: {
    tagline: "Scream's automatic backup",
    blurb: "You never pick it - it is drawn for you the moment Scream runs dry. Infinite ammo, tiny damage, just enough to keep fighting.",
    sfx: "gun_secondary",
  },
  knife: {
    tagline: "Everyone carries one",
    blurb: "Tap KNIFE to swap. Short reach, 3 damage - a single stab is an instant KO, and nothing can be dodged by running out of ammo.",
    sfx: "knife_hit",
  },
};

export const WEAPONS: Weapon[] = (["smith", "kurval", "flamer", "scream", "pistol", "knife"] as WeaponId[]).map((id) => {
  const w = W[id];
  return {
    id,
    name: w.name,
    kind: w.kind as "gun" | "melee",
    selectable: w.selectable,
    damage: w.damage,
    ammo: w.ammo,
    cooldown: w.cooldown,
    bulletSpeed: w.bulletSpeed,
    auto: w.auto,
    recoil: w.recoil,
    spread: w.spread,
    reach: w.reach,
    color: w.color,
    glow: w.glow,
    ...WEAPON_COPY[id],
  };
});

/** Muzzle height as a fraction of the weapon sprite (measured from the artwork; the tip is always at the right edge). */
export const MUZZLE: Record<WeaponId, number> = { smith: 0.32, kurval: 0.226, flamer: 0.235, scream: 0.429, pistol: 0.171, knife: 0.624 };

/** width / height of each sprite, so the stage can size every weapon identically. */
export const ASPECT: Record<WeaponId, number> = { smith: 520 / 192, kurval: 520 / 179, flamer: 520 / 172, scream: 520 / 99, pistol: 464 / 325, knife: 500 / 89 };

export const weaponImg = (id: WeaponId, player = 0) => `${A}/guns/p${player + 1}/${id}.webp`;
export const hitsToKill = (w: Weapon) => Math.ceil(MAX_HP / w.damage - 1e-6);

// ───────────────────────────── arenas ─────────────────────────────
export type Hazard = { icon: string; name: string; text: string };
export type Arena = {
  id: string;
  name: string;
  world: string;
  palette: [string, string, string];
  bg: string;
  floor: string;
  tagline: string;
  hazards: Hazard[];
  fallZone: string;
  isNew: boolean;
};

const HZ = {
  moving: { icon: "↔", name: "Moving platforms", text: "Platforms that swing or lift on a fixed loop." },
  crumble: { icon: "▦", name: "Crumbling platforms", text: "Collapse shortly after you step on them, then respawn." },
  spikes: { icon: "▲", name: "Spikes", text: "-1 heart and a nasty knock-back." },
  bounce: { icon: "◉", name: "Bounce mushrooms", text: "Launch you high above the arena." },
  ice: { icon: "❄", name: "Slippery ice", text: "Low-friction surfaces that make you slide." },
  arrows: { icon: "➤", name: "Wall arrow traps", text: "Fire along a fixed height at regular intervals." },
  geyser: { icon: "≋", name: "Sea geysers", text: "Foam and a red warning line first, then a launch upwards - can even save you from a fall." },
  cannon: { icon: "●", name: "Ship cannons", text: "Wall cannons on both sides firing at deck height." },
  antigrav: { icon: "⇧", name: "Anti-gravity lifts", text: "Always-on columns of blue light that carry you up." },
  portal: { icon: "◎", name: "Portals", text: "Teleport left ⇄ right with a 1-second cooldown." },
  conveyor: { icon: "⇄", name: "Conveyor belts", text: "Floors drag you toward the middle, upper decks push outward." },
  saw: { icon: "✺", name: "Rail saws", text: "Circular saws on rails. A hit costs a heart and throws you like spikes do." },
};

const mk = (
  id: string, name: string, world: string, tagline: string, fallZone: string,
  hazards: (keyof typeof HZ)[], isNew = false,
): Arena => ({
  id, name, world, tagline, fallZone, isNew,
  palette: RAW.palettes[id as keyof typeof RAW.palettes] as unknown as [string, string, string],
  bg: `${A}/stages/${id}.webp`,
  floor: `${A}/stages/${id}_floor.webp`,
  hazards: hazards.map((h) => HZ[h]),
});

export const ARENAS: Arena[] = [
  mk("earth", "Earth", "Green Fields", "Open skies and a clean, honest fight.", "Bottomless pit", []),
  mk("hell", "Hell", "Inferno", "A dark red sky above a floor of lava.", "Lava", []),
  mk("snow", "Snow", "Frozen Pass", "Slide over ice, dodge drifting floes.", "Icy water", ["ice", "moving"]),
  mk("desert", "Desert", "Dune Ruins", "Crumbling sandstone and thorny cacti.", "Pit", ["crumble", "spikes"]),
  mk("jungle", "Jungle", "Canopy", "Bounce on mushrooms, ride the wooden lifts.", "Pit", ["bounce", "moving"]),
  mk("safari", "Safari", "Thorn Savanna", "Acacia thorns and swinging platforms.", "Pit", ["spikes", "moving"]),
  mk("temple", "Temple", "Ziggurat", "A stepped pyramid with arrow-spitting walls.", "Pit", ["spikes", "arrows", "moving"]),
  mk("ocean", "Ocean", "Shipwreck Bay", "Cannons, rotten planks and erupting geysers.", "Open sea", ["geyser", "cannon", "crumble"], true),
  mk("space", "Space", "Star Station", "Zero-G lifts and floor-to-floor portals.", "Open space", ["antigrav", "portal"], true),
  mk("factory", "Factory", "Iron Foundry", "Conveyor belts and razor-sharp rail saws.", "Molten metal", ["conveyor", "saw"], true),
];

export const MAP_FACTS = {
  mirrored: "Every arena is perfectly mirrored left-to-right, with spawn points paired on both sides.",
  hit: "Falling into the lava / water / pit costs 1 heart, then you respawn.",
};

export const DENSITIES = [
  { name: "Fewer", text: "Lighter hazards - shorter spikes, rarer traps, one saw." },
  { name: "Normal", text: "The default map, exactly as designed." },
  { name: "More", text: "Extra themed objects added to every arena." },
  { name: "Extreme", text: "A packed arena with even tighter trap timing." },
];

// ───────────────────────────── power-ups ─────────────────────────────
export type PowerUp = {
  id: string;
  name: string;
  short: string;
  icon: string;
  color: string;
  duration: string;
  effect: string;
  text: string;
  sfx: string;
  campaignOnly?: boolean;
};

const PC = RAW.pucolors;
export const POWERUPS: PowerUp[] = [
  { id: "heal", name: "Heal", short: "+1 heart", icon: `${A}/pu/heal.webp`, color: PC.heal, duration: "Instant", effect: "+1 heart", text: "Restores one heart straight away. Grabbing it at full health does nothing.", sfx: "pu_heal" },
  { id: "jump", name: "Jump Boost", short: "Higher jump", icon: `${A}/pu/jump.webp`, color: PC.jump, duration: "10 s", effect: "Jump ×1.35", text: "Your jump gets 35% higher for 10 seconds - reach the top platforms and escape the pit.", sfx: "pu_jump" },
  { id: "speed", name: "Speed Boost", short: "Run faster", icon: `${A}/pu/speed.webp`, color: PC.speed, duration: "10 s", effect: "Speed ×1.5", text: "Run 50% faster for 10 seconds. Perfect for chasing a wounded rival.", sfx: "pu_speed" },
  { id: "shield", name: "Shield", short: "Blocks 2 hits", icon: `${A}/pu/shield.webp`, color: PC.shield, duration: "7 s max", effect: "Blocks 2 hits", text: "Absorbs two damage events of any kind - bullets, knife, arrows, lava, spikes, falls - then breaks. No hearts lost while it holds.", sfx: "pu_shield" },
  { id: "invisible", name: "Invisible", short: "Fade away", icon: `${A}/pu/invisible.webp`, color: PC.invisible, duration: "3 s", effect: "Vanish", text: "Your fighter disappears for 3 seconds. Sneak, flank, or run.", sfx: "pu_invisible" },
  { id: "ammo_refill", name: "Ammo Refill", short: "Full magazine", icon: `${A}/pu/ammo_refill.webp`, color: PC.ammo_refill, duration: "Instant", effect: "Full ammo", text: "Refills your main weapon. If Scream was on Pistol, you switch back to Scream with 3 rounds.", sfx: "pu_ammo_refill" },
  { id: "swap_position", name: "Swap Position", short: "Shuffle spots", icon: `${A}/pu/swap_position.webp`, color: PC.swap_position, duration: "3 s window", effect: "Shuffle everyone", text: "You can't shoot for 3 seconds. Press SHOOT to randomly shuffle every living player's position - or let the timer run out.", sfx: "pu_swap_position" },
  { id: "nuke", name: "Nuke", short: "Blast every enemy", icon: `${A}/pu/nuke.webp`, color: "#ff6a2a", duration: "Instant", effect: "2.2 damage to all enemies", text: "Campaign only. A screen-shaking blast that damages every enemy on the map and knocks them away.", sfx: "nuke", campaignOnly: true },
  { id: "freeze", name: "Freeze", short: "Stop all enemies", icon: `${A}/pu/freeze.webp`, color: "#8fe8ff", duration: "4.5 s", effect: "Enemies frozen", text: "Campaign only. Every enemy is frozen in place for 4.5 seconds - free damage, free reload.", sfx: "freeze", campaignOnly: true },
];

export const PU_AMOUNTS = [
  { name: "Few", min: 13, max: 19, cap: 1 },
  { name: "Normal", min: 6, max: 10, cap: 2 },
  { name: "Many", min: 3.5, max: 6, cap: 3 },
  { name: "Chaos", min: 1.5, max: 3, cap: 5 },
];

// ───────────────────────────── match rules ─────────────────────────────
export const TEAM_NERF = [
  { label: "Balanced", dmg: 100, rate: 100, speed: 100, jump: 100 },
  { label: "+1 bigger than smallest", dmg: 85, rate: 91, speed: 96, jump: 100 },
  { label: "+2 bigger than smallest", dmg: 70, rate: 82, speed: 92, jump: 97 },
];

// ───────────────────────────── campaign ─────────────────────────────
export const CHAPTERS = RAW.chapterNames.map((name, i) => ({
  n: i + 1,
  name,
  range: [i * 50 + 1, i * 50 + 50] as [number, number],
  blurb: [
    "The original ten worlds, one hand-built map per world.",
    "The same worlds return with remixed map variants and elite enemies.",
    "Another set of map variants. Tougher elites, longer boss fights.",
    "Twenty brand-new maps with new layouts, hazards and colours, plus 20 new bosses.",
    "The final stretch. Maximum difficulty, final-form bosses.",
  ][i],
}));

export const WORLDS = RAW.worlds.map((w) => ({ ...w, arena: ARENAS.find((a) => a.id === w.id)! }));

export type Enemy = {
  id: string;
  name: string;
  weapon: WeaponId;
  hp: number;
  speed: number;
  jump: number;
  dmg: number;
  range: number;
  score: number;
  shield: boolean;
  knife: boolean;
  size: number;
  traits: string[];
  char: number;
  boss: boolean;
};

const E = RAW.enemies as unknown as Record<string, Omit<Enemy, "id" | "char" | "boss"> & { chars: number[] }>;
const mkEnemy = (id: string): Enemy => {
  const e = E[id];
  return { id, name: e.name, weapon: e.weapon as WeaponId, hp: e.hp, speed: e.speed, jump: e.jump, dmg: e.dmg, range: e.range, score: e.score, shield: e.shield, knife: e.knife, size: e.size, traits: e.traits, char: e.chars[0], boss: id.startsWith("boss_") };
};

export const ENEMY_BLURB: Record<string, string> = {
  grunt: "Basic foot soldier with a Smith. Easy to read, fun to chain combos on.",
  rusher: "Knife only. Fast, fragile, and always charging straight at you.",
  gunner: "Keeps its distance with the heavy Kurval.",
  burner: "Close-range Flamer that sprays long bursts.",
  sniper: "Scream user. One shot is a guaranteed kill - break line of sight.",
  guard: "Carries a shield that absorbs hits before it can be hurt.",
  hopper: "Pistol and an enormous jump. Hard to pin down.",
  brute: "Giant, slow, and tanky with a Kurval. Worth 450 points.",
  veteran: "Elite shielded Smith soldier with high HP.",
  assassin: "Elite knife fighter - extremely fast and agile.",
  marksman: "Elite shielded Scream sniper with long range.",
  juggernaut: "Elite giant Flamer with serious HP.",
};
export const ENEMIES: Enemy[] = Object.keys(ENEMY_BLURB).map(mkEnemy);

export type Boss = Enemy & { chapter: number; worldId: string; worldName: string; level: number };
const bossIds = Object.keys(E).filter((k) => k.startsWith("boss_"));
export const BOSSES: Boss[] = bossIds.map((id, i) => {
  const w = RAW.worlds[i % 10];
  return { ...mkEnemy(id), chapter: Math.floor(i / 10) + 1, worldId: w.id, worldName: w.name, level: (i % 10) * 5 + 5 };
});

export const BOSS_TRAITS: Record<string, { name: string; text: string }> = {
  enrage: { name: "Enrage", text: "At 50% HP the boss roars: faster fire, faster movement, +10% damage." },
  summon: { name: "Summon", text: "Calls reinforcements at 66% and again at 33% HP." },
  leap: { name: "Leap", text: "Makes huge jumps to close the distance or dodge your shots." },
  dash: { name: "Dash", text: "Lunges across the arena in a fast, short charge." },
};

export const PERKS = RAW.perks.map((p) => ({ ...p, icon: `${A}/camp/perk_${p.id}.webp` }));

export const GRADES = [
  { letter: "S", stars: 3, text: "3 stars and a flawless run - zero damage taken." },
  { letter: "A", stars: 3, text: "3 stars: ≤ 1.5 damage taken and never died on the level." },
  { letter: "B", stars: 2, text: "2 stars: ≤ 4 damage taken." },
  { letter: "C", stars: 1, text: "1 star: you cleared the level." },
];

// ───────────────────────────── shop ─────────────────────────────
export const CHAR_SKINS = RAW.charSkins.map((s) => ({ ...s, rarity: s.rarity as Rarity }));
export const WEAPON_SKINS = Object.fromEntries(
  Object.entries(RAW.weaponSkins).map(([w, list]) => [
    w,
    list.map((s) => ({ ...s, rarity: s.rarity as Rarity, img: `${A}/wskins/${w}/${s.id}.webp` })),
  ]),
) as Record<WeaponId, { id: string; name: string; rarity: Rarity; price: number; bullet: string; img: string }[]>;
export const ACCESSORIES = RAW.accessories.map((a) => ({ ...a, rarity: a.rarity as Rarity, slot: a.slot as "head" | "face" | "neck" | "back", img: `${A}/acc/${a.id}.webp` }));
export const SLOTS = ["head", "face", "neck", "back"] as const;

// ───────────────────────────── controls ─────────────────────────────
export const KEYMAP = [
  { left: "A", right: "D", up: "W", down: "S", shoot: "F", knife: "G" },
  { left: "←", right: "→", up: "↑", down: "↓", shoot: "/", knife: "." },
  { left: "J", right: "L", up: "I", down: "K", shoot: "H", knife: "U" },
  { left: "Num 4", right: "Num 6", up: "Num 8", down: "Num 5", shoot: "Num 0", knife: "Num ." },
];
/** KeyboardEvent.code → [player, action] for live key-press demo */
export const KEYCODES: Record<string, [number, string]> = {
  KeyA: [0, "left"], KeyD: [0, "right"], KeyW: [0, "up"], KeyS: [0, "down"], KeyF: [0, "shoot"], KeyG: [0, "knife"],
  ArrowLeft: [1, "left"], ArrowRight: [1, "right"], ArrowUp: [1, "up"], ArrowDown: [1, "down"], Slash: [1, "shoot"], Period: [1, "knife"],
  KeyJ: [2, "left"], KeyL: [2, "right"], KeyI: [2, "up"], KeyK: [2, "down"], KeyH: [2, "shoot"], KeyU: [2, "knife"],
  Numpad4: [3, "left"], Numpad6: [3, "right"], Numpad8: [3, "up"], Numpad5: [3, "down"], Numpad0: [3, "shoot"], NumpadDecimal: [3, "knife"],
};
export const ACTIONS = [
  { id: "left", label: "Left" }, { id: "right", label: "Right" }, { id: "up", label: "Jump" },
  { id: "down", label: "Drop" }, { id: "shoot", label: "Shoot" }, { id: "knife", label: "Knife" },
] as const;

export const PAD = [
  { action: "Move", btn: "Left stick / D-pad" },
  { action: "Jump", btn: "✕ (A) / D-pad up / L1" },
  { action: "Drop through platform", btn: "Stick or D-pad down" },
  { action: "Shoot", btn: "□ (X)" },
  { action: "Knife", btn: "△ (Y)" },
  { action: "Pause", btn: "OPTIONS (Start)" },
];

export const SETTINGS_LIST = [
  "Music volume", "Sound FX volume", "Vibration", "Screen shake", "Fullscreen", "Show FPS", "FPS limit (30 / 60 / 90 / 120 / 240 / unlimited)",
];

// ───────────────────────────── links ─────────────────────────────
export const LINKS = {
  tiktok: "https://www.tiktok.com/@equinox.interactive",
  instagram: "https://www.instagram.com/equinox.interactive/",
  x: "https://x.com/EquinoxIntratve",
};

/** Direct download links. Only the /download page uses these. Every other button links to the /download route. */
export const DOWNLOAD = {
  windows: "https://github.com/EquinoxInteractive/BoxSiege/releases/download/Game/BOX-SIEGE.zip",
  macos: "https://github.com/EquinoxInteractive/BoxSiege/releases/download/Game/BOX-SIEGE.zip",
  linux: "https://github.com/EquinoxInteractive/BoxSiege/releases/download/Game/BOX-SIEGE.zip",
} as const;

// ───────────────────────────── game status ─────────────────────────────
/**
 * ➜ To change the status shown on the whole site, edit ONLY the line `GAME_STATUS` below.
 *    "released"    → green "Released" badge, normal download wording.
 *    "development" → gold "In development" badge, "early build" wording.
 */
export type GameStatus = "released" | "development";
export const GAME_STATUS: GameStatus = "development";

export const STATUS_INFO: Record<GameStatus, { label: string; color: string; cta: string }> = {
  released: {
    label: "Released",
    color: "#4be3a0",
    cta: "Free for Windows. Download, unzip, plug in a few controllers and start brawling.",
  },
  development: {
    label: "In development",
    color: "#ffd23f",
    cta: "BOX SIEGE is still in development. Grab the latest build, expect rough edges and new updates.",
  },
};