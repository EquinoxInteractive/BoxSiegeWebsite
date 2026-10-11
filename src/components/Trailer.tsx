import { useState } from "react";
import { ExternalLink, Film, Play } from "lucide-react";
import { A, ARENAS } from "@/data/game";
import { Reveal } from "./ui";
import { StatusBadge } from "./StatusBadge";

/**
 * ─── HOW TO SET YOUR VIDEO ────────────────────────────────────────────────────
 *  Change ONLY the PREVIEW_VIDEO line below. The type is detected automatically:
 *
 *  1. LOCAL FILE   "/assets/video/preview.mp4"                       (file in public/assets/video/)
 *  2. YOUTUBE      "https://www.youtube.com/watch?v=XXXXXXXXXXX"     (also youtu.be/…, /shorts/…, /live/…)
 *  3. GOOGLE DRIVE "https://drive.google.com/file/d/FILE_ID/view"    (share it as "Anyone with the link")
 *  4. DIRECT LINK  "https://example.com/video.mp4"                   (any link ending in .mp4 / .webm / .ogg / .mov)
 *
 *  Leave it as "" to show the "coming soon" placeholder.
 *  PREVIEW_POSTER is only used for local files and direct links (optional cover image).
 * ────────────────────────────────────────────────────────────────────────────── */
// export const PREVIEW_VIDEO: string = `${A}/video/preview.mp4`;
export const PREVIEW_VIDEO: string = "https://drive.google.com/file/d/1qDZdTi-WrF8lFJd6TQTFB3xR_LHUYBYd/preview";

const PREVIEW_POSTER: string = `${A}/video/preview.jpg`;


type Source =
  | { kind: "youtube"; id: string; src: string; open: string; poster: string }
  | { kind: "drive"; id: string; src: string; open: string; poster: string }
  | { kind: "file"; src: string }
  | { kind: "none" };

/** Works out what kind of video link was given and turns it into something that can be embedded. */
function parseSource(raw: string): Source {
  const url = raw.trim();
  if (!url) return { kind: "none" };

  // YouTube: watch?v=, youtu.be/, /shorts/, /embed/, /live/
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/i);
  if (yt) {
    return {
      kind: "youtube", id: yt[1],
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1&playsinline=1`,
      open: `https://www.youtube.com/watch?v=${yt[1]}`,
      poster: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`,
    };
  }

  // Google Drive: /file/d/ID/…, open?id=ID, uc?id=ID
  if (/drive\.google\.com/i.test(url)) {
    const d = url.match(/\/file\/d\/([\w-]+)/i) ?? url.match(/[?&]id=([\w-]+)/i);
    if (d) {
      return {
        kind: "drive", id: d[1],
        src: `https://drive.google.com/file/d/${d[1]}/preview`,
        open: `https://drive.google.com/file/d/${d[1]}/view`,
        poster: `https://drive.google.com/thumbnail?id=${d[1]}&sz=w1280`,
      };
    }
    return { kind: "none" };
  }

  // local file (starts with "/") or any direct https link to a video file
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return { kind: "file", src: url };

  return { kind: "none" };
}

function Placeholder() {
  return (
    <div className="absolute inset-0 grid place-items-center text-center text-white/60">
      <div>
        <Film className="mx-auto h-12 w-12 text-gold" />
        <p className="mt-3 font-ui text-sm uppercase tracking-[0.2em]">Gameplay preview coming soon</p>
      </div>
    </div>
  );
}

/**
 * Embedded players (Google Drive / YouTube) are not loaded until you tap play.
 * Why: a Drive player mounted straight into the page (lazy, inside animated and blurred
 * wrappers) often renders tiny, black or without controls on phones. Loading it from a
 * tap gives it a real, visible, full-width box and a user gesture, so it plays normally.
 */
function EmbedFacade({ source }: { source: Extract<Source, { kind: "youtube" | "drive" }> }) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        // YouTube can start by itself after the tap; Drive shows its own play button
        src={source.kind === "youtube" ? `${source.src}&autoplay=1` : source.src}
        title="BOX SIEGE gameplay preview"
        allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 block h-full w-full border-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label="Play gameplay preview"
      className="group absolute inset-0 grid cursor-pointer place-items-center overflow-hidden"
      style={{ background: `url(${source.poster}) center/cover no-repeat, url(${ARENAS[0].bg}) center/cover no-repeat`, imageRendering: "auto" }}
    >
      <span className="absolute inset-0 bg-gradient-to-t from-[#0b0b1c]/80 via-[#0b0b1c]/25 to-[#0b0b1c]/40" />
      <span className="relative grid place-items-center">
        <span className="absolute h-16 w-16 rounded-full bg-gold/60 sm:h-20 sm:w-20" style={{ animation: "pulse-ring 1.8s ease-out infinite" }} />
        <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gold text-ink shadow-[0_0_0_4px_#0b0b1c,0_0_0_6px_#ffd23f,0_14px_30px_-8px_rgba(255,210,63,0.6)] transition-transform group-active:scale-95 sm:h-20 sm:w-20 sm:group-hover:scale-110">
          <Play className="ml-1 h-7 w-7 sm:h-9 sm:w-9" fill="currentColor" />
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-3 text-center font-ui text-xs uppercase tracking-[0.2em] text-white/80 sm:bottom-4 sm:text-sm">Tap to play</span>
    </button>
  );
}

/** The video player itself (16:9 panel). Reused on the home page and the download page. */
export function VideoPreview({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  const source = parseSource(PREVIEW_VIDEO);
  const embed = source.kind === "youtube" || source.kind === "drive" ? source : null;

  return (
    <div className={`mx-auto w-full ${className}`}>
      {/* plain box (no blur / transform) so the embedded player always gets a proper size */}
      <div className="rounded-2xl border border-white/10 bg-[#12122b] p-1.5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] sm:p-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
          {source.kind === "none" || (source.kind === "file" && failed) ? (
            <Placeholder />
          ) : source.kind === "file" ? (
            <video
              src={source.src}
              poster={PREVIEW_POSTER || undefined}
              controls
              playsInline
              preload="metadata"
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full object-contain"
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <EmbedFacade source={source} />
          )}
        </div>
      </div>
      {embed && (
        <p className="mt-3 text-center text-xs text-white/50">
          Player too small on your phone?{" "}
          <a href={embed.open} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-ui uppercase tracking-wider text-gold underline-offset-4 hover:underline">
            Open in {embed.kind === "drive" ? "Google Drive" : "YouTube"} <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      )}
    </div>
  );
}

/** Gameplay preview section for the home page. */
export function Trailer() {
  return (
    <section className="relative px-4 py-14 sm:px-5 md:py-28" aria-labelledby="trailer-title">
      <Reveal className="mx-auto max-w-5xl text-center">
        <div className="flex justify-center"><StatusBadge /></div>
        <h2 id="trailer-title" className="mt-4 font-display text-[2.7rem] leading-none sm:text-5xl md:text-7xl">See it in action</h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-white/70 sm:text-lg">A quick look at the chaos: fast fights, wild arenas and four players on one screen.</p>
        <VideoPreview className="mt-7 md:mt-10" />
      </Reveal>
    </section>
  );
}