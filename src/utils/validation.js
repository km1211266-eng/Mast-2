// Validation rules for the add / edit menu item form.
// Kept outside the screen so the rules are easy to read, reuse and change.

const PRICE_PATTERN = /^\d+(\.\d{1,2})?$/;

// South African users often type a comma as the decimal separator ("145,50"),
// so we accept it and convert it to a dot before checking or saving.
export function normalisePrice(text) {
  return text.trim().replace(',', '.');
}

export function validateMenuItem(form, existingItems = [], editingId = null) {
  const errors = {};
  const name = form.dishName.trim();

  if (!name) {
    errors.dishName = 'Dish name is required.';
  } else if (name.length < 2) {
    errors.dishName = 'Dish name must be at least 2 characters.';
  } else if (
    form.course &&
    existingItems.some(
      (item) =>
        item.id !== editingId &&
        item.course === form.course &&
        item.dishName.toLowerCase() === name.toLowerCase()
    )
  ) {
    errors.dishName = `"${name}" is already on the ${form.course} menu.`;
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required.';
  }

  if (!form.course) {
    errors.course = 'Please select a course.';
  }

  const price = normalisePrice(form.price);
  if (!price) {
    errors.price = 'Price is required.';
  } else if (!PRICE_PATTERN.test(price)) {
    errors.price = 'Enter a valid price, e.g. 145 or 145.50.';
  } else if (Number(price) <= 0) {
    errors.price = 'Price must be greater than 0.';
  } else if (Number(price) > 99999) {
    errors.price = 'Price looks too high. Please check it.';
  }

  return errors;
}
