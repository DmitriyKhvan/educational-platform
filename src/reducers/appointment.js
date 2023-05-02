import ActionTypes from '../constants/actionTypes';
import { format, utcToZonedTime } from 'date-fns-tz';
import moment from 'moment-timezone';

const initialState = {
  list: [],
  loading: false,
};

const sortCalendarEvents = (data) => {
  const timeZone = 'Asia/Seoul';
  let eventDates = {};
  data
    .filter((apt) => apt.students.length > 0)
    .forEach((apt) => {
      let start_at = new Date(apt.start_at);
      let date = format(utcToZonedTime(start_at, timeZone), 'yyyy-MM-dd');
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
      const date = moment(eventDate.start_at).utc(0, true).unix();
      const endEpoch = date + eventDate.duration * 60;
      const start_at = moment.unix(date).utc(0, true);
      const end_at = moment.unix(endEpoch).utc(0, true);
      const iterateEvents = {
        zoomLink: eventDate.zoomlink,
        lesson: eventDate.lesson,
        start_at,
        end_at,
        type: eventDate.type,
        tutor: eventDate.tutor,
        student: eventDate.students,
        eventDate,
      };

      calendarEvents.push(iterateEvents);
    }
  });
  const tablularEventData = [];
  for (const eventKey of eventKeys) {
    for (const eventDate of eventDates[eventKey]) {
      const date = moment(eventDate.start_at).utc(0, true).unix();
      const tutor = eventDate.tutor
        ? eventDate.tutor.user.first_name +
          ' ' +
          eventDate.tutor.user.last_name.charAt(0).toUpperCase() +
          '.'
        : '';
      const startTime = moment.unix(date).utc(0, true).format('hh:mm a');
      const tableRow = {
        lesson:
          eventDate.lesson.type.charAt(0).toUpperCase() +
          eventDate.lesson.type.slice(1),
        topic: eventDate.lesson.description,
        level: eventDate.students[0].level,
        dateTime: {
          startTime,
          endTime: moment
            .unix(date)
            .utc(0, true)
            .add(eventDate.duration, 'minutes')
            .format('hh:mm a'),
          date: moment.unix(date).utc(0, true).format('ddd, MMM D'),
        },
        sessionTime: new Date(
          `${moment.unix(date).utc(0, true).format('ddd, MMM D')},${startTime}`,
        ),
        onClick: {
          date,
        },
        tutor,
        tutorFeedback: eventDate.students[0].feedbacks,
        resource: eventDate,
      };
      tablularEventData.push(tableRow);
    }
  }
  return { tablularEventData, calendarEvents };
};

export default function appointment(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.GET_APPOINTMENT_INFO.REQUEST:
      return {
        ...state,
        list: [],
        loading: true,
      };
    case ActionTypes.GET_APPOINTMENT_INFO.SUCCESS:
      const { tablularEventData, calendarEvents } = sortCalendarEvents(
        action.payload,
      );
      return {
        ...state,
        loading: false,
        list: action.payload.filter((apt) => apt.students.length > 0),
        tablularEventData: [...tablularEventData],
        calendarEvents: [...calendarEvents],
      };
    case ActionTypes.GET_APPOINTMENT_INFO.FAILURE:
      return {
        ...state,
        list: false,
      };

    case ActionTypes.CANCEL_APPOINTMENT_INFO.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.CANCEL_APPOINTMENT_INFO.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.CANCEL_APPOINTMENT_INFO.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case ActionTypes.UPDATE_APPOINTMENT_INFO.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.UPDATE_APPOINTMENT_INFO.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.UPDATE_APPOINTMENT_INFO.FAILURE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
