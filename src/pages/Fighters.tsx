import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dices, Skull, Smile, Volume2 } from "lucide-react";
import { ARENAS, CHARACTERS, CHAR_SKINS, charSkinImg } from "@/data/game";
import { Page } from "@/components/Page";
import { Coin, FighterFace, RarityTag, useMedia } from "@/components/ui";
import { playUrl, sfx } from "@/lib/audio";

export function Fighters() {
  const [sel, setSel] = useState(0);
  const [ko, setKo] = useState(false);
  const [skin, setSkin] = useState<string>("");
  const [spin, setSpin] = useState(0);
  const small = useMedia("(max-width: 480px)");
  const c = CHARACTERS[sel];
  const arena = ARENAS[sel % ARENAS.length];

  const pick = (i: number) => {
    setSel(i); setSkin(""); setKo(false);
    playUrl(CHARACTERS[i].voice, 0.55);
  };
  const random = () => {
    sfx("ui_move", 0.4);
    setSpin((s) => s + 1);
    let n = sel;
    while (n === sel) n = Math.floor(Math.random() * CHARACTERS.length);
    pick(n);
  };

  const face = skin ? charSkinImg(c.id, skin) : ko ? c.die : c.img;
  const skinInfo = CHAR_SKINS.find((s) => s.id === skin);

  return (
    <Page id="fighters" title="24 fighters" wide
      intro="Every box has its own face, voice and attitude. Any fighter can be used by any player - you just can't pick the same one twice. 16 originals plus 8 brand-new faces.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* viewer */}
        <div className="panel relative overflow-hidden p-4 sm:p-5 md:p-8">
          <div className="absolute inset-0 opacity-45" style={{ background: `url(${arena.bg}) center/cover`, imageRendering: "pixelated" }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, ${c.color}55, transparent 60%), linear-gradient(180deg, rgba(11,11,28,0.55), rgba(11,11,28,0.92))` }} />

          <div className="relative flex min-h-[430px] flex-col items-center justify-between sm:min-h-[470px]">
            <div className="flex w-full items-start justify-between gap-3">
              <div>
                <AnimatePresence mode="wait">
                  <motion.h3 key={c.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.25 }}
                    className="font-display text-[2.6rem] leading-none sm:text-5xl md:text-7xl" style={{ color: c.color, textShadow: "0 4px 0 #000" }}>
                    {c.name}
                  </motion.h3>
                </AnimatePresence>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="chip">#{String(sel + 1).padStart(2, "0")}</span>
                  {c.isNew && <span className="chip text-mint border-mint/40">New fighter</span>}
                  {skinInfo && <RarityTag r={skinInfo.rarity} />}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => playUrl(c.voice, 0.7)} className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-black/40 cursor-pointer hover:border-gold hover:text-gold transition-colors" aria-label="Play voice line" title="Voice line">
                  <Volume2 className="w-5 h-5" />
                </button>
                <button onClick={() => { setKo((k) => !k); sfx("hit", 0.4); }} className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-black/40 cursor-pointer hover:border-gold hover:text-gold transition-colors" aria-label={ko ? "Show idle pose" : "Show KO pose"} title={ko ? "Idle pose" : "KO pose"}>
                  {ko ? <Smile className="w-5 h-5" /> : <Skull className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={c.id + face} initial={{ opacity: 0, scale: 0.6, rotate: -10, y: 30 }} animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: -20 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="my-4">
                <div className={ko ? "" : "animate-bob"}>
                  <FighterFace src={face} size={small ? 200 : 260} className="drop-shadow-[0_18px_0_rgba(0,0,0,0.5)]" />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="w-full">
              <p className="mb-2 font-ui text-[11px] uppercase tracking-widest text-white/50">Character skins · {CHAR_SKINS.length} per fighter</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button onClick={() => { setSkin(""); sfx("ui_move", 0.3); }} className="relative shrink-0 cursor-pointer rounded-xl border-2 p-1 transition-all hover:-translate-y-1" style={{ borderColor: skin === "" ? "#ffd23f" : "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.4)" }} title="Default">
                  <img src={c.img} alt="Default" className="px h-14 w-14" />
                </button>
                {CHAR_SKINS.map((s) => (
                  <button key={s.id} onClick={() => { setSkin(s.id); setKo(false); sfx("ui_move", 0.3); }} className="relative shrink-0 cursor-pointer rounded-xl border-2 p-1 transition-all hover:-translate-y-1" style={{ borderColor: skin === s.id ? "#ffd23f" : "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.4)" }} title={`${s.name} · ${s.price}`}>
                    <img src={charSkinImg(c.id, s.id)} alt={s.name} className="px h-14 w-14" loading="lazy" />
                  </button>
                ))}
              </div>
              <p className="mt-1 h-5 text-sm text-white/70">
                {skinInfo ? <span className="inline-flex items-center gap-2"><b className="font-ui text-white">{skinInfo.name}</b> · <Coin /> {skinInfo.price}</span> : "Default skin · always owned"}
              </p>
            </div>
          </div>
        </div>

        {/* roster grid */}
        <div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2.5">
            {CHARACTERS.map((ch, i) => {
              const on = i === sel;
              return (
                <motion.button
                  key={ch.id}
                  onClick={() => pick(i)}
                  onMouseEnter={() => sfx("ui_hover", 0.08)}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 bg-black/40"
                  style={{ borderColor: on ? ch.color : "rgba(255,255,255,0.1)", boxShadow: on ? `0 0 0 2px ${ch.color}55, 0 0 26px ${ch.color}88` : undefined }}
                  aria-label={ch.name}
                  aria-pressed={on}
                >
                  <img src={ch.img} alt={ch.name} className="px h-full w-full" loading="lazy" />
                  {ch.isNew && <span className="absolute left-0.5 top-0.5 rounded bg-mint px-1 font-ui text-[8px] uppercase leading-3 text-ink">New</span>}
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 py-0.5 text-center font-ui text-[9px] uppercase tracking-wider">{ch.name}</span>
                  {on && <motion.span layoutId="fighter-ring" className="absolute inset-0 rounded-[10px] border-2 border-white/80" />}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <button onClick={random} className="skew-btn ghost !py-2.5 !px-5 !text-xs"><span className="flex items-center gap-2"><motion.span animate={{ rotate: spin * 360 }} transition={{ duration: 0.5 }}><Dices className="w-4 h-4" /></motion.span> Random fighter</span></button>
            <p className="text-xs text-white/50">Same as the RANDOM tile in the game.</p>
          </div>

          <div className="panel mt-4 grid gap-3 p-4 text-sm text-white/70 sm:mt-5 sm:grid-cols-2 sm:p-5">
            <p><b className="font-ui text-white">One of a kind.</b> In a match, each fighter can only be locked in by one player - others see “TAKEN BY Px”.</p>
            <p><b className="font-ui text-white">Skins are per fighter.</b> 10 themes × 24 fighters = 240 character skins, bought individually.</p>
            <p><b className="font-ui text-white">KO poses.</b> Every fighter and skin has its own defeat sprite shown when a round ends.</p>
            <p><b className="font-ui text-white">Voice lines.</b> Each fighter is announced by name in-game - click one to hear it.</p>
          </div>
        </div>
      </div>
    </Page>
  );
}