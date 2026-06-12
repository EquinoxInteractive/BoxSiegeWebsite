import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ActionKey = "Left" | "Right" | "Down" | "Jump" | "Shot" | "SwitchWeapon";
type FactionKey = "p1" | "p2" | "p3" | "p4";

type KeySpec = {
    action: ActionKey;
    col: number;
    row: number;
    short: string;
    codes: string[];
};

type FactionMeta = {
    id: FactionKey;
    label: string;
    accent: string;
    soft: string;
    layout: KeySpec[];
};

// P1 — WASD + QE
const LAYOUT_P1: KeySpec[] = [
    { action: "SwitchWeapon", col: 1, row: 1, short: "Switch", codes: ["KeyQ"] },
    { action: "Jump",         col: 2, row: 1, short: "Jump",  codes: ["KeyW"] },
    { action: "Shot",         col: 3, row: 1, short: "Shot",  codes: ["KeyE"] },
    { action: "Left",         col: 1, row: 2, short: "Left",  codes: ["KeyA"] },
    { action: "Down",         col: 2, row: 2, short: "Down",  codes: ["KeyS"] },
    { action: "Right",        col: 3, row: 2, short: "Right",  codes: ["KeyD"] },
];

// P2 — IJKL + UO
const LAYOUT_P2: KeySpec[] = [
    { action: "SwitchWeapon", col: 1, row: 1, short: "Switch", codes: ["KeyU"] },
    { action: "Jump",         col: 2, row: 1, short: "Jump",  codes: ["KeyI"] },
    { action: "Shot",         col: 3, row: 1, short: "Shot",  codes: ["KeyO"] },
    { action: "Left",         col: 1, row: 2, short: "Left",  codes: ["KeyJ"] },
    { action: "Down",         col: 2, row: 2, short: "Down",  codes: ["KeyK"] },
    { action: "Right",        col: 3, row: 2, short: "Right",  codes: ["KeyL"] },
];

// P3 — TFGH + RY
const LAYOUT_P3: KeySpec[] = [
    { action: "SwitchWeapon", col: 1, row: 1, short: "Switch", codes: ["KeyR"] },
    { action: "Jump",         col: 2, row: 1, short: "Jump",  codes: ["KeyT"] },
    { action: "Shot",         col: 3, row: 1, short: "Shot",  codes: ["KeyY"] },
    { action: "Left",         col: 1, row: 2, short: "Left",  codes: ["KeyF"] },
    { action: "Down",         col: 2, row: 2, short: "Down",  codes: ["KeyG"] },
    { action: "Right",        col: 3, row: 2, short: "Right",  codes: ["KeyH"] },
];

// P4 — Arrows + Numpad 1 / Numpad 0
const LAYOUT_P4: KeySpec[] = [
    { action: "SwitchWeapon", col: 1, row: 1, short: "Switch", codes: ["Numpad1", "Digit1"] },
    { action: "Jump",         col: 2, row: 1, short: "Jump",  codes: ["ArrowUp"] },
    { action: "Shot",         col: 3, row: 1, short: "Shot",  codes: ["Numpad0", "Digit0"] },
    { action: "Left",         col: 1, row: 2, short: "Left",  codes: ["ArrowLeft"] },
    { action: "Down",         col: 2, row: 2, short: "Down",  codes: ["ArrowDown"] },
    { action: "Right",        col: 3, row: 2, short: "Right",  codes: ["ArrowRight"] },
];

const FACTIONS: FactionMeta[] = [
    { id: "p1", label: "Player 1", accent: "#ff2d2d", soft: "rgba(255,45,45,0.18)", layout: LAYOUT_P1 },
    { id: "p2", label: "Player 2", accent: "#00d6ff", soft: "rgba(0,214,255,0.18)", layout: LAYOUT_P2 },
    { id: "p3", label: "Player 3", accent: "#b366ff", soft: "rgba(179,102,255,0.18)", layout: LAYOUT_P3 },
    { id: "p4", label: "Player 4", accent: "#ffb347", soft: "rgba(255,179,71,0.18)", layout: LAYOUT_P4 },
];

const ACTION_LABEL: Record<ActionKey, string> = {
    Left: "Left",
    Right: "Right",
    Down: "Down",
    Jump: "Jump",
    Shot: "Shot",
    SwitchWeapon: "Switch",
};

const iconPath = (faction: FactionKey, key: ActionKey) =>
    `/assets/KEYBIND/${faction.toUpperCase()}/${key}.png`;

/** Detect coarse pointer (mobile) — no hover, must tap. */
function useIsTouch() {
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(hover: none), (pointer: coarse)");
        const handler = () => setIsTouch(mq.matches);
        handler();
        mq.addEventListener?.("change", handler);
        return () => mq.removeEventListener?.("change", handler);
    }, []);
    return isTouch;
}

