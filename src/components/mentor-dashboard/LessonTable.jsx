import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../modules/auth';
import { format, utcToZonedTime } from 'date-fns-tz';
import { addMinutes } from 'date-fns';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import { ZoomRecordingModal } from '../ZoomRecordingModal';

import { BsPlayCircle } from 'react-icons/bs';
import { ucFirst } from 'src/utils/ucFirst';

const LessonTable = ({ tabularData }) => {
  const [showRecording, setShowRecording] = useState(false);
  const [urlRecording, setUrlRecording] = useState('');

  const playRecording = (url) => {
    setUrlRecording(url);
    setShowRecording(true);
  };

  const [t] = useTranslation('lessons');
  const [displayTableData, setDisplayTableData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (tabularData.length) {
      const x = tabularData
        .sort(
          (a, b) => new Date(a.resource.startAt) - new Date(b.resource.startAt),
        )
        .map((x) => x);

      const y = Object.assign({}, x);
      const z = [];
      for (const [, value] of Object.entries(y)) {
        z.push(value);
      }
      setDisplayTableData(z);
    } else {
      setDisplayTableData([]);
    }
  }, [tabularData]);

  const tableHead = [
    t('lesson_package'),
    t('duration'),
    t('date_time'),
    t('student_name'),
    t('status'),
    t('recording', { ns: 'lessons' }),
    // t('class_feedback'),
  ];

  return (
    <div className="scroll-layout">
      <table className="table">
        <thead>
          <tr>
            {tableHead.map((x, ind) => (
              <th
                className="py-5 lg:first:pl-16"
                scope="col"
                key={`row-${ind}`}
              >
                {x}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayTableData?.length === 0 && (
            <tr>
              <td colSpan={tableHead.length} align="center">
                {t('no_lessons')}
              </td>
            </tr>
          )}
          {displayTableData.map((event) => (
            <tr className="h-[80px] m-auto text-center" key={event.resource.id}>
              <td className="pt-4 border-b text-left lg:pl-16">
                <p className="mt-4 font-semibold text-color-light-grey tracking-tight text-[15px] leading-normal">
                  {event.resource.packageSubscription.package?.course?.title}
                </p>
              </td>
              {/* 
              Do not delete this code, it is for future use
              <td className='td-item  m-0'>
                <p className='td-topic-level td-level'>
                  {`${t('level')} ${event.level || 0}`}
                </p>
              </td>
              <td className='td-item m-0'>
                <p className='td-topic-level'>
                  {event.topic === 'Business English' ? 'English' : event.topic}
                </p>
              </td>
              <td className='td-item text-center  m-0'>
                <p className='td-topic-level '>
                  {"WarmUp Exercise"}
                </p>
              </td> */}
              <td className="pt-4 border-b text-left">
                <p className="mt-4 font-semibold text-color-light-grey tracking-tight text-[15px] leading-normal">
                  {`${event.resource.duration} min`}
                </p>
              </td>
              <td className="py-[25px] border-b text-left">
                <span className="border inline-block border-color-border-grey rounded-[10px] pr-2.5 pl-[15px] text-color-light-grey font-medium text-[15px] h-10 border-box leading-10">
                  <span className="h-full inline-block border-r border-color-border-grey pr-2.5 mr-2.5">
                    {format(
                      utcToZonedTime(
                        new Date(event.resource.startAt),
                        user.timeZone,
                      ),
                      'eee, MMM do',
                      { timeZone: user.timeZone },
                    )}
                  </span>
                  <span className="inline-block">
                    {format(
                      utcToZonedTime(
                        new Date(event.resource.startAt),
                        user.timeZone,
                      ),
                      'hh:mm a',
                      { timeZone: user.timeZone },
                    )}
                    {' → '}
                    {format(
                      addMinutes(
                        utcToZonedTime(
                          new Date(event.resource.startAt),
                          user.timeZone,
                        ),
                        event.resource.duration,
                      ),
                      'hh:mm a',
                      { timeZone: user.timeZone },
                    )}
                  </span>
                </span>
              </td>
              <td className="pt-4 border-b text-left">
                <p className="mt-4 text-color-light-grey tracking-tight text-[15px] leading-normal">
                  {(event.resource.student.firstName ?? '') +
                    ' ' +
                    (event.resource.student.lastName ?? '')}
                </p>
              </td>

              <td className="pt-4 border-b text-left">
                <p className="mt-4 text-color-light-grey tracking-tight text-[15px] leading-normal">
                  {event.resource.status === 'scheduled'
                    ? 'Pending Request'
                    : ucFirst(event.resource.status)}
                </p>
              </td>
              <td className="pt-4 border-b m-0">
                {event.resource?.zoom?.recordingUrl && (
                  <BsPlayCircle
                    onClick={() =>
                      playRecording(event.resource?.zoom?.recordingUrl)
                    }
                    className="mt-4 text-2xl text-color-purple cursor-pointer text-center"
                  />
                )}
              </td>
              {/* <td className="td-item m-0">
                <Link
                  className="td-button"
                  to={`lesson-calendar/lesson/${event.resource.id}`}
                >
                  Feedback
                </Link>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      <ModalWrapper
        isOpen={showRecording}
        closeModal={setShowRecording}
        widthContent="70%"
        heightContent="auto"
        paddingContent="0"
      >
        <ZoomRecordingModal urlRecording={urlRecording} />
      </ModalWrapper>
    </div>
  );
};

export default LessonTable;
