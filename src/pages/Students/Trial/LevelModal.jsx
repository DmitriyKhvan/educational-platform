import React from 'react';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';

const LevelModal = () => {
  return (
    <>
      <h2 className="text-center sm:text-left sm:text-2xl sm:font-bold font-semibold my-5">
        Select a Level
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <label className="border rounded-xl p-4">
          <CheckboxField type="radio" name="level" />
          <h3 className="font-bold mb-2">Pre-Level 1</h3>
          <p>I speak in one word answers and can read simple words</p>
        </label>
        <label className="border rounded-xl p-4">
          <CheckboxField type="radio" name="level" />
          <h3 className="font-bold mb-2">Level 1</h3>
          <p>I can understand and read short sentences</p>
        </label>
        <label className="border rounded-xl p-4">
          <CheckboxField type="radio" name="level" />
          <h3 className="font-bold mb-2">Level 2</h3>
          <p>I can read new words and speak in full sentences</p>
        </label>
        <label className="border rounded-xl p-4">
          <CheckboxField type="radio" name="level" />
          <h3 className="font-bold mb-2">Level 3</h3>
          <p>I can say and understand complex sentences</p>
        </label>
        <label className="border rounded-xl p-4">
          <CheckboxField type="radio" name="level" />
          <h3 className="font-bold mb-2">Level 4</h3>
          <p>I can communicate freely with few limitations</p>
        </label>
        <label className="border rounded-xl p-4">
          <CheckboxField type="radio" name="level" />
          <h3 className="font-bold mb-2">Level 5</h3>
          <p>I can discuss complex topics fluently</p>
        </label>
      </div>
      <Button className="my-10 w-full h-[57px]">Select</Button>
    </>
  );
};

export default LevelModal;
