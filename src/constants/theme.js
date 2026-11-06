// Chef's Menu Manager shared design tokens.

export const COLORS = {
  primary: '#214C3A',
  primaryDark: '#17382B',
  primaryLight: '#DCE9DF',
  accent: '#D78148',
  background: '#F5F4ED',
  surface: '#FFFFFF',
  border: '#E1E3D9',
  text: '#202A24',
  textMuted: '#69756D',
  placeholder: '#929A92',
  success: '#2E7D4F',
  successBg: '#E4F5EA',
  error: '#C62839',
  errorBg: '#FDE8EA',
  white: '#FFFFFF',
  overlay: 'rgba(26, 39, 31, 0.48)',
};

export const COURSES = ['Starter', 'Main Course', 'Dessert'];

export const COURSE_COLORS = {
  Starter: { bg: '#F8E7C8', text: '#80541A' },
  'Main Course': { bg: '#DCE9DF', text: COLORS.primaryDark },
  Dessert: { bg: '#F4DED4', text: '#8F4D36' },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  pill: 999,
};

export const FONT = {
  h1: 26,
  h2: 20,
  body: 15,
  small: 13,
};
