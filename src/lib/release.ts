/**
 * Info rilis terbaru dari GitHub (versi, tanggal, link & ukuran file per platform).
 * Hasil disimpan 10 menit di sessionStorage supaya tidak memanggil API berulang.
 * Kalau gagal (offline, rate limit), hook mengembalikan null dan website memakai link "latest" bawaan.
 */
import { useEffect, useState } from "react";
import { LATEST_API } from "@/data/game";

export type PlatformId = "windows" | "macos" | "linux";
export type ReleaseAsset = { name: string; url: string; size: number };
export type ReleaseInfo = {
  tag: string;
  version: string;
  date: string | null;
  url: string;
  assets: Partial<Record<PlatformId, ReleaseAsset>>;
};

const CACHE_KEY = "bs-latest-release-v1";
const TTL = 10 * 60 * 1000;

type RawAsset = { name?: string; size?: number; browser_download_url?: string };
type RawRelease = { tag_name?: string; published_at?: string; html_url?: string; assets?: RawAsset[] };

function platformOf(name: string): PlatformId | null {
  const n = name.toLowerCase();
  if (n.endsWith(".exe")) return "windows";
  if (n.endsWith(".x86_64")) return "linux";
  if (n.endsWith(".zip") && !n.includes("source")) {
    if (n.includes("mac") || n.includes("osx")) return "macos";
  }
  return null;
}

function parse(raw: RawRelease): ReleaseInfo | null {
  if (!raw.tag_name) return null;
  const assets: ReleaseInfo["assets"] = {};
  for (const a of raw.assets ?? []) {
    if (!a.name || !a.browser_download_url) continue;
    const p = platformOf(a.name);
    if (p && !assets[p]) assets[p] = { name: a.name, url: a.browser_download_url, size: a.size ?? 0 };
  }
  return {
    tag: raw.tag_name,
    version: raw.tag_name.replace(/^v/i, ""),
    date: raw.published_at ?? null,
    url: raw.html_url ?? "",
    assets,
  };
}

function readCache(): ReleaseInfo | null {
  try {
    const t = sessionStorage.getItem(CACHE_KEY);
    if (!t) return null;
    const c = JSON.parse(t) as { at: number; info: ReleaseInfo };
    return Date.now() - c.at < TTL ? c.info : null;
  } catch {
    return null;
  }
}

export function useLatestRelease(): ReleaseInfo | null {
  const [info, setInfo] = useState<ReleaseInfo | null>(readCache);

  useEffect(() => {
    if (info) return;
    const ctrl = new AbortController();
    fetch(LATEST_API, { signal: ctrl.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? (r.json() as Promise<RawRelease>) : null))
      .then((raw) => {
        const parsed = raw ? parse(raw) : null;
        if (!parsed) return;
        setInfo(parsed);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), info: parsed })); } catch { /* abaikan */ }
      })
      .catch(() => { /* offline / rate limit: pakai link latest bawaan */ });
    return () => ctrl.abort();
  }, [info]);

  return info;
}

export function formatSize(bytes: number): string {
  if (!bytes) return "";
  return bytes >= 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(2)} GB` : `${Math.round(bytes / 1024 ** 2)} MB`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}
