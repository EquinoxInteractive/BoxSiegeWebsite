import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Info } from "lucide-react";
import { ACTIONS, KEYCODES, KEYMAP, PAD, PLAYER_COLORS, SETTINGS_LIST } from "@/data/game";
import { Page } from "@/components/Page";
import { Reveal, useKeyDown } from "@/components/ui";
import { sfx } from "@/lib/audio";

type K = { c?: string; l: string; w?: number; h?: number };
const L = (ch: string): K => ({ c: `Key${ch}`, l: ch });
const row = (s: string) => s.split("").map(L);

/** Real keyboard geometry (1u = one standard key). Only the keys the game uses are bound. */
const MAIN: K[][] = [
  [{ l: "Tab", w: 1.5 }, ...row("QWERTYUIOP"), { l: "[" }, { l: "]" }, { l: "\\", w: 1.5 }],
  [{ l: "Caps", w: 1.75 }, ...row("ASDFGHJKL"), { l: ";" }, { l: "'" }, { l: "Enter", w: 2.25 }],
  [{ l: "Shift", w: 2.25 }, ...row("ZXCVBNM"), { c: "Comma", l: "," }, { c: "Period", l: "." }, { c: "Slash", l: "/" }, { l: "Shift", w: 2.75 }],
  [{ l: "Ctrl", w: 1.25 }, { l: "Win", w: 1.25 }, { l: "Alt", w: 1.25 }, { l: "", w: 6.25 }, { l: "Alt", w: 1.25 }, { l: "Win", w: 1.25 }, { l: "Menu", w: 1.25 }, { l: "Ctrl", w: 1.25 }],
];

const NUMPAD: (K & { col: number; row: number })[] = [
  { l: "Num", col: 1, row: 1 }, { l: "/", col: 2, row: 1 }, { l: "*", col: 3, row: 1 }, { l: "-", col: 4, row: 1 },
  { l: "7", col: 1, row: 2 }, { l: "8", c: "Numpad8", col: 2, row: 2 }, { l: "9", col: 3, row: 2 }, { l: "+", col: 4, row: 2, h: 2 },
  { l: "4", c: "Numpad4", col: 1, row: 3 }, { l: "5", c: "Numpad5", col: 2, row: 3 }, { l: "6", c: "Numpad6", col: 3, row: 3 },
  { l: "1", col: 1, row: 4 }, { l: "2", col: 2, row: 4 }, { l: "3", col: 3, row: 4 }, { l: "Ent", col: 4, row: 4, h: 2 },
  { l: "0", c: "Numpad0", col: 1, row: 5, w: 2 }, { l: ".", c: "NumpadDecimal", col: 3, row: 5 },
];

const ARROWS = [
  { c: "ArrowUp", l: "↑", col: 2, row: 1 },
  { c: "ArrowLeft", l: "←", col: 1, row: 2 }, { c: "ArrowDown", l: "↓", col: 2, row: 2 }, { c: "ArrowRight", l: "→", col: 3, row: 2 },
];

const ACT: Record<string, string> = { left: "LEFT", right: "RIGHT", up: "JUMP", down: "DROP", shoot: "SHOOT", knife: "KNIFE" };

