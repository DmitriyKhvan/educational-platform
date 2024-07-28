import i18next from 'i18next';
import { type DefaultToastOptions, type ToastType, toast } from 'react-hot-toast';

const notify = (message: string, type: ToastType = 'success') => {
  let messageParse: string = message;

  if (message.includes('\n') || message.includes('.js')) {
    messageParse = i18next.t('error_system', { ns: 'common' });
  }

  // Ensure the type is one of the valid toast types
  if (type) {
    toast(messageParse, {
      type: type as ToastType,
      position: 'top-center',
      duration: 5000,
    } as DefaultToastOptions);
  } else {
    toast(messageParse, {
      position: 'top-center',
      duration: 5000,
    });
  }
};

export default notify;
