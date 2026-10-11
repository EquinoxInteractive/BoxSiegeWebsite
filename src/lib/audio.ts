import { A } from "@/data/game";

let sfxOn = true;
export const setSfxEnabled = (v: boolean) => { sfxOn = v; };
export const isSfxEnabled = () => sfxOn;

const cache = new Map<string, HTMLAudioElement>();

function get(url: string) {
  let a = cache.get(url);
  if (!a) {
    a = new Audio(url);
    a.preload = "auto";
    cache.set(url, a);
  }
  return a;
}

/** Play a one-shot sound effect (assets/sfx/<name>.mp3). Overlapping plays are cloned. */
export function sfx(name: string, volume = 0.6, rate = 1) {
  if (!sfxOn) return;
  playUrl(`${A}/sfx/${name}.mp3`, volume, rate);
}

export function playUrl(url: string, volume = 0.6, rate = 1) {
  if (!sfxOn) return;
  try {
    const base = get(url);
    const a = base.paused || base.ended ? base : (base.cloneNode() as HTMLAudioElement);
    a.volume = Math.min(1, Math.max(0, volume));
    a.playbackRate = rate;
    a.currentTime = 0;
    void a.play().catch(() => {});
  } catch {
    /* autoplay blocked or unsupported - ignore */
  }
}

export const TRACKS = [
  { id: "menu", name: "Main Menu", src: `${A}/music/menu.ogg` },
  { id: "campaign", name: "Campaign", src: `${A}/music/campaign.ogg` },
  { id: "game", name: "Battle", src: `${A}/music/game.ogg` },
  { id: "boss", name: "Boss Fight", src: `${A}/music/boss.ogg` },
] as const;
