export const columnStorageKey = tableId => `flowbook:table-columns:v1:${tableId}`;

export function readColumnPreferences(storage, tableId) {
  try {
    const value = JSON.parse((typeof storage === 'function' ? storage() : storage).getItem(columnStorageKey(tableId)) || '{}');
    if (!value || Array.isArray(value) || typeof value !== 'object') return {};
    return Object.fromEntries(Object.entries(value).filter(([, visible]) => typeof visible === 'boolean'));
  } catch { return {}; }
}

export function columnIsVisible(preferences, key, defaultHidden, required) {
  return required || (Object.hasOwn(preferences, key) ? preferences[key] : !defaultHidden.includes(key));
}
