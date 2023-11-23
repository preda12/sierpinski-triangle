export const toBool = (value, fallback = false) => {
  return value ? value === 'true' : fallback;
};

export const toInt = (value, fallback) => {
  return value ? parseInt(value, 10) : fallback;
};
