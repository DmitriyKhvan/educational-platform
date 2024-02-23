import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import Button from 'src/components/Form/Button';

const AvailableSpots = ({ setStep }) => {
  return (
    <div className="w-full max-w-[440px] mx-auto">
      <div className="mb-8 flex items-center">
        <FaArrowLeft
          className="mr-3 w-[20px] h-[20px] cursor-pointer"
          onClick={() => setStep((v) => v - 1)}
        />
        <h1 className="text-3xl font-semibold">Abailable Spots</h1>
      </div>

      <Button
        className="w-full h-14 sm:h-16"
        onClick={() => setStep((v) => v + 1)}
      >
        Continue
      </Button>
    </div>
  );
};

export default AvailableSpots;
