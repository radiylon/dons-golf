export const SF_SCHOOL_ID = "2490";
export const SF_SCHOOL_NAME = "San Francisco";
export const SEASONS = [2024, 2025, 2026];

export function seasonLabel(season: number): string {
  return `${season - 1}-${String(season).slice(2)}`;
}

export const CLIPPD_BASE = "https://scoreboard.clippd.com";
export const CLIPPD_API = `${CLIPPD_BASE}/api`;

export const POLL_INTERVAL_MS = 30_000;

const CLIPPD_CDN = "https://clippd-prod.mo.cloudinary.net/scoreboard";

export function schoolLogoUrl(logo: string, size = 48): string {
  if (!logo) return "";
  return `${CLIPPD_CDN}/${logo}?tx=w_${size},ar_1,q_90,c_fit`;
}

export function playerPhotoUrl(picture: string, size = 48): string {
  if (!picture) return "";
  return `${CLIPPD_CDN}/${picture}?tx=w_${size},ar_1,q_90,g_face:center,c_thumb,z_0.85`;
}
