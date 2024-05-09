import { MentorAvailabilityType } from 'src/constants/global';
import { Tab } from './Tab';
import Button from 'src/components/Form/Button';
import { FaListUl } from 'react-icons/fa6';
import { FaRegCalendarAlt } from 'react-icons/fa';

const Tabs = ({
  mentorInfo,
  mentorAvailabilityType,
  setMentorAvailabilityType,
  selectedView,
  setSelectedView,
}) => {
  return (
    <>
      <div className="grid grid-cols-2 w-full sm:flex sm:w-auto">
        <Button
          theme="outline"
          className={`relative ml-0 rounded-r-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
            selectedView === 'list' && 'bg-color-dark-purple text-white'
          }`}
          onClick={() => setSelectedView('list')}
        >
          <FaListUl className="mr-2" />
          <span>List View</span>
        </Button>
        <Button
          theme="outline"
          className={`ml-[-4px] rounded-l-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
            selectedView === 'calendar' && 'bg-color-dark-purple text-white'
          }`}
          onClick={() => setSelectedView('calendar')}
        >
          <FaRegCalendarAlt className="mr-2" />
          <span>Calendar View</span>
        </Button>
      </div>

      {selectedView === 'list' && (
        <div className="relative w-full flex items-center after:content-[''] after:absolute after:bottom-0 after:w-full after:h-[2px] after:bg-gray-100 after:-z-10">
          {mentorInfo.mentorAvailability ===
          MentorAvailabilityType.REGULAR_AND_TRIAL ? (
            <>
              <Tab
                active={
                  mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR
                }
                onClick={() =>
                  setMentorAvailabilityType(MentorAvailabilityType.ONLY_REGULAR)
                }
              >
                Regular Students
              </Tab>

              <Tab
                active={
                  mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL
                }
                onClick={() =>
                  setMentorAvailabilityType(MentorAvailabilityType.ONLY_TRIAL)
                }
              >
                Trial Students
              </Tab>
            </>
          ) : mentorInfo.mentorAvailability ===
            MentorAvailabilityType.ONLY_TRIAL ? (
            <Tab
              active={
                mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL
              }
              onClick={() =>
                setMentorAvailabilityType(MentorAvailabilityType.ONLY_TRIAL)
              }
            >
              Trial Students
            </Tab>
          ) : null}
        </div>
      )}
    </>
  );
};

export default Tabs;
