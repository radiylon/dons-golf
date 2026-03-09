export function formatScore(score: number): string {
  if (score === 0) return "E";
  return score > 0 ? `+${score}` : `${score}`;
}

export function scoreColor(score: number): string {
  if (score < 0) return "text-birdie";
  if (score > 0) return "text-bogey";
  return "text-gray-600";
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
