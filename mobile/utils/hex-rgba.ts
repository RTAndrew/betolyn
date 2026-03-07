/**
 * Converts a hex color to rgba string.
 * @param hex - Hex color starting with # (e.g. '#FF0000', '#F00')
 * @param opacity - Optional opacity 0–1 (default 1)
 */
export function hexToRgba(hex: `#${string}`, opacity: number = 1): string {
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

/**
 * Converts a hex color + opacity to 8-digit hex (#RRGGBBAA).
 * Use this for libraries that only accept hex (e.g. react-native-fast-shimmer).
 * @param hex - Hex color starting with # (e.g. '#c7d1e7')
 * @param opacity - Opacity 0–1 (default 1)
 */
export function hexToHexWithAlpha(hex: `#${string}`, opacity: number = 1): string {
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
  const a = Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a}`;
}
