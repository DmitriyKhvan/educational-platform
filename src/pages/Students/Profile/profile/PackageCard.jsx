import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from 'src/utils/functions';

const PackageCard = ({ item }) => {
  const [t] = useTranslation(['profile', 'common', 'lessons']);
  console.log(item, 'ITEM');
  return (
    <div
      key={item.id}
      className={cn(
        'w-full p-5 bg-white border border-solid mb-2 border-color-border-grey shadow-sm rounded-[10px]',
        !item.credits === 0 && 'bg-gray-50',
      )}
    >
      <h3
        className={cn(
          'text-[18px] mb-3 font-bold leading-6 tracking-[-0.6px] whitespace-nowrap',
          !item.credits ? 'text-gray-400' : 'text-color-dark-purple',
        )}
      >
        {item.package.course.title}
      </h3>

      <div className="flex space-x-6">
        <div className="">
          <h4 className="text-gray-300 font-medium text-sm">
            {t('lessons_remaining', {
              ns: 'profile',
            })}
          </h4>
          <p
            className={cn(
              'font-medium text-sm',
              !item.credits ? 'text-gray-400' : 'text-color-purple',
            )}
          >
            {item.credits}/{item.package.totalSessions}
          </p>
        </div>

        <div className="">
          <h4 className="text-gray-300 font-medium text-sm">
            {t('duration', { ns: 'lessons' })}
          </h4>
          <p
            className={cn(
              'text-gray-400 font-medium text-sm',
              !item.credits ? 'text-gray-400' : 'text-color-dark-purple',
            )}
          >
            {item.package.sessionTime} {t('minutes', { ns: 'common' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
