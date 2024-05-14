import Layout from '../../../layouts/DashboardLayout';
import Button from 'src/components/Form/Button';
import { FaListUl } from 'react-icons/fa6';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { AvailabilityList } from './AvailabilityList';
import { useState } from 'react';
import { AvailabilityCalendar } from './AvailabilityCalendar';

const Availability = () => {
  const [availabilityView, setAvailabilityView] = useState('list');

  return (
    <Layout>
      <div className="space-y-10">
        <h2 className="text-[32px] text-color-dark-purple font-bold leading-9">
          My Availability
        </h2>

        <div className="flex items-center">
          <Button
            theme="outline"
            className={`rounded-r-none gap-2 hover:bg-color-dark-purple ${
              availabilityView === 'list' &&
              'bg-color-dark-purple text-white z-10'
            }`}
            onClick={() => setAvailabilityView('list')}
          >
            <FaListUl className="text-base" /> <span>List view</span>
          </Button>
          <Button
            theme="outline"
            className={`rounded-l-none gap-2 -ml-[1px] hover:bg-color-dark-purple ${
              availabilityView === 'calendar' &&
              'bg-color-dark-purple text-white'
            }`}
            onClick={() => setAvailabilityView('calendar')}
          >
            <FaRegCalendarAlt className="text-lg" />
            <span>Calendar view</span>
          </Button>
        </div>

        {availabilityView === 'list' ? (
          <AvailabilityList />
        ) : (
          <AvailabilityCalendar />
        )}
      </div>
    </Layout>
  );
};

export default Availability;
