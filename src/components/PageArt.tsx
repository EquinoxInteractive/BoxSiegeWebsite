import { ACCESSORIES, ARENAS, A, CHARACTERS, POWERUPS, weaponImg, type WeaponId } from "@/data/game";
import { FighterFace } from "./ui";

type Item = {
  src?: string;
  /** width in px on a 1440px-wide screen; scales down with the viewport */
  w: number;
  /** left offset in % of the art area */
  x: number;
  /** distance from the floor in px (0 = standing on it) */
  y?: number;
  rot?: number;
  /** floating objects bob and tilt; characters just bob */
  float?: boolean;
  frame?: boolean;
  cap?: { label: string; color: string };
  glow?: string;
  /** a fighter wearing accessories (ids from the shop): [character index, accessory ids] */
  wear?: [number, string[]];
  /** weapon drawn in the fighter's hand: [weapon, player colour index, side the gun points to] */
  gun?: [WeaponId, number, "l" | "r"];
  z?: number;
};

const C = (i: number) => CHARACTERS[i].img;
const PU = (id: string) => POWERUPS.find((p) => p.id === id)!;
const ARENA = (id: string) => ARENAS.find((a) => a.id === id)!.bg;

const ART: Record<string, Item[]> = {
  modes: [
    { src: C(0), w: 190, x: 4, gun: ["smith", 0, "r"] },
    { src: C(4), w: 170, x: 30, gun: ["kurval", 1, "r"], z: 2 },
    { src: C(12), w: 190, x: 56, gun: ["flamer", 2, "l"] },
    { src: C(8), w: 150, x: 78, gun: ["scream", 3, "l"], z: 2 },
  ],
  fighters: [
    { src: C(20), w: 200, x: 2 },
    { src: C(22), w: 170, x: 28, z: 2 },
    { src: C(17), w: 200, x: 50 },
    { src: C(23), w: 150, x: 76, z: 2 },
  ],
  arsenal: [
    { src: weaponImg("smith", 0), w: 360, x: 2, y: 190, rot: -9, float: true },
    { src: weaponImg("kurval", 1), w: 330, x: 36, y: 70, rot: 5, float: true, z: 2 },
    { src: weaponImg("flamer", 2), w: 320, x: 18, y: 300, rot: 3, float: true },
    { src: weaponImg("scream", 3), w: 260, x: 62, y: 250, rot: -5, float: true },
  ],
  arenas: [
    { src: ARENA("ocean"), w: 330, x: 2, y: 140, rot: -5, frame: true, float: true },
    { src: ARENA("space"), w: 300, x: 40, y: 40, rot: 4, frame: true, float: true, z: 2 },
    { src: ARENA("factory"), w: 270, x: 30, y: 260, rot: -2, frame: true, float: true },
  ],
  powerups: [
    { src: PU("shield").icon, w: 150, x: 4, y: 40, float: true, glow: PU("shield").color },
    { src: PU("speed").icon, w: 120, x: 30, y: 170, float: true, glow: PU("speed").color },
    { src: PU("heal").icon, w: 140, x: 52, y: 30, float: true, glow: PU("heal").color, z: 2 },
    { src: PU("freeze").icon, w: 110, x: 76, y: 190, float: true, glow: PU("freeze").color },
    { src: PU("nuke").icon, w: 120, x: 74, y: 20, float: true, glow: PU("nuke").color },
  ],
  campaign: [
    { src: C(22), w: 130, x: 6, gun: ["smith", 0, "r"] },
    { src: C(21), w: 300, x: 52, gun: ["kurval", 1, "l"], z: 2 },
    { src: `${A}/camp/star.webp`, w: 70, x: 36, y: 230, float: true },
    { src: `${A}/camp/star.webp`, w: 54, x: 28, y: 290, float: true },
    { src: `${A}/camp/star.webp`, w: 54, x: 46, y: 300, float: true },
  ],
  rules: [
    { src: C(0), w: 190, x: 6, gun: ["smith", 0, "r"] },
    { src: C(3), w: 190, x: 62, gun: ["kurval", 1, "l"] },
    { src: `${A}/ui/heart.webp`, w: 70, x: 33, y: 190, float: true },
    { src: `${A}/ui/heart.webp`, w: 70, x: 41, y: 240, float: true },
    { src: `${A}/ui/heart.webp`, w: 70, x: 49, y: 190, float: true },
  ],
  shop: [
    { w: 190, x: 2, wear: [16, ["crown", "sunglasses"]] },
    { w: 190, x: 32, wear: [0, ["halo", "heart_glasses"]], z: 2 },
    { w: 190, x: 62, wear: [3, ["cowboy_hat", "bowtie"]] },
    { src: `${A}/ui/coin.webp`, w: 64, x: 24, y: 250, float: true },
    { src: `${A}/ui/coin.webp`, w: 52, x: 58, y: 270, float: true },
  ],
  controls: [
    { w: 84, x: 16, y: 220, cap: { label: "W", color: "#ff3b3b" } },
    { w: 84, x: 4, y: 128, cap: { label: "A", color: "#ff3b3b" } },
    { w: 84, x: 16, y: 128, cap: { label: "S", color: "#ff3b3b" } },
    { w: 84, x: 28, y: 128, cap: { label: "D", color: "#ff3b3b" } },
    { w: 84, x: 62, y: 220, cap: { label: "↑", color: "#3b9bff" } },
    { w: 84, x: 50, y: 128, cap: { label: "←", color: "#3b9bff" } },
    { w: 84, x: 62, y: 128, cap: { label: "↓", color: "#3b9bff" } },
    { w: 84, x: 74, y: 128, cap: { label: "→", color: "#3b9bff" } },
  ],
  download: [
    { src: C(1), w: 150, x: 0 },
    { src: C(5), w: 170, x: 17, z: 2 },
    { src: C(9), w: 150, x: 36 },
    { src: C(13), w: 180, x: 52, z: 2 },
    { src: C(17), w: 150, x: 72 },
  ],
};

