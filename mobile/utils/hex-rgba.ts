/**
 * Converts a hex color to rgba string.
 * @param hex - Hex color (e.g. '#FF0000' or 'F00')
 * @param opacity - Optional opacity 0–1 (default 1)
 */
export function hexToRgba(hex: string, opacity: number = 1): string {
  const normalized = hex.replace(/^#/, '');
  const isShort = normalized.length === 3;
  const r = isShort
    ? parseInt(normalized[0]! + normalized[0], 16)
    : parseInt(normalized.slice(0, 2), 16);
  const g = isShort
    ? parseInt(normalized[1]! + normalized[1], 16)
    : parseInt(normalized.slice(2, 4), 16);
  const b = isShort
    ? parseInt(normalized[2]! + normalized[2], 16)
    : parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
