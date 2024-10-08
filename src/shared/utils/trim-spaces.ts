type TrimmedObject<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Array<infer U>
      ? Array<TrimmedObject<U>>
      : T[K] extends object
        ? TrimmedObject<T[K]>
        : T[K];
};

export const trimSpaces = <T extends Record<string, unknown>>(obj: T): TrimmedObject<T> => {
  const result = {} as TrimmedObject<T>;

  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result[key] = (obj[key] as string).trim() as TrimmedObject<T>[typeof key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        result[key] = (obj[key] as Array<unknown>).map((item) =>
          typeof item === 'string' ? item.trim() : trimSpaces(item as Record<string, unknown>),
        ) as TrimmedObject<T>[typeof key];
      } else {
        result[key] = trimSpaces(
          obj[key] as Record<string, unknown>,
        ) as TrimmedObject<T>[typeof key];
      }
    } else {
      result[key] = obj[key] as TrimmedObject<T>[typeof key];
    }
  }

  return result;
};
