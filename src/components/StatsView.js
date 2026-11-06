import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, COURSE_COLORS, COURSES, FONT, RADIUS, SPACING } from '../constants/theme';
import { calculateStats, formatPrice } from '../utils/menuHelpers';
import EmptyState from './EmptyState';

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// Overview of the whole menu (always uses the full list, not the search results).
export default function StatsView({ items }) {
  const stats = useMemo(() => calculateStats(items), [items]);

  if (stats.total === 0) {
    return (
      <EmptyState
        emoji="📊"
        title="No statistics yet"
        subtitle="Add some dishes and your menu overview will appear here."
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.row}>
        <StatCard label="Total menu items" value={String(stats.total)} />
        <StatCard label="Average price" value={formatPrice(stats.average)} />
      </View>

      <Text style={styles.sectionTitle}>Items per course</Text>
      {COURSES.map((course) => (
        <View key={course} style={styles.courseRow}>
          <View style={[styles.dot, { backgroundColor: COURSE_COLORS[course].bg }]} />
          <Text style={styles.courseName}>{course}</Text>
          <Text style={styles.courseCount}>{stats.byCourse[course]}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT.h1,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    marginTop: SPACING.xs,
    fontSize: FONT.small,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FONT.h2,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: SPACING.sm,
  },
  courseName: {
    flex: 1,
    fontSize: FONT.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  courseCount: {
    fontSize: FONT.h2,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
