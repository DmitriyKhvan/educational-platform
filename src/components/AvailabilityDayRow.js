import React, { useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
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
  const [ontoggle, setOntoggle] = useState(false)
  const [newRow, setNewRow] = useState(false)
  const tutorInfo = useSelector(state => state.tutor.info)
  const { setAvailabilityRow, removeAvailabilityRow, availabilityRow } =
    useContext(AvailProv)

  useEffect(() => {
    
    setInitialRow(uuid())
  }, [])
  useEffect(() => {
    if (ontoggle === false) {
      gatherAvailabilities.map(data => {
        if (data.day === day) {
          if (toggle === false) {
            setToggle(true)
          }
        }
      })
    }
  }, [gatherAvailabilities])
  const onToggleDay = () => {
    setOntoggle(true)
    setToggle(!toggle)
    if (!toggle) {
      removeAvailabilityRow({ day })
    }
    if (toggle === true) {
      setGatherAvailabilities(gatherAvailabilities.filter(q => q.day !== day))
    }
  }
  const addAvailRow = () => {
    const id = uuid()
    setAvailabilityRow(row => [...row, { id }])
    setNewRow(true)
  }
  return (
    <div className='row form-switch justify-content-md-center py-3 border-availabilities-picker'>
      <input
        className='form-check-input mt-3 align_Toggle'
        type='checkbox'
        name={day}
        checked={toggle}
        onClick={onToggleDay}
      />
      <div className='col-sm-1 ms-3 me-5 align_day'>
        <div>
          <strong>{day}</strong>
        </div>
      </div>
      {toggle && (
        <>
          <div className='col-auto justify-content-md-center aligns_row_time'>
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
                  newRow={newRow}
                />
              )
            })}
          </div>
          <div className='col-auto align_fa_trash'>
            <button className='btn fa_trash_can ms-3 pb-0' onClick={addAvailRow}>
              <img className='plus_button' src={plusIcon} alt='' />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
export default AvailabilityDayRow
