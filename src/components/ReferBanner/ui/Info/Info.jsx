import React from 'react';
// import { InfoItem } from './InfoItem';
import Button from 'src/components/Form/Button';
import { FaCopy } from 'react-icons/fa';
import {
  IoTriangleSharp,
  IoSquareSharp,
  IoEllipseSharp,
} from 'react-icons/io5';

export const Info = () => {
  // const info = [
  //   {
  //     title: 'Share your referral code with a friend',
  //     text: 'Copy the link below and share it with your friends or network',
  //     icon: <IoSquareSharp className="rotate-45 text-[#FF9335]" />,
  //     color: '#FF9335',
  //     bgOpacity10: 'bg-[#FF9335]/10',
  //     bgOpacity16: 'bg-[#FF9335]/16',
  //   },
  //   {
  //     title: 'You get 3 free classes',
  //     text: 'You will get 3 free classes after your friend’s second Nao Now class',
  //     icon: <IoEllipseSharp className="text-[#00D986]" />,
  //     color: '#00D986',
  //     bgOpacity10: 'bg-[#00D986]/10',
  //     bgOpacity16: 'bg-[#00D986]/16',
  //   },
  //   {
  //     title: 'Your friend buys lessons and saves $50',
  //     text: 'If your friend is a new user, he will get $50 discount on their first purchase over $200',
  //     icon: <IoTriangleSharp className="text-[#19BBFE]" />,
  //     color: '#19BBFE',
  //     bgOpacity10: 'bg-[#19BBFE]/10',
  //     bgOpacity16: 'bg-[#19BBFE]/16',
  //   },
  // ];

  return (
    <div className="w-full sm:w-[436px]">
      <h2 className="text-[28px] font-bold text-color-dark-purple text-center">
        Refer a friend and get FREE CLASSES{' '}
      </h2>
      <h5 className="text-gray-400 leading-6 text-center mt-4">
        $50 discount – for your friend 3 free classes – for you
      </h5>

      <div className="space-y-3 mt-6">
        {/* {info.map((item) => {
          return <InfoItem key={item.color} info={item} />;
        })} */}
        <div
          className={`flex items-center gap-4 p-4 rounded-lg bg-[#FF9335]/[.1]`}
        >
          <div
            className={`min-w-8 min-h-8 flex items-center justify-center rounded bg-[#FF9335]/[.16]`}
          >
            <IoSquareSharp className="rotate-45 text-[#FF9335]" />
          </div>
          <div className="space-y-2">
            <h4 className={`text-lg font-bold text-[#FF9335] leading-6`}>
              Share your referral code with a friend
            </h4>
            <p className={`text-[15px] text-[#FF9335] leading-[22px]`}>
              Copy the link below and share it with your friends or network
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-4 p-4 rounded-lg bg-[#00D986]/[.1]`}
        >
          <div
            className={`min-w-8 min-h-8 flex items-center justify-center rounded bg-[#00D986]/[.16]`}
          >
            <IoEllipseSharp className="text-[#00D986]" />
          </div>
          <div className="space-y-2">
            <h4 className={`text-lg font-bold text-[#00D986] leading-6`}>
              Share your referral code with a friend
            </h4>
            <p className={`text-[15px] text-[#00D986] leading-[22px]`}>
              Copy the link below and share it with your friends or network
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-4 p-4 rounded-lg bg-[#19BBFE]/[.1]`}
        >
          <div
            className={`min-w-8 min-h-8 flex items-center justify-center rounded bg-[#19BBFE]/[.16]`}
          >
            <IoTriangleSharp className="text-[#19BBFE]" />
          </div>
          <div className="space-y-2">
            <h4 className={`text-lg font-bold text-[#19BBFE] leading-6`}>
              Share your referral code with a friend
            </h4>
            <p className={`text-[15px] text-[#19BBFE] leading-[22px]`}>
              Copy the link below and share it with your friends or network
            </p>
          </div>
        </div>
      </div>

      <Button className="w-full h-[60px] space-x-3 mt-6">
        <FaCopy />
        <span className="text-[15px] font-semibold">Copy my referral link</span>
      </Button>
    </div>
  );
};
