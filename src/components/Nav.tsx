import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { NAV_PAGES } from "@/data/pages";
import { sfx } from "@/lib/audio";

export function Nav() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

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

  // lock page scroll behind the open menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const solid = scrolled || open || pathname !== "/";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? "border-b border-white/10 bg-[#0b0b1c]/85 backdrop-blur-xl" : "bg-transparent"}`}
      >
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-3" aria-label="Main">
          <Link to="/" onClick={() => sfx("ui_confirm", 0.35)} className="shrink-0" aria-label="BOX SIEGE home">
            <img src="/assets/ui/title.webp" alt="BOX SIEGE" className="px h-8 w-auto transition-transform hover:scale-105 md:h-9" />
          </Link>

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

          <div className="flex items-center gap-3">
            <Link to="/download" onClick={() => sfx("ui_confirm", 0.35)} className="skew-btn !py-2.5 !px-5 !text-xs !shadow-none">
              <span className="flex items-center gap-2"><Download className="h-4 w-4" /> Download</span>
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl border border-white/15 bg-black/40 xl:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        <motion.div className="h-[3px] origin-left" style={{ scaleX: progress, background: "linear-gradient(90deg,#ff4040,#ffd23f,#4fd8ff)" }} />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-[#0b0b1c]/95 px-6 pb-10 pt-24 backdrop-blur-xl xl:hidden"
          >
            <ul className="mx-auto grid max-w-xl gap-1.5">
              {NAV_PAGES.map((n, i) => {
                const on = pathname === n.path;
                const Icon = n.icon;
                return (
                  <motion.li key={n.id} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.035 * i }}>
                    <Link
                      to={n.path}
                      onClick={() => sfx("ui_confirm", 0.35)}
                      aria-current={on ? "page" : undefined}
                      className="flex items-center gap-4 rounded-2xl border px-4 py-3"
                      style={{ borderColor: on ? n.accent : "rgba(255,255,255,0.08)", background: on ? `${n.accent}18` : "rgba(255,255,255,0.03)" }}
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: n.accent, color: "#0b0b1c" }}><Icon className="h-6 w-6" /></span>
                      <span className="min-w-0">
                        <span className="block font-display text-3xl leading-none" style={{ color: on ? n.accent : "#fff" }}>{n.label}</span>
                        <span className="mt-1 block truncate text-sm text-white/55">{n.blurb}</span>
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
