import { addMinutes } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';

export const sortCalendarEvents = (data, timeZone) => {
  if (!data) return;
  let eventDates = {};
  data.forEach((apt) => {
    let startAt = new Date(apt.startAt);
    let date = format(startAt, 'yyyy-MM-dd');
    if (eventDates[date]) {
      eventDates[date].push(apt);
    } else {
      eventDates[date] = [apt];
    }
  });

  const eventKeys = Object.keys(eventDates);
  const calendarEvents = [];
  eventKeys.forEach((key) => {
    for (const eventDate of eventDates[key]) {
      const iterateEvents = {
        playground: eventDate.playground,
        lesson: eventDate?.packageSubscription?.package?.course?.title,
        courseId: eventDate?.packageSubscription?.package?.course?.id,
        startAt: utcToZonedTime(new Date(eventDate.startAt), timeZone),
        end_at: addMinutes(
          utcToZonedTime(new Date(eventDate.startAt), timeZone),
          eventDate.duration,
        ),
        type: eventDate.type,
        mentor: eventDate.mentor,
        student: eventDate.student,
        isTrial: eventDate.isTrial,
        eventDate,
        status: eventDate.status,
        packageSubscription: eventDate.packageSubscription,
        topic: eventDate.topic,
        languageLevel: eventDate.languageLevel,
      };

      calendarEvents.push(iterateEvents);
    }
  });

  const tablularEventData = [];
  for (const eventKey of eventKeys) {
    for (const eventDate of eventDates[eventKey]) {
      const mentor = eventDate.mentor
        ? eventDate.mentor?.user?.firstName +
          ' ' +
          eventDate.mentor?.user?.lastName?.charAt(0)?.toUpperCase() +
          '.'
        : '';

      const startTime = format(
        utcToZonedTime(new Date(eventDate.startAt), timeZone),
        'hh:mm a',
        { timeZone: timeZone },
      );
      const endTime = format(
        addMinutes(
          utcToZonedTime(new Date(eventDate.startAt), timeZone),
          eventDate.duration,
        ),
        'hh:mm a',
        { timeZone: timeZone },
      );

      const tableRow = {
        dateTime: {
          startTime,
          endTime: endTime,
          date: format(
            utcToZonedTime(new Date(eventDate.startAt), timeZone),
            'eee, MMM do',
            { timeZone: timeZone },
          ),
        },
        sessionTime: new Date(eventDate.startAt),
        mentor,
        resource: eventDate,
      };
      tablularEventData.push(tableRow);
    }
  }
  return { tablularEventData, calendarEvents };
};
