export type CharacterData = {
    id: string;
    name: string;
    sprite: string;
    death: string;
    gun: string;
    color: string;
};

export const CHARACTERS_P1: CharacterData[] = [
    { id: "angry", name: "Angry", sprite: "/assets/IMG/P1/angry.png", death: "/assets/IMG/P1/angrydie.png", gun: "/assets/IMG/P1/gunp1.png", color: "#ff0000" },
    { id: "bandel", name: "Bandel", sprite: "/assets/IMG/P1/bandel1.png", death: "/assets/IMG/P1/bandel1-die.png", gun: "/assets/IMG/P1/gunp1.png", color: "#a85700" },
    { id: "melow", name: "Melow", sprite: "/assets/IMG/P1/melow.png", death: "/assets/IMG/P1/melowdie.png", gun: "/assets/IMG/P1/gunp1.png", color: "#ffffff" },
    { id: "ninja", name: "Ninja", sprite: "/assets/IMG/P1/ninja.png", death: "/assets/IMG/P1/ninjadie.png", gun: "/assets/IMG/P1/gunp1.png", color: "#363636" },
];

export const CHARACTERS_P2: CharacterData[] = [
    { id: "calm", name: "Calm", sprite: "/assets/IMG/P2/calmblue.png", death: "/assets/IMG/P2/calmbluedie.png", gun: "/assets/IMG/P2/gunp2.png", color: "#003ca4" },
    { id: "baik", name: "Baik", sprite: "/assets/IMG/P2/baik1.png", death: "/assets/IMG/P2/baik1-die.png", gun: "/assets/IMG/P2/gunp2.png", color: "#003a9f" },
    { id: "mime", name: "Mime", sprite: "/assets/IMG/P2/mime.png", death: "/assets/IMG/P2/mimedie.png", gun: "/assets/IMG/P2/gunp2.png", color: "#ffffff" },
    { id: "silat", name: "Silat", sprite: "/assets/IMG/P2/silat.png", death: "/assets/IMG/P2/silat-die.png", gun: "/assets/IMG/P2/gunp2.png", color: "#540000" },
];

export const CHARACTERS_P3: CharacterData[] = [
    { id: "drunk", name: "Drunk", sprite: "/assets/IMG/P3/drunk.png", death: "/assets/IMG/P3/drunkdie.png", gun: "/assets/IMG/P3/gunp3.png", color: "#45005f" },
    { id: "blind", name: "Blind", sprite: "/assets/IMG/P3/blind.png", death: "/assets/IMG/P3/blinddie.png", gun: "/assets/IMG/P3/gunp3.png", color: "#1e4200" },
    { id: "joker", name: "Joker", sprite: "/assets/IMG/P3/joker.png", death: "/assets/IMG/P3/jokerdie.png", gun: "/assets/IMG/P3/gunp3.png", color: "#340035" },
    { id: "spiderweaver", name: "Spider Weaver", sprite: "/assets/IMG/P3/spiderweaver.png", death: "/assets/IMG/P3/spiderweaverdie.png", gun: "/assets/IMG/P3/gunp3.png", color: "#b20101" },
];

export const CHARACTERS_P4: CharacterData[] = [
    { id: "bald-man", name: "Bald Man", sprite: "/assets/IMG/P4/bald-man.png", death: "/assets/IMG/P4/bald-mandie.png", gun: "/assets/IMG/P4/gunp4.png", color: "#ffb570" },
    { id: "deadswim", name: "Deadswim", sprite: "/assets/IMG/P4/deadswim.png", death: "/assets/IMG/P4/deadswimdie.png", gun: "/assets/IMG/P4/gunp4.png", color: "#930404" },
    { id: "savior", name: "Savior", sprite: "/assets/IMG/P4/savior.png", death: "/assets/IMG/P4/saviordie.png", gun: "/assets/IMG/P4/gunp4.png", color: "#003163" },
    { id: "spiderblack", name: "Spider Black", sprite: "/assets/IMG/P4/spiderblack.png", death: "/assets/IMG/P4/spiderblackdie.png", gun: "/assets/IMG/P4/gunp4.png", color: "#aa0404" },
];

