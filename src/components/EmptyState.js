import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT, SPACING } from '../constants/theme';

// Reused for "no dishes yet" and "no search results" so both look consistent.
export default function EmptyState({
  emoji = '🍽️',
  title = 'No menu items yet',
  subtitle = 'Tap "Add Menu Item" below to add your first dish.',
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
    paddingHorizontal: SPACING.lg,
  },
  emoji: {
    fontSize: 42,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT.h2,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
