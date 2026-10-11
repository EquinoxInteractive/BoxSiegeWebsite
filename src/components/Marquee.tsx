const WORDS = ["24 FIGHTERS", "10 ARENAS", "250 LEVELS", "50 BOSSES", "9 POWER-UPS", "6 WEAPONS", "4 PLAYERS", "301 COSMETICS", "TEAM BATTLES", "CONTROLLER READY", "SUDDEN DEATH", "FREE TO PLAY"];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden py-4" aria-hidden>
    <div className="relative overflow-hidden border-y-4 border-black bg-gold py-3 -rotate-1 scale-105">
      <div className="marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={i} className="flex items-center font-display text-3xl md:text-4xl text-ink px-5 whitespace-nowrap">
                {w}
                <span className="ml-10 inline-block h-3 w-3 rotate-45 bg-ink" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
