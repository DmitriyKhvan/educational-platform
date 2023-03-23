import { useEffect, useState } from 'react'

export const Toggle = ({ on, off, className, initValue, onUpdate }) => {
  const [activeItem, setActiveItem] = useState(initValue)
  useEffect(() => {
    setActiveItem(initValue)
  }, [initValue])

  const onClick = value => {
    setActiveItem(value)
    onUpdate(value)
  }

  return (
    <div className={'toggle ' + className}>
      <span
        className={'left ' + (activeItem === on.value ? 'active' : '')}
        onClick={() => onClick(on.value)}
      >
        {on.label}
      </span>
      <span
        className={'right ' + (activeItem === off.value ? 'active' : '')}
        onClick={() => onClick(off.value)}
      >
        {off.label}
      </span>
    </div>
  )
}
