// import { Dialog } from '@radix-ui/react-dialog';
import React from 'react';

export const AvailabilityModalConfirm = ({ icon, title, text, btns }) => {
  return (
    <div className="w-[336px]">
      {icon}
      <h2 className="text-center text-[22px] font-bold mb-4">{title}</h2>
      <div className="text-center text-[15px] font-normal mb-6">{text}</div>

      {btns}
    </div>
  );
};
