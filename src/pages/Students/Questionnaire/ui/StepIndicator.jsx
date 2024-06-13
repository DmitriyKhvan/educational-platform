import React from 'react';
import { IoArrowBack } from 'react-icons/io5';
import Button from 'src/components/Form/Button';

export const StepIndicator = ({ step, setStep }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => setStep(step - 1)}
          theme="clear"
          className="text-color-purple gap-1"
        >
          <IoArrowBack className="text-base" />
          <span className="font-medium">Back</span>
        </Button>

        <div className="text-sm text-color-purple space-x-1">
          <span>Question</span>
          <span>{step}/5</span>
        </div>
      </div>

      <div className="w-full h-[5px] bg-gray-100 rounded-lg overflow-hidden">
        <div
          style={{ width: `${(step / 5) * 100}%` }}
          className="h-full bg-color-purple"
        ></div>
      </div>
    </div>
  );
};
