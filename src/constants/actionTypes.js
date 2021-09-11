import { defineAction } from 'redux-define'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  AUTH_LOGIN: defineAction('AUTH_LOGIN', ['REQUEST', 'SUCCESS', 'FAILURE']),
  AUTH_SIGNUP: defineAction('AUTH_SIGNUP', ['REQUEST', 'SUCCESS', 'FAILURE']),
  AUTH_LOGOUT: defineAction('AUTH_LOGOUT', ['REQUEST', 'SUCCESS', 'FAILURE']),
  AUTH_EMAIL_VERIFY: defineAction('AUTH_EMAIL_VERIFY', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  AUTH_FORGOT_PASSWORD: defineAction('AUTH_FORGOT_PASSWORD', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  AUTH_RESET_PASSWORD: defineAction('AUTH_RESET_PASSWORD', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),

  // Admin
  GET_USER_BY_ID: defineAction('GET_USER_BY_ID', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  UPDATE_TUTOR_HOURLY_RATE: defineAction('UPDATE_TUTOR_HOURLY_RATE', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),

  // User
  GET_USER: defineAction('GET_USER', ['REQUEST', 'SUCCESS', 'FAILURE']),
  UPLOAD_AVATAR: defineAction('UPLOAD_AVATAR', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  GET_AVATAR: defineAction('GET_AVATAR', ['REQUEST', 'SUCCESS', 'FAILURE']),
  UPDATE_USER: defineAction('UPDATE_USER', ['REQUEST', 'SUCCESS', 'FAILURE']),
  UPLOAD_PRESET: defineAction('UPLOAD_PRESET', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),

  // Students
  GET_STUDENT_INFO: defineAction('GET_STUDENT_INFO', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  FETCH_STUDENTS: defineAction('FETCH_STUDENTS', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  UPDATE_STUDENT_PROFILE: defineAction('UPDATE_STUDENT_PROFILE', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  GET_STUDENT_LIST: defineAction('GET_STUDENT_LIST', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  FETCH_FAVORITE_TUTORS: defineAction('FETCH_FAVORITE_TUTORS', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  SET_FAVOURITE: defineAction('SET_FAVOURITE', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  SET_REVIEW: defineAction('SET_REVIEW', ['REQUEST', 'SUCCESS', 'FAILURE']),
  SET_TUTOR_ATTENDANCE: defineAction('SET_TUTOR_ATTENDANCE', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),

  // Tutors
  GET_TUTOR_INFO: defineAction('GET_TUTOR_INFO', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  GET_TUTOR_LIST: defineAction('GET_TUTOR_LIST', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  GET_TUTOR_OVERALL_SUMMARY: defineAction('GET_TUTOR_OVERALL_SUMMARY', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  GET_TUTOR_PAYMENT_HISTORY: defineAction('GET_TUTOR_PAYMENT_HISTORY', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  FETCH_TUTORS: defineAction('FETCH_TUTORS', ['REQUEST', 'SUCCESS', 'FAILURE']),
  FETCH_TUTOR_RATES: defineAction('FETCH_TUTOR_RATES', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  UPDATE_TUTOR_INFO: defineAction('UPDATE_TUTOR_INFO', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  UPDATE_TUTOR_AVAILABILITIES: defineAction('UPDATE_TUTOR_AVAILABILITIES', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  UPDATE_TUTOR_EXCEPTIONDATES: defineAction('UPDATE_TUTOR_EXCEPTIONDATES', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),

  // Appointment
  GET_APPOINTMENT_INFO: defineAction('GET_APPOINTMENT_INFO', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  CREATE_APPOINTMENT_INFO: defineAction('CREATE_APPOINTMENT_INFO', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  APPROVE_APPOINTMENT_INFO: defineAction('APPROVE_APPOINTMENT_INFO', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  CANCEL_APPOINTMENT_INFO: defineAction('CANCEL_APPOINTMENT_INFO', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  UPDATE_APPOINTMENT_INFO: defineAction('UPDATE_APPOINTMENT_INFO', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),

  // Message
  GET_MESSAGE_INFO: defineAction('GET_MESSAGE_INFO', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),

  // Subscription
  CREATE_PLAN: defineAction('CREATE_PLAN', ['REQUEST', 'SUCCESS', 'FAILURE']),
  UPDATE_PLAN: defineAction('UPDATE_PLAN', ['REQUEST', 'SUCCESS', 'FAILURE']),
  GET_PLAN: defineAction('GET_PLAN', ['REQUEST', 'SUCCESS', 'FAILURE']),
  GET_PLAN_STATUS: defineAction('GET_PLAN_STATUS', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),
  GET_SUBSCRIPTIONS: defineAction('GET_SUBSCRIPTIONS', [
    'REQUEST',
    'SUCCESS',
    'FAILURE'
  ]),

  DELETE_TUTOR: defineAction('DELETE_TUTOR', ['REQUEST', 'SUCCESS', 'FAILURE']),

  // Notification
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  READ_NOTIFICATION: 'READ_NOTIFICATION',
  DELETE_ALL_NOTIFICATION: 'DELETE_ALL_NOTIFICATION'
}
