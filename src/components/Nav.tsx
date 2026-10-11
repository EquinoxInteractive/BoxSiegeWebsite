import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { HOME, NAV_PAGES, PAGES } from "@/data/pages";
import { sfx } from "@/lib/audio";

/** Home first, then every page except Download (Download has its own big button in the menu). */
const MENU_PAGES = [HOME, ...NAV_PAGES];

const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";

export function Nav() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  // title shown in the mobile bar: the name of the page you are on
  const current = [HOME, ...PAGES].find((p) => p.path === norm(pathname));
  const title = current?.label ?? "Not found";
  const accent = current?.accent ?? "#ffd23f";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu whenever the page changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock page scroll behind the open menu + tell the rest of the page (music button hides itself)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) document.documentElement.dataset.menu = "open";
    else delete document.documentElement.dataset.menu;
    return () => {
      document.body.style.overflow = "";
      delete document.documentElement.dataset.menu;
    };
  }, [open]);

  // Esc closes the menu; growing the window to desktop size closes it too
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const mq = window.matchMedia("(min-width: 1280px)");
    const onMq = () => { if (mq.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    menuRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const solid = scrolled || open || pathname !== "/";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500 ${solid ? "border-b border-white/10 bg-[#0b0b1c]/90 backdrop-blur-xl" : "bg-gradient-to-b from-[#0b0b1c]/70 to-transparent xl:bg-none"}`}
      >
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-2 sm:px-6 xl:px-5 xl:py-3" aria-label="Main">
          {/* desktop: logo */}
          <Link to="/" onClick={() => sfx("ui_confirm", 0.35)} className="hidden shrink-0 xl:block" aria-label="BOX SIEGE home">
            <img src="/assets/ui/title.webp" alt="BOX SIEGE" className="px h-9 w-auto transition-transform hover:scale-105" />
          </Link>

          {/* mobile / tablet: just the title of the page you are on, text only */}
          <button
            type="button"
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); sfx("ui_move", 0.2); }}
            aria-label={`${title}, scroll to top`}
            className="min-w-0 flex-1 cursor-pointer overflow-hidden text-left xl:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="block truncate font-display text-[1.65rem] leading-[1.15] tracking-wide sm:text-3xl"
                style={{ color: accent, textShadow: "0 2px 0 #000" }}
              >
                {title}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* desktop: links */}
          <ul className="hidden items-center gap-1 xl:flex">
            {NAV_PAGES.map((n) => {
              const on = pathname === n.path;
              return (
                <li key={n.id}>
                  <Link
                    to={n.path}
                    onClick={() => sfx("ui_confirm", 0.35)}
                    onMouseEnter={() => sfx("ui_hover", 0.12)}
                    aria-current={on ? "page" : undefined}
                    className="relative block px-3 py-2 font-ui text-[13px] uppercase tracking-wider transition-colors hover:text-white"
                    style={{ color: on ? n.accent : "rgba(255,255,255,0.72)" }}
                  >
                    {n.label}
                    {on && <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full" style={{ background: n.accent }} transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-3">
            {/* desktop: download button (on mobile it lives inside the menu) */}
            <Link to="/download" onClick={() => sfx("ui_confirm", 0.35)} className="skew-btn hidden !py-2.5 !px-5 !text-xs !shadow-none xl:inline-flex">
              <span className="flex items-center gap-2"><Download className="h-4 w-4" /> Download</span>
            </Link>

            <button
              type="button"
              onClick={() => { setOpen((o) => !o); sfx("ui_toggle_on", 0.25); }}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl border border-white/15 bg-white/[0.06] transition-colors active:scale-95 active:bg-white/15 xl:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "m"}
                  initial={{ rotate: -80, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 80, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.16 }}
                  className="grid place-items-center"
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
        <motion.div className="h-[3px] origin-left" style={{ scaleX: progress, background: "linear-gradient(90deg,#ff4040,#ffd23f,#4fd8ff)" }} />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col bg-[#0b0b1c]/[0.97] pt-[calc(env(safe-area-inset-top)+3.9rem)] outline-none backdrop-blur-xl xl:hidden"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 pb-4 pt-3 sm:px-6">
              <ul className="mx-auto grid max-w-xl gap-1.5 sm:max-w-3xl sm:grid-cols-2">
                {MENU_PAGES.map((n, i) => {
                  const on = pathname === n.path;
                  return (
                    <motion.li
                      key={n.id}
                      className="min-w-0"
                      initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.02 * i, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        to={n.path}
                        onClick={() => sfx("ui_confirm", 0.35)}
                        aria-current={on ? "page" : undefined}
                        className="relative block truncate rounded-xl border px-4 py-3 font-display text-[1.3rem] leading-none tracking-wide transition-all active:scale-[0.98]"
                        style={{
                          color: on ? n.accent : "rgba(255,255,255,0.88)",
                          borderColor: on ? n.accent : "rgba(255,255,255,0.07)",
                          background: on ? `${n.accent}18` : "rgba(255,255,255,0.03)",
                        }}
                      >
                        {n.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* download lives here now, always reachable at the bottom of the menu */}
            <div className="shrink-0 border-t border-white/10 bg-[#0b0b1c] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
              <div className="mx-auto max-w-xl sm:max-w-3xl">
                <Link
                  to="/download"
                  onClick={() => sfx("ui_confirm", 0.4)}
                  className="skew-btn w-full !py-3.5 !text-sm"
                  aria-current={pathname === "/download" ? "page" : undefined}
                >
                  <span className="flex items-center gap-2.5"><Download className="h-5 w-5" /> Download free</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}