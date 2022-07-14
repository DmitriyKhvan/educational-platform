import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import AvailabilityPickerOver from '../pages/Tutors/Availiability/AvailabilityPicker'
import { AvailProv } from '../pages/Tutors/Availiability/AvailabilityProvider'
import plusIcon from '../assets/images/plus_icon.svg'
import { v4 as uuid } from 'uuid'
export const AvailabilityDayRowOver = ({
  startDate,
  setGatherAvailabilities,
  gatherAvailabilities,
  setHasValidTimes
}) => {
  const tutorInfo = useSelector(state => state.tutor.info)
  const avail = useContext(AvailProv)
  const addAvailRows = () => {
    const id = uuid()
    avail.setAvailabilityRow(row => [...row, { id }])
  }
  return (
    <div className='row form-switch justify-content-md-center m-3 ms-0 ps-0 '>
      <>
        <div className='col-auto justify-content-md-center override-srcolls aligns_row_time'>
          <AvailabilityPickerOver
            date={startDate}
            setGatherAvailabilities={setGatherAvailabilities}
            gatherAvailabilities={gatherAvailabilities}
            disabled={true}
            setHasValidTimes={setHasValidTimes}
          />

          {avail.availabilityRow.map(k => {
            return (
              <>
                <AvailabilityPickerOver
                  date={startDate}
                  i={avail.availabilityRow.length + 1}
                  key={k.id}
                  id={k.id}
                  setGatherAvailabilities={setGatherAvailabilities}
                  gatherAvailabilities={gatherAvailabilities}
                  setHasValidTimes={setHasValidTimes}
                />
              </>
            )
          })}
        </div>
        <div className='col-auto align-self-centers'>
          <button className='btn fa_trash_can pb-0' onClick={addAvailRows}>
            <img className='plus_button' src={plusIcon} alt='' />
          </button>
        </div>
      </>
    </div>
  )
}

export default AvailabilityDayRowOver
