import React from 'react';
import Button from 'src/components/Form/Button';
import { FaCopy } from 'react-icons/fa';
import {
  IoTriangleSharp,
  IoSquareSharp,
  IoEllipseSharp,
} from 'react-icons/io5';
import { InfoItem } from './InfoItem';

export const Info = () => {
  const info = [
    {
      title: 'Share your referral code with a friend',
      text: 'Copy the link below and share it with your friends or network',
      icon: <IoSquareSharp className="rotate-45 text-[rgba(255,147,53,1)]" />,
      color: '255,147,53',
    },
    {
      title: 'You get 2 free classes',
      text: 'You will get 2 free classes after your friend’s second Nao Now class',
      icon: <IoEllipseSharp className="text-[rgba(0,217,134,1)]" />,
      color: '0,217,134',
    },
    {
      title: 'Your friend buys lessons and saves 10%',
      text: 'If your friend is a new user, they will get a 10% discount on their first purchase over $200',
      icon: <IoTriangleSharp className="text-[rgba(25,187,254,1)]" />,
      color: '25,187,254',
    },
  ];

  const writeClipboardText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="w-full sm:w-[436px]">
      <h2 className="text-[28px] font-bold text-color-dark-purple text-center">
        Refer a friend and get FREE CLASSES{' '}
      </h2>
      <h5 className="text-gray-400 leading-6 text-center mt-4">
        2 free classes – for you
      </h5>
      <h5 className="text-gray-400 leading-6 text-center">
        $10 discount – for your friend
      </h5>

      <div className="space-y-3 mt-6">
        {info.map((item) => {
          return <InfoItem key={item.color} info={item} />;
        })}
      </div>

      <Button
        onClick={() => writeClipboardText()}
        className="w-full h-[60px] space-x-3 mt-6"
      >
        <FaCopy />
        <span className="text-[15px] font-semibold">Copy my referral link</span>
      </Button>
    </div>
  );
};
