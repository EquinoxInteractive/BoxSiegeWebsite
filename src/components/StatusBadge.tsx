import { Hammer, Rocket } from "lucide-react";
import { GAME_STATUS, STATUS_INFO } from "@/data/game";

/** Small pill showing whether the game is released or still in development (set GAME_STATUS in data/game.ts). */
export function StatusBadge({ className = "" }: { className?: string }) {
  const info = STATUS_INFO[GAME_STATUS];
  const Icon = GAME_STATUS === "released" ? Rocket : Hammer;
  return (
    <span
      className={`chip ${className}`}
      style={{ color: info.color, borderColor: `${info.color}66`, background: `${info.color}14` }}
    >
      <Icon className="h-3.5 w-3.5" /> {info.label}
    </span>
  );
}