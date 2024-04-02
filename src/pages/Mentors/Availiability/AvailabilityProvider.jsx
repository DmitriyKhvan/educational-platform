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
  setDisablePlusBtn,
  setIsTeachAddHours,
  AvailabilitySlots,
  isteachAddHours,
  day,
  validateTimesSelected,
}) => {
  // const [availabilityRow, setAvailabilityRow] = useState({
  //   exceptiondates: [],
  //   availability: [],
  // });

  // console.log('availabilityRow', availabilityRow);

  const removeAvailabilityRow = ({ id, day, mentorAvailabilityType }) => {
    debugger;
    const tempData = [
      { id: id, day: undefined, slots: [{ from: '09:00', to: '17:00' }] },
    ];
    if (id) {
      // setAvailabilityRow({
      //   ...availabilityRow,
      //   [type]: availabilityRow[type].filter((q) => q.id !== id),
      // });
      var LastToTime, fromTime, length;
      var deleteRow = gatherAvailabilities.filter((q) => q.id !== id);
      const removeDay =
        isteachAddHours && isteachAddHours.filter((el) => el !== day);
      setIsTeachAddHours(removeDay);
      localStorage.setItem('deleteRow', JSON.stringify(deleteRow));
      setGatherAvailabilities(
        deleteRow.length === 0 ? tempData : deleteRow,
        mentorAvailabilityType,
      );

      if (deleteRow.length > 0) {
        length = deleteRow.length - 1;
        LastToTime = deleteRow[length].slots[0].to;
        fromTime = LastToTime;
        if (LastToTime === '23:30') {
          // setIsTeachAddHours(true)
          setDisablePlusBtn(true);
        } else {
          // setIsTeachAddHours(false)
          setDisablePlusBtn(false);
        }
      }
      validateTimesSelected(deleteRow.length === 0 ? tempData : deleteRow, day);
    }
  };

  const addAvailRows = (type) => {
    var length, LastToTime, fromTime, toTime;
    if (gatherAvailabilities.length > 0) {
      length = gatherAvailabilities.length - 1;
      LastToTime = gatherAvailabilities[length].slots[0].to;
      // fromTime = moment(LastToTime, 'HH:mm:ss').add("60", 'minutes').format('HH:mm');
      fromTime = LastToTime;
      if (fromTime >= '23:00') {
        toTime = moment(fromTime, 'HH:mm:ss')
          .add('30', 'minutes')
          .format('HH:mm');
        setDisablePlusBtn(true);
      } else {
        toTime = moment(fromTime, 'HH:mm:ss')
          .add('60', 'minutes')
          .format('HH:mm');
      }
    }
    const id = uuid();
    AvailabilitySlots(fromTime || '09:00', toTime || '17:00', id);
    // setAvailabilityRow({
    //   ...availabilityRow,
    //   [type]: [
    //     ...availabilityRow[type],
    //     ...[
    //       { id, fromTime: fromTime || '09:00', toTime: toTime || '17:00', day },
    //     ],
    //   ],
    // });
  };
  const addAvailRowUp = (day, type) => {
    var length, LastToTime, fromTime, toTime;
    const tempDay = [...isteachAddHours];
    if (gatherAvailabilities.length > 0) {
      length = gatherAvailabilities.length - 1;
      gatherAvailabilities.map((data) => {
        if (data.day === day) {
          LastToTime = data.slots[0].to;
        }
        var allLast = data.slots[0].to;
        fromTime = LastToTime;
        if (fromTime >= '23:00') {
          toTime = moment(fromTime, 'HH:mm:ss')
            .add('30', 'minutes')
            .format('HH:mm');
          tempDay.push(day);
        } else {
          toTime = moment(fromTime, 'HH:mm:ss')
            .add('60', 'minutes')
            .format('HH:mm');
        }
      });
      setIsTeachAddHours([...new Set(tempDay)]);
    }
    const id = uuid();
    AvailabilitySlots(fromTime || '09:00', toTime || '17:00', id, day);
    // setAvailabilityRow({
    //   ...availabilityRow,
    //   [type]: [
    //     ...availabilityRow[type],
    //     ...[
    //       { id, fromTime: fromTime || '09:00', toTime: toTime || '17:00', day },
    //     ],
    //   ],
    // });
  };

  return (
    <AvailProv.Provider
      value={{
        // availabilityRow,
        // setAvailabilityRow,
        removeAvailabilityRow,
        addAvailRows,
        addAvailRowUp,
      }}
    >
      {children}
    </AvailProv.Provider>
  );
};