function Key({ k, down, focus, style }: { k: K; down: Set<string>; focus: number | null; style?: React.CSSProperties }) {
  const bind = k.c ? KEYCODES[k.c] : undefined;
  const p = bind?.[0];
  const dim = bind !== undefined && focus !== null && focus !== p;
  const pressed = bind ? down.has(`${bind[0]}-${bind[1]}`) : false;
  const color = p !== undefined ? PLAYER_COLORS[p] : "";
  return (
    <div className="p-[2px]" style={{ width: `calc(var(--u) * ${k.w ?? 1})`, height: `calc(var(--u) * ${k.h ?? 1})`, ...style }}>
      <div
        className="relative flex h-full w-full flex-col items-center justify-center rounded-[7px] border text-center font-ui leading-none transition-all duration-100"
        style={{
          fontSize: "calc(var(--u) * 0.36)",
          background: bind ? (pressed ? color : `linear-gradient(180deg, ${color}55, ${color}22)`) : "linear-gradient(180deg, #1f1e44, #15152f)",
          borderColor: bind ? color : "rgba(255,255,255,0.08)",
          color: bind ? (pressed ? "#0b0b1c" : "#fff") : "rgba(255,255,255,0.28)",
          boxShadow: bind ? (pressed ? "none" : `0 3px 0 ${color}88, 0 0 14px ${color}33`) : "0 3px 0 #0a0a1c",
          transform: pressed ? "translateY(3px)" : undefined,
          opacity: dim ? 0.25 : 1,
        }}
      >
        <span>{k.l}</span>
        {bind && <span className="mt-[2px] font-bold tracking-wide" style={{ fontSize: "calc(var(--u) * 0.2)", opacity: 0.9, fontFamily: "var(--font-body)" }}>{ACT[bind[1]]}</span>}
        {bind && <span className="absolute -right-1 -top-1 grid place-items-center rounded-full border border-black font-ui text-white" style={{ background: color, width: "calc(var(--u) * 0.4)", height: "calc(var(--u) * 0.4)", fontSize: "calc(var(--u) * 0.24)" }}>{(p as number) + 1}</span>}
      </div>
    </div>
  );
}

