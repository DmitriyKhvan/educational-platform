/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ko as kr, enUS as en } from 'date-fns/locale';
import { addMinutes } from 'date-fns';

import { BsPlayCircle } from 'react-icons/bs';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import { ZoomRecordingModal } from '../ZoomRecordingModal';
import { LessonsStatusType } from 'src/constants/global';

export const LessonTableMobile = ({
  displayTableData,
  userTimezone,
  handleOpenFeedbackModal,
  // handleFeedback,
}) => {
  const [showRecording, setShowRecording] = useState(false);
  const [urlRecording, setUrlRecording] = useState('');

  const { t, i18n } = useTranslation(['lessons']);

  const currentLanguage = i18n.language;
  const locale = currentLanguage === 'kr' ? kr : en;

  const tableHead = [
    t('date_time', { ns: 'lessons' }),
    t('mentor', { ns: 'lessons' }),
    t('status', { ns: 'lessons' }),
    t('recording', { ns: 'lessons' }),
  ];

  const playRecording = (url) => {
    setUrlRecording(url);
    setShowRecording(true);
  };

  return (
    <>
      <table className="table border-spacing-1">
        <thead>
          <tr>
            {tableHead.map((x, ind) => (
              <th
                className="py-2 px-1 text-xs whitespace-nowrap"
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
                <span onClick={handleOpenFeedbackModal}>
                  {t('no_lessons', { ns: 'lessons' })}
                </span>
              </td>
            </tr>
          )}
          {displayTableData
            .sort(
              (a, b) =>
                new Date(a.resource.startAt) - new Date(b.resource.startAt),
            )
            .map((event) => {
              return (
                <tr className="" key={event.resource.id}>
                  <td className="border-b py-2 px-1 text-xs align-middle">
                    <span className="">
                      {format(
                        utcToZonedTime(
                          new Date(event.resource.startAt),
                          userTimezone,
                        ),
                        'MMM do, ',
                        { timeZone: userTimezone, locale: locale },
                      )}
                    </span>

                    <span className="inline-block">
                      <span className="inline-block">
                        {format(
                          utcToZonedTime(
                            new Date(event.resource.startAt),
                            userTimezone,
                          ),
                          'hh:mm a',
                          { timeZone: userTimezone, locale: locale },
                        )}
                        <span className="mx-[4px]">→</span>
                      </span>

                      <span className="inline-block">
                        {format(
                          addMinutes(
                            utcToZonedTime(
                              new Date(event.resource.startAt),
                              userTimezone,
                            ),
                            event.resource.duration,
                          ),
                          'hh:mm a',
                          {
                            timeZone: userTimezone,
                            locale: locale,
                          },
                        )}
                      </span>
                    </span>
                  </td>
                  <td className="border-b py-2 px-1 align-middle">
                    <p className="text-xs text-color-light-grey tracking-tight leading-normal">
                      {event.resource.mentor.firstName}
                    </p>
                  </td>

                  <td className="border-b py-2 px-1 align-middle">
                    <p className="text-xs text-color-light-grey tracking-tight leading-normal">
                      {event.resource.status === LessonsStatusType.SCHEDULED ||
                      event.resource.status === LessonsStatusType.RESCHEDULED
                        ? t('lesson_pending_approval')
                        : t(event.resource.status)}
                    </p>
                  </td>
                  <td className="border-b py-2 px-1 align-middle">
                    {event.resource?.zoom?.recordingUrl && (
                      <BsPlayCircle
                        onClick={() =>
                          playRecording(event.resource?.zoom?.recordingUrl)
                        }
                        className="text-2xl text-color-purple cursor-pointer text-center"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
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
    </>
  );
};
