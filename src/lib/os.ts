/**
 * Deteksi sistem operasi pengunjung (dipakai di halaman Download).
 * Hasil "other" = HP / tablet / ChromeOS / tidak dikenali → semua tombol download tetap menyala.
 */
export type DetectedOS = "windows" | "macos" | "linux" | "other";

type NavigatorWithUAData = Navigator & {
  userAgentData?: { platform?: string; mobile?: boolean };
};

export function detectOS(): DetectedOS {
  if (typeof navigator === "undefined") return "other";

  const nav = navigator as NavigatorWithUAData;
  const ua = (nav.userAgent || "").toLowerCase();
  // userAgentData.platform (Chrome/Edge modern) lebih akurat; navigator.platform sebagai cadangan
  const hint = (nav.userAgentData?.platform || nav.platform || "").toLowerCase();

  // HP / tablet / ChromeOS: tidak ada build desktop-nya
  if (nav.userAgentData?.mobile) return "other";
  if (/android|iphone|ipad|ipod|cros/.test(ua)) return "other";
  // iPadOS menyamar sebagai Mac, bedanya punya layar sentuh
  if (hint.startsWith("mac") && nav.maxTouchPoints > 1) return "other";

  if (hint.startsWith("win") || ua.includes("windows")) return "windows";
  if (hint.startsWith("mac") || ua.includes("macintosh") || ua.includes("mac os x")) return "macos";
  if (hint.includes("linux") || hint.includes("x11") || ua.includes("linux") || ua.includes("x11")) return "linux";

  return "other";
}