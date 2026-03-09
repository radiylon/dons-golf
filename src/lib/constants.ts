export const SF_SCHOOL_ID = "2490";
export const SEASONS = [2024, 2025, 2026];

export function seasonLabel(season: number): string {
  return `${season - 1}-${String(season).slice(2)}`;
}

const CLIPPD_BASE = "https://scoreboard.clippd.com";
export const CLIPPD_API = `${CLIPPD_BASE}/api`;

export const POLL_INTERVAL_MS = 30_000;

export const RORO_PLAYER_NAME = "Rodaylin Mina";

export const TOURNAMENT_NAME_OVERRIDES: Record<string, string> = {
  "239116": "Juli Inkster Invitational",
};
export const RORO_ENROLLMENT_YEAR = 2023; // Fall 2023 freshman → computes class year dynamically

const CLIPPD_CDN = "https://clippd-prod.mo.cloudinary.net/scoreboard";

export function schoolLogoUrl(logo: string, size = 48): string {
  if (!logo) return "";
  return `${CLIPPD_CDN}/${logo}?tx=w_${size},ar_1,q_90,c_fit`;
}

export function playerPhotoUrl(picture: string, size = 48): string {
  if (!picture) return "";
  return `${CLIPPD_CDN}/${picture}?tx=w_${size},ar_1,q_90,g_face:center,c_thumb,z_0.85`;
}
