import React, { useEffect, useState } from 'react';
import ImgHeartOn from '../assets/images/heart_on.svg';
import ImgHeartOff from '../assets/images/heart_off.svg';

const FavouriteIcon = ({ isFavourite /* tutor_id */ }) => {
  const [isLike, setIsLike] = useState(isFavourite);

  useEffect(() => {
    setIsLike(isFavourite);
  }, [isFavourite]);

  const onClick = async () => {
    // add to favourite list
  };

  return (
    <img
      className="heart"
      src={isLike ? ImgHeartOn : ImgHeartOff}
      alt=""
      onClick={onClick}
    />
  );
};

export default FavouriteIcon;
