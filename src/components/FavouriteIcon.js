import React, { useEffect, useState } from 'react'
import ImgHeartOn from '../assets/images/heart_on.svg'
import ImgHeartOff from '../assets/images/heart_off.svg'
import { useDispatch } from 'react-redux'
import { setFavourite } from '../actions/students'
import actionTypes from '../constants/actionTypes'

const FavouriteIcon = ({ isFavourite, tutor_id }) => {
  const dispatch = useDispatch()
  const [isLike, setIsLike] = useState(isFavourite)

  useEffect(() => {
    setIsLike(isFavourite)
  }, [isFavourite])

  const onClick = async () => {
    const res = await dispatch(
      setFavourite({
        tutor_id,
        is_like: !isLike
      })
    )
    if (res.type === actionTypes.SET_FAVOURITE.SUCCESS) {
      setIsLike(!isLike)
    }
  }

  return (
    <img
      className='heart'
      src={isLike ? ImgHeartOn : ImgHeartOff}
      alt=''
      onClick={onClick}
    />
  )
}

export default FavouriteIcon
