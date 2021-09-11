import React from 'react'
import ImgStarOutline from '../assets/images/star_outline.svg'
import ImgStarFill from '../assets/images/star_fill.svg'

const Stars = ({ points }) => {
  return (
    <div className="stars">
      {[0, 1, 2, 3, 4].map(index => {
        let decimal = 100 - (points - index) * 100
        let blankSpan = <></>
        if (decimal < 100 && decimal > 0) {
          blankSpan = (
            <span className="blank" style={{ width: `${decimal}%` }} />
          )
        }
        return (
          <span key={`star-${index}`}>
            <img src={index < points ? ImgStarFill : ImgStarOutline} alt="" />
            {blankSpan}
          </span>
        )
      })}
    </div>
  )
}

export default Stars
