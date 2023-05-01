import { Store } from 'react-notifications-component';

const error = (message, t) => {
  Store.addNotification({
    title: t('failed'),
    message: message,
    type: 'danger',
    insert: 'top',
    container: 'top-center',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

export default {
  error,
};
