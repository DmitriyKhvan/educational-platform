import toast from 'react-hot-toast';

const notify = (type, message) => {
  toast[type](message, {
    position: 'top-center',
    duration: 5000,
  });
};

export default notify;
