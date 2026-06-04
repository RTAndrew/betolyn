export const colors = {
  // Brand Colors
  terciary: '#7e87f1',
  primary: '#3cc5a4',
  complementary: '#f3ca41',
  complementary2: '#fff7d6',
  secondary: '#f80069',

  // Grayscale
  greyDark: '#272f3d',
  greyMedium: '#485164',
  greyLight: '#61687e',
  greyLighter: '#c7d1e7',
  white: '#ffffff',

  // Variations & Gradients
  greyLighter50: '#8891A6',
  // gradient01: '#ee9ae5',
  // gradient02: '#7e87f1',
} as const;

// Type for your theme colors
export type TColor = keyof typeof colors;
