import type { ExceptionDateSlot, Maybe } from "@/types/types.generated";

export const changeSlots = (startSlots: Maybe<ExceptionDateSlot>[], updatedSlots: any[]) => {
  const changeAvailabilities = updatedSlots.filter((updatedObj) => {
    const originalObj = startSlots.find((originalObj) => originalObj?.id === updatedObj.id);
    return !originalObj || !(JSON.stringify(originalObj) === JSON.stringify(updatedObj));
  });

  return changeAvailabilities;
};
