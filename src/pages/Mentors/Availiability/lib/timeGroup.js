export const timeGroup = (timeGroups, time) => {
  // Проходим по каждому массиву в массиве массивов
  for (var i = 0; i < timeGroups.length; i++) {
    if (
      timeGroups[i].find((t) => {
        return t.value === time;
      })
    ) {
      return timeGroups[i];
    }
  }

  return [];
};
