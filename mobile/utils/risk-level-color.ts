import { colors } from '@/constants/colors';

/**
 * Returns the color for a risk level (0–100).
 * Green &lt; 60, Yellow 60–84, Red ≥ 85.
 */
export function getRiskLevelColor(riskLevel: number): string {
  if (riskLevel >= 0 && riskLevel < 60) {
    return colors.primary;
  }
  if (riskLevel >= 60 && riskLevel < 85) {
    return colors.complementary2;
  }
  if (riskLevel >= 85) {
    return colors.secondary;
  }
  return colors.primary;
}
