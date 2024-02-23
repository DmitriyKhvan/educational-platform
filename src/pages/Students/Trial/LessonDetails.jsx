import React from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { MyDrawer } from 'src/components/Drawer';
import { useMediaQuery } from 'react-responsive';
// import Dropdown from 'src/components/Dropdown';
import MyDropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';
import { MyDialog } from 'src/components/Dialog';
import LevelModal from './LevelModal';

const LessonDetails = ({ setStep }) => {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  // const levelModal = (

  // );

  return (
    <div className="w-full max-w-[440px] mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Lesson Details</h1>

      <div className="mb-6">
        <label className="font-semibold block mb-3">Course</label>
        <MyDropdownMenu
          button={
            <label className="min-w-[103px] py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none cursor-pointer">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Test</span>
                <MdOutlineKeyboardArrowDown className="w-4" />
              </div>
            </label>
          }
        >
          <ul className="overflow-auto px-6 min-w-[280px] sm:min-w-[430px]">
            <li>
              <label className="flex items-center justify-between gap-3 py-4">
                <p>Speaking</p>
                <CheckboxField type="radio" name="phoneCode" />
              </label>
            </li>

            <li>
              <label className="flex items-center justify-between gap-3 py-4">
                <p>Writing</p>
                <CheckboxField type="radio" name="phoneCode" />
              </label>
            </li>

            <li>
              <label className="flex items-center justify-between gap-3 py-4">
                <p>Adult English</p>
                <CheckboxField type="radio" name="phoneCode" />
              </label>
            </li>
          </ul>
        </MyDropdownMenu>
      </div>

      <div className="mb-6">
        <label className="font-semibold block mb-3">Level</label>

        {isMobile ? (
          <MyDrawer
            className="h-full"
            button={
              <label className="min-w-[103px] py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none cursor-pointer">
                <div className="flex items-center justify-between gap-2">
                  <p className=" text-sm font-medium">Test</p>
                  <MdOutlineKeyboardArrowDown className="w-4" />
                </div>
              </label>
            }
          >
            <LevelModal />
          </MyDrawer>
        ) : (
          <MyDialog
            className="w-[520px] overflow-auto"
            button={
              <label className="min-w-[103px] py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none cursor-pointer">
                <div className="flex items-center justify-between gap-2">
                  <p className=" text-sm font-medium">Test</p>
                  <MdOutlineKeyboardArrowDown className="w-4" />
                </div>
              </label>
            }
          >
            <LevelModal />
          </MyDialog>
        )}
      </div>

      <div className="mb-8">
        <label className="font-semibold block mb-3">Lesson topic</label>
        <MyDropdownMenu
          button={
            <label className="min-w-[103px] py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none cursor-pointer">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Test</span>
                <MdOutlineKeyboardArrowDown className="w-4" />
              </div>
            </label>
          }
        >
          <ul className="overflow-auto px-6 min-w-[280px] sm:min-w-[430px]">
            <li>
              <label className="flex items-center justify-between gap-3 py-4">
                <p>State of Liberty</p>
                <CheckboxField type="radio" name="phoneCode" />
              </label>
            </li>

            <li>
              <label className="flex items-center justify-between gap-3 py-4">
                <p>Test</p>
                <CheckboxField type="radio" name="phoneCode" />
              </label>
            </li>

            <li>
              <label className="flex items-center justify-between gap-3 py-4">
                <p>Adult English</p>
                <CheckboxField type="radio" name="phoneCode" />
              </label>
            </li>
          </ul>
        </MyDropdownMenu>
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

export default LessonDetails;
