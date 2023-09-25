import React from 'react';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Form/Button/Button';
import { Avatar } from '../../widgets/Avatar/Avatar';
import { HiMiniPlusSmall } from 'react-icons/hi2';

export const SelectProfile = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-y-[70px]">
        <h1 className="text-[40px] text-color-dark-purple leading-[48px] tracking-[-1px]">
          Select a Profile
        </h1>

        <div className="flex items-center justify-center gap-x-[50px]">
          <div className="flex flex-col items-center gap-y-5">
            <div className="w-[150px] h-[150px] ">
              <Avatar className="rounded-full border-color-purple border-2 shadow-[0_0_0_4px_#F0EBF7] cursor-pointer" />
            </div>
            <span className="font-semibold text-[20px] text-color-light-grey leading-6 tracking-[-0.2px]">
              Addison
            </span>
          </div>

          <div className="flex flex-col items-center gap-y-5">
            <div className="w-[150px] h-[150px]">
              <Avatar className="rounded-full cursor-pointer" />
            </div>
            <span className="font-semibold text-[20px] text-color-light-grey leading-6 tracking-[-0.2px]">
              Liam
            </span>
          </div>

          <div className="flex flex-col items-center gap-y-5">
            <HiMiniPlusSmall className="text-[150px] text-color-purple rounded-full bg-color-light-purple cursor-pointer" />
            <span className="font-semibold text-[20px] text-color-light-grey leading-6 tracking-[-0.2px]">
              Add Account
            </span>
          </div>
        </div>

        <Button>Return to Dashboard</Button>
      </div>
    </AuthLayout>
  );
};
