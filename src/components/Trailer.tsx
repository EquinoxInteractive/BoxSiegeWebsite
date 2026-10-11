import { useState } from "react";
import { Film } from "lucide-react";
import { A } from "@/data/game";
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
export const PREVIEW_VIDEO: string = "https://drive.google.com/file/d/1aFNfS5eG9DxgMnd9ormEkqFPDUx_jnAh/preview";

const PREVIEW_POSTER: string = `${A}/video/preview.jpg`;


type Source =
  | { kind: "youtube"; src: string }
  | { kind: "drive"; src: string }
  | { kind: "file"; src: string }
  | { kind: "none" };

/** Works out what kind of video link was given and turns it into something that can be embedded. */
function parseSource(raw: string): Source {
  const url = raw.trim();
  if (!url) return { kind: "none" };

  // YouTube: watch?v=, youtu.be/, /shorts/, /embed/, /live/
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/i);
  if (yt) return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1&playsinline=1` };

  // Google Drive: /file/d/ID/…, open?id=ID, uc?id=ID
  if (/drive\.google\.com/i.test(url)) {
    const d = url.match(/\/file\/d\/([\w-]+)/i) ?? url.match(/[?&]id=([\w-]+)/i);
    if (d) return { kind: "drive", src: `https://drive.google.com/file/d/${d[1]}/preview` };
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

/** The video player itself (16:9 panel). Reused on the home page and the download page. */
export function VideoPreview({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  const source = parseSource(PREVIEW_VIDEO);

  return (
    <div className={`panel mx-auto overflow-hidden p-2 md:p-3 ${className}`}>
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
          <iframe
            src={source.src}
            title="BOX SIEGE gameplay preview"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>
    </div>
  );
}

/** Gameplay preview section for the home page. */
export function Trailer() {
  return (
    <section className="relative px-5 py-20 md:py-28" aria-labelledby="trailer-title">
      <Reveal className="mx-auto max-w-5xl text-center">
        <div className="flex justify-center"><StatusBadge /></div>
        <h2 id="trailer-title" className="mt-4 font-display text-5xl md:text-7xl">See it in action</h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-white/70">A quick look at the chaos: fast fights, wild arenas and four players on one screen.</p>
        <VideoPreview className="mt-10" />
      </Reveal>
    </section>
  );
}