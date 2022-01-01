import ImgCheck from '../assets/images/checkbox/check.svg'
import ImgUncheck from '../assets/images/checkbox/uncheck.svg'

export const Checkbox = ({ label, checked, onChange }) => {
  return (
    <div className='checkbox' onClick={() => onChange(label)}>
      {checked && <img src={ImgCheck} alt='' />}
      {!checked && <img src={ImgUncheck} alt='' />}
      <p>{label}</p>
    </div>
  )
}
