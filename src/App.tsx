import { Component, Fragment, Suspense, lazy, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Background, MusicPlayer } from "@/components/Ambient";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import Home from "@/pages/Home";
import { ARENAS } from "@/data/game";
import { PAGES } from "@/data/pages";

/* ─────────────────────────────────────────────────────────────────────────────
 * Pages. Every page except Home is its own chunk. The route table below is used
 * twice: React.lazy for a first visit / deep link, and by the page transition,
 * which downloads the next page while the cover slides in and keeps the loaded
 * component, so the swap is fully synchronous (no "Loading" flash, no empty gap).
 * ──────────────────────────────────────────────────────────────────────────── */
type Route = { load: () => Promise<unknown>; pick: (m: any) => ComponentType }; // eslint-disable-line @typescript-eslint/no-explicit-any

const ROUTES: Record<string, Route> = {
  "/modes": { load: () => import("@/pages/Modes"), pick: (m) => m.Modes },
  "/fighters": { load: () => import("@/pages/Fighters"), pick: (m) => m.Fighters },
  "/arsenal": { load: () => import("@/pages/Arsenal"), pick: (m) => m.Arsenal },
  "/arenas": { load: () => import("@/pages/Arenas"), pick: (m) => m.Arenas },
  "/power-ups": { load: () => import("@/pages/PowerUps"), pick: (m) => m.PowerUps },
  "/campaign": { load: () => import("@/pages/Campaign"), pick: (m) => m.Campaign },
  "/rules": { load: () => import("@/pages/Rules"), pick: (m) => m.Rules },
  "/shop": { load: () => import("@/pages/Shop"), pick: (m) => m.Shop },
  "/controls": { load: () => import("@/pages/Controls"), pick: (m) => m.Controls },
  "/download": { load: () => import("@/pages/Download"), pick: (m) => m.default },
  "*": { load: () => import("@/pages/NotFound"), pick: (m) => m.default },
};

const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";
const routeId = (pathname: string) => {
  const k = norm(pathname);
  return k === "/" ? "/" : ROUTES[k] ? k : "*";
};

const loaded = new Map<string, ComponentType>(); // components whose chunk has arrived
const lazies = new Map<string, ComponentType>(); // React.lazy fallbacks (first visit only)

