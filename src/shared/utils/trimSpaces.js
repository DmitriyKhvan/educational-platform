export const trimSpaces = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim();
    } else if (typeof obj[key] === 'object') {
      trimSpaces(obj[key]); // Рекурсивный вызов для вложенных объектов
    }
  }

  return obj;
};
