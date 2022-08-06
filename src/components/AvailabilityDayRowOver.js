import React, { useContext, useEffect,useState} from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import AvailabilityPickerOver from '../pages/Tutors/Availiability/AvailabilityPicker'
import { AvailProv } from '../pages/Tutors/Availiability/AvailabilityProvider'
import plusIcon from '../assets/images/plus_icon.svg'



export const AvailabilityDayRowOver = ({
  startDate,
  setGatherAvailabilities,
  gatherAvailabilities,
  setHasValidTimes,
  setDisablePlusBtn,
  disablePlusBtn,
  AvailabilitySlots,
  setCurrentToTime,
  currentToTime,
  type,
  id
}) => {
  const tutorInfo = useSelector(state => state.tutor.info)
  // const [currentToTime, setCurrentToTime] = useState("16:00")
  const { t } = useTranslation()

  const avail = useContext(AvailProv)
  const { addAvailRows } = useContext(AvailProv)

  

  useEffect(()=>{
    var crttoTime = currentToTime.split(":")
    if(crttoTime[0]>=17){
    }else{
      setDisablePlusBtn(false)
    }
  },[currentToTime])

 
 
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
            updateTime={setCurrentToTime}
            setDisablePlusBtn ={setDisablePlusBtn}
            disablePlusBtn ={disablePlusBtn}
            AvailabilitySlots ={AvailabilitySlots}
            type={type}
            id={id}
            frmTime ={gatherAvailabilities[0]?.slots?.[0].from || "09:00"}
            tTime ={gatherAvailabilities[0]?.slots?.[0].to || "17:00"}
          />

          {avail.availabilityRow.exceptiondates.map(k => {
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
                  frmTime ={k.fromTime}
                  tTime={k.toTime}
                  updateTime={setCurrentToTime}
                  setDisablePlusBtn ={setDisablePlusBtn}
                  disablePlusBtn ={disablePlusBtn}
                  AvailabilitySlots ={AvailabilitySlots}
                  type={type}
                  
                />
              </>
            )
          })}
        </div>
        <div className='col-auto align-self-centers' style={disablePlusBtn===true?{cursor:"not-allowed"}:{}}>
          <button className='btn fa_trash_can pb-0' onClick={()=>addAvailRows('exceptiondates')} disabled={disablePlusBtn} >
            <img className='plus_button' src={plusIcon} alt='' />
          </button>
        </div>
      </>
    </div>
  )
}

export default AvailabilityDayRowOver
