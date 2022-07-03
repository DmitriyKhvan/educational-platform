import React, { useContext, useState, useEffect } from 'react'
import AvailabilityPicker from '../pages/Tutors/Availiability/AvailabilityPicker'
import { AvailProv } from '../pages/Tutors/Availiability/AvailabilityProvider'
import plusIcon from '../assets/images/plus_icon.svg'
import { v4 as uuid } from 'uuid'

export const AvailabilityDayRow = ({
  day,
  setGatherAvailabilities,
  gatherAvailabilities,
  setHasValidTimes
}) => {
  const [toggle, setToggle] = useState(false)
  const [initialRow, setInitialRow] = useState()
  const {
    setAvailabilityRow,
    removeAvailabilityRow,
    availabilityRow
  } = useContext(AvailProv)

  useEffect(() => {
    setInitialRow(uuid())
  }, [])

  useEffect(() => {
    for (const gatherAvailability of gatherAvailabilities) {
      console.log(gatherAvailability)
    }
  }, [gatherAvailabilities])

  const onToggleDay = () => {
    setToggle(!toggle)
    if (!toggle) {
      removeAvailabilityRow({ day })
    }
  }

  const addAvailRow = () => {
    const id = uuid()
    setAvailabilityRow(row => [...row, { id }])
  }

  return (
    <div className='row form-switch justify-content-md-center m-3 border-availabilities-picker'>
      <input
        className='form-check-input mt-1 mb-4'
        type='checkbox'
        name={day}
        onClick={onToggleDay}
      />
      <div className='col-sm-1 ms-3 me-5'>
        <div>
          <strong>{day}</strong>
        </div>
      </div>
      {toggle && (
        <>
          <div className='col justify-content-md-center'>
            <AvailabilityPicker
              day={day}
              key={initialRow}
              id={initialRow}
              setGatherAvailabilities={setGatherAvailabilities}
              gatherAvailabilities={gatherAvailabilities}
              disabled={true}
              setHasValidTimes={setHasValidTimes}
            />
            {availabilityRow.map((k, i) => {
              return (
                <AvailabilityPicker
                  day={day}
                  key={i}
                  id={k.id}
                  setGatherAvailabilities={setGatherAvailabilities}
                  gatherAvailabilities={gatherAvailabilities}
                  setHasValidTimes={setHasValidTimes}
                />
              )
            })}
          </div>
          <div className='col-sm-1'>
            <button className='btn fa_trash_can pb-0' onClick={addAvailRow}>
              <img className='plus_button' src={plusIcon} alt='' />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default AvailabilityDayRow

/**\  <button type='button' className='btn time_picker'>
          <FontAwesomeIcon icon={faPlus} size='1x' />
        </button> */
