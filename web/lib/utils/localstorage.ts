export const getItemFromLocalStorage = <T>(key: string, parse = true): T | null => {
  const gottenValue = window.localStorage.getItem(key);
  return gottenValue && parse ? JSON.parse(gottenValue) : gottenValue;
};

export const setItemToLocalStorage = (key: string, value: unknown) => {
  const putValue = typeof value === 'string' ? value : JSON.stringify(value);
  window.localStorage.setItem(key, putValue);
};