// ─── WEAPONS ─────────────────────────────────────────────────────────────────
export type WeaponStatsData = {
    name: string;
    image: string;
    damage: number;
    magazine: number;
    bulletSpeed: number;
    fireRate: number;
};

export type WeaponData = WeaponStatsData & {
    id: string;
    secondary?: WeaponStatsData;
};

export const WEAPONS_P1: WeaponData[] = [
    {
        id: "smith", name: "Smith", image: "/assets/WEAPON/P1/smith.png",
        damage: 1, magazine: 25, bulletSpeed: 10, fireRate: 0.5
    },
    {
        id: "kurval", name: "Kurval", image: "/assets/WEAPON/P1/kurval.png",
        damage: 1.5, magazine: 10, bulletSpeed: 5, fireRate: 3.5
    },
    {
        id: "flamer", name: "Flamer", image: "/assets/WEAPON/P1/flamer.png",
        damage: 0.5, magazine: 30, bulletSpeed: 15, fireRate: 0
    },
    {
        id: "scream", name: "Scream", image: "/assets/WEAPON/P1/scream.png",
        damage: 3, magazine: 3, bulletSpeed: 50, fireRate: 5,
        secondary: {
            name: "Pistol", image: "/assets/WEAPON/P1/pistol.png",
            damage: 0.25, magazine: Infinity, bulletSpeed: 10, fireRate: 0.5,
        },
    },
];

export const WEAPONS_P2: WeaponData[] = [
    {
        id: "smith", name: "Smith", image: "/assets/WEAPON/P2/smith.png",
        damage: 1, magazine: 25, bulletSpeed: 10, fireRate: 0.5
    },
    {
        id: "kurval", name: "Kurval", image: "/assets/WEAPON/P2/kurval.png",
        damage: 1.5, magazine: 10, bulletSpeed: 5, fireRate: 3.5
    },
    {
        id: "flamer", name: "Flamer", image: "/assets/WEAPON/P2/flamer.png",
        damage: 0.5, magazine: 30, bulletSpeed: 15, fireRate: 0
    },
    {
        id: "scream", name: "Scream", image: "/assets/WEAPON/P2/scream.png",
        damage: 3, magazine: 3, bulletSpeed: 50, fireRate: 5,
        secondary: {
            name: "Pistol", image: "/assets/WEAPON/P2/pistol.png",
            damage: 0.25, magazine: Infinity, bulletSpeed: 10, fireRate: 0.5,
        },
    },
];

export const WEAPONS_P3: WeaponData[] = [
    {
        id: "smith", name: "Smith", image: "/assets/WEAPON/P3/smith.png",
        damage: 1, magazine: 25, bulletSpeed: 10, fireRate: 0.5
    },
    {
        id: "kurval", name: "Kurval", image: "/assets/WEAPON/P3/kurval.png",
        damage: 1.5, magazine: 10, bulletSpeed: 5, fireRate: 3.5
    },
    {
        id: "flamer", name: "Flamer", image: "/assets/WEAPON/P3/flamer.png",
        damage: 0.5, magazine: 30, bulletSpeed: 15, fireRate: 0
    },
    {
        id: "scream", name: "Scream", image: "/assets/WEAPON/P3/scream.png",
        damage: 3, magazine: 3, bulletSpeed: 50, fireRate: 5,
        secondary: {
            name: "Pistol", image: "/assets/WEAPON/P3/pistol.png",
            damage: 0.25, magazine: Infinity, bulletSpeed: 10, fireRate: 0.5,
        },
    },
];

export const WEAPONS_P4: WeaponData[] = [
    {
        id: "smith", name: "Smith", image: "/assets/WEAPON/P4/smith.png",
        damage: 1, magazine: 25, bulletSpeed: 10, fireRate: 0.5
    },
    {
        id: "kurval", name: "Kurval", image: "/assets/WEAPON/P4/kurval.png",
        damage: 1.5, magazine: 10, bulletSpeed: 5, fireRate: 3.5
    },
    {
        id: "flamer", name: "Flamer", image: "/assets/WEAPON/P4/flamer.png",
        damage: 0.5, magazine: 30, bulletSpeed: 15, fireRate: 0
    },
    {
        id: "scream", name: "Scream", image: "/assets/WEAPON/P4/scream.png",
        damage: 3, magazine: 3, bulletSpeed: 50, fireRate: 5,
        secondary: {
            name: "Pistol", image: "/assets/WEAPON/P4/pistol.png",
            damage: 0.25, magazine: Infinity, bulletSpeed: 10, fireRate: 0.5,
        },
    },
];

