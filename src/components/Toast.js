import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';

// Small banner that confirms an action (added / updated / deleted).
export default function Toast({ message, type = 'success' }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <View
      pointerEvents="none"
      style={[styles.toast, isError ? styles.error : styles.success]}
    >
      <Text style={[styles.text, isError ? styles.errorText : styles.successText]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    bottom: 96,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  success: { backgroundColor: COLORS.successBg, borderColor: COLORS.success },
  error: { backgroundColor: COLORS.errorBg, borderColor: COLORS.error },
  text: { fontSize: FONT.body, fontWeight: '600', textAlign: 'center' },
  successText: { color: COLORS.success },
  errorText: { color: COLORS.error },
});
