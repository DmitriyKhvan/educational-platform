import type { ExceptionDateSlot, Maybe } from "@/types/types.generated";

// interface SlotsInterface {
//   id: InputMaybe<string> | undefined;
//   date: string;
//   from: string;
//   to: string;
// }[]
export const changeSlots = (startSlots: Maybe<ExceptionDateSlot>[], updatedSlots: Maybe<ExceptionDateSlot>[]) => {
  const changeAvailabilities = updatedSlots.filter((updatedObj) => {
    const originalObj = startSlots.find((originalObj) => originalObj?.id === updatedObj?.id);
    return !originalObj || !(JSON.stringify(originalObj) === JSON.stringify(updatedObj));
  });

  return changeAvailabilities;
};
