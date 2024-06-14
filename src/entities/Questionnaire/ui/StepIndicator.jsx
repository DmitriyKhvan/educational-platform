import React from 'react';
import { IoArrowBack } from 'react-icons/io5';
import Button from 'src/components/Form/Button';

export const StepIndicator = ({ step, setStep }) => {
  return (
    <div className="w-full mb-8 sm:mb-10">
      <div className="flex justify-between items-center">
        {step !== 1 ? (
          <Button
            onClick={() => setStep(step - 1)}
            theme="clear"
            className="text-color-purple gap-1"
          >
            <IoArrowBack className="text-base" />
            <span className="font-medium">Back</span>
          </Button>
        ) : (
          <div className="h-12"></div>
        )}

        <div className="text-sm text-color-purple space-x-1">
          <span>Question</span>
          <span>{step}/5</span>
        </div>
      </div>

      <div className="w-full h-[5px] bg-gray-100 rounded-lg overflow-hidden">
        <div
          style={{ width: `${(step / 5) * 100}%` }}
          className="h-full bg-color-purple transition-all duration-500"
        ></div>
      </div>
    </div>
  );
};
