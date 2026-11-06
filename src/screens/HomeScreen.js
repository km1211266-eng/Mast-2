import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMenu } from '../context/MenuContext';
import MenuItemCard from '../components/MenuItemCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import CourseFilter from '../components/CourseFilter';
import StatsView from '../components/StatsView';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import MenuItemFormModal from './MenuItemFormModal';
import {
  ALL_COURSES,
  calculateStats,
  filterMenuItems,
  formatPrice,
} from '../utils/menuHelpers';
import { COLORS, COURSES, FONT, RADIUS, SPACING } from '../constants/theme';

const TABS = ['Menu', 'Statistics'];

export default function HomeScreen() {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    isReady,
    storageError,
  } = useMenu();

  const [activeTab, setActiveTab] = useState('Menu');
  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] = useState(ALL_COURSES);

  const [formVisible, setFormVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [toast, setToast] = useState({ message: '', type: 'success' });
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast({ message: '', type }), 2500);
  }, []);

  useEffect(() => {
    if (storageError) {
      showToast('Your menu could not be saved on this device.', 'error');
    }
  }, [storageError, showToast]);

  // The list shown on screen is worked out from the full menu plus the
  // current search text and course filter, so it always stays in sync.
  const visibleItems = useMemo(
    () => filterMenuItems(menuItems, searchText, courseFilter),
    [menuItems, searchText, courseFilter]
  );
  const overviewStats = calculateStats(menuItems);
  const activeCourseCount = Object.values(overviewStats.byCourse).filter(
    (count) => count > 0
  ).length;

  const filtersActive = searchText.trim() !== '' || courseFilter !== ALL_COURSES;

  const clearFilters = () => {
    setSearchText('');
    setCourseFilter(ALL_COURSES);
  };

  const openAddForm = () => {
    setItemToEdit(null);
    setFormVisible(true);
  };

  const openEditForm = (item) => {
    setItemToEdit(item);
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setItemToEdit(null);
  };

  const handleSubmit = (data) => {
    if (itemToEdit) {
      updateMenuItem(itemToEdit.id, data);
      showToast(`"${data.dishName}" was updated.`);
    } else {
      addMenuItem(data);
      showToast(`"${data.dishName}" was added to the menu.`);
    }
    closeForm();
  };

  const confirmDelete = () => {
    deleteMenuItem(itemToDelete.id);
    showToast(`"${itemToDelete.dishName}" was deleted.`);
    setItemToDelete(null);
  };

  const itemCountLabel = !isReady
    ? 'Loading your menu...'
    : menuItems.length === 1
      ? '1 dish'
      : `${menuItems.length} dishes`;

  const loadingState = (
    <View style={styles.loadingState}>
      <ActivityIndicator color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading saved menu...</Text>
    </View>
  );

  const listEmptyState = !isReady ? loadingState : filtersActive ? (
    <EmptyState
      emoji="🔍"
      title="No dishes found"
      subtitle="Try a different name or course, or clear the search."
    />
  ) : (
    <EmptyState />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View style={styles.headerEyebrowRow}>
          <Text style={styles.eyebrow}>SERVICE / MENU</Text>
          <View style={styles.savedBadge}>
            <View
              style={[
                styles.savedDot,
                storageError && styles.savedDotError,
              ]}
            />
            <Text style={styles.savedText}>
              {storageError ? 'NOT SAVED' : isReady ? 'SAVED LOCALLY' : 'LOADING'}
            </Text>
          </View>
        </View>
        <Text style={styles.appTitle}>Chef's Menu Manager</Text>
        <Text style={styles.appSubtitle}>
          {isReady ? `${itemCountLabel} ready for service` : itemCountLabel}
        </Text>
      </View>

      <View style={styles.overviewRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>MENU ITEMS</Text>
          <Text style={styles.metricValue}>{isReady ? menuItems.length : '-'}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>AVG. PRICE</Text>
          <Text style={styles.metricValue}>
            {isReady ? formatPrice(overviewStats.average) : '--'}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>COURSES</Text>
          <Text style={styles.metricValue}>
            {isReady ? `${activeCourseCount}/${COURSES.length}` : '-'}
          </Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'Menu' ? (
        <>
          <View style={styles.searchArea}>
            <SearchBar value={searchText} onChangeText={setSearchText} />
            <CourseFilter selected={courseFilter} onSelect={setCourseFilter} />
            {filtersActive && (
              <View style={styles.resultsRow}>
                <Text style={styles.resultsText}>
                  Showing {visibleItems.length} of {menuItems.length}
                </Text>
                <Pressable onPress={clearFilters} hitSlop={8} accessibilityRole="button">
                  <Text style={styles.clearLink}>Clear search & filter</Text>
                </Pressable>
              </View>
            )}
          </View>

          <FlatList
            data={isReady ? visibleItems : []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MenuItemCard
                item={item}
                onEdit={openEditForm}
                onDelete={setItemToDelete}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={listEmptyState}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              onPress={openAddForm}
              disabled={!isReady}
              accessibilityRole="button"
            >
              <Text style={styles.addButtonText}>+ Add Menu Item</Text>
            </Pressable>
          </View>
        </>
      ) : (
        isReady ? <StatsView items={menuItems} /> : loadingState
      )}

      <MenuItemFormModal
        visible={formVisible}
        itemToEdit={itemToEdit}
        existingItems={menuItems}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        visible={!!itemToDelete}
        title="Delete this dish?"
        message={
          itemToDelete
            ? `"${itemToDelete.dishName}" will be removed from the menu. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <Toast message={toast.message} type={toast.type} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.accent,
  },
  headerEyebrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  eyebrow: {
    fontSize: FONT.small,
    fontWeight: '800',
    color: '#F3C48E',
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  savedDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.pill,
    backgroundColor: '#9AD0A8',
    marginRight: SPACING.xs,
  },
  savedDotError: {
    backgroundColor: '#FF9A8B',
  },
  savedText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
  },
  appSubtitle: {
    fontSize: FONT.body,
    color: '#DCE9DF',
    marginTop: 4,
  },
  overviewRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginTop: -SPACING.sm,
    zIndex: 1,
  },
  metricCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 72,
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xs,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  searchArea: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  resultsText: {
    fontSize: FONT.small,
    color: COLORS.textMuted,
  },
  clearLink: {
    fontSize: FONT.small,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    flexGrow: 1,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: FONT.body,
    color: COLORS.textMuted,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  addButtonPressed: {
    backgroundColor: COLORS.primaryDark,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONT.h2,
    fontWeight: '700',
  },
});
