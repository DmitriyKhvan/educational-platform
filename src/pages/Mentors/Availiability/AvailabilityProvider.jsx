/* eslint-disable no-unused-vars */
// This file uses vars and i'm afraid to delete them

import { createContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
export const AvailProv = createContext();

export const AvailabilityProvider = ({
  children,
  gatherAvailabilities,
  setGatherAvailabilities,
  setIsTeachAddHours,
  AvailabilitySlots,
  isteachAddHours,
  day,
  validateTimesSelected,
}) => {
  const removeAvailabilityRow = ({ id, day, mentorAvailabilityType }) => {
    const tempData = [
      { id: id, day: undefined, slots: [{ from: '09:00', to: '17:00' }] },
    ];
    if (id) {
      var deleteRow = gatherAvailabilities.filter((q) => q.id !== id);
      const removeDay =
        isteachAddHours && isteachAddHours.filter((el) => el !== day);
      setIsTeachAddHours(removeDay);
      localStorage.setItem('deleteRow', JSON.stringify(deleteRow));
      setGatherAvailabilities(
        deleteRow.length === 0 ? tempData : deleteRow,
        mentorAvailabilityType,
      );

      validateTimesSelected(deleteRow.length === 0 ? tempData : deleteRow, day);
    }
  };

  return (
    <AvailProv.Provider
      value={{
        removeAvailabilityRow,
      }}
    >
      {children}
    </AvailProv.Provider>
  );
};
