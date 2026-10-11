import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { TRACKS, setSfxEnabled, sfx } from "@/lib/audio";

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function Background() {
  const boxes = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: 26 }, () => {
      const size = 18 + r() * 70;
      return {
        left: r() * 100, size, dur: 26 + r() * 40, delay: -r() * 60,
        dx: (r() - 0.5) * 160, rot: (r() > 0.5 ? 1 : -1) * (90 + r() * 270), o: 0.35 + r() * 0.65,
      };
    });
  }, []);
  return (
    <>
      <div className="bg-world" />
      <div className="fixed inset-0 -z-[1] overflow-hidden pointer-events-none" aria-hidden>
        {boxes.map((b, i) => (
          <span
            key={i}
            className="drift-box"
            style={{
              left: `${b.left}%`, width: b.size, height: b.size, opacity: b.o,
              animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`,
              ["--dx" as string]: `${b.dx}px`, ["--rot" as string]: `${b.rot}deg`,
            }}
          />
        ))}
      </div>
      <div className="bg-grid" />
    </>
  );
}

export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.5);
  const [open, setOpen] = useState(false);
  const [sfxOn, setSfxOn] = useState(true);

  useEffect(() => {
    const a = new Audio();
    a.loop = true;
    a.preload = "none";
    audio.current = a;
    return () => { a.pause(); a.src = ""; };
  }, []);

  useEffect(() => { if (audio.current) audio.current.volume = vol; }, [vol]);

  const play = (i: number) => {
    const a = audio.current;
    if (!a) return;
    if (i !== track || !a.src) { a.src = TRACKS[i].src; setTrack(i); }
    void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); } else play(track);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-end gap-3">
      <button
        onClick={() => { setOpen((o) => !o); sfx("ui_toggle_on", 0.25); }}
        aria-label="Music & sound"
        className="relative grid h-14 w-14 place-items-center rounded-full border-2 border-white/20 bg-black/70 backdrop-blur cursor-pointer transition-transform hover:scale-110"
        style={{ boxShadow: playing ? "0 0 26px rgba(255,210,63,0.55)" : "0 8px 24px rgba(0,0,0,0.5)" }}
      >
        <img src="/assets/ui/icon.jpg" alt="" className={`absolute inset-1 rounded-full object-cover ${playing ? "animate-[spin_6s_linear_infinite]" : "opacity-60"}`} />
        {!playing && <Music2 className="relative w-5 h-5 text-white drop-shadow" />}
        {playing && <span className="absolute inset-0 rounded-full border-2 border-gold animate-[pulse-ring_1.8s_ease-out_infinite]" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="panel w-64 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-ui text-xs uppercase tracking-widest text-gold">Soundtrack</p>
              <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-9 w-9 place-items-center rounded-full bg-gold text-ink cursor-pointer">
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>
            <ul className="mt-3 grid gap-1">
              {TRACKS.map((t, i) => (
                <li key={t.id}>
                  <button
                    onClick={() => play(i)}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm cursor-pointer transition-colors hover:bg-white/10"
                    style={{ color: i === track && playing ? "#ffd23f" : "#fff" }}
                  >
                    <span className="font-digital text-lg w-5">{i + 1}</span> {t.name}
                    {i === track && playing && <span className="ml-auto flex gap-0.5 items-end h-3">{[0, 1, 2].map((k) => <span key={k} className="w-0.5 bg-gold" style={{ height: "100%", animation: `flicker ${0.5 + k * 0.17}s infinite` }} />)}</span>}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-2">
              {vol === 0 ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-white/60" />}
              <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(+e.target.value)} className="w-full accent-[#ffd23f]" aria-label="Music volume" />
            </div>
            <label className="mt-3 flex items-center justify-between text-sm text-white/80 cursor-pointer">
              Sound effects
              <input type="checkbox" checked={sfxOn} onChange={(e) => { setSfxOn(e.target.checked); setSfxEnabled(e.target.checked); }} className="accent-[#ffd23f] w-4 h-4" />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
