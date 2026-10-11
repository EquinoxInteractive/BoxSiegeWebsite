import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Crown, Infinity as Inf, Shield, Users } from "lucide-react";
import { MAX_HP, PLAYER_COLORS, TEAM_NERF } from "@/data/game";
import { Page } from "@/components/Page";
import { Heart, Reveal, StatBar } from "@/components/ui";
import { sfx } from "@/lib/audio";

const TIMES = ["0:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "∞"];
const LAYOUTS = [
  { name: "Free-for-all", lanes: [[0], [1], [2], [3]] },
  { name: "2 v 1 v 1", lanes: [[0, 1], [2], [3], []] },
  { name: "2 v 2", lanes: [[0, 1], [2, 3], [], []] },
  { name: "3 v 1", lanes: [[0, 1, 2], [3], [], []] },
];

export function Rules() {
  const [rounds, setRounds] = useState(3);
  const [time, setTime] = useState(3);
  const [lay, setLay] = useState(2);
  const layout = LAYOUTS[lay];
  const biggest = Math.max(...layout.lanes.map((l) => l.length));
  const smallest = Math.min(...layout.lanes.filter((l) => l.length).map((l) => l.length));
  const nerf = TEAM_NERF[Math.min(2, biggest - smallest)];

  return (
    <Page id="rules" title="Match rules"
      intro="Everything about a Versus match is set on the Battle Settings screen. Try the controls below.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="panel p-5 sm:p-7">
          <div className="flex items-center gap-3"><Crown className="w-6 h-6 text-gold" /><h3 className="font-display text-3xl">Rounds to win</h3></div>
          <p className="mt-1 text-sm text-white/60">First player (or team) to this many round wins takes the match.</p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => { setRounds(n); sfx("ui_move", 0.3); }} className="relative h-14 flex-1 cursor-pointer rounded-xl font-digital text-3xl transition-colors" style={{ background: n === rounds ? "#ffd23f" : "rgba(255,255,255,0.07)", color: n === rounds ? "#0b0b1c" : "#fff" }}>{n}</button>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: rounds }).map((_, i) => (
              <motion.span key={i} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 45 }} transition={{ delay: i * 0.05, type: "spring" }} className="h-6 w-6 border-2 border-black" style={{ background: PLAYER_COLORS[i % 4] }} />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-white/50">When everyone is one win from the end, it is announced as the <b className="text-gold">Final Round</b>.</p>
        </Reveal>

        <Reveal delay={0.08} className="panel p-5 sm:p-7">
          <div className="flex items-center gap-3"><Clock className="w-6 h-6 text-cyan" /><h3 className="font-display text-3xl">Round timer</h3></div>
          <p className="mt-1 text-sm text-white/60">From 30 seconds to 5 minutes in 30-second steps - or no limit at all.</p>
          <div className="mt-4 text-center font-digital text-6xl text-cyan sm:text-7xl" style={{ textShadow: "0 0 24px #4fd8ff88" }}>{TIMES[time] === "∞" ? <Inf className="mx-auto h-16 w-16" /> : TIMES[time]}</div>
          <input type="range" min={0} max={TIMES.length - 1} value={time} onChange={(e) => { setTime(+e.target.value); sfx("ui_move", 0.15); }} className="mt-3 h-8 w-full accent-[#4fd8ff]" aria-label="Round time" />
          <p className="mt-2 text-sm text-white/65">When time runs out, the fighter with the highest health percentage wins the round. A tie goes to <b className="text-brand-red">Sudden Death</b>.</p>
        </Reveal>
      </div>

      <Reveal className="panel mt-6 p-5 sm:p-7 md:p-9">
        <div className="flex items-center gap-3"><Users className="w-6 h-6 text-mint" /><h3 className="font-display text-3xl">Team lanes & fair-play handicap</h3></div>
        <p className="mt-1 text-sm text-white/60">Pick a layout for four players. Teammates never hurt each other.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {LAYOUTS.map((l, i) => (
            <button key={l.name} onClick={() => { setLay(i); sfx("ui_move", 0.3); }} className="cursor-pointer rounded-lg px-3.5 py-2.5 font-ui text-xs uppercase tracking-wider transition-colors active:scale-95 sm:px-4 sm:py-2" style={{ background: i === lay ? "#4be3a0" : "rgba(255,255,255,0.07)", color: i === lay ? "#0b0b1c" : "#fff" }}>{l.name}</button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {layout.lanes.map((lane, li) => (
            <div key={li} className="min-h-[96px] rounded-xl border-2 border-dashed border-white/15 bg-black/25 p-2">
              <p className="font-ui text-[10px] uppercase tracking-widest text-white/40">Team {li + 1}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {lane.map((p) => (
                  <motion.div layout layoutId={`tok-${p}`} key={p} transition={{ type: "spring", stiffness: 380, damping: 28 }} className="grid h-10 w-10 place-items-center rounded-lg border-2 border-black font-digital text-xl text-white" style={{ background: PLAYER_COLORS[p] }}>P{p + 1}</motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4" key={lay}>
          <StatBar label="Damage" value={nerf.dmg / 100} display={`${nerf.dmg}%`} color="#ff4040" />
          <StatBar label="Fire rate" value={nerf.rate / 100} display={`${nerf.rate}%`} color="#ffd23f" delay={0.05} />
          <StatBar label="Move speed" value={nerf.speed / 100} display={`${nerf.speed}%`} color="#4be3a0" delay={0.1} />
          <StatBar label="Jump" value={nerf.jump / 100} display={`${nerf.jump}%`} color="#4fd8ff" delay={0.15} />
        </div>
        <p className="mt-3 text-xs text-white/50">Shown for the largest team in this layout: {nerf.label.toLowerCase()}. Small teams are never nerfed.</p>
      </Reveal>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { i: <Heart className="w-7 h-7" />, t: `${MAX_HP} hearts each`, d: "Every fighter starts each round with three hearts. Heal pickups restore one." },
          { i: <Shield className="w-7 h-7 text-cyan" />, t: "Flawless victory", d: "Win a round without losing a single heart and the announcer lets everyone know." },
          { i: <Crown className="w-7 h-7 text-gold" />, t: "Sudden Death", d: "Equal health at the buzzer? A tie-breaker round decides who takes the point." },
        ].map((x, i) => (
          <Reveal key={x.t} delay={i * 0.07} className="panel flex gap-4 p-4 sm:p-5">{x.i}<div><p className="font-ui text-lg">{x.t}</p><p className="mt-1 text-sm text-white/65">{x.d}</p></div></Reveal>
        ))}
      </div>
    </Page>
  );
}