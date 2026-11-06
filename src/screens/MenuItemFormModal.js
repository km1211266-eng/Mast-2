import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FormField from '../components/FormField';
import CourseSelector from '../components/CourseSelector';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';
import { normalisePrice, validateMenuItem } from '../utils/validation';

const emptyForm = { dishName: '', description: '', course: '', price: '' };

// One form for both adding and editing.
// - itemToEdit === null  -> "Add Menu Item" mode (empty form)
// - itemToEdit is a dish -> "Edit Menu Item" mode (form pre-filled)
export default function MenuItemFormModal({
  visible,
  itemToEdit,
  existingItems,
  onClose,
  onSubmit,
}) {
  const isEditing = !!itemToEdit;
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Every time the form opens, load the dish being edited (or a blank form).
  useEffect(() => {
    if (!visible) return;
    setErrors({});
    setForm(
      itemToEdit
        ? {
            dishName: itemToEdit.dishName,
            description: itemToEdit.description,
            course: itemToEdit.course,
            price: String(itemToEdit.price),
          }
        : emptyForm
    );
  }, [visible, itemToEdit]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateMenuItem(
      form,
      existingItems,
      itemToEdit ? itemToEdit.id : null
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      dishName: form.dishName.trim(),
      description: form.description.trim(),
      course: form.course,
      price: Number(normalisePrice(form.price)),
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Menu Item' : 'Add Menu Item'}
          </Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button">
            <Text style={styles.closeText}>Cancel</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          <FormField
            label="Dish Name"
            value={form.dishName}
            onChangeText={(text) => setField('dishName', text)}
            placeholder="e.g. Butternut & Sage Ravioli"
            error={errors.dishName}
            maxLength={60}
          />

          <FormField
            label="Description"
            value={form.description}
            onChangeText={(text) => setField('description', text)}
            placeholder="Describe the dish..."
            error={errors.description}
            multiline
            maxLength={200}
          />

          <CourseSelector
            label="Course"
            value={form.course}
            onChange={(course) => setField('course', course)}
            error={errors.course}
          />

          <FormField
            label="Price (ZAR)"
            value={form.price}
            onChangeText={(text) => setField('price', text)}
            placeholder="e.g. 145.00"
            error={errors.price}
            keyboardType="decimal-pad"
          />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
            onPress={handleSubmit}
            accessibilityRole="button"
          >
            <Text style={styles.submitText}>
              {isEditing ? 'Save Changes' : 'Save Menu Item'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: FONT.h1,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeText: {
    fontSize: FONT.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  form: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    flexGrow: 1,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  submitButtonPressed: {
    backgroundColor: COLORS.primaryDark,
  },
  submitText: {
    color: COLORS.white,
    fontSize: FONT.h2,
    fontWeight: '700',
  },
});
