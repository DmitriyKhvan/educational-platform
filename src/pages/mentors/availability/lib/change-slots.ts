export const changeSlots = (startSlots: any[], updatedSlots: any[]) => {
  const changeAvailabilities = updatedSlots.filter((updatedObj) => {
    const originalObj = startSlots.find((originalObj) => originalObj.id === updatedObj.id);
    return !originalObj || !(JSON.stringify(originalObj) === JSON.stringify(updatedObj));
  });

  return changeAvailabilities;
};
