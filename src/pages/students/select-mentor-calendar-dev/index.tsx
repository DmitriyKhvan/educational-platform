import { useAuth } from '@/app/providers/auth-provider';
import Button from '@/components/form/button';
import { PACKAGE_QUERY } from '@/shared/apollo/graphql';
import { getItemToLocalStorage } from '@/shared/constants/global';
import { SelectMentorCalendar } from '@/widgets/select-mentor-calendar';
import { useQuery } from '@apollo/client';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from "src/app/providers/AuthProvider";
// import Button from "src/components/Form/Button";
// import { PACKAGE_QUERY } from 'src/shared/apollo/graphql';
// import { getItemToLocalStorage } from 'src/shared/constants/global';
// import { SelectMentorCalendar } from "src/widgets/SelectMentorCalendar";

function SelectMentorCalendarPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    data: { packageSubscriptions: planStatus = [] } = {},
  } = useQuery(PACKAGE_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      studentId: getItemToLocalStorage('studentId', ''),
    },
  });

  console.log('🚀 ~ SelectMentorCalendar ~ user:', user);
  console.log('🚀 ~ SelectMentorCalendar ~ planStatus:', planStatus);
  return (
    <section>
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            <IoArrowBack className="text-2xl" />
          </button>
          <h2 className="font-bold text-3xl">Book a lesson with Meghan B.</h2>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 items-center p-2 pr-3 rounded-lg bg-color-purple bg-opacity-10 text-color-purple font-semibold text-base">
            <span className="bg-color-purple bg-opacity-10 block px-3 py-2 rounded leading-4">
              18
            </span>
            <span>credits left</span>
          </div>

          <Button disabled className="">
            Book selected lessons
          </Button>
        </div>
      </header>

      <p className="mb-5 text-[15px] text-color-light-grey">Select date and time</p>

      {/* <Calendar /> */}
      <SelectMentorCalendar />
    </section>
  );
}

export default SelectMentorCalendarPage;