/** Resolves the component for a path. Loaded pages render synchronously. */
function componentFor(pathname: string): ComponentType {
  const id = routeId(pathname);
  if (id === "/") return Home;
  const hit = loaded.get(id);
  if (hit) return hit;
  let lz = lazies.get(id);
  if (!lz) {
    const r = ROUTES[id];
    lz = lazy(() => r.load().then((m) => { const C = r.pick(m); loaded.set(id, C); return { default: C }; }));
    lazies.set(id, lz);
  }
  return lz;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Page transition
 *
 * The old version swapped the page instantly and only hid it behind opacity: 0
 * while the wipe was still sliding in, so the old page vanished BEFORE it was
 * covered (a blank flash), the new page popped in at almost the exact moment
 * the screen became fully covered (a flicker), and a slow chunk showed
 * "Loading" after the wipe had already gone.
 *
 * Now it is a proper sequence, driven by one state machine in <Layout>:
 *   1. COVER   the slash slides in over the OLD page (chunk + images preload)
 *   2. HOLD    fully covered: logo shown, waits for the chunk (max 10 s)
 *   3. SWAP    new page mounts under the cover, scroll jumps to top
 *   4. REVEAL  the slash slides out and uncovers the NEW page
 * Clicking another link at any point simply restarts the sequence cleanly.
 * ──────────────────────────────────────────────────────────────────────────── */
const START = -115; // panel fully off-screen on the left (percent of its own width)
const COVER = -25;  // panel covers the whole viewport
const END = 65;     // panel fully off-screen on the right
const COVER_MS = 900;
const HOLD_MS = 280;
const REVEAL_MS = 1100;
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";
const ACCENT = "var(--tx-accent, #ffd23f)";
const STRIPES = `linear-gradient(90deg, ${ACCENT} 0 28px, #f2f2ff 28px 56px, #4fd8ff 56px 84px, #0b0b1c 84px calc(100% - 84px), #4fd8ff calc(100% - 84px) calc(100% - 56px), #f2f2ff calc(100% - 56px) calc(100% - 28px), ${ACCENT} calc(100% - 28px))`;
const tf = (x: number) => `translateX(${x}%) skewX(-10deg)`;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const frames = (n: number) =>
  new Promise<void>((resolve) => {
    let left = n;
    const tick = () => (--left <= 0 ? resolve() : requestAnimationFrame(tick));
    requestAnimationFrame(tick);
  });

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

/** Downloads everything the next page needs. Never rejects; reports how it went. */
async function prepare(pathname: string): Promise<"ok" | "failed" | "slow"> {
  const id = routeId(pathname);
  const def = PAGES.find((p) => p.path === norm(pathname));
  const arena = def && ARENAS.find((a) => a.id === def.stage);
  const chunk = id === "/" || loaded.has(id)
    ? Promise.resolve()
    : ROUTES[id].load().then((m) => { loaded.set(id, ROUTES[id].pick(m)); });
  // the page header backdrop: wait for it, but never longer than 1.2 s
  const images = Promise.race([Promise.all(arena ? [preloadImage(arena.bg), preloadImage(arena.floor)] : []), wait(1200)]);
  return Promise.race([
    Promise.all([chunk, images]).then(() => "ok" as const, () => "failed" as const),
    wait(10000).then(() => "slow" as const),
  ]);
}

/** After a new deploy an open tab can ask for a chunk that no longer exists. One hard reload fixes it. */
function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem("bs-reload") ?? 0);
    if (Date.now() - last < 15000) return false;
    sessionStorage.setItem("bs-reload", String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

class RouteBoundary extends Component<{ resetKey: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) {
    const msg = String((err as Error)?.message ?? err);
    if (/dynamically imported module|importing a module script|loading chunk|failed to fetch/i.test(msg)) reloadOnce();
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false });
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="grid min-h-[70svh] place-items-center px-5 pt-28 text-center">
        <div>
          <h1 className="font-display text-6xl md:text-8xl" style={{ textShadow: "0 5px 0 #000" }}>Oops</h1>
          <p className="mx-auto mt-3 max-w-md text-lg text-white/70">This page could not be loaded. Check your connection and try again.</p>
          <button onClick={() => window.location.reload()} className="skew-btn mt-8"><span>Reload</span></button>
        </div>
      </section>
    );
  }
}

function Loading() {
  return (
    <div className="grid min-h-[70svh] place-items-center">
      <img src="/assets/ui/title.webp" alt="Loading" className="px w-56 animate-pulse" />
    </div>
  );
}

