import { useEffect, useState, useRef } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") root.classList.add("light");
  else root.classList.remove("light");
  try { localStorage.setItem("theme", theme); } catch {}
}

export function useInitTheme() {
  useEffect(() => {
    try {
      const saved = (localStorage.getItem("theme") as Theme | null) ?? "dark";
      applyTheme(saved);
    } catch {
      applyTheme("dark");
    }
  }, []);
}

type Props = {
  variant?: "fixed" | "inline";
  className?: string;
};

export function ThemeToggle({ variant = "fixed", className = "" }: Props) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (document.documentElement.classList.contains("light") ? "light" : "dark");
  });
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const toggle = async () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const btn = btnRef.current;
    const rect = btn?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const maxR = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const supportsVT = typeof doc.startViewTransition === "function";

    if (!supportsVT || !doc.startViewTransition) {
      applyTheme(next);
      setTheme(next);
      return;
    }

    const transition = doc.startViewTransition(() => {
      applyTheme(next);
      setTheme(next);
    });

    try { await transition.ready; } catch { return; }

    const clipFrom = `circle(0px at ${cx}px ${cy}px)`;
    const clipTo = `circle(${maxR}px at ${cx}px ${cy}px)`;
    document.documentElement.animate(
      { clipPath: [clipFrom, clipTo] },
      {
        duration: 700,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  const baseFixed =
    "hidden md:flex fixed top-5 right-[76px] z-[1100] w-12 h-12 rounded-full border border-white/20 bg-black/60 backdrop-blur items-center justify-center hover:scale-110 transition-transform cursor-pointer themed-toggle";
  const baseInline =
    "md:hidden relative w-10 h-10 flex items-center justify-center rounded-md border border-white/15 bg-black/40 hover:border-[#00f1ff]/60 transition-colors cursor-pointer themed-toggle";

  const cls = variant === "fixed" ? baseFixed : baseInline;

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`${cls} ${className}`}
    >
      {theme === "dark"
        ? <Sun className="w-5 h-5 text-white" />
        : <Moon className="w-5 h-5 text-black" />}
    </button>
  );
}
