import toast from 'react-hot-toast';

const toastCustom = (type, message) => {
  toast[type](message, {
    position: 'top-center',
    duration: 5000,
  });
};

export default toastCustom;