function Layout() {
  const location = useLocation();
  const [shown, setShown] = useState(location); // the location that is actually on screen

  const shownPath = useRef(location.pathname);
  const busy = useRef(false);
  const token = useRef(0);
  const panel = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const scrolledFor = useRef(shown.pathname);
  const seg = useRef<{ from: number; to: number; anim: Animation } | null>(null);
  const logoAnim = useRef<Animation | null>(null);

  // we handle scroll ourselves (always start a page at the top)
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  // the transition state machine: runs whenever the router location changes.
  // The panel is animated with the Web Animations API, so it runs on the GPU
  // compositor and stays smooth even while React is busy mounting the next page.
  useEffect(() => {
    const dest = location;
    if (dest.pathname === shownPath.current && !busy.current) return;

    const me = ++token.current;
    const alive = () => token.current === me;
    busy.current = true;

    const pos = () => {
      const s = seg.current;
      if (!s) return START;
      const prog = s.anim.effect?.getComputedTiming().progress ?? 0;
      return s.from + (s.to - s.from) * prog;
    };
    const sweep = (from: number, to: number, ms: number) => {
      const el = panel.current;
      if (!el) return Promise.resolve(false);
      const anim = el.animate([{ transform: tf(from) }, { transform: tf(to) }], { duration: ms, easing: EASING, fill: "both" });
      const prev = seg.current?.anim;
      seg.current = { from, to, anim };
      prev?.cancel();
      return anim.finished.then(() => true, () => false);
    };
    const fadeLogo = (to: number, ms: number, delay = 0) => {
      const el = logo.current;
      if (!el) return;
      const from = Number(getComputedStyle(el).opacity) || 0;
      const prev = logoAnim.current;
      logoAnim.current = el.animate([{ opacity: from }, { opacity: to }], { duration: ms, delay, easing: "ease-out", fill: "both" });
      prev?.cancel();
    };

    void (async () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ready = prepare(dest.pathname); // starts downloading right away

      // 1. COVER: the slash slides over the OLD page
      if (!reduce && panel.current) {
        const accent = PAGES.find((pg) => pg.path === norm(dest.pathname))?.accent ?? "#ffd23f";
        panel.current.style.setProperty("--tx-accent", accent);
        panel.current.style.visibility = "visible";
        if (logo.current) logo.current.style.visibility = "visible";
        const cur = pos();
        if (Math.abs(cur - COVER) > 0.5) {
          const ms = cur <= START + 0.5 ? COVER_MS : Math.max(450, (COVER_MS * Math.abs(COVER - cur)) / (COVER - START));
          fadeLogo(1, 520, cur <= START + 0.5 ? ms * 0.45 : 0);
          await sweep(cur, COVER, ms);
          if (!alive()) return;
        } else {
          fadeLogo(1, 300);
        }
        // 2. HOLD: fully covered
        await wait(HOLD_MS);
        if (!alive()) return;
      }

      const result = await ready;
      if (!alive()) return;
      if (result === "failed" && reloadOnce()) return;

      // 3. SWAP under the cover: commit synchronously, then give the new page a moment to paint
      if (dest.pathname !== shownPath.current) {
        shownPath.current = dest.pathname;
        flushSync(() => setShown(dest));
      }
      await frames(3);
      if (!alive()) return;
      await wait(80);
      if (!alive()) return;

      // 4. REVEAL: the slash slides out and uncovers the NEW page
      if (!reduce && panel.current) {
        fadeLogo(0, 380);
        const ok = await sweep(COVER, END, REVEAL_MS);
        if (!alive() || !ok) return;
        seg.current?.anim.cancel();
        seg.current = null;
        logoAnim.current?.cancel();
        logoAnim.current = null;
        panel.current.style.visibility = "hidden";
        if (logo.current) logo.current.style.visibility = "hidden";
      }
      busy.current = false;
    })();
  }, [location]);

  // new page: jump to the top before it is painted, and move focus for keyboard / screen-reader users
  useLayoutEffect(() => {
    if (scrolledFor.current === shown.pathname) return;
    scrolledFor.current = shown.pathname;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    mainRef.current?.focus({ preventScroll: true });
  }, [shown.pathname]);

  const View = componentFor(shown.pathname);

  return (
    <>
      <Background />
      <Nav />

      {/* the slash that wipes across the screen between pages */}
      <div
        ref={panel}
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-[60] w-[200vw] motion-reduce:hidden"
        style={{ transform: tf(START), visibility: "hidden", background: STRIPES, willChange: "transform", backfaceVisibility: "hidden" }}
      />
      <div
        ref={logo}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[61] grid place-items-center motion-reduce:hidden"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <img src="/assets/ui/title.webp" alt="" className="px animate-bob w-48 sm:w-60" draggable={false} />
      </div>

      <main ref={mainRef} tabIndex={-1} className="outline-none">
        <RouteBoundary resetKey={shown.pathname}>
          <Suspense fallback={<Loading />}>
            <Fragment key={shown.pathname}>
              <View />
            </Fragment>
          </Suspense>
        </RouteBoundary>
      </main>

      <Footer />
      <MusicPlayer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}