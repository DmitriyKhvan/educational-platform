import { useQuery } from '@apollo/client';
import { addMinutes } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiStarFourFill } from 'react-icons/pi';
import { useParams } from 'react-router-dom';
import { AdaptiveDialog } from 'src/shared/ui/AdaptiveDialog/index.jsx';
import Button from 'src/components/Form/Button';
import Indicator from 'src/components/Indicator';
import { PlaygroundRecordingModal } from 'src/components/PlaygroundRecordingModal';
import StatusIndicator from 'src/components/student-dashboard/StatusIndicator';
import FeedbackInfo from './FeedbackInfo';
import LessonInfo from './LessonInfo';
import { FaCheck, FaStar } from 'react-icons/fa6';
import { useAuth } from 'src/app/providers/AuthProvider';
import { LESSON_QUERY } from 'src/shared/apollo/graphql';
import { localeDic } from 'src/shared/constants/global';
import Loader from 'src/components/Loader/Loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/shared/ui/Tabs';
import { StudentReviewModal } from 'src/entities/StudentReviewModal';

function Feedback() {
  const params = useParams();
  const [t, i18n] = useTranslation(['common', 'feedback']);
  const { user } = useAuth();

  const [openReview, setOpenReview] = useState(false);

  const {
    data: lessonData,
    loading,
    refetch,
  } = useQuery(LESSON_QUERY, {
    fetchPolicy: 'network-only',
    variables: { id: params?.id },
  });
  const data = lessonData?.lesson;

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (loading && !data) {
    return <Loader height="100%" />;
  }

  return (
    <>
      <header className="max-w-[514px] xl:max-w-none mx-auto flex justify-between items-center mb-6">
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
      <div className="flex flex-col xl:flex-row-reverse max-w-[514px] mx-auto xl:max-w-none xl:gap-20">
        <section className="basis-1/2">
          {data?.playground?.recordingUrl && (
            <PlaygroundRecordingModal
              urlRecording={data?.playground?.recordingUrl}
            />
          )}

          <div className="">
            <AdaptiveDialog
              button={
                <Button
                  disabled={data?.studentReview}
                  className="w-full h-[57px] mb-10 font-semibold gap-2 disabled:bg-[#039855] disabled:bg-opacity-10 disabled:text-[#039855]"
                >
                  {data?.studentReview ? <FaCheck /> : <FaStar />}{' '}
                  {data?.studentReview
                    ? t('review_submitted', { ns: 'feedback' })
                    : t('submit_review', { ns: 'feedback' })}
                </Button>
              }
              open={openReview}
              setOpen={setOpenReview}
            >
              <StudentReviewModal
                studentId={data?.student?.id}
                lessonId={data?.id}
                closeModal={() => {
                  refetch();
                  setOpenReview(false);
                }}
              />
            </AdaptiveDialog>
          </div>
        </section>

        <section className="basis-1/2">
          <Tabs defaultValue="feedback">
            <TabsList className="w-full">
              <TabsTrigger value="feedback" className="w-full">
                {t('feedback', { ns: 'feedback' })}
              </TabsTrigger>
              <TabsTrigger value="lessonInfo" className="w-full">
                {t('lesson_info', { ns: 'feedback' })}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="feedback">
              <FeedbackInfo data={data} />
            </TabsContent>
            <TabsContent value="lessonInfo">
              <LessonInfo data={data} />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </>
  );
}

export default Feedback;
