import React from 'react'
import style from './OverlayStyle.module.scss'

export const DarkBackground = props => {
  // output a messaqge in the console on the first render
  React.useEffect(() => {
    console.log('DarkBackground rendered')
  }, [])
  return <div className={`${props.disappear ? style.show : style.hide}`}></div>
}
