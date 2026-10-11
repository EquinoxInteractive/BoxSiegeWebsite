import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ARENAS } from "@/data/game";
import { SEQUENCE, pageById, type PageDef } from "@/data/pages";
import { sfx } from "@/lib/audio";
import { PageArt } from "./PageArt";
import { EASE } from "./ui";

const SITE = "BOX SIEGE";

/** Sets the tab title and meta description for the current page. */
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }, [title, description]);
}

function PageHero({ page, title, intro }: { page: PageDef; title: string; intro?: ReactNode }) {
  const arena = ARENAS.find((a) => a.id === page.stage)!;
  return (
    <header className="relative isolate overflow-hidden" style={{ ["--accent" as string]: page.accent }}>
      {/* the stage this page is set on */}
      <div className="absolute inset-0 -z-10" style={{ background: `url(${arena.bg}) center/cover`, imageRendering: "pixelated" }} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0b0b1c_6%,rgba(11,11,28,0.84)_46%,rgba(11,11,28,0.3)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b0b1c]/75 via-transparent to-[#0b0b1c]/70" />
      <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(900px 420px at 85% 80%, ${page.accent}33, transparent 70%)` }} />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-24 pt-28 md:pb-28 md:pt-36">
        <div className="max-w-3xl lg:max-w-[47%]">
          <motion.h1
            initial={{ opacity: 0, x: -40, skewX: -8 }}
            animate={{ opacity: 1, x: 0, skewX: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="font-display text-6xl leading-[0.95] text-white sm:text-7xl lg:text-8xl xl:text-[7.5rem]"
            style={{ textShadow: `0 5px 0 #000, 0 0 50px ${page.accent}66` }}
          >
            {title}
          </motion.h1>
          {intro && (
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55, ease: EASE }} className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
              {intro}
            </motion.p>
          )}
          <motion.ul
            initial="hidden" animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.7 } } }}
            className="mt-7 flex flex-wrap gap-2.5"
          >
            {page.facts.map((f) => (
              <motion.li
                key={f}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-black/45 px-3.5 py-2 font-ui text-sm tracking-wide text-white backdrop-blur"
              >
                <span className="h-2 w-2 shrink-0 rotate-45" style={{ background: page.accent }} />
                {f}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <PageArt id={page.id} />
      </div>

      {/* stage floor */}
      <div className="absolute inset-x-0 bottom-0 h-[44px] border-t-4 border-black/70" style={{ background: `url(${arena.floor}) repeat-x center/auto 100%`, imageRendering: "pixelated" }} />
    </header>
  );
}

function PageNavTile({ page, dir }: { page: PageDef; dir: "prev" | "next" }) {
  const arena = ARENAS.find((a) => a.id === page.stage)!;
  const Icon = page.icon;
  const next = dir === "next";
  return (
    <Link
      to={page.path}
      onClick={() => sfx("ui_confirm", 0.35)}
      onMouseEnter={() => sfx("ui_hover", 0.1)}
      className={`group relative isolate flex min-h-[132px] items-center gap-5 overflow-hidden rounded-2xl border border-white/10 p-6 transition-colors hover:border-[var(--accent)] ${next ? "flex-row-reverse text-right" : ""}`}
      style={{ ["--accent" as string]: page.accent }}
    >
      <span className="absolute inset-0 -z-10 opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-60" style={{ background: `url(${arena.bg}) center/cover`, imageRendering: "pixelated" }} />
      <span className="absolute inset-0 -z-10" style={{ background: `linear-gradient(${next ? "270deg" : "90deg"}, rgba(11,11,28,0.95) 15%, rgba(11,11,28,0.55))` }} />
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl transition-transform group-hover:-rotate-6" style={{ background: page.accent, color: "#0b0b1c" }}>
        {next ? <ArrowRight className="h-6 w-6" /> : <ArrowLeft className="h-6 w-6" />}
      </span>
      <span className="min-w-0">
        <span className="block font-ui text-sm text-white/60">{next ? "Next page" : "Previous page"}</span>
        <span className="mt-0.5 flex items-center gap-2.5 font-display text-4xl leading-none md:text-5xl" style={{ justifyContent: next ? "flex-end" : "flex-start" }}>
          <Icon className="h-6 w-6 shrink-0" style={{ color: page.accent }} />
          {page.label}
        </span>
        <span className="mt-1.5 block text-sm text-white/60">{page.blurb}</span>
      </span>
    </Link>
  );
}

function PageNav({ id }: { id: string }) {
  const i = SEQUENCE.findIndex((p) => p.id === id);
  const prev = SEQUENCE[i - 1];
  const next = SEQUENCE[i + 1];
  return (
    <nav aria-label="More pages" className="grid gap-4 md:grid-cols-2">
      {prev ? <PageNavTile page={prev} dir="prev" /> : <span />}
      {next && <PageNavTile page={next} dir="next" />}
    </nav>
  );
}

/**
 * One page of the site: a header dressed as the page's stage, the page content,
 * and previous / next tiles. `id` is the page's id in data/pages.ts.
 */
export function Page({ id, title, intro, children, wide = false }: { id: string; title: string; intro?: ReactNode; children: ReactNode; wide?: boolean }) {
  const page = pageById(id);
  useDocumentMeta(`${page.label} · ${SITE}`, page.desc);
  return (
    <>
      <PageHero page={page} title={title} intro={intro} />
      <section className="relative px-5 pb-10 pt-10 md:pt-14" style={{ ["--accent" as string]: page.accent }}>
        <div className={`mx-auto ${wide ? "max-w-[1400px]" : "max-w-7xl"}`}>{children}</div>
      </section>
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-6">
        <PageNav id={id} />
      </div>
    </>
  );
}