// ─── MAPS ────────────────────────────────────────────────────────────────────
export type MapData = {
    id: string;
    name: string;
    thumb: string;
    full: string;
    biome: string;
    accent: string;
};

export const MAPS: MapData[] = [
    { id: "earth", name: "The Earth", thumb: "/assets/IMG/stage/erth.png", full: "/assets/IMG/stage in game/earth.png", biome: "Earth", accent: "#00d1ff" },
    { id: "hell", name: "The Hell", thumb: "/assets/IMG/stage/hell.png", full: "/assets/IMG/stage in game/hell.png", biome: "Hell", accent: "#630f0f" },
    { id: "snow", name: "The Snow", thumb: "/assets/IMG/stage/snow.png", full: "/assets/IMG/stage in game/snow.png", biome: "Snow", accent: "#4da6ff" },
    { id: "desert", name: "The Desert", thumb: "/assets/IMG/stage/dessert.png", full: "/assets/IMG/stage in game/dessert.png", biome: "Desert", accent: "#ffb570" },
];

// ─── POWER UPS ───────────────────────────────────────────────────────────────
export type PowerUpData = {
    id: string;
    title: string;
    img: string;
    video: string;
    desc: string;
    duration: string;
    effect: string;
    accent: string;
};

export const POWERUPS: PowerUpData[] = [
    { id: "speed", title: "Speed Boost", img: "/assets/IMG/itempowerup/gerakspeed.png", video: "/assets/VIDS/preview/Speed-Preview.mp4", desc: "Player will get a fast running effect for 10 seconds.", duration: "10s", effect: "Movement x2", accent: "#ff0000" },
    { id: "jump", title: "Jump Boost", img: "/assets/IMG/itempowerup/jumpboost.png", video: "/assets/VIDS/preview/Jump-Preview.mp4", desc: "Player will get a high jump effect for 10 seconds.", duration: "10s", effect: "Jump Height x2", accent: "#2ca0e9" },
    { id: "heal", title: "Heal", img: "/assets/IMG/itempowerup/health.png", video: "/assets/VIDS/preview/Heal-Preview.mp4", desc: "Player regains one health bar. Does nothing if at full health.", duration: "Instant", effect: "+1 Health", accent: "#ff0000" },
    { id: "shield", title: "Shield", img: "/assets/IMG/itempowerup/perisai.png", video: "/assets/VIDS/preview/Shield-Preview.mp4", desc: "Player will get 2 shields with no time limit.", duration: "7s", effect: "+2 Shields", accent: "#919191" },
];

// ─── MELEE ───────────────────────────────────────────────────────────────────
export type MeleeData = {
    id: string;
    name: string;
    image: string;
    damage: number;
    fireRate: number;
    range: number;
    bullet: number; // ammo count (Infinity = unlimited)
};

export const MELEE_P1: MeleeData = {
    id: "knife",
    name: "Combat Knife",
    image: "/assets/WEAPON/P1/knife.png",
    damage: 3,
    bullet: Infinity,
    fireRate: 1,
    range: 0.3,
};

export const MELEE_P2: MeleeData = {
    id: "knife",
    name: "Combat Knife",
    image: "/assets/WEAPON/P2/knife.png",
    damage: 3,
    bullet: Infinity,
    fireRate: 1,
    range: 0.3,
};

export const MELEE_P3: MeleeData = {
    id: "knife",
    name: "Combat Knife",
    image: "/assets/WEAPON/P3/knife.png",
    damage: 3,
    bullet: Infinity,
    fireRate: 1,
    range: 0.3,
};

export const MELEE_P4: MeleeData = {
    id: "knife",
    name: "Combat Knife",
    image: "/assets/WEAPON/P4/knife.png",
    damage: 3,
    bullet: Infinity,
    fireRate: 1,
    range: 0.3,
};