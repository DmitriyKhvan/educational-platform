import { store } from 'react-notifications-component'

const success = (message, t) => {
  store.addNotification({
    title: t('success'),
    message: message,
    type: 'success',
    insert: 'top',
    container: 'top-center',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  })
}

const error = (message, t) => {
  store.addNotification({
    title: t('failed'),
    message: message,
    type: 'danger',
    insert: 'top',
    container: 'top-center',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  })
}

export default {
  success,
  error
}
