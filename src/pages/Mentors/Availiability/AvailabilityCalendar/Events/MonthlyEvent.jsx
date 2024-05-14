import { format } from 'date-fns';
import React from 'react';

const MonthlyEvent = ({ data }) => {
  const reformatTime = (time) =>
    format(
      new Date(`01/01/2011 ${time}:00`),
      `h${time.match(/\d*:30/) ? ':mm' : ''} aa`,
    );

  return (
    <div className="mx-auto py-2 min-h-[41px] h-full 2xl:mx-2 bg-white text-black border rounded-lg overflow-hidden truncate shadow-[0px_0px_8px_0px_#00000014]">
      <div className="text-center mb-1 text-[10px] xl:text-xs">
        {data?.regular?.map((v) => (
          <p key={v.from} className="text-color-purple font-medium">
            {reformatTime(v.from)} - {reformatTime(v.to)}
          </p>
        ))}
        {data?.trial?.map((v) => (
          <p key={v.from} className="text-[#FF9335] font-medium">
            {reformatTime(v.from)} - {reformatTime(v.to)}
          </p>
        ))}

        {data?.exception?.map((v) => (
          <p key={v.from} className="text-[#C0C0C3] font-medium">
            {reformatTime(v.from)} - {reformatTime(v.to)}
          </p>
        ))}
      </div>
      <div className="flex gap-1 justify-center">
        {data?.regular && (
          <span className="block w-[6px] h-[6px] rounded-sm bg-color-purple"></span>
        )}
        {data?.trial && (
          <span className="block w-[6px] h-[6px] rounded-sm bg-[#FF9335]"></span>
        )}
        {data?.exception && (
          <span className="block w-[6px] h-[6px] rounded-sm bg-[#C0C0C3]"></span>
        )}
      </div>
    </div>
  );
};

export default MonthlyEvent;