function KeyCap({
    faction,
    spec,
    accent,
    pressed,
    onPressStart,
    onPressEnd,
    index,
    isTouch,
}: {
    faction: FactionKey;
    spec: KeySpec;
    accent: string;
    pressed: boolean;
    onPressStart: () => void;
    onPressEnd: () => void;
    index: number;
    isTouch: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -35, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{ delay: 0.05 * index, type: "spring", stiffness: 220, damping: 18 }}
            style={{
                gridColumn: spec.col,
                gridRow: spec.row,
                perspective: 800,
            }}
            className={`relative flex items-end justify-center ${
                spec.action === "SwitchWeapon" ? "mr-3 sm:mr-14" : ""
            } ${spec.action === "Shot" ? "ml-3 sm:ml-14" : ""}`}
        >
            {/* Floating label above */}
            <motion.div
                animate={{ y: pressed ? -2 : 0, opacity: pressed ? 1 : 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -top-7 left-1/2 -translate-x-1/2 select-none pointer-events-none"
            >
                <span
                    className="font-display text-[11px] md:text-xs uppercase tracking-[0.3em] whitespace-nowrap"
                    style={{
                        color: pressed ? accent : "rgba(255,255,255,0.65)",
                        textShadow: pressed
                            ? `0 0 10px ${accent}, 0 2px 0 rgba(0,0,0,0.85)`
                            : "0 2px 0 rgba(0,0,0,0.8)",
                        WebkitTextStroke: "0.6px rgba(0,0,0,0.7)",
                    }}
                >
                    {ACTION_LABEL[spec.action]}
                </span>
            </motion.div>

            <motion.button
                type="button"
                onPointerDown={(e) => {
                    e.preventDefault();
                    onPressStart();
                }}
                onPointerUp={onPressEnd}
                onPointerLeave={onPressEnd}
                onPointerCancel={onPressEnd}
                whileTap={{ scale: 0.95 }}
                animate={{ y: pressed ? 8 : 0 }}
                transition={{ type: "spring", stiffness: 520, damping: 24 }}
                className="group relative focus:outline-none"
                style={{ transformStyle: "preserve-3d", touchAction: "none" }}
                aria-label={ACTION_LABEL[spec.action]}
            >
                {/* Halo behind cap */}
                <motion.span
                    aria-hidden
                    initial={false}
                    animate={{
                        opacity: pressed ? 1 : 0,
                        scale: pressed ? 1.4 : 0.6,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at 50% 60%, ${accent}88 0%, transparent 70%)`,
                        filter: "blur(10px)",
                    }}
                />

                {/* Depth shadow */}
                <motion.span
                    aria-hidden
                    animate={{ opacity: pressed ? 0.2 : 1, y: pressed ? -6 : 0 }}
                    className="absolute left-1 right-1 -bottom-1 h-3 rounded-[14px] -z-10"
                    style={{
                        background: `linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.2))`,
                        filter: "blur(2px)",
                    }}
                />

                {/* Keycap body — dark, designed */}
                <div
                    className="relative rounded-2xl border overflow-hidden w-[68px] h-[68px] sm:w-[104px] sm:h-[104px]"
                    style={{
                        background: pressed
                            ? `linear-gradient(180deg, #2a2f3a 0%, #161a22 55%, #0a0d13 100%)`
                            : `linear-gradient(180deg, #1f2430 0%, #11141b 55%, #07090d 100%)`,
                        borderColor: pressed ? accent : "rgba(255,255,255,0.08)",
                        boxShadow: pressed
                            ? `0 0 0 2px ${accent}, 0 4px 0 -2px rgba(0,0,0,0.8), 0 10px 28px -6px ${accent}cc, inset 0 -2px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 30px ${accent}44`
                            : `0 10px 0 -4px rgba(0,0,0,0.75), 0 16px 26px -10px rgba(0,0,0,0.8), inset 0 -6px 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`,
                        transition: "box-shadow 120ms ease, background 120ms ease, border-color 120ms ease",
                    }}
                >
                    {/* Inner bevel — dark */}
                    <div
                        className="absolute inset-[5px] rounded-xl"
                        style={{
                            background: pressed
                                ? `linear-gradient(180deg, #232836 0%, #12161f 60%, #090b11 100%)`
                                : `linear-gradient(180deg, #1c2030 0%, #0f131c 60%, #06080d 100%)`,
                            boxShadow:
                                "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)",
                        }}
                    />

                    {/* Subtle micro-grid texture */}
                    <div
                        aria-hidden
                        className="absolute inset-[5px] rounded-xl opacity-40 pointer-events-none"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                            backgroundSize: "10px 10px",
                            maskImage: "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 85%)",
                            WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 85%)",
                        }}
                    />

                    {/* Accent corner brackets */}
                    <span
                        aria-hidden
                        className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r rounded-tr-[3px] pointer-events-none"
                        style={{ borderColor: pressed ? accent : `${accent}55` }}
                    />
                    <span
                        aria-hidden
                        className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l rounded-bl-[3px] pointer-events-none"
                        style={{ borderColor: pressed ? accent : `${accent}55` }}
                    />

                    {/* Faction accent wash */}
                    <motion.div
                        aria-hidden
                        animate={{ opacity: pressed ? 0.55 : 0.08 }}
                        className="absolute inset-[5px] rounded-xl pointer-events-none"
                        style={{ background: `radial-gradient(circle at 50% 30%, ${accent}, transparent 70%)` }}
                    />

                    {/* Bottom accent stripe */}
                    <div
                        aria-hidden
                        className="absolute left-3 right-3 bottom-[7px] h-px pointer-events-none"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${accent}${pressed ? "cc" : "55"}, transparent)`,
                        }}
                    />

                    {/* Icon */}
                    <div className="relative h-full w-full flex items-center justify-center">
                        <img
                            src={iconPath(faction, spec.action)}
                            alt={ACTION_LABEL[spec.action]}
                            className="max-h-[38px] max-w-[68%] sm:max-h-[58px] object-contain select-none pointer-events-none"
                            style={{
                                imageRendering: "pixelated",
                                filter: pressed
                                    ? `drop-shadow(0 0 8px ${accent}) brightness(1.15)`
                                    : "drop-shadow(0 2px 4px rgba(0,0,0,0.8))",
                                transition: "filter 120ms ease",
                            }}
                            draggable={false}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                        />
                    </div>

                    {/* Press flash */}
                    <motion.span
                        aria-hidden
                        initial={false}
                        animate={{ opacity: pressed ? 0.45 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: `radial-gradient(circle, ${accent}, transparent 65%)` }}
                    />
                </div>
            </motion.button>
        </motion.div>
    );
}

function KeyboardCluster({
    faction,
    accent,
    soft,
    pressedActions,
    setPressed,
    isTouch,
}: {
    faction: FactionMeta;
    accent: string;
    soft: string;
    pressedActions: Set<ActionKey>;
    setPressed: (a: ActionKey, p: boolean) => void;
    isTouch: boolean;
}) {
    const layout = faction.layout;

    return (
        <motion.div
            key={faction.id}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[560px] mx-auto"
        >
            {/* Player title */}
            <div className="text-center mb-10">
                <motion.h4
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-display text-4xl md:text-5xl uppercase italic"
                    style={{
                        color: accent,
                        WebkitTextStroke: "1.5px rgba(0,0,0,0.6)",
                        textShadow: `0 4px 0 rgba(0,0,0,0.45), 0 0 30px ${accent}88`,
                        letterSpacing: "0.05em",
                    }}
                >
                    {faction.label}
                </motion.h4>
            </div>

            {/* Cluster grid: 3 cols × 2 rows */}
            <div
                className="relative grid gap-x-3 sm:gap-x-5 gap-y-8 sm:gap-y-10 justify-center items-end px-2 sm:px-4 py-8 sm:py-10 grid-cols-[repeat(3,68px)] sm:grid-cols-[repeat(3,104px)] auto-rows-[68px] sm:auto-rows-[104px]"
            >
                {/* Soft radial glow under the keys */}
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-[36px]"
                    style={{
                        background: `radial-gradient(ellipse at 50% 80%, ${soft} 0%, transparent 70%)`,
                    }}
                />
                {/* faint platform line */}
                <div
                    aria-hidden
                    className="absolute left-6 right-6 bottom-6 h-px -z-10"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
                    }}
                />

                {layout.map((spec, i) => (
                    <KeyCap
                        key={spec.action}
                        faction={faction.id}
                        spec={spec}
                        accent={accent}
                        pressed={pressedActions.has(spec.action)}
                        onPressStart={() => setPressed(spec.action, true)}
                        onPressEnd={() => setPressed(spec.action, false)}
                        index={i}
                        isTouch={isTouch}
                    />
                ))}
            </div>

            {/* Action legend */}
            <div className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                {layout.map((spec) => {
                    const isPressed = pressedActions.has(spec.action);
                    return (
                        <motion.div
                            key={`leg-${spec.action}`}
                            animate={{
                                borderColor: isPressed ? accent : "rgba(255,255,255,0.08)",
                                backgroundColor: isPressed ? `${accent}22` : "rgba(255,255,255,0.02)",
                            }}
                            className="rounded-md border px-2 py-1.5"
                        >
                            <div
                                className="font-display text-sm"
                                style={{ color: isPressed ? accent : "rgba(255,255,255,0.85)" }}
                            >
                                {spec.short}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export function KeybindShowcase() {
    const [active, setActive] = useState<FactionKey>("p1");
    const faction = FACTIONS.find((f) => f.id === active)!;
    const isTouch = useIsTouch();

    const [pressedActions, setPressedActions] = useState<Set<ActionKey>>(new Set());

    const setPressed = useCallback((action: ActionKey, on: boolean) => {
        setPressedActions((prev) => {
            const next = new Set(prev);
            if (on) next.add(action);
            else next.delete(action);
            return next;
        });
    }, []);

    // Real keyboard interaction (desktop). Mobile users tap the caps directly.
    useEffect(() => {
        if (isTouch) return;
        const layout = faction.layout;
        const codeMap = new Map<string, ActionKey>();
        layout.forEach((spec) => spec.codes.forEach((c) => codeMap.set(c, spec.action)));

        const onDown = (e: KeyboardEvent) => {
            const action = codeMap.get(e.code);
            if (!action) return;
            // Avoid blocking typing in inputs
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
            setPressed(action, true);
        };
        const onUp = (e: KeyboardEvent) => {
            const action = codeMap.get(e.code);
            if (!action) return;
            setPressed(action, false);
        };
        const onBlur = () => setPressedActions(new Set());

        window.addEventListener("keydown", onDown);
        window.addEventListener("keyup", onUp);
        window.addEventListener("blur", onBlur);
        return () => {
            window.removeEventListener("keydown", onDown);
            window.removeEventListener("keyup", onUp);
            window.removeEventListener("blur", onBlur);
        };
    }, [faction.layout, isTouch, setPressed]);

    // Clear pressed state when switching player
    useEffect(() => {
        setPressedActions(new Set());
    }, [active]);

    return (
        <div className="mt-20">
            <div className="flex flex-col items-center gap-3 mb-10">
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Controls</p>
                <h3 className="font-display text-4xl md:text-5xl text-gradient">Keybind</h3>
                <p className="text-white/60 text-sm text-center max-w-xl">
                    Default key bindings for every player. {isTouch
                        ? "Tap and hold a key to feel the response."
                        : "Try with your real keyboard and drives the caps below."}
                </p>
            </div>

            {/* Faction toggle */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {FACTIONS.map((f) => {
                    const isActive = f.id === active;
                    return (
                        <button
                            key={f.id}
                            onClick={() => setActive(f.id)}
                            className="relative px-5 py-2 rounded-full border text-xs font-display uppercase tracking-[0.3em] transition-colors"
                            style={{
                                borderColor: isActive ? f.accent : "rgba(255,255,255,0.12)",
                                color: isActive ? f.accent : "rgba(255,255,255,0.6)",
                                background: isActive ? f.soft : "transparent",
                                boxShadow: isActive ? `0 0 24px -6px ${f.accent}` : "none",
                            }}
                        >
                            {f.label}
                        </button>
                    );
                })}
            </div>

            {/* Panel */}
            <div
                className="relative rounded-3xl border border-white/10 overflow-hidden bg-black/50 backdrop-blur p-6 md:p-12"
                style={{
                    backgroundImage:
                        "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0) 60%)",
                }}
            >
                <motion.div
                    key={active + "-border"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pointer-events-none absolute inset-0 rounded-3xl"
                    style={{
                        boxShadow: `inset 0 0 0 1px ${faction.accent}55, 0 0 80px -20px ${faction.accent}`,
                    }}
                />
                <div className="pointer-events-none absolute inset-0 scanline-overlay opacity-30" />

                {/* faint corner ticks for life */}
                {[
                    "top-3 left-3 border-l-2 border-t-2",
                    "top-3 right-3 border-r-2 border-t-2",
                    "bottom-3 left-3 border-l-2 border-b-2",
                    "bottom-3 right-3 border-r-2 border-b-2",
                ].map((cls) => (
                    <span
                        key={cls}
                        aria-hidden
                        className={`absolute h-4 w-4 rounded-sm pointer-events-none ${cls}`}
                        style={{ borderColor: `${faction.accent}88` }}
                    />
                ))}

                <AnimatePresence mode="wait">
                    <KeyboardCluster
                        faction={faction}
                        accent={faction.accent}
                        soft={faction.soft}
                        pressedActions={pressedActions}
                        setPressed={setPressed}
                        isTouch={isTouch}
                    />
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <span
                        className="h-2 w-2 rounded-full animate-pulse"
                        style={{ background: faction.accent, boxShadow: `0 0 10px ${faction.accent}` }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                        {isTouch
                            ? "Tap a key to test · Fully Rebindable In-Game"
                            : "Press your keyboard to test · Fully Rebindable In-Game"}
                    </span>
                </div>
            </div>
        </div>
    );
}
