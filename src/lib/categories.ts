/**
 * The Category tabs, by meal, in the order they appear (ADR 0003). Every
 * recipe has exactly one: where you'd usually reach for it. Tags cover the rest.
 */
export const CATEGORIES = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'sides', label: 'Sides' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'drinks', label: 'Drinks' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export const CATEGORY_IDS = CATEGORIES.map((category) => category.id) as [CategoryId, ...CategoryId[]];

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((category) => category.id === id)!.label;
}
