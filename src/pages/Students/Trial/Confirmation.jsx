import React from 'react';
import { FaArrowLeft, FaPencil } from 'react-icons/fa6';
import Button from 'src/components/Form/Button';

const Confirmation = ({ setStep }) => {
  return (
    <div className="w-full max-w-[440px] mx-auto">
      <div className="mb-2 flex items-center">
        <FaArrowLeft
          className="mr-3 w-[20px] h-[20px] cursor-pointer"
          onClick={() => setStep((v) => v - 1)}
        />{' '}
        <h1 className="text-3xl font-semibold">Confirmation</h1>
      </div>

      <p className="mb-8">Please ensure that everything below is correct</p>

      <section className="mb-6">
        <p className="text-sm text-gray-400 font-medium mb-4">
          Your contact information
        </p>
        <div className="w-full border rounded-lg p-5 flex justify-between items-center">
          <div>
            <label className="mb-4 block">
              <span className="text-[13px] text-gray-400 mb-2">
                English name of student
              </span>
              <p className="text-gray-950 font-medium">Jony</p>
            </label>

            <label className="mb-4 block">
              <span className="text-[13px] text-gray-400 mb-2">Email</span>
              <p className="text-gray-950 font-medium">jony@email.com</p>
            </label>
            <label>
              <span className="text-[13px] text-gray-400 mb-2">
                Phone number
              </span>
              <p className="text-gray-950 font-medium">02-312-3456</p>
            </label>
          </div>
          <div className="bg-color-purple bg-opacity-10 w-7 h-7 rounded-lg flex justify-center items-center cursor-pointer hover:bg-opacity-20 transition-colors">
            <FaPencil className="text-color-purple w-3 h-3" />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <p className="text-sm text-gray-400 font-medium mb-4">Lesson details</p>
        <div className="w-full border rounded-lg p-5 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg mb-5">Speaking</h3>
            <div className="flex gap-6">
              <label className="block">
                <span className="text-[13px] text-gray-400">Level</span>
                <p className="text-gray-950 font-medium">Jony</p>
              </label>

              <label className="block">
                <span className="text-[13px] text-gray-400">Topic</span>
                <p className="text-gray-950 font-medium">Statue of Liberty</p>
              </label>
            </div>
          </div>
          <div className="bg-color-purple bg-opacity-10 w-7 h-7 rounded-lg flex justify-center items-center cursor-pointer hover:bg-opacity-20 transition-colors">
            <FaPencil className="text-color-purple w-3 h-3" />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <p className="text-sm text-gray-400 font-medium mb-4">Date and Time</p>
        <div className="w-full border rounded-lg p-5 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg mb-4">02:00 PM - 02:25 PM</h3>
            <p>Friday, Dec 15</p>
          </div>
          <div className="bg-color-purple bg-opacity-10 w-7 h-7 rounded-lg flex justify-center items-center cursor-pointer hover:bg-opacity-20 transition-colors">
            <FaPencil className="text-color-purple w-3 h-3" />
          </div>
        </div>
      </section>

      <Button
        className="w-full h-14 sm:h-16 my-10"
        onClick={() => setStep((v) => v + 1)}
      >
        Continue
      </Button>
    </div>
  );
};

export default Confirmation;
