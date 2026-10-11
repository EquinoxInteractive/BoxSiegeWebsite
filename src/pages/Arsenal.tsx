import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Page } from "@/components/Page";
import { Heart, RarityTag, StatBar, Coin } from "@/components/ui";
import { MAX_HP, PLAYER_COLORS, WEAPONS, WEAPON_SKINS, hitsToKill, weaponImg, ASPECT, MUZZLE, type WeaponId } from "@/data/game";
import { sfx } from "@/lib/audio";

export function Arsenal() {
  const [id, setId] = useState<WeaponId>("smith");
  const [player, setPlayer] = useState(0);
  const [skin, setSkin] = useState("");
  const [shots, setShots] = useState(0);
  const w = WEAPONS.find((x) => x.id === id)!;
  const skins = WEAPON_SKINS[id];
  const sk = skins.find((s) => s.id === skin);
  const img = sk ? sk.img : weaponImg(id, player);
  const hits = hitsToKill(w);
  const bulletColor = sk ? sk.bullet : w.color;

  const select = (n: WeaponId) => { setId(n); setSkin(""); sfx("ui_move", 0.3); };
  const fire = () => { setShots((s) => s + 1); sfx(w.sfx, 0.5); };

  return (
    <Page id="arsenal" title="The arsenal"
      intro="Four main weapons chosen on the fighter screen, a Pistol that backs up Scream, and a knife everyone carries. Click the weapon to fire it.">
      <div className="mb-5 grid grid-cols-3 gap-2 sm:mb-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
        {WEAPONS.map((x) => (
          <button key={x.id} onClick={() => select(x.id)} onMouseEnter={() => sfx("ui_hover", 0.08)}
            className="relative cursor-pointer rounded-xl border-2 px-2 py-2.5 transition-all active:scale-95 sm:px-4 sm:py-3 sm:hover:-translate-y-1"
            style={{ borderColor: x.id === id ? x.color : "rgba(255,255,255,0.12)", background: x.id === id ? `${x.color}22` : "rgba(0,0,0,0.35)" }}>
            <img src={weaponImg(x.id, 0)} alt={x.name} className="px mx-auto h-8 w-full object-contain sm:h-9 sm:w-24" />
            <p className="mt-1 truncate font-ui text-[11px] uppercase tracking-wider sm:text-xs sm:tracking-widest">{x.name}</p>
            {!x.selectable && <span className="absolute -right-1 -top-2 chip !text-[9px] bg-ink">{x.kind === "melee" ? "Melee" : "Backup"}</span>}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="panel relative overflow-hidden p-4 sm:p-6 md:p-8" style={{ ["--accent" as string]: w.color }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 45%, ${w.glow}44, transparent 60%)` }} />
          <div className="relative flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <div className="min-w-0">
              <h3 className="font-display text-5xl leading-none sm:text-6xl md:text-8xl" style={{ color: w.color, textShadow: "0 5px 0 #000" }}>{w.name}</h3>
              <p className="font-ui uppercase tracking-widest text-white/65 mt-1">{w.tagline}</p>
            </div>
            <div className="flex gap-1.5" title="Player colour">
              {PLAYER_COLORS.map((c, i) => (
                <button key={c} onClick={() => { setPlayer(i); setSkin(""); sfx("ui_move", 0.25); }} aria-label={`Player ${i + 1} colour`}
                  className="h-8 w-8 cursor-pointer rounded-full border-2 transition-transform active:scale-90 sm:h-7 sm:w-7 sm:hover:scale-110"
                  style={{ background: c, borderColor: player === i && !skin ? "#fff" : "transparent" }} />
              ))}
            </div>
          </div>

          <button onClick={fire} className="relative mt-4 flex h-44 w-full cursor-crosshair items-center justify-center sm:mt-6 sm:h-52" aria-label={`Fire ${w.name}`}>
            <AnimatePresence mode="wait">
              <motion.div key={img} initial={{ opacity: 0, x: -40, rotate: -4 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.25 }}
                className="relative -translate-x-[14%]" style={{ width: `min(${Math.round(Math.min(330, 150 * ASPECT[id]))}px, 56vw)` }}>
                <img src={img} alt={w.name} className="px block h-auto w-full drop-shadow-[0_16px_0_rgba(0,0,0,0.4)]" draggable={false} />
                {w.kind === "gun" && (
                  /* anchor sits exactly on the muzzle: right edge, measured height */
                  <span className="pointer-events-none absolute" style={{ left: "100%", top: `${MUZZLE[id] * 100}%` }}>
                    <motion.span key={`f${shots}`} initial={{ opacity: shots ? 1 : 0, scale: 0.3 }} animate={{ opacity: 0, scale: 1.5 }} transition={{ duration: 0.22 }}
                      className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle, #fff 0%, ${bulletColor} 35%, transparent 70%)` }} />
                    <motion.span key={`b${shots}`} initial={{ x: 0, opacity: shots ? 1 : 0 }} animate={{ x: 200, opacity: [1, 1, 0] }} transition={{ duration: 0.45, ease: "easeIn" }}
                      className="absolute left-0 top-0 block h-[14px] w-14 -translate-y-1/2 rounded-full"
                      style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.95) 0 22%, ${bulletColor} 22% 78%, rgba(255,255,255,0.95) 78% 100%)`, boxShadow: `0 0 16px ${bulletColor}` }} />
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </button>
          <p className="relative mt-2 text-center text-xs text-white/45">{shots ? `Fired ${shots}×` : "Tap to test fire"}</p>
          <p className="relative mt-4 text-white/75 leading-relaxed">{w.blurb}</p>
        </div>

        <div className="panel p-5 sm:p-6 md:p-8">
          <h4 className="font-ui text-sm uppercase tracking-widest text-white/60">Stats</h4>
          <div className="mt-4 grid gap-4" key={id}>
            <StatBar label="Damage per hit" value={w.damage / 3} display={`${w.damage}`} color="#ff4040" />
            <StatBar label="Magazine" value={w.ammo < 0 ? 1 : w.ammo / 30} display={w.kind === "melee" ? "∞ melee" : w.ammo < 0 ? "∞" : `${w.ammo} rounds`} color="#ffd23f" delay={0.05} />
            <StatBar label="Fire rate" value={Math.min(1, (1 / w.cooldown) / 14.3)} display={w.auto ? `Auto · ${(1 / w.cooldown).toFixed(1)}/s` : `${(1 / w.cooldown).toFixed(1)}/s`} color="#4be3a0" delay={0.1} />
            <StatBar label={w.kind === "melee" ? "Reach" : "Bullet speed"} value={w.kind === "melee" ? w.reach / 100 : w.bulletSpeed / 1750} display={w.kind === "melee" ? `${w.reach} px` : `${w.bulletSpeed} px/s`} color="#4fd8ff" delay={0.15} />
            <StatBar label="Recoil" value={w.recoil / 380} display={w.recoil ? `${w.recoil}` : "-"} color="#be5aff" delay={0.2} />
          </div>
          <div className="mt-6 rounded-xl bg-black/35 p-4">
            <p className="font-ui text-xs uppercase tracking-widest text-white/55">Hits to knock out</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-digital text-5xl text-gold">{hits}</span>
              <div className="flex">{Array.from({ length: MAX_HP }).map((_, i) => <Heart key={i} />)}</div>
              <span className="text-xs text-white/50">every fighter has {MAX_HP} hearts</span>
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {w.auto && <li className="chip text-mint">Hold to fire</li>}
            {w.spread > 0 && <li className="chip">Spread ±{w.spread}px</li>}
            {id === "scream" && <li className="chip text-cyan">Falls back to Pistol</li>}
            {w.kind === "melee" && <li className="chip">Swap with KNIFE key</li>}
            {w.ammo > 0 && <li className="chip">Refilled by Ammo power-up</li>}
          </ul>
        </div>
      </div>

      <div className="panel mt-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-display text-3xl">{w.name} skins</h4>
          <p className="text-sm text-white/55">5 per weapon · 30 in total · bullet colour changes too</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          <button onClick={() => setSkin("")} className="cursor-pointer rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-1" style={{ borderColor: !skin ? "#ffd23f" : "rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)" }}>
            <img src={weaponImg(id, player)} alt="" className="px h-14 w-full object-contain" />
            <p className="mt-2 font-ui text-xs uppercase">Default</p>
            <p className="text-[11px] text-white/45">Always owned</p>
          </button>
          {skins.map((s) => (
            <button key={s.id} onClick={() => { setSkin(s.id); sfx("ui_move", 0.3); }} className={`cursor-pointer rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-1 ${s.rarity === "legendary" ? "rarity-legendary" : ""}`}
              style={{ borderColor: skin === s.id ? "#ffd23f" : "rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)" }}>
              <img src={s.img} alt={s.name} loading="lazy" className="px h-14 w-full object-contain" />
              <p className="mt-2 font-ui text-xs uppercase">{s.name}</p>
              <div className="mt-1 flex items-center justify-between"><RarityTag r={s.rarity} /><span className="flex items-center gap-1 text-xs"><Coin className="w-3.5 h-3.5" />{s.price}</span></div>
            </button>
          ))}
        </div>
        {sk && <p className="mt-3 text-xs text-white/50">Previewing {sk.name}. Weapon skins are bought in the Shop and equipped from the Inventory screen.</p>}
      </div>
    </Page>
  );
}