function Keyboard({ down, focus }: { down: Set<string>; focus: number | null }) {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="mx-auto flex w-max items-end gap-[calc(var(--u)*0.5)] rounded-3xl border border-white/10 bg-gradient-to-b from-[#1b1a40] to-[#0f0f26] p-[calc(var(--u)*0.5)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]" style={{ ["--u" as string]: "clamp(34px, 3.3vw, 46px)" }}>
        <div>
          {MAIN.map((r, i) => (
            <div key={i} className="flex">{r.map((k, j) => <Key key={j} k={k} down={down} focus={focus} />)}</div>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, var(--u))", gridTemplateRows: "repeat(2, var(--u))" }}>
          {ARROWS.map((a) => <Key key={a.c} k={{ c: a.c, l: a.l }} down={down} focus={focus} style={{ gridColumn: a.col, gridRow: a.row, width: "auto", height: "auto" }} />)}
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(4, var(--u))", gridTemplateRows: "repeat(5, var(--u))" }}>
          {NUMPAD.map((n) => (
            <Key key={n.l + n.col + n.row} k={{ c: n.c, l: n.l }} down={down} focus={focus}
              style={{ gridColumn: `${n.col} / span ${n.w ?? 1}`, gridRow: `${n.row} / span ${n.h ?? 1}`, width: "auto", height: "auto" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Movement keys drawn as an inverted-T, exactly how the fingers sit on the keyboard. */
function PlayerPad({ p, down, active, onFocus }: { p: number; down: Set<string>; active: boolean; onFocus: (v: number | null) => void }) {
  const m = KEYMAP[p];
  const color = PLAYER_COLORS[p];
  const cap = (a: string) => {
    const on = down.has(`${p}-${a}`);
    return (
      <div className="flex flex-col items-center gap-1.5">
        <span className={`keycap ${on ? "down" : ""}`} style={{ ["--kc" as string]: color }}>{m[a as keyof typeof m]}</span>
        <span className="font-ui text-[10px] uppercase tracking-widest text-white/55">{ACT[a]}</span>
      </div>
    );
  };
  return (
    <motion.div
      onMouseEnter={() => onFocus(p)} onMouseLeave={() => onFocus(null)} onFocus={() => onFocus(p)} onBlur={() => onFocus(null)} tabIndex={0}
      whileHover={{ y: -5 }}
      className="panel relative h-full overflow-hidden p-5 outline-none"
      style={{ borderColor: active ? color : undefined, boxShadow: active ? `0 0 0 1px ${color}, 0 20px 50px -24px ${color}` : undefined }}
    >
      <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: color }} />
      <div className="flex items-center justify-between">
        <h3 className="font-display text-3xl" style={{ color }}>Player {p + 1}</h3>
        <span className="grid h-8 w-8 place-items-center rounded-full font-ui text-sm text-ink" style={{ background: color }}>{p + 1}</span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-x-2 gap-y-3">
        <span />{cap("up")}<span />
        {cap("left")}{cap("down")}{cap("right")}
      </div>
      <div className="mt-5 flex justify-center gap-8 border-t border-white/10 pt-4">
        {cap("shoot")}{cap("knife")}
      </div>
      <p className="mt-4 text-center text-[11px] text-white/45">{p === 3 ? "Uses the numpad - turn NumLock on." : p === 1 ? "Arrow keys plus / and ." : p === 0 ? "Left hand on WASD, F and G." : "Right hand on IJKL, H and U."}</p>
    </motion.div>
  );
}

export function Controls() {
  const [down, setDown] = useState<Set<string>>(new Set());
  const [last, setLast] = useState("");
  const [focus, setFocus] = useState<number | null>(null);
  useKeyDown((e, isDown) => {
    const hit = KEYCODES[e.code];
    if (!hit) return;
    const t = e.target as HTMLElement;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    const k = `${hit[0]}-${hit[1]}`;
    setDown((s) => { const n = new Set(s); if (isDown) n.add(k); else n.delete(k); return n; });
    if (isDown && !e.repeat) {
      setLast(`Player ${hit[0] + 1} · ${ACTIONS.find((a) => a.id === hit[1])!.label}`);
      sfx(hit[1] === "shoot" ? "gun_smith" : hit[1] === "knife" ? "knife_hit" : hit[1] === "up" ? "jump" : "ui_move", 0.3);
    }
  });

  return (
    <Page id="controls" title="Controls" wide
      intro="Four players fit on a single keyboard - each gets their own colour. Press any highlighted key on your keyboard to try it.">
      <Reveal>
        <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
          {PLAYER_COLORS.map((c, p) => (
            <button key={p} onMouseEnter={() => setFocus(p)} onMouseLeave={() => setFocus(null)} onClick={() => setFocus(focus === p ? null : p)}
              className="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 font-ui text-xs uppercase tracking-widest transition-colors"
              style={{ borderColor: focus === p ? c : "rgba(255,255,255,0.15)", background: focus === p ? `${c}33` : "rgba(0,0,0,0.3)" }}>
              <span className="h-3 w-3 rounded-full" style={{ background: c }} /> Player {p + 1}
            </button>
          ))}
        </div>
        <Keyboard down={down} focus={focus} />
        <p className="mt-3 h-6 text-center font-ui text-sm uppercase tracking-widest text-gold">{last || "Waiting for a key..."}</p>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((p) => <Reveal key={p} delay={p * 0.06} className="h-full"><PlayerPad p={p} down={down} active={focus === p} onFocus={setFocus} /></Reveal>)}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Reveal className="panel p-6">
          <div className="flex items-center gap-3"><Gamepad2 className="w-6 h-6 text-cyan" /><h3 className="font-display text-3xl">Controller</h3></div>
          <ul className="mt-4 grid gap-2">
            {PAD.map((r) => (
              <motion.li key={r.action} whileHover={{ x: 6 }} className="flex items-center justify-between rounded-lg bg-black/30 px-4 py-2.5 text-sm"><span className="font-ui uppercase tracking-wider">{r.action}</span><span className="text-white/65">{r.btn}</span></motion.li>
            ))}
          </ul>
          <p className="mt-4 flex gap-2 text-sm text-white/60"><Info className="mt-0.5 h-4 w-4 shrink-0" /> Plug in as many controllers as you like - hot-plug works. Each pad is assigned to a player automatically, and every menu is fully navigable with a pad.</p>
        </Reveal>
        <Reveal delay={0.08} className="panel p-6">
          <h3 className="font-display text-3xl">Controls & Settings screens</h3>
          <p className="mt-2 text-sm text-white/65">The CONTROLS screen lets every player rebind each action and choose a preferred device (keyboard or a specific controller). The SETTINGS screen offers:</p>
          <ul className="mt-4 flex flex-wrap gap-2">{SETTINGS_LIST.map((s) => <li key={s} className="chip normal-case !tracking-normal !text-xs">{s}</li>)}</ul>
        </Reveal>
      </div>
    </Page>
  );
}