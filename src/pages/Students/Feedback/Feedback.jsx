import { useQuery } from '@apollo/client';
import { addMinutes, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiStarFourFill } from 'react-icons/pi';
import { useParams } from 'react-router-dom';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import Button from 'src/components/Form/Button';
import Indicator from 'src/components/Indicator';
import { PlaygroundRecordingModal } from 'src/components/PlaygroundRecordingModal';
import LessonReviewModal from 'src/components/student-dashboard/LessonReviewModal';
import StatusIndicator from 'src/components/student-dashboard/StatusIndicator';
// import { localeDic } from 'src/constants/global';
// import Layout from 'src/layouts/DashboardLayout';
// import { useAuth } from 'src/modules/auth';
// import { LESSON_QUERY } from 'src/modules/auth/graphql';
import FeedbackInfo from './FeedbackInfo';
import LessonInfo from '../Lessons/LessonInfo';
import { FaStar } from 'react-icons/fa6';
import { useAuth } from 'src/app/providers/AuthProvider';
import { LESSON_QUERY } from 'src/shared/apollo/graphql';
// import { Layout } from 'src/shared/layouts';
import { localeDic } from 'src/shared/constants/global';

function Feedback() {
  const params = useParams();
  const [t, i18n] = useTranslation('common');
  const { user } = useAuth();

  const [openReview, setOpenReview] = useState(false);
  const [selectedTab, setSelectedTab] = useState('feedback');

  const { data: lessonData, loading } = useQuery(LESSON_QUERY, {
    variables: { id: params?.id },
  });
  const data = lessonData?.lesson;
  console.log('🚀 ~ Feedback ~ data:', data);
  console.log('🚀 ~ Feedback ~ params:', params);
  console.log('🚀 ~ Feedback ~ loading:', loading);
  console.log('🚀 ~ Feedback ~ data?.startAt:', data?.startAt);
  console.log(
    '🚀 ~ Feedback ~ new Date(data?.startAt):',
    new Date(data?.startAt),
  );

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  return (
    // <Layout>
    <div className="max-w-[514px] mx-auto">
      <section>
        <header className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-[28px] font-bold text-color-dark-purple">
              {format(
                toZonedTime(new Date(data?.startAt), userTimezone),
                'eee, MMM do',
                {
                  timeZone: userTimezone,
                  locale: localeDic[i18n.language],
                },
              )}
            </h2>
            <p>
              {format(
                toZonedTime(new Date(data?.startAt), userTimezone),
                'hh:mm a',
                {
                  timeZone: userTimezone,
                  locale: localeDic[i18n.language],
                },
              )}
              {' - '}
              {format(
                addMinutes(
                  toZonedTime(new Date(data?.startAt), userTimezone),
                  data?.duration,
                ),
                'hh:mm a',
                { timeZone: userTimezone, locale: localeDic[i18n.language] },
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {data?.isTrial && (
              <Indicator className="bg-green-300 text-green-500">
                <PiStarFourFill /> {t('trial', { ns: 'common' })}
              </Indicator>
            )}

            <StatusIndicator status={data?.status} />
          </div>
        </header>

        <PlaygroundRecordingModal
          urlRecording={data?.playground?.recordingUrl}
        />

        <div className="">
          <AdaptiveDialog
            button={
              <Button className="w-full h-[57px] mt-6 mb-10 font-semibold gap-2">
                <FaStar /> Submit Review
              </Button>
            }
            open={openReview}
            setOpen={setOpenReview}
          >
            <LessonReviewModal
              studentId={data?.student?.id}
              lessonId={data?.id}
              closeModal={() => setOpenReview(false)}
            />
          </AdaptiveDialog>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 w-full">
          <Button
            theme="outline"
            className={`relative ml-0 rounded-r-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
              selectedTab === 'feedback' && 'bg-color-dark-purple text-white'
            }`}
            onClick={() => setSelectedTab('feedback')}
          >
            <span>Feedback</span>
          </Button>
          <Button
            theme="outline"
            className={`ml-[-4px] rounded-l-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
              selectedTab === 'lessonInfo' && 'bg-color-dark-purple text-white'
            }`}
            onClick={() => setSelectedTab('lessonInfo')}
          >
            <span>Lesson info</span>
          </Button>
        </div>

        <div>
          {selectedTab === 'feedback' ? (
            <FeedbackInfo data={data} />
          ) : (
            <LessonInfo data={data} />
          )}
        </div>
      </section>
    </div>
    // </Layout>
  );
}

export default Feedback;
