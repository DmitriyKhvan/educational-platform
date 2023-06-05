import React, { useState , useEffect } from 'react';
import ImgStarOutline from '../assets/images/star_outline_red.svg';
import ImgStarFill from '../assets/images/star_fill_red.svg';

export default function ReviewRating({ onChange }) {
  const [starIndex, setStarIndex] = useState();
  useEffect(() => {
    onChange(starIndex + 1);
  }, [starIndex]);

  return (
    <div className="rating">
      <div className="stars">
        {[0, 1, 2, 3, 4].map((value, index) => (
          <img
            key={`img-${index}`}
            src={starIndex >= index ? ImgStarFill : ImgStarOutline}
            alt=""
            onClick={() => setStarIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
