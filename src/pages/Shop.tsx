import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ACCESSORIES, CHARACTERS, CHAR_SKINS, RARITY, SLOTS, WEAPONS, WEAPON_SKINS, charSkinImg, type Rarity, type WeaponId } from "@/data/game";
import { Page } from "@/components/Page";
import { Coin, Counter, FighterFace, RarityTag, Reveal, Tabs } from "@/components/ui";
import { sfx } from "@/lib/audio";

type Tab = "skins" | "weapons" | "acc";

function Picker({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2">
      {CHARACTERS.map((c, i) => (
        <button key={c.id} onClick={() => onChange(i)} className="shrink-0 cursor-pointer rounded-lg border-2 p-0.5 transition-transform hover:-translate-y-0.5" style={{ borderColor: i === value ? "#be5aff" : "rgba(255,255,255,0.1)" }} aria-label={c.name}>
          <img src={c.img} alt={c.name} className="px h-9 w-9" loading="lazy" />
        </button>
      ))}
    </div>
  );
}

function Skins() {
  const [ci, setCi] = useState(16);
  const [si, setSi] = useState(9);
  const c = CHARACTERS[ci];
  const s = CHAR_SKINS[si];
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="panel flex flex-col items-center p-6">
        <AnimatePresence mode="wait">
          <motion.div key={c.id + s.id} initial={{ opacity: 0, rotateY: 90, scale: 0.8 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} exit={{ opacity: 0, rotateY: -90 }} transition={{ duration: 0.35 }} className={s.rarity === "legendary" ? "rarity-legendary rounded-xl" : ""}>
            <FighterFace src={charSkinImg(c.id, s.id)} size={220} className="drop-shadow-[0_14px_0_rgba(0,0,0,0.45)]" />
          </motion.div>
        </AnimatePresence>
        <p className="mt-5 font-display text-4xl leading-none">{s.name}</p>
        <p className="font-ui text-xs uppercase tracking-widest text-white/50">{c.name}</p>
        <div className="mt-3 flex items-center gap-3"><RarityTag r={s.rarity} /><span className="flex items-center gap-1.5 font-ui"><Coin className="w-5 h-5" />{s.price}</span></div>
      </div>
      <div className="panel p-5">
        <Picker value={ci} onChange={(i) => { setCi(i); sfx("ui_move", 0.2); }} />
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {CHAR_SKINS.map((x, i) => (
            <button key={x.id} onClick={() => { setSi(i); sfx("ui_move", 0.3); }} className={`cursor-pointer rounded-xl border-2 p-2 text-center transition-all hover:-translate-y-1 ${x.rarity === "legendary" ? "rarity-legendary" : ""}`} style={{ borderColor: i === si ? RARITY[x.rarity].color : "rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)" }}>
              <img src={charSkinImg(c.id, x.id)} alt={x.name} className="px mx-auto h-16 w-16" loading="lazy" />
              <p className="mt-1.5 truncate font-ui text-[11px] uppercase">{x.name}</p>
              <p className="flex items-center justify-center gap-1 text-[11px]" style={{ color: RARITY[x.rarity].color }}><Coin className="w-3 h-3" />{x.price}</p>
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-white/55">10 skin themes per fighter, from 8-BIT to the legendary rainbow-framed COSMIC. Each skin comes with its own KO sprite.</p>
      </div>
    </div>
  );
}

function WeaponSkins() {
  const [w, setW] = useState<WeaponId>("smith");
  const list = WEAPON_SKINS[w];
  return (
    <div className="panel p-6">
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {WEAPONS.map((x) => (
          <button key={x.id} onClick={() => { setW(x.id); sfx("ui_move", 0.3); }} className="cursor-pointer rounded-lg px-4 py-2 font-ui text-xs uppercase tracking-wider transition-colors" style={{ background: x.id === w ? x.color : "rgba(255,255,255,0.07)", color: x.id === w ? "#0b0b1c" : "#fff" }}>{x.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {list.map((s, i) => (
          <motion.div key={w + s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }}
            className={`rounded-xl border p-4 ${s.rarity === "legendary" ? "rarity-legendary" : ""}`} style={{ borderColor: `${RARITY[s.rarity].color}66`, background: "rgba(0,0,0,0.3)" }}>
            <img src={s.img} alt={s.name} className="px h-20 w-full object-contain" loading="lazy" />
            <p className="mt-3 font-display text-2xl leading-none">{s.name}</p>
            <div className="mt-2 flex items-center justify-between"><RarityTag r={s.rarity} /><span className="flex items-center gap-1 text-sm"><Coin className="w-4 h-4" />{s.price}</span></div>
            <span className="mt-2 flex items-center gap-2 text-[11px] text-white/50"><i className="h-2.5 w-6 rounded-full" style={{ background: s.bullet.startsWith("#") ? s.bullet : `#${s.bullet}` }} /> Bullet trail</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Accessories() {
  const [ci, setCi] = useState(0);
  const [slot, setSlot] = useState<(typeof SLOTS)[number]>("head");
  const [worn, setWorn] = useState<Record<string, string>>({ head: "crown" });
  const c = CHARACTERS[ci];
  const wearing = useMemo(() => Object.values(worn).map((id) => ACCESSORIES.find((a) => a.id === id)!).filter(Boolean), [worn]);
  const total = wearing.reduce((n, a) => n + a.price, 0);
  const items = ACCESSORIES.filter((a) => a.slot === slot);
  const toggle = (id: string, s: string) => { sfx("ui_confirm", 0.3); setWorn((w) => { const n = { ...w }; if (n[s] === id) delete n[s]; else n[s] = id; return n; }); };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="panel flex flex-col items-center p-6">
        <p className="font-ui text-xs uppercase tracking-widest text-white/50">Try-on · {c.name}</p>
        <div className="my-10 animate-bob"><FighterFace src={c.img} size={190} eyeY={c.eyeY} accessories={wearing} className="drop-shadow-[0_14px_0_rgba(0,0,0,0.45)]" /></div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {wearing.map((a) => <span key={a.id} className="chip" style={{ color: RARITY[a.rarity].color }}>{a.name}</span>)}
        </div>
        <p className="mt-3 flex items-center gap-2 font-ui text-sm">Outfit value: <Coin className="w-5 h-5" /> <Counter to={total} className="font-digital text-2xl text-gold" /></p>
        <button onClick={() => setWorn({})} className="mt-3 cursor-pointer text-xs uppercase tracking-widest text-white/50 underline-offset-4 hover:text-gold hover:underline">Clear outfit</button>
      </div>
      <div className="panel p-5">
        <Picker value={ci} onChange={setCi} />
        <div className="mt-2 flex justify-center">
          <Tabs id="slot" value={slot} onChange={(s) => { setSlot(s); sfx("ui_move", 0.25); }} accent="#be5aff" tabs={SLOTS.map((s) => ({ id: s, label: s, badge: String(ACCESSORIES.filter((a) => a.slot === s).length) }))} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {items.map((a) => {
            const on = worn[slot] === a.id;
            return (
              <button key={a.id} onClick={() => toggle(a.id, slot)} className="cursor-pointer rounded-xl border-2 p-2 text-center transition-all hover:-translate-y-1" style={{ borderColor: on ? RARITY[a.rarity].color : "rgba(255,255,255,0.1)", background: on ? `${RARITY[a.rarity].color}1f` : "rgba(0,0,0,0.3)" }}>
                <img src={a.img} alt={a.name} className="px mx-auto h-16 w-16 object-contain" loading="lazy" />
                <p className="mt-1 truncate font-ui text-[11px] uppercase">{a.name}</p>
                <p className="flex items-center justify-center gap-1 text-[11px]" style={{ color: RARITY[a.rarity].color }}><Coin className="w-3 h-3" />{a.price}</p>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-white/55">One item per slot, equipped per fighter and skin from the Inventory screen. Accessories render in front of or behind the box to match their type.</p>
      </div>
    </div>
  );
}

export function Shop() {
  const [tab, setTab] = useState<Tab>("skins");
  const rar = (["common", "rare", "epic", "legendary"] as Rarity[]);
  return (
    <Page id="shop" title="Shop & inventory" wide
      intro="301 ways to stand out. Earn coins in the Campaign, buy what you like, and equip it in the Inventory - purely cosmetic, never pay-to-win.">
      <Reveal className="mb-6 flex flex-wrap items-center justify-center gap-3">
        {rar.map((r) => <RarityTag key={r} r={r} />)}
      </Reveal>
      <Reveal className="mb-8 flex justify-center">
        <Tabs id="shop" value={tab} onChange={(t) => { setTab(t); sfx("ui_move", 0.3); }} accent="#be5aff"
          tabs={[{ id: "skins", label: "Fighter skins", badge: "240" }, { id: "weapons", label: "Weapon skins", badge: "30" }, { id: "acc", label: "Accessories", badge: "31" }]} />
      </Reveal>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
          {tab === "skins" && <Skins />}
          {tab === "weapons" && <WeaponSkins />}
          {tab === "acc" && <Accessories />}
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}
