import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, COURSE_COLORS, FONT, RADIUS, SPACING } from '../constants/theme';
import { formatPrice } from '../utils/menuHelpers';

export default function MenuItemCard({ item, onEdit, onDelete }) {
  const courseStyle = COURSE_COLORS[item.course] || {
    bg: COLORS.primaryLight,
    text: COLORS.primaryDark,
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.dishName} numberOfLines={2}>
          {item.dishName}
        </Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>

      <View style={[styles.courseBadge, { backgroundColor: courseStyle.bg }]}>
        <Text style={[styles.courseText, { color: courseStyle.text }]}>
          {item.course}
        </Text>
      </View>

      {!!item.description && (
        <Text style={styles.description}>{item.description}</Text>
      )}

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
          onPress={() => onEdit(item)}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${item.dishName}`}
        >
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
          onPress={() => onDelete(item)}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${item.dishName}`}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dishName: {
    flex: 1,
    fontSize: FONT.h2,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  price: {
    fontSize: FONT.h2,
    fontWeight: '700',
    color: COLORS.primary,
  },
  courseBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    marginTop: SPACING.sm,
  },
  courseText: {
    fontSize: FONT.small,
    fontWeight: '600',
  },
  description: {
    marginTop: SPACING.sm,
    fontSize: FONT.body,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  editButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primaryLight,
    marginRight: SPACING.sm,
  },
  editText: {
    color: COLORS.primaryDark,
    fontWeight: '700',
    fontSize: FONT.body,
  },
  deleteButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.errorBg,
  },
  deleteText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: FONT.body,
  },
  pressed: {
    opacity: 0.6,
  },
});
