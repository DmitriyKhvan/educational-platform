import ImgIncrease from '../assets/images/increase.svg'
import ImgDecrease from '../assets/images/decrease.svg'
import { useState } from 'react'

export const Counter = ({ max, min, onUpdate, initValue }) => {
  const [value, setValue] = useState(initValue)
  const onChange = plus => {
    let val = value
    if (plus) {
      if (value < max) {
        val = value + 1
      } else {
        val = 0
      }
    } else {
      if (value > 0) {
        val = value - 1
      } else {
        val = max
      }
    }
    setValue(val)
    onUpdate(val)
  }
  return (
    <div className="counter">
      <div className="button" onClick={() => onChange(true)}>
        <img src={ImgIncrease} alt="" />
      </div>
      <div className="value">{value.toString().padStart(2, '0')}</div>
      <div className="button" onClick={() => onChange(false)}>
        <img src={ImgDecrease} alt="" />
      </div>
    </div>
  )
}
