import { COURSES } from '../constants/theme';

export const ALL_COURSES = 'All';

export function formatPrice(value) {
  return `R${Number(value).toFixed(2)}`;
}

// Search by dish name (case-insensitive) and/or filter by course.
// Both rules are applied together, so "pie" + "Dessert" only shows dessert pies.
export function filterMenuItems(items, query, course) {
  const text = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesCourse = course === ALL_COURSES || item.course === course;
    const matchesName = !text || item.dishName.toLowerCase().includes(text);
    return matchesCourse && matchesName;
  });
}

// Statistics shown on the Statistics tab.
export function calculateStats(items) {
  const total = items.length;
  const average =
    total === 0 ? 0 : items.reduce((sum, item) => sum + item.price, 0) / total;

  const byCourse = {};
  COURSES.forEach((course) => {
    byCourse[course] = items.filter((item) => item.course === course).length;
  });

  return { total, average, byCourse };
}
