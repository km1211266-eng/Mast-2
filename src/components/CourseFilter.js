import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, COURSES, FONT, RADIUS, SPACING } from '../constants/theme';
import { ALL_COURSES } from '../utils/menuHelpers';

const OPTIONS = [ALL_COURSES, ...COURSES];

// Row of chips: All / Starter / Main Course / Dessert.
// Choosing "All" shows every course again.
export default function CourseFilter({ selected, onSelect }) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const active = selected === option;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.chip, active && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT.small,
    fontWeight: '600',
    color: COLORS.text,
  },
  chipTextActive: {
    color: COLORS.white,
  },
});