const width = (w: number) => `clamp(${Math.round(w * 0.5)}px, ${(w / 14.4).toFixed(2)}vw, ${w}px)`;

/** Decorative sprites that stand on (or float above) the floor strip of a page header. Desktop only. */
export function PageArt({ id }: { id: string }) {
  const items = ART[id] ?? [];
  return (
    <div className="pointer-events-none absolute bottom-[44px] right-0 hidden h-full w-[50%] lg:block" aria-hidden>
      {items.map((it, i) => (
        <div key={i} className="absolute" style={{ left: `${it.x}%`, bottom: it.y ?? 0, width: width(it.w), zIndex: it.z ?? 1, transform: `rotate(${it.rot ?? 0}deg)`, containerType: "inline-size" }}>
          <div className={it.float ? "animate-bob-rot" : "animate-bob"} style={{ animationDelay: `${i * 0.45}s` }}>
            {it.cap ? (
              <span
                className="grid aspect-square w-full place-items-center rounded-[16%] border-2 font-ui"
                style={{
                  fontSize: "46cqw", color: "#fff", borderColor: it.cap.color,
                  background: `linear-gradient(180deg, ${it.cap.color}66, ${it.cap.color}22)`,
                  boxShadow: `0 7px 0 ${it.cap.color}99, 0 0 26px ${it.cap.color}55`,
                }}
              >
                {it.cap.label}
              </span>
            ) : it.wear ? (
              <FighterFace
                src={CHARACTERS[it.wear[0]].img} size={it.w} eyeY={CHARACTERS[it.wear[0]].eyeY}
                accessories={ACCESSORIES.filter((a) => it.wear![1].includes(a.id))}
                className="drop-shadow-[0_10px_0_rgba(0,0,0,0.45)]"
              />
            ) : it.frame ? (
              <img src={it.src} alt="" className="px block aspect-video w-full rounded-xl border-4 border-black/70 object-cover shadow-[0_14px_0_rgba(0,0,0,0.45)]" />
            ) : (
              <div className="relative">
                <img src={it.src} alt="" className="px block w-full max-w-none" style={{ filter: it.glow ? `drop-shadow(0 0 22px ${it.glow})` : "drop-shadow(0 10px 0 rgba(0,0,0,0.45))" }} />
                {it.gun && (
                  <img
                    src={weaponImg(it.gun[0], it.gun[1])} alt=""
                    className="px absolute top-[45%] w-[85%] max-w-none"
                    style={it.gun[2] === "r" ? { left: "58%" } : { right: "58%", transform: "scaleX(-1)" }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
