export function formatScore(score: number): string {
  if (score === 0) return "E";
  return score > 0 ? `+${score}` : `${score}`;
}

export function scoreColor(score: number): string {
  if (score <= -2) return "text-eagle";
  if (score === -1) return "text-birdie";
  if (score === 0) return "text-gray-600";
  if (score === 1) return "text-bogey";
  return "text-double";
}

export function nineHoleTotal(
  strokes: (number | null)[],
  start: number,
  end: number
): number | null {
  const slice = strokes.slice(start, end);
  const played = slice.filter((s): s is number => s !== null);
  return played.length > 0 ? played.reduce((a, b) => a + b, 0) : null;
}

export function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDate.toLocaleDateString("en-US", opts)}–${endDate.getDate()}, ${startDate.getFullYear()}`;
  }
  return `${startDate.toLocaleDateString("en-US", opts)} – ${endDate.toLocaleDateString("en-US", opts)}, ${startDate.getFullYear()}`;
}

export function formatTimeAgo(timestamp: number): string {
  if (timestamp === 0) return "";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export type TournamentStatus = "live" | "upcoming" | "completed";

export function getTournamentStatus(t: {
  isComplete: boolean;
  startDate: string;
  endDate: string;
}): TournamentStatus {
  if (t.isComplete) return "completed";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(t.startDate + "T00:00:00");
  const end = new Date(t.endDate + "T23:59:59");
  if (start <= today && today <= end) return "live";
  if (end < today) return "completed";
  return "upcoming";
}
