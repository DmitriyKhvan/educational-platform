export const timeGroups = (data) => {
  const maxGap = 30 * 60; // 30 минут в секундах

  const splitData = [];
  let currentGroup = [];

  data.forEach((item, index) => {
    if (index === 0) {
      currentGroup.push(item);
      return;
    }

    const prevItem = data[index - 1];
    const gap = item.value - prevItem.value;

    if (gap <= maxGap) {
      currentGroup.push(item);
    } else {
      splitData.push(currentGroup);
      currentGroup = [item];
    }

    if (index === data.length - 1) {
      splitData.push(currentGroup);
    }
  });

  return splitData;
};
