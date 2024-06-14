import React from 'react';

export const Availability = ({ children }) => {
  return (
    <>
      <h2 className="text-center text-[30px] font-bold leading-[120%] mb-3">
        What is your availability?
      </h2>

      <h4 className="text-center text-color-dark-purple mb-10 font-normal">
        Please select as many options as possible
      </h4>

      {children}
    </>
  );
};